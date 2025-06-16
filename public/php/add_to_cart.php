<?php
// add_to_cart.php - 支援用戶關聯版本
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

try {
    if (!file_exists('connection.php')) {
        throw new Exception('資料庫連線文件不存在');
    }

    include_once 'connection.php';

    if (!isset($pdo) || !($pdo instanceof PDO)) {
        throw new Exception('資料庫連線失敗');
    }

    $rawInput = file_get_contents("php://input");

    if (empty($rawInput)) {
        throw new Exception('未收到請求數據');
    }

    error_log("收到的原始數據: " . $rawInput);

    $input = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 解析失敗: ' . json_last_error_msg());
    }

    // 檢查必要字段
    if (!isset($input['m_id'])) {
        throw new Exception('缺少 m_id 參數');
    }

    if (!isset($input['order_items']) || !is_array($input['order_items'])) {
        throw new Exception('缺少 order_items 參數或格式錯誤');
    }

    $m_id = intval($input['m_id']); // 統一使用 m_id
    $orderItems = $input['order_items'];
    $message_card_id = $input['message_card_id'] ?? null;

    // 驗證會員是否存在（使用正確的表格名稱 MEMBERS）
    $memberCheckSql = "SELECT ID FROM `MEMBERS` WHERE ID = :m_id";
    $memberCheckStmt = $pdo->prepare($memberCheckSql);
    $memberCheckStmt->execute([':m_id' => $m_id]);
    
    if (!$memberCheckStmt->fetch()) {
        throw new Exception('會員不存在，ID: ' . $m_id);
    }

    // 驗證 orderItems 不為空
    if (empty($orderItems)) {
        throw new Exception('order_items 不能為空');
    }

    // 從 orderItems 計算摘要資訊
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
            error_log("取得 plan_type: " . $plan_type);
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

    $orderSummary = [
        'm_id' => $m_id, // 對應資料庫的 M_ID 欄位
        'plan_type' => $plan_type,
        'order_start_date' => $start_date,
        'order_end_date' => $end_date,
        'total_days' => $total_days,
        'total_meal_count' => $total_meal_count,
        'total_amount' => $total_amount
    ];

    error_log("orderSummary: " . json_encode($orderSummary));
    error_log("message_card_id: " . ($message_card_id ?? 'NULL'));

    // 開始事務
    $pdo->beginTransaction();

    // 修改 SQL 語句，使用正確的欄位名稱 M_ID
    $sql_cart = "INSERT INTO SHOPPING_CART (
        M_ID, PLAN_TYPE, ORDER_START_DATE, ORDER_END_DATE, TOTAL_DAYS,
        TOTAL_MEAL_COUNT, TOTAL_AMOUNT, MESSAGE_CARD_ID, ADDCART_CREATE_AT
    ) VALUES (
        :m_id, :plan_type, :order_start_date, :order_end_date, :total_days,
        :total_meal_count, :total_amount, :message_card_id, NOW()
    )";

    $stmt_cart = $pdo->prepare($sql_cart);

    $cart_params = [
        ':m_id' => $m_id, // 使用正確的參數名稱
        ':plan_type' => $orderSummary['plan_type'],
        ':order_start_date' => $orderSummary['order_start_date'],
        ':order_end_date' => $orderSummary['order_end_date'],
        ':total_days' => $orderSummary['total_days'],
        ':total_meal_count' => intval($orderSummary['total_meal_count']),
        ':total_amount' => floatval($orderSummary['total_amount']),
        ':message_card_id' => $message_card_id
    ];

    error_log("準備執行 SHOPPING_CART 插入: " . json_encode($cart_params));

    if (!$stmt_cart->execute($cart_params)) {
        $error_info = $stmt_cart->errorInfo();
        throw new Exception('插入 SHOPPING_CART 失敗: ' . $error_info[2]);
    }

    $shopping_cart_id = $pdo->lastInsertId();
    error_log("SHOPPING_CART 插入成功，ID: " . $shopping_cart_id);

    // 插入 CART_ITEMS
    $sql_items = "INSERT INTO CART_ITEMS (
        SCART_ID, MEAL_DATE, MEAL_ITEMS, COUNT, TOTAL_AMOUNT
    ) VALUES (
        :scart_id, :meal_date, :meal_items, :count, :total_amount
    )";

    $stmt_items = $pdo->prepare($sql_items);

    foreach ($orderItems as $index => $item) {
        $itemRequiredFields = ['meal_date', 'meal_items', 'count', 'total_amount'];
        foreach ($itemRequiredFields as $field) {
            if (!isset($item[$field])) {
                throw new Exception("orderItems[{$index}] 缺少必要字段: {$field}");
            }
        }

        $item_params = [
            ':scart_id' => $shopping_cart_id,
            ':meal_date' => $item['meal_date'],
            ':meal_items' => $item['meal_items'],
            ':count' => intval($item['count']),
            ':total_amount' => floatval($item['total_amount'])
        ];

        error_log("準備插入 CART_ITEMS[{$index}]: " . json_encode($item_params));

        if (!$stmt_items->execute($item_params)) {
            $error_info = $stmt_items->errorInfo();
            throw new Exception("插入 CART_ITEMS[{$index}] 失敗: " . $error_info[2]);
        }
    }

    // 提交事務
    $pdo->commit();
    error_log("事務提交成功");

    ob_clean();

    echo json_encode([
        'success' => true,
        'message' => '餐點成功加入購物車',
        'shopping_cart_id' => $shopping_cart_id,
        'debug_info' => [
            'm_id' => $m_id, // 對應資料庫欄位名稱
            'received_items_count' => count($orderItems),
            'cart_id' => $shopping_cart_id,
            'plan_type' => $orderSummary['plan_type'],
            'total_amount' => $orderSummary['total_amount'],
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
        'error_code' => $e->getCode()
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
        'message' => $e->getMessage()
    ]);
} finally {
    ob_end_flush();
}
?>