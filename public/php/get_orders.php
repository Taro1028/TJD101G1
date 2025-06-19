<?php
//  訂單總覽用php
//  環境變數檢測和CORS設定
$isDevelopment = ($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);

if ($isDevelopment) {
    // 開發環境 - 允許所有來源
    header('Access-Control-Allow-Origin: *');
} else {
    // 生產環境 - 只允許特定網域（請根據實際情況修改）
    header('Access-Control-Allow-Origin: https://yourdomain.com');
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

//  處理 OPTIONS 預檢請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

//  清理輸出緩衝區
if (ob_get_length()) ob_clean();

//  動態引入資料庫連線檔案
$db_file_paths = [
    __DIR__ . '/connection.php',           // 同目錄的connection.php
    __DIR__ . '/db_connect.php',           // 同目錄
    __DIR__ . '/../connection.php',        // 上一層的connection.php
    __DIR__ . '/../db_connect.php',        // 上一層目錄
    __DIR__ . '/../../db_connect.php',     // 上兩層目錄
];

$db_connected = false;
foreach ($db_file_paths as $path) {
    if (file_exists($path)) {
        try {
            require_once $path;
            $db_connected = true;
            break;
        } catch (Exception $e) {
            // 繼續嘗試下一個路徑
            continue;
        }
    }
}

if (!$db_connected) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '無法找到資料庫連線檔案',
        'debug' => [
            'checked_paths' => $db_file_paths,
            'current_dir' => __DIR__
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 取得請求參數
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $memberId = (int)($_GET['member_id'] ?? 0);
        $page = (int)($_GET['page'] ?? 1);
    } else {
        $input = json_decode(file_get_contents('php://input'), true);
        $memberId = (int)($input['member_id'] ?? 0);
        $page = (int)($input['page'] ?? 1);
    }
    
    $perPage = 5; // 每頁5筆訂單
    $offset = ($page - 1) * $perPage;

    // 驗證會員ID
    if ($memberId <= 0) {
        throw new Exception('無效的會員ID');
    }

    //  檢查資料庫連線是否存在
    if (!isset($pdo)) {
        // 嘗試手動建立資料庫連線
        try {
            $host = '127.0.0.1';
            $dbname = 'tibaeat';
            $username = 'root';
            $password = 'password';
            
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception('資料庫連線失敗: ' . $e->getMessage());
        }
    }

    // 查詢訂單總數
    $countSql = "SELECT COUNT(*) as total FROM ORDERS WHERE M_ID = ?";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute([$memberId]);
    $totalOrders = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // 計算總頁數
    $totalPages = ceil($totalOrders / $perPage);

    // 查詢訂單主資料 (按日期新到舊排序)
    $ordersSql = "
        SELECT 
            ID,
            ORDER_NUMBER,
            PLAN_TYPE,
            ORDER_START_DATE,
            ORDER_END_DATE,
            TOTAL_DAYS,
            TOTAL_MEAL_COUNT,
            TOTAL_AMOUNT,
            ORDERS_STATUS,
            CONSIGNEE_NAME,
            CONSIGNEE_PHONE,
            CONSIGNEE_ADDRESS,
            ORDERS_CREATE_AT
        FROM ORDERS 
        WHERE M_ID = ? 
        ORDER BY ORDERS_CREATE_AT DESC
        LIMIT $perPage OFFSET $offset
    ";
    
    $ordersStmt = $pdo->prepare($ordersSql);
    $ordersStmt->execute([$memberId]);
    $orders = $ordersStmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($orders)) {
        echo json_encode([
            'success' => true,
            'message' => '無訂單資料',
            'data' => [
                'orders' => [],
                'pagination' => [
                    'current_page' => (int)$page,
                    'total_pages' => 0,
                    'total_orders' => 0,
                    'per_page' => $perPage
                ]
            ]
        ]);
        exit;
    }

    // 取得所有訂單ID以查詢訂單項目
    $orderIds = array_column($orders, 'ID');
    $orderIdPlaceholders = str_repeat('?,', count($orderIds) - 1) . '?';

    // 查詢訂單項目詳細資料
    $orderItemsSql = "
        SELECT 
            ORDERS_ID,
            MEAL_DATE,
            MEAL_ITEMS,
            COUNT,
            TOTAL_AMOUNT
        FROM ORDERS_ITEMS 
        WHERE ORDERS_ID IN ($orderIdPlaceholders)
        ORDER BY ORDERS_ID, MEAL_DATE
    ";
    
    $orderItemsStmt = $pdo->prepare($orderItemsSql);
    $orderItemsStmt->execute($orderIds);
    $orderItems = $orderItemsStmt->fetchAll(PDO::FETCH_ASSOC);

    // 組織訂單項目資料
    $orderItemsByOrderId = [];
    foreach ($orderItems as $item) {
        $orderId = $item['ORDERS_ID'];
        if (!isset($orderItemsByOrderId[$orderId])) {
            $orderItemsByOrderId[$orderId] = [];
        }
        
        //  安全解析 MEAL_ITEMS JSON
        $mealItems = [];
        if (!empty($item['MEAL_ITEMS'])) {
            $decoded = json_decode($item['MEAL_ITEMS'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $mealItems = $decoded;
            }
        }
        $item['MEAL_ITEMS_PARSED'] = $mealItems;
        
        $orderItemsByOrderId[$orderId][] = $item;
    }

    // 將訂單項目整合到訂單資料中
    $ordersWithItems = [];
    foreach ($orders as $order) {
        $order['ORDER_ITEMS'] = $orderItemsByOrderId[$order['ID']] ?? [];
        
        //  安全格式化日期
        $startDate = '';
        $endDate = '';
        
        if (!empty($order['ORDER_START_DATE'])) {
            $startDate = date('Y/m/d', strtotime($order['ORDER_START_DATE']));
        }
        if (!empty($order['ORDER_END_DATE'])) {
            $endDate = date('Y/m/d', strtotime($order['ORDER_END_DATE']));
        }
        
        $order['FORMATTED_START_DATE'] = $startDate;
        $order['FORMATTED_END_DATE'] = $endDate;
        $order['DELIVERY_PERIOD'] = $startDate . '～' . $endDate;
        
        //  訂單狀態對應 (支援更多狀態格式)
        $statusMap = [
            'PENDING' => 1, 'PD' => 1,
            'CONFIRMED' => 2, 'CO' => 2,
            'PACKING' => 3, 'PC' => 3,
            'DELIVERING' => 4, 'DV' => 4,
            'FINISHED' => 5, 'FN' => 5
        ];
        
        $currentStatus = strtoupper($order['ORDERS_STATUS'] ?? 'PENDING');
        $order['STATUS_NUMBER'] = $statusMap[$currentStatus] ?? 1;
        
        // 狀態中文對應
        $statusTextMap = [
            'PENDING' => '完成付款', 'PD' => '完成付款', 
            'CONFIRMED' => '訂單確認', 'CO' => '確認',
            'PACKING' => '便當準備', 'PC' => '準備便當',
            'DELIVERING' => '運送', 'DV' => '運送',
            'FINISHED' => '完成', 'FN' => '完成'
        ];
        
        $order['STATUS_TEXT'] = $statusTextMap[$currentStatus] ?? '未知狀態';
        
        //  轉換數值型態
        $order['TOTAL_AMOUNT'] = (float)$order['TOTAL_AMOUNT'];
        $order['TOTAL_DAYS'] = (int)$order['TOTAL_DAYS'];
        $order['TOTAL_MEAL_COUNT'] = (int)$order['TOTAL_MEAL_COUNT'];
        
        $ordersWithItems[] = $order;
    }

    //  返回結果
    echo json_encode([
        'success' => true,
        'message' => '查詢成功',
        'data' => [
            'orders' => $ordersWithItems,
            'pagination' => [
                'current_page' => (int)$page,
                'total_pages' => (int)$totalPages,
                'total_orders' => (int)$totalOrders,
                'per_page' => $perPage
            ]
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '資料庫錯誤: ' . $e->getMessage(),
        'error_code' => $e->getCode()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>