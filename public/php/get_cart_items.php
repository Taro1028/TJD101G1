<?php
// get_cart_items.php
include_once 'cors_1.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 強制顯示所有錯誤
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// 開始捕獲輸出
ob_start();

$debug_info = [];
$debug_info['start_time'] = date('Y-m-d H:i:s');
$debug_info['request_method'] = $_SERVER['REQUEST_METHOD'];
$debug_info['get_params'] = $_GET;

try {
    $debug_info['step'] = 'checking_connection_file';
    
    if (!file_exists('connection.php')) {
        throw new Exception('connection.php 檔案不存在');
    }
    
    $debug_info['step'] = 'including_connection';
    include_once 'connection.php';
    
    if (!isset($pdo)) {
        throw new Exception('PDO 變數未定義');
    }
    
    if (!($pdo instanceof PDO)) {
        throw new Exception('PDO 不是有效的資料庫連線物件');
    }
    
    $debug_info['step'] = 'connection_success';
    $debug_info['pdo_status'] = 'connected';

    // 取得會員ID參數
    $debug_info['step'] = 'getting_member_id';
    $m_id = $_GET['m_id'] ?? null;
    
    if (!$m_id) {
        throw new Exception('缺少 m_id 參數');
    }
    
    $m_id = intval($m_id);
    $debug_info['m_id'] = $m_id;
    
    if ($m_id <= 0) {
        throw new Exception('無效的會員ID: ' . $m_id);
    }
    
    // 檢查資料表是否存在
    $debug_info['step'] = 'checking_tables';
    $required_tables = ['MEMBERS', 'SHOPPING_CART', 'CART_ITEMS', 'MESSAGE_CARDS'];
    $existing_tables = [];
    
    foreach ($required_tables as $table) {
        $checkSql = "SHOW TABLES LIKE '{$table}'";
        $result = $pdo->query($checkSql);
        if ($result && $result->fetch()) {
            $existing_tables[] = $table;
        }
    }
    
    $debug_info['existing_tables'] = $existing_tables;
    $debug_info['missing_tables'] = array_diff($required_tables, $existing_tables);
    
    if (count($debug_info['missing_tables']) > 0) {
        throw new Exception('缺少資料表: ' . implode(', ', $debug_info['missing_tables']));
    }
    
    // 檢查 SHOPPING_CART 表結構
    $debug_info['step'] = 'checking_shopping_cart_structure';
    $cartColumnsSql = "SHOW COLUMNS FROM SHOPPING_CART";
    $cartColumnsResult = $pdo->query($cartColumnsSql);
    $cartColumns = $cartColumnsResult->fetchAll(PDO::FETCH_COLUMN);
    $debug_info['shopping_cart_columns'] = $cartColumns;
    
    // 檢查 MESSAGE_CARDS 表結構
    $debug_info['step'] = 'checking_message_cards_structure';
    $cardColumnsSql = "SHOW COLUMNS FROM MESSAGE_CARDS";
    $cardColumnsResult = $pdo->query($cardColumnsSql);
    $cardColumns = $cardColumnsResult->fetchAll(PDO::FETCH_COLUMN);
    $debug_info['message_cards_columns'] = $cardColumns;
    
    // 檢查主鍵名稱
    $debug_info['step'] = 'checking_primary_keys';
    if (in_array('SCART_ID', $cartColumns)) {
        $primary_key = 'SCART_ID';
    } elseif (in_array('ID', $cartColumns)) {
        $primary_key = 'ID';
    } else {
        throw new Exception('SHOPPING_CART 表找不到主鍵欄位 (SCART_ID 或 ID)');
    }
    $debug_info['cart_primary_key'] = $primary_key;
    
    // 驗證會員是否存在
    $debug_info['step'] = 'validating_member';
    $memberCheckSql = "SELECT ID FROM `MEMBERS` WHERE ID = :m_id";
    $memberCheckStmt = $pdo->prepare($memberCheckSql);
    $memberCheckStmt->execute([':m_id' => $m_id]);
    
    if (!$memberCheckStmt->fetch()) {
        throw new Exception('會員不存在，ID: ' . $m_id);
    }
    
    $debug_info['member_exists'] = true;
    
    // 檢查該會員是否有購物車資料
    $debug_info['step'] = 'checking_cart_count';
    $countSql = "SELECT COUNT(*) FROM SHOPPING_CART WHERE M_ID = :m_id";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute([':m_id' => $m_id]);
    $cartCount = $countStmt->fetchColumn();
    $debug_info['cart_count'] = $cartCount;
    
    if ($cartCount == 0) {
        $debug_info['result'] = 'empty_cart';
        ob_clean();
        echo json_encode([
            'success' => true,
            'message' => '購物車為空',
            'data' => [],
            'debug_info' => $debug_info
        ]);
        exit;
    }
    
    // 構建動態 SQL（根據實際表結構）
    $debug_info['step'] = 'building_sql';
    
    // 檢查是否有 SHOPPING_CART_ID 欄位在 MESSAGE_CARDS
    $hasShoppingCartId = in_array('SHOPPING_CART_ID', $cardColumns);
    $debug_info['message_cards_has_shopping_cart_id'] = $hasShoppingCartId;
    
    if ($hasShoppingCartId) {
        // 【修正】使用 MYCARDS_ID 作為主鍵
        $sql = "
            SELECT 
                sc.{$primary_key} as cart_id,
                sc.M_ID as m_id,
                sc.PLAN_TYPE,
                sc.ORDER_START_DATE,
                sc.ORDER_END_DATE,
                sc.TOTAL_DAYS,
                sc.TOTAL_MEAL_COUNT,
                sc.TOTAL_AMOUNT,
                sc.ADDCART_CREATE_AT,
                CASE WHEN mc.MYCARDS_ID IS NOT NULL THEN 1 ELSE 0 END as has_message_card,
                ci.MEAL_DATE,
                ci.MEAL_ITEMS,
                ci.COUNT as daily_count,
                ci.TOTAL_AMOUNT as daily_total
            FROM SHOPPING_CART sc
            LEFT JOIN MESSAGE_CARDS mc ON sc.{$primary_key} = mc.SHOPPING_CART_ID
            LEFT JOIN CART_ITEMS ci ON sc.{$primary_key} = ci.SCART_ID
            WHERE sc.M_ID = :m_id
            ORDER BY sc.{$primary_key} DESC, ci.MEAL_DATE ASC
        ";
    } else {
        // 舊結構：不使用 MESSAGE_CARDS 關聯
        $sql = "
            SELECT 
                sc.{$primary_key} as cart_id,
                sc.M_ID as m_id,
                sc.PLAN_TYPE,
                sc.ORDER_START_DATE,
                sc.ORDER_END_DATE,
                sc.TOTAL_DAYS,
                sc.TOTAL_MEAL_COUNT,
                sc.TOTAL_AMOUNT,
                sc.ADDCART_CREATE_AT,
                0 as has_message_card,
                ci.MEAL_DATE,
                ci.MEAL_ITEMS,
                ci.COUNT as daily_count,
                ci.TOTAL_AMOUNT as daily_total
            FROM SHOPPING_CART sc
            LEFT JOIN CART_ITEMS ci ON sc.{$primary_key} = ci.SCART_ID
            WHERE sc.M_ID = :m_id
            ORDER BY sc.{$primary_key} DESC, ci.MEAL_DATE ASC
        ";
    }
    
    $debug_info['sql_query'] = $sql;
    
    // 執行查詢
    $debug_info['step'] = 'executing_query';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':m_id' => $m_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $debug_info['raw_results_count'] = count($results);
    $debug_info['first_result'] = count($results) > 0 ? $results[0] : null;
    
    // 整理資料格式
    $debug_info['step'] = 'processing_results';
    $cartGroups = [];
    
    foreach ($results as $row) {
        $cart_id = $row['cart_id'];
        
        if (!isset($cartGroups[$cart_id])) {
            $cartGroups[$cart_id] = [
                'cart_id' => $cart_id,
                'm_id' => $row['m_id'],
                'plan_type' => $row['PLAN_TYPE'],
                'order_start_date' => $row['ORDER_START_DATE'],
                'order_end_date' => $row['ORDER_END_DATE'],
                'total_days' => intval($row['TOTAL_DAYS']),
                'total_meal_count' => intval($row['TOTAL_MEAL_COUNT']),
                'total_amount' => floatval($row['TOTAL_AMOUNT']),
                'created_at' => $row['ADDCART_CREATE_AT'],
                'has_message_card' => intval($row['has_message_card']) === 1,
                'items' => []
            ];
        }
        
        if ($row['MEAL_DATE']) {
            $cartGroups[$cart_id]['items'][] = [
                'meal_date' => $row['MEAL_DATE'],
                'meal_items' => $row['MEAL_ITEMS'],
                'count' => intval($row['daily_count']),
                'total_amount' => floatval($row['daily_total'])
            ];
        }
    }
    
    $cartList = array_values($cartGroups);
    $debug_info['final_cart_groups'] = count($cartList);
    $debug_info['step'] = 'success';
    
    ob_clean();
    
    echo json_encode([
        'success' => true,
        'data' => $cartList,
        'total_cart_groups' => count($cartList),
        'debug_info' => $debug_info
    ]);

} catch (PDOException $e) {
    ob_clean();
    
    $debug_info['error_type'] = 'PDOException';
    $debug_info['error_message'] = $e->getMessage();
    $debug_info['error_code'] = $e->getCode();
    $debug_info['error_file'] = $e->getFile();
    $debug_info['error_line'] = $e->getLine();
    
    error_log("PDO 錯誤: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'PDO 錯誤: ' . $e->getMessage(),
        'debug_info' => $debug_info
    ]);
    
} catch (Exception $e) {
    ob_clean();
    
    $debug_info['error_type'] = 'Exception';
    $debug_info['error_message'] = $e->getMessage();
    $debug_info['error_file'] = $e->getFile();
    $debug_info['error_line'] = $e->getLine();
    
    error_log("一般錯誤: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug_info' => $debug_info
    ]);
    
} catch (Throwable $e) {
    ob_clean();
    
    $debug_info['error_type'] = 'Throwable';
    $debug_info['error_message'] = $e->getMessage();
    $debug_info['error_file'] = $e->getFile();
    $debug_info['error_line'] = $e->getLine();
    
    error_log("嚴重錯誤: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '嚴重錯誤: ' . $e->getMessage(),
        'debug_info' => $debug_info
    ]);
}

ob_end_flush();
?>