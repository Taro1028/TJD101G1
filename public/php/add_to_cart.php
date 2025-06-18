<?php
// add_to_cart.php
include_once 'cors_1.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 強化錯誤顯示
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
ob_start();

// 調試：輸出接收到的原始數據
error_log("=== DEBUG: 開始處理請求 ===");
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);

try {
    // 檢查資料庫連線文件
    if (!file_exists('connection.php')) {
        throw new Exception('資料庫連線文件不存在');
    }

    include_once 'connection.php';

    if (!isset($pdo) || !($pdo instanceof PDO)) {
        throw new Exception('資料庫連線失敗');
    }

    error_log("DEBUG: 資料庫連線成功");

    // 讀取輸入數據
    $rawInput = file_get_contents("php://input");

    if (empty($rawInput)) {
        throw new Exception('未收到請求數據');
    }

    error_log("DEBUG: 收到的原始數據: " . $rawInput);

    $input = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 解析失敗: ' . json_last_error_msg());
    }

    error_log("DEBUG: JSON 解析成功: " . json_encode($input));

    // 檢查必要字段
    if (!isset($input['m_id'])) {
        throw new Exception('缺少 m_id 參數');
    }

    if (!isset($input['order_items']) || !is_array($input['order_items'])) {
        throw new Exception('缺少 order_items 參數或格式錯誤');
    }

    $m_id = intval($input['m_id']);
    $orderItems = $input['order_items'];
    $message_card_id = isset($input['message_card_id']) ? intval($input['message_card_id']) : null;

    error_log("DEBUG: 解析後的參數 - m_id: {$m_id}, message_card_id: " . ($message_card_id ?? 'NULL'));

    // 驗證會員是否存在
    $memberCheckSql = "SELECT ID FROM `MEMBERS` WHERE ID = :m_id";
    $memberCheckStmt = $pdo->prepare($memberCheckSql);
    $memberCheckStmt->execute([':m_id' => $m_id]);
    
    if (!$memberCheckStmt->fetch()) {
        throw new Exception('會員不存在，ID: ' . $m_id);
    }

    error_log("DEBUG: 會員驗證成功");

    // 如果有 message_card_id，驗證留言小卡
    if ($message_card_id) {
        error_log("DEBUG: 開始驗證留言小卡 ID: {$message_card_id}");
        
        // 檢查 MESSAGE_CARDS 表是否存在且有正確的欄位
        $tableCheckSql = "SHOW TABLES LIKE 'MESSAGE_CARDS'";
        $tableCheckStmt = $pdo->query($tableCheckSql);
        if (!$tableCheckStmt->fetch()) {
            throw new Exception('MESSAGE_CARDS 表不存在');
        }
        
        // 檢查是否有 SHOPPING_CART_ID 欄位
        $columnCheckSql = "SHOW COLUMNS FROM MESSAGE_CARDS LIKE 'SHOPPING_CART_ID'";
        $columnCheckStmt = $pdo->query($columnCheckSql);
        if (!$columnCheckStmt->fetch()) {
            throw new Exception('MESSAGE_CARDS 表缺少 SHOPPING_CART_ID 欄位，請先執行資料表更新 SQL');
        }
        
        // 【修正】使用 MYCARDS_ID 作為主鍵
        $cardCheckSql = "SELECT MYCARDS_ID, SHOPPING_CART_ID, ORDERS_ID FROM MESSAGE_CARDS WHERE MYCARDS_ID = :card_id";
        $cardCheckStmt = $pdo->prepare($cardCheckSql);
        $cardCheckStmt->execute([':card_id' => $message_card_id]);
        $cardInfo = $cardCheckStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$cardInfo) {
            throw new Exception('留言小卡不存在，ID: ' . $message_card_id);
        }
        
        if ($cardInfo['SHOPPING_CART_ID'] !== null || $cardInfo['ORDERS_ID'] !== null) {
            throw new Exception('留言小卡已被使用');
        }
        
        error_log("DEBUG: 留言小卡驗證成功");
    }

    // 驗證 orderItems 不為空
    if (empty($orderItems)) {
        throw new Exception('order_items 不能為空');
    }

    // 計算摘要資訊
    $total_meal_count = 0;
    $total_amount = 0;
    $start_date = null;
    $end_date = null;
    $plan_type = null;

    foreach ($orderItems as $item) {
        $total_meal_count += intval($item['count'] ?? 0);
        $total_amount += floatval($item['total_amount'] ?? 0);

        if ($plan_type === null && isset($item['plan_type'])) {
            $plan_type = $item['plan_type'];
        }

        if ($start_date === null || $item['meal_date'] < $start_date) {
            $start_date = $item['meal_date'];
        }
        if ($end_date === null || $item['meal_date'] > $end_date) {
            $end_date = $item['meal_date'];
        }
    }

    if ($plan_type === null) {
        throw new Exception('無法從 orderItems 中取得 plan_type');
    }

    // 計算總天數
    $total_days = 1;
    if ($start_date && $end_date && $start_date !== $end_date) {
        $start_timestamp = strtotime($start_date);
        $end_timestamp = strtotime($end_date);
        $total_days = max(1, round(($end_timestamp - $start_timestamp) / (60 * 60 * 24)) + 1);
    }

    error_log("DEBUG: 計算完成 - total_meal_count: {$total_meal_count}, total_amount: {$total_amount}");

    // 開始事務
    $pdo->beginTransaction();
    error_log("DEBUG: 開始事務");

    // 插入 SHOPPING_CART
    $sql_cart = "INSERT INTO SHOPPING_CART (
        M_ID, PLAN_TYPE, ORDER_START_DATE, ORDER_END_DATE, TOTAL_DAYS,
        TOTAL_MEAL_COUNT, TOTAL_AMOUNT, ADDCART_CREATE_AT
    ) VALUES (
        :m_id, :plan_type, :order_start_date, :order_end_date, :total_days,
        :total_meal_count, :total_amount, NOW()
    )";

    $stmt_cart = $pdo->prepare($sql_cart);

    $cart_params = [
        ':m_id' => $m_id,
        ':plan_type' => $plan_type,
        ':order_start_date' => $start_date,
        ':order_end_date' => $end_date,
        ':total_days' => $total_days,
        ':total_meal_count' => $total_meal_count,
        ':total_amount' => $total_amount
    ];

    error_log("DEBUG: 準備插入 SHOPPING_CART: " . json_encode($cart_params));

    if (!$stmt_cart->execute($cart_params)) {
        $error_info = $stmt_cart->errorInfo();
        throw new Exception('插入 SHOPPING_CART 失敗: ' . $error_info[2]);
    }

    $shopping_cart_id = $pdo->lastInsertId();
    error_log("DEBUG: SHOPPING_CART 插入成功，ID: {$shopping_cart_id}");

    // 插入 CART_ITEMS
    $sql_items = "INSERT INTO CART_ITEMS (
        SCART_ID, MEAL_DATE, MEAL_ITEMS, COUNT, TOTAL_AMOUNT
    ) VALUES (
        :scart_id, :meal_date, :meal_items, :count, :total_amount
    )";

    $stmt_items = $pdo->prepare($sql_items);

    foreach ($orderItems as $index => $item) {
        $item_params = [
            ':scart_id' => $shopping_cart_id,
            ':meal_date' => $item['meal_date'],
            ':meal_items' => $item['meal_items'],
            ':count' => intval($item['count']),
            ':total_amount' => floatval($item['total_amount'])
        ];

        if (!$stmt_items->execute($item_params)) {
            $error_info = $stmt_items->errorInfo();
            throw new Exception("插入 CART_ITEMS[{$index}] 失敗: " . $error_info[2]);
        }
    }

    error_log("DEBUG: CART_ITEMS 插入完成");

    // 【修正】如果有留言小卡，關聯到購物車（使用 MYCARDS_ID）
    if ($message_card_id) {
        $updateCardSql = "UPDATE MESSAGE_CARDS SET SHOPPING_CART_ID = :shopping_cart_id WHERE MYCARDS_ID = :card_id";
        $updateCardStmt = $pdo->prepare($updateCardSql);
        
        if (!$updateCardStmt->execute([
            ':shopping_cart_id' => $shopping_cart_id,
            ':card_id' => $message_card_id
        ])) {
            throw new Exception('關聯留言小卡失敗');
        }
        
        error_log("DEBUG: 留言小卡關聯成功");
    }

    // 提交事務
    $pdo->commit();
    error_log("DEBUG: 事務提交成功");

    ob_clean();

    echo json_encode([
        'success' => true,
        'message' => '餐點成功加入購物車' . ($message_card_id ? '，留言小卡已關聯' : ''),
        'cart_id' => $shopping_cart_id,
        'debug_info' => [
            'm_id' => $m_id,
            'received_items_count' => count($orderItems),
            'cart_id' => $shopping_cart_id,
            'plan_type' => $plan_type,
            'total_amount' => $total_amount,
            'message_card_linked' => $message_card_id ? true : false,
            'message_card_id' => $message_card_id
        ]
    ]);

} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    ob_clean();

    error_log("PDO 錯誤: " . $e->getMessage());
    error_log("PDO 錯誤碼: " . $e->getCode());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '資料庫操作失敗: ' . $e->getMessage(),
        'error_code' => $e->getCode(),
        'debug_trace' => $e->getTraceAsString()
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    ob_clean();

    error_log("一般錯誤: " . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug_trace' => $e->getTraceAsString()
    ]);
} finally {
    ob_end_flush();
}
?>