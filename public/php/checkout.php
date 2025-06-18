<?php
// checkout.php
include_once 'cors_1.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
ob_start();

include_once 'connection.php';

// 🔥 設定台灣時區
date_default_timezone_set('Asia/Taipei');

// 🔥 新的訂單編號生成函數：EAT + YYMMDD + 4位ID
function generateOrderNumber($orderId) {
    $prefix = 'EAT';                              // 固定前綴 EAT
    $dateStr = date('ymd');                       // 年月日：YYMMDD
    $idStr = sprintf('%04d', $orderId);           // 4位數ID，左邊補0
    
    return $prefix . $dateStr . $idStr;
    // 總長度：3 + 6 + 4 = 13 字符
    // 範例：EAT2506180001
}

// 檢查請求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '不支援的請求方法'
    ]);
    exit;
}

// 獲取請求資料
$input = json_decode(file_get_contents('php://input'), true);

// 驗證必要欄位
if (!isset($input['m_id']) || !isset($input['cart_ids']) || empty($input['cart_ids'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '缺少必要參數'
    ]);
    exit;
}

try {
    $pdo->beginTransaction();
    
    $memberId = (int)$input['m_id'];
    $cartIds = $input['cart_ids'];
    $consigneeInfo = $input['consignee_info'] ?? [];
    $shippingFee = $input['shipping_fee'] ?? 0;
    
    // 驗證會員ID
    if ($memberId <= 0) {
        throw new Exception('無效的會員ID');
    }
    
    // 查詢 SHOPPING_CART 資料
    $cartPlaceholders = str_repeat('?,', count($cartIds) - 1) . '?';
    
    $cartQuery = "
        SELECT 
            ID,
            M_ID,
            PLAN_TYPE,
            ORDER_START_DATE as START_DATE,
            ORDER_END_DATE as END_DATE,
            TOTAL_DAYS,
            TOTAL_MEAL_COUNT,
            TOTAL_AMOUNT
        FROM SHOPPING_CART 
        WHERE ID IN ($cartPlaceholders) AND M_ID = ?
        ORDER BY PLAN_TYPE, ORDER_START_DATE
    ";
    
    $params = array_merge($cartIds, [$memberId]);
    $cartStmt = $pdo->prepare($cartQuery);
    $cartStmt->execute($params);
    $carts = $cartStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($carts)) {
        throw new Exception('找不到購物車項目或權限不足');
    }
    
    // 查詢 CART_ITEMS 表
    $cartItemsQuery = "
        SELECT 
            SCART_ID,
            MEAL_DATE,
            MEAL_ITEMS,
            COUNT,
            TOTAL_AMOUNT
        FROM CART_ITEMS 
        WHERE SCART_ID IN ($cartPlaceholders)
        ORDER BY SCART_ID, MEAL_DATE
    ";
    
    $cartItemsStmt = $pdo->prepare($cartItemsQuery);
    $cartItemsStmt->execute($cartIds);
    $cartItems = $cartItemsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 組織資料
    $cartItemsByCartId = [];
    $totalMealCount = 0;
    $totalAmount = 0;
    
    foreach ($cartItems as $item) {
        $cartId = $item['SCART_ID'];
        if (!isset($cartItemsByCartId[$cartId])) {
            $cartItemsByCartId[$cartId] = [];
        }
        $cartItemsByCartId[$cartId][] = $item;
        $totalMealCount += (int)$item['COUNT'];
        $totalAmount += (float)$item['TOTAL_AMOUNT'];
    }
    
    $createdOrders = [];
    $totalOrderCount = 0;
    $cartToOrderMapping = []; // 記錄購物車ID到訂單ID的映射
    
    // 為每個購物車項目創建訂單
    foreach ($carts as $cart) {
        $totalDays = (int)$cart['TOTAL_DAYS'];
        $groupMealCount = (int)$cart['TOTAL_MEAL_COUNT'];
        $groupTotalAmount = (float)$cart['TOTAL_AMOUNT'];
        
        // 🔥 插入 ORDERS 表（包含收貨人資訊）
        $orderSql = "INSERT INTO ORDERS (
            M_ID, PLAN_TYPE, ORDER_START_DATE, ORDER_END_DATE, 
            TOTAL_DAYS, TOTAL_MEAL_COUNT, TOTAL_AMOUNT, 
            CONSIGNEE_NAME, CONSIGNEE_PHONE, CONSIGNEE_ADDRESS,
            ORDERS_CREATE_AT, ORDERS_UPDATE_AT, ORDERS_STATUS
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NULL, 'PENDING')";
        
        $orderStmt = $pdo->prepare($orderSql);
        $orderStmt->execute([
            $memberId,
            $cart['PLAN_TYPE'],
            $cart['START_DATE'],
            $cart['END_DATE'],
            $totalDays,
            $groupMealCount,
            $groupTotalAmount,
            $consigneeInfo['name'] ?? '',
            $consigneeInfo['phone'] ?? '',
            $consigneeInfo['address'] ?? ''
        ]);
        
        // 🔥 取得插入的訂單ID
        $orderId = $pdo->lastInsertId();
        
        // 🔥 使用新格式生成訂單編號：EAT + YYMMDD + 4位ID
        $orderNumber = generateOrderNumber($orderId);
        
        // 🔥 記錄生成的訂單編號（除錯用）
        error_log("生成訂單編號: $orderNumber (訂單ID: $orderId)");
        
        // 🔥 更新訂單編號到資料庫
        $updateOrderNumberSql = "UPDATE ORDERS SET ORDER_NUMBER = ? WHERE ID = ?";
        $updateOrderNumberStmt = $pdo->prepare($updateOrderNumberSql);
        $updateOrderNumberStmt->execute([$orderNumber, $orderId]);
        
        // 🔥 記錄購物車ID到訂單ID的映射
        $cartToOrderMapping[$cart['ID']] = $orderId;
        
        // 插入 ORDERS_ITEMS
        if (isset($cartItemsByCartId[$cart['ID']])) {
            foreach ($cartItemsByCartId[$cart['ID']] as $item) {
                $orderItemSql = "INSERT INTO ORDERS_ITEMS (
                    ORDERS_ID, MEAL_DATE, MEAL_ITEMS, COUNT, TOTAL_AMOUNT
                ) VALUES (?, ?, ?, ?, ?)";
                
                $orderItemStmt = $pdo->prepare($orderItemSql);
                $orderItemStmt->execute([
                    $orderId,
                    $item['MEAL_DATE'],
                    $item['MEAL_ITEMS'],
                    $item['COUNT'],
                    $item['TOTAL_AMOUNT']
                ]);
            }
        }
        
        // 🔥 記錄創建的訂單資訊
        $createdOrders[] = [
            'order_id' => $orderId,
            'order_number' => $orderNumber, // 🔥 新格式：EAT2506180001
            'plan_type' => $cart['PLAN_TYPE'],
            'start_date' => $cart['START_DATE'],
            'end_date' => $cart['END_DATE'],
            'total_days' => $totalDays,
            'total_meal_count' => $groupMealCount,
            'total_amount' => $groupTotalAmount,
            'items_count' => isset($cartItemsByCartId[$cart['ID']]) ? count($cartItemsByCartId[$cart['ID']]) : 0
        ];
        
        $totalOrderCount++;
    }
    
    // 🔥 重要：處理 MESSAGE_CARDS 遷移
    $migratedCardsCount = 0;
    foreach ($cartToOrderMapping as $cartId => $orderId) {
        // 將該購物車的 MESSAGE_CARDS 遷移到對應的訂單
        $migrateSql = "UPDATE MESSAGE_CARDS 
                       SET SHOPPING_CART_ID = NULL, ORDERS_ID = ? 
                       WHERE SHOPPING_CART_ID = ?";
        $migrateStmt = $pdo->prepare($migrateSql);
        $migrateStmt->execute([$orderId, $cartId]);
        $migratedCardsCount += $migrateStmt->rowCount();
    }
    
    // 🔥 安全地刪除購物車資料
    
    // 1. 刪除 CART_ITEMS
    $deleteItemsSql = "DELETE FROM CART_ITEMS WHERE SCART_ID IN ($cartPlaceholders)";
    $deleteItemsStmt = $pdo->prepare($deleteItemsSql);
    $deleteItemsStmt->execute($cartIds);
    $deletedItemsCount = $deleteItemsStmt->rowCount();
    
    // 2. 刪除 SHOPPING_CART
    $deleteCartSql = "DELETE FROM SHOPPING_CART WHERE ID IN ($cartPlaceholders) AND M_ID = ?";
    $deleteCartStmt = $pdo->prepare($deleteCartSql);
    $deleteCartStmt->execute($params);
    $deletedCartCount = $deleteCartStmt->rowCount();
    
    // 🔥 提交事務
    $pdo->commit();
    
    // 🔥 清理輸出緩衝區，確保只輸出 JSON
    ob_clean();
    
    // 🔥 返回成功結果
    echo json_encode([
        'success' => true,
        'message' => '結帳成功',
        'data' => [
            'order_ids' => array_column($createdOrders, 'order_id'),
            'order_numbers' => array_column($createdOrders, 'order_number'), // 🔥 新格式陣列：["EAT2506180001"]
            'orders' => $createdOrders,
            'total_orders' => $totalOrderCount,
            'total_amount' => $totalAmount,
            'total_meal_count' => $totalMealCount,
            'shipping_fee' => $shippingFee,
            'final_total' => $totalAmount + $shippingFee,
            'deleted_cart_count' => $deletedCartCount,
            'deleted_items_count' => $deletedItemsCount,
            'migrated_cards_count' => $migratedCardsCount,
            'cart_to_order_mapping' => $cartToOrderMapping,
            'consignee_info' => $consigneeInfo,
            'order_time' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    ob_clean(); // 🔥 清理輸出緩衝區
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'SQLSTATE[' . $e->getCode() . ']: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    ob_clean(); // 🔥 清理輸出緩衝區
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>