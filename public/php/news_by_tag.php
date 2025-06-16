<?php
// news_by_tag.php
include_once 'cors_1.php';

// 處理 OPTIONS 請求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'connection.php';

try {
    // 獲取參數
    $tag = $_GET['tag'] ?? '';
    $limit = (int)($_GET['limit'] ?? 10);
    
    if (empty($tag)) {
        throw new Exception('標籤參數不能為空');
    }
    
    // 準備 SQL 查詢
    $sql = "
        SELECT ID, TITLE, SUMMARY, TAG, IMG, UPDATED_AT, IS_FEATURED
        FROM NEWS_ITEMS 
        WHERE TAG = :tag AND STATUS = 1
        ORDER BY UPDATED_AT DESC 
        LIMIT :limit
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':tag', $tag, PDO::PARAM_STR);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 確保回傳 JSON 格式
    echo json_encode($results, JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => '資料庫錯誤: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>