<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';

try {
    // ========= 1. 取值 =========
    $newsId   = $_POST['newsId'] ?? null; // 有值代表「修改」
    $title    = $_POST['title']    ?? '';
    $summary  = $_POST['summary']  ?? '';
    $tag      = $_POST['tag']      ?? '';
    $featured = (int)($_POST['featured'] ?? 0);
    $status   = (int)($_POST['status']   ?? 0);

    // 內文陣列（subtitle[0]…）
    $subtitles  = $_POST['subtitle']  ?? [];
    $paragraphs = $_POST['paragraph'] ?? [];
    $sortOrders = $_POST['sortOrder'] ?? [];

    // 圖片（允許「修改時不換圖」）
    $uploadDir = '/Users/kevin/TJD101G1/public/images/News/';
    $relativePath = null;

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        // ……與你原本上傳流程相同……
        $extension   = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename    = uniqid('news_') . ".$extension";
        $targetPath  = $uploadDir . $filename;
        $relativePath = 'images/News/' . $filename;
        move_uploaded_file($_FILES['image']['tmp_name'], $targetPath);
    }

    // ========= 2. 開啟交易 =========
    $pdo->beginTransaction();

    /* ============ 3. 新增 or 更新主表 ============ */
    if ($newsId) {
        // --- 修改 ---
        $sql = "UPDATE NEWS_ITEMS 
                   SET TITLE = :title,
                       SUMMARY = :summary,
                       TAG = :tag,
                       IS_FEATURED = :featured,
                       STATUS = :status,
                       UPDATED_AT = CURDATE()"
            . ($relativePath ? ", IMG = :img" : "") . "
                 WHERE ID = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':title',    $title);
        $stmt->bindValue(':summary',  $summary);
        $stmt->bindValue(':tag',      $tag);
        $stmt->bindValue(':featured', $featured);
        $stmt->bindValue(':status',   $status);
        if ($relativePath) $stmt->bindValue(':img', $relativePath);
        $stmt->bindValue(':id',       $newsId, PDO::PARAM_INT);
        $stmt->execute();

        // 先把舊的內文全部刪掉，再重新插入
        $pdo->prepare("DELETE FROM NEWS_CONTENTS WHERE NEWS_ITEMS_ID = ?")
            ->execute([$newsId]);
    } else {
        // --- 新增 ---
        $sql = "INSERT INTO NEWS_ITEMS 
                   (TITLE, SUMMARY, TAG, IS_FEATURED, STATUS, IMG, UPDATED_AT)
                VALUES (:title, :summary, :tag, :featured, :status, :img, CURDATE())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':title'    => $title,
            ':summary'  => $summary,
            ':tag'      => $tag,
            ':featured' => $featured,
            ':status'   => $status,
            ':img'      => $relativePath,
        ]);
        $newsId = $pdo->lastInsertId();
    }

    /* ============ 4. 寫入三段內文 ============ */
    $sqlContent = "INSERT INTO NEWS_CONTENTS 
                      (NEWS_ITEMS_ID, SUBTITLE, PARAGRAPH, SORT_ORDER)
                   VALUES (:nid, :sub, :para, :sort)";
    $stmtC = $pdo->prepare($sqlContent);

    foreach ($subtitles as $idx => $sub) {
        // 保險：空字串不寫入
        if ($sub === '' && ($paragraphs[$idx] ?? '') === '') continue;

        $stmtC->execute([
            ':nid'  => $newsId,
            ':sub'  => $sub,
            ':para' => $paragraphs[$idx]  ?? '',
            ':sort' => $sortOrders[$idx]  ?? ($idx + 1),
        ]);
    }

    /* ============ 5. 交易完成 ============ */
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => $newsId ? '修改完成' : '新增完成']);
} catch (Throwable $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => '錯誤：' . $e->getMessage()]);
}
