<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';

try {
    // 取得前端送來的 JSON 輸入
    $input = json_decode(file_get_contents("php://input"), true);
    $searchId = $input['searchId'] ?? '';

    // 基本 SQL
    $sql = "SELECT * FROM CONSIGNEES";

    if (!empty($searchId)) {
        $sql .= " WHERE ID = :id_exact OR CAST(ID AS CHAR) LIKE :id_like";
    }

    $stmt = $pdo->prepare($sql);

    if (!empty($searchId)) {
        $stmt->bindValue(':id_exact', (int)$searchId, PDO::PARAM_INT);
        $stmt->bindValue(':id_like', '%' . $searchId . '%', PDO::PARAM_STR);
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
        'message' => '伺服器錯誤：' . $e->getMessage()
    ]);
}
