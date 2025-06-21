<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';
$input = json_decode(file_get_contents("php://input"), true);
$searchId = isset($input['searchId']) ? $input['searchId'] : null;
try {
   $sql = "SELECT 
            n.ID AS news_id,
            n.TITLE,
            n.SUMMARY,
            n.TAG,
            n.IMG,
            n.UPDATED_AT,
            n.STATUS,
            n.IS_FEATURED,
            c.ID AS content_id,
            c.NEWS_ITEMS_ID,
            c.SUBTITLE,
            c.PARAGRAPH,
            c.SORT_ORDER
        FROM NEWS_ITEMS n 
        LEFT JOIN NEWS_CONTENTS c ON n.ID = c.NEWS_ITEMS_ID";

if (!empty($searchId)) {
        $sql .= " WHERE n.ID = :searchId";
    }
    $stmt = $pdo->prepare($sql);
    if ($searchId) {
        $stmt->bindValue(':searchId', $searchId, PDO::PARAM_INT);
    }
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $newsList = [];

    foreach ($rows as $row) {
        $id = $row['news_id'];
        if (!isset($newsList[$id])) {
            $newsList[$id] = [
                'ID' => $id,
                
                'TITLE' => $row['TITLE'],

                'SUMMARY' => $row['SUMMARY'],


                'TAG' => $row['TAG'],
                'IMG' => $row['IMG'],
                'UPDATED_AT' => $row['UPDATED_AT'],
                'STATUS' => $row['STATUS'] ? '上架' : '下架',
                'IS_FEATURED' => $row['IS_FEATURED'] ? '是' : '否',
                'CONTENTS' => []
            ];
        }

        if ($row['content_id']) {
            $newsList[$id]['CONTENTS'][] = [
                'ID' => $row['content_id'],
                'NEWS_ITEMS_ID' => $row['NEWS_ITEMS_ID'],
                'SUBTITLE' => $row['SUBTITLE'],
                'PARAGRAPH' => $row['PARAGRAPH'],
                'SORT_ORDER' => $row['SORT_ORDER']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'members' => array_values($newsList)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '伺服器錯誤：' . $e->getMessage()
    ]);
}