<?php
// CORS 設定
require_once 'cors_1.php';

// 處理 OPTIONS 預檢請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 引入現有的連線檔案
require_once 'connection.php';

// 設定響應頭
header('Content-Type: application/json; charset=utf-8');

// 只允許 GET 請求
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => '只允許 GET 請求'
    ]);
    exit;
}

try {
    // 取得會員ID參數
    $m_id = isset($_GET['m_id']) ? intval($_GET['m_id']) : 0;
    
    if ($m_id <= 0) {
        throw new Exception('缺少有效的會員ID');
    }
    
    // 取得分頁參數
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $per_page = 6; // 每頁6張小卡
    $offset = ($page - 1) * $per_page;
    
    // 驗證會員是否存在
    $memberCheckSql = "SELECT ID FROM MEMBERS WHERE ID = :m_id";
    $memberCheckStmt = $pdo->prepare($memberCheckSql);
    $memberCheckStmt->execute([':m_id' => $m_id]);
    
    if (!$memberCheckStmt->fetch()) {
        throw new Exception('會員不存在');
    }
    
    // 計算總數量（只計算有ORDERS_ID的小卡）
    $countSql = "SELECT COUNT(*) FROM MESSAGE_CARDS mc
                 INNER JOIN ORDERS o ON mc.ORDERS_ID = o.ID
                 WHERE o.M_ID = :m_id AND mc.ORDERS_ID IS NOT NULL";
    
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute([':m_id' => $m_id]);
    $total_cards = $countStmt->fetchColumn();
    
    // 如果沒有小卡，直接回傳空結果
    if ($total_cards == 0) {
        echo json_encode([
            'success' => true,
            'message' => '您還沒有任何小卡',
            'data' => [
                'cards' => [],
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $per_page,
                    'total_items' => 0,
                    'total_pages' => 0,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ]
        ]);
        exit;
    }
    
    // 取得小卡清單（按建立日期最新排在最前面）
    $cardsSql = "SELECT 
                    mc.MYCARDS_ID,
                    mc.MESSAGE_TEXT,
                    mc.SELECTED_COLOR,
                    mc.STICKERS_DATA,
                    mc.IMAGE_PATH,
                    mc.CREATED_AT,
                    mc.ORDERS_ID,
                    o.ORDER_NUMBER,
                    o.PLAN_TYPE
                 FROM MESSAGE_CARDS mc
                 INNER JOIN ORDERS o ON mc.ORDERS_ID = o.ID
                 WHERE o.M_ID = :m_id AND mc.ORDERS_ID IS NOT NULL
                 ORDER BY mc.CREATED_AT DESC
                 LIMIT :limit OFFSET :offset";
    
    $cardsStmt = $pdo->prepare($cardsSql);
    $cardsStmt->bindValue(':m_id', $m_id, PDO::PARAM_INT);
    $cardsStmt->bindValue(':limit', $per_page, PDO::PARAM_INT);
    $cardsStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $cardsStmt->execute();
    
    $cards = $cardsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 處理小卡資料
    $processed_cards = [];
    foreach ($cards as $card) {
        $processed_cards[] = [
            'card_id' => $card['MYCARDS_ID'],
            'message_text' => $card['MESSAGE_TEXT'],
            'selected_color' => $card['SELECTED_COLOR'],
            'stickers_data' => json_decode($card['STICKERS_DATA'], true),
            'image_path' => $card['IMAGE_PATH'],
            'created_at' => $card['CREATED_AT'],
            'order_id' => $card['ORDERS_ID'],
            'order_number' => $card['ORDER_NUMBER'],
            'plan_type' => $card['PLAN_TYPE'],
            // 格式化顯示日期
            'display_date' => date('Y/m/d', strtotime($card['CREATED_AT']))
        ];
    }
    
    // 計算分頁資訊
    $total_pages = ceil($total_cards / $per_page);
    
    // 回傳成功結果
    echo json_encode([
        'success' => true,
        'message' => '取得小卡清單成功',
        'data' => [
            'cards' => $processed_cards,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $per_page,
                'total_items' => $total_cards,
                'total_pages' => $total_pages,
                'has_next' => $page < $total_pages,
                'has_prev' => $page > 1
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log("取得會員小卡失敗: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug_info' => [
            'requested_m_id' => $m_id ?? 'not_set',
            'requested_page' => $page ?? 'not_set'
        ]
    ]);
}
?>