<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';

try {
    // 1. 先接收主表資料
    $title = $_POST['title'];
    $summary = $_POST['summary'];
    $tag = $_POST['tag'];
    $featured = $_POST['featured'];
    $status = $_POST['status'];

    // 2. 接收段落資料（另一張表用）
    $subtitle = $_POST['subtitle'];
    $paragraph = $_POST['paragraph'];
    $sortOrder = $_POST['sortOrder'];

    // 3. 處理圖片上傳
    $image = $_FILES['image'];
    $uploadDir = 'images/News/';
    $filename = basename($image['name']);
    $targetPath = $uploadDir . $filename;

    // 系統自動生成更新時間
    $updatedAt = date('Y-m-d');

    if (!move_uploaded_file($image['tmp_name'], $targetPath)) {
        echo json_encode(['success' => false, 'message' => '圖片上傳失敗']);
        exit;
    }

    // 4. 新增主資料到 NEWS_ITEMS
    $sql1 = "INSERT INTO NEWS_ITEMS (TITLE, SUMMARY, TAG, IS_FEATURED, STATUS, IMG, UPDATED_AT)
             VALUES (:title, :summary, :tag, :featured, :status, :image, :updatedAt)";
    $stmt1 = $pdo->prepare($sql1);
    $stmt1->execute([
        ':title' => $title,
        ':summary' => $summary,
        ':tag' => $tag,
        ':featured' => $featured,
        ':status' => $status,
        ':image' => $targetPath,
        ':updatedAt' => $updatedAt
    ]);

    // 5. 取得剛剛插入的主鍵 ID
    $newsItemId = $pdo->lastInsertId();

    // 6. 寫入段落資料到 NEWS_CONTENTS，關聯 NEWS_ITEMS_ID
    $sql2 = "INSERT INTO NEWS_CONTENTS (NEWS_ITEMS_ID, SUBTITLE, PARAGRAPH, SORT_ORDER)
             VALUES (:newsId, :subtitle, :paragraph, :sortOrder)";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([
        ':newsId' => $newsItemId,
        ':subtitle' => $subtitle,
        ':paragraph' => $paragraph,
        ':sortOrder' => $sortOrder
    ]);

    // 7. 回傳成功結果
    echo json_encode([
        'success' => true,
        'message' => '新聞新增成功',
        'newsItemId' => $newsItemId
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '資料庫錯誤：' . $e->getMessage()
    ]);
}
