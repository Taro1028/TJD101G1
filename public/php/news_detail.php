<?php
// news_detail.php
include_once 'cors_1.php';

// 處理 OPTIONS 請求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'connection.php';

try {
    // 獲取新聞 ID
    $id = (int)($_GET['id'] ?? 0);
    
    if ($id <= 0) {
        throw new Exception('無效的新聞ID');
    }
    
    // 獲取新聞主要資訊
    $newsSQL = "
        SELECT ID, TITLE, SUMMARY, TAG, IMG, UPDATED_AT, STATUS
        FROM NEWS_ITEMS 
        WHERE ID = :id AND STATUS = 1
    ";
    
    $newsStmt = $pdo->prepare($newsSQL);
    $newsStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $newsStmt->execute();
    
    $news = $newsStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$news) {
        http_response_code(404);
        throw new Exception('找不到該新聞');
    }
    
    // 獲取新聞內容段落
    $contentSQL = "
        SELECT ID, SUBTITLE, PARAGRAPH, SORT_ORDER
        FROM NEWS_CONTENTS 
        WHERE NEWS_ITEMS_ID = :news_id
        ORDER BY SORT_ORDER ASC
    ";
    
    $contentStmt = $pdo->prepare($contentSQL);
    $contentStmt->bindParam(':news_id', $id, PDO::PARAM_INT);
    $contentStmt->execute();
    
    $contents = $contentStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 組合回傳資料
    $response = [
        'news' => $news,
        'contents' => $contents
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo json_encode([
        'error' => true,
        'message' => '資料庫錯誤: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>