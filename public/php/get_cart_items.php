<?php
// get_cart_items.php - 支援用戶過濾版本
include_once 'cors_1.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

try {
    include_once 'connection.php';
    
    if (!isset($pdo)) {
        throw new Exception('資料庫連線失敗');
    }

    // 取得會員ID參數
    $m_id = $_GET['m_id'] ?? null;
    
    if (!$m_id) {
        throw new Exception('缺少 m_id 參數');
    }
    
    $m_id = intval($m_id); // 統一使用 m_id
    
    // 驗證會員是否存在（使用正確的表格名稱 MEMBERS）
    $memberCheckSql = "SELECT ID FROM `MEMBERS` WHERE ID = :m_id";
    $memberCheckStmt = $pdo->prepare($memberCheckSql);
    $memberCheckStmt->execute([':m_id' => $m_id]);
    
    if (!$memberCheckStmt->fetch()) {
        throw new Exception('會員不存在，ID: ' . $m_id);
    }
    
    // 修改 SQL 查詢，使用正確的欄位名稱 M_ID
    $sql = "
        SELECT 
            sc.ID as cart_id,
            sc.M_ID as m_id,
            sc.PLAN_TYPE,
            sc.ORDER_START_DATE,
            sc.ORDER_END_DATE,
            sc.TOTAL_DAYS,
            sc.TOTAL_MEAL_COUNT,
            sc.TOTAL_AMOUNT,
            sc.MESSAGE_CARD_ID,
            sc.ADDCART_CREATE_AT,
            ci.MEAL_DATE,
            ci.MEAL_ITEMS,
            ci.COUNT as daily_count,
            ci.TOTAL_AMOUNT as daily_total
        FROM SHOPPING_CART sc
        LEFT JOIN CART_ITEMS ci ON sc.ID = ci.SCART_ID
        WHERE sc.M_ID = :m_id
        ORDER BY sc.ID DESC, ci.MEAL_DATE ASC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':m_id' => $m_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 整理資料格式
    $cartGroups = [];
    
    foreach ($results as $row) {
        $cart_id = $row['cart_id'];
        
        // 如果這個購物車組還不存在，建立它
        if (!isset($cartGroups[$cart_id])) {
            $cartGroups[$cart_id] = [
                'cart_id' => $cart_id,
                'm_id' => $row['m_id'], // 使用正確的欄位名稱
                'plan_type' => $row['PLAN_TYPE'],
                'order_start_date' => $row['ORDER_START_DATE'],
                'order_end_date' => $row['ORDER_END_DATE'],
                'total_days' => $row['TOTAL_DAYS'],
                'total_meal_count' => $row['TOTAL_MEAL_COUNT'],
                'total_amount' => $row['TOTAL_AMOUNT'],
                'message_card_id' => $row['MESSAGE_CARD_ID'],
                'created_at' => $row['ADDCART_CREATE_AT'],
                'items' => []
            ];
        }
        
        // 如果有餐點項目，加入到 items 陣列
        if ($row['MEAL_DATE']) {
            $cartGroups[$cart_id]['items'][] = [
                'meal_date' => $row['MEAL_DATE'],
                'meal_items' => json_decode($row['MEAL_ITEMS'], true),
                'count' => $row['daily_count'],
                'total_amount' => $row['daily_total']
            ];
        }
    }
    
    // 轉換為陣列格式
    $cartList = array_values($cartGroups);
    
    echo json_encode([
        'success' => true,
        'data' => $cartList,
        'total_cart_groups' => count($cartList),
        'debug_info' => [
            'm_id' => $m_id, // 使用正確的欄位名稱
            'raw_rows_count' => count($results)
        ]
    ]);

} catch (Exception $e) {
    error_log("獲取購物車失敗: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>