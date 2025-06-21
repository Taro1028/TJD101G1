<?php
include_once 'cors.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
// 取得前端送來的 JSON 輸入
$member = json_decode(file_get_contents("php://input"), true);


include_once 'connection.php';


try {
    $input = json_decode(file_get_contents("php://input"), true);
    $searchId = $input['searchId'] ?? '';

    if (!empty($searchId)) {
        $sql = "SELECT * FROM MEMBERS WHERE ID LIKE :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', '%' . $searchId . '%');
    } else {
        $sql = "SELECT * FROM MEMBERS";
        $stmt = $pdo->prepare($sql);
    }

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'members' => $results
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '錯誤：' . $e->getMessage()
    ]);
}