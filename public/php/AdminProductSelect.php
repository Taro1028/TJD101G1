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
    $sql = "SELECT * FROM PRODUCTS";

    // ✅ 改動 1：使用 LIKE 模糊比對 ID（把精確比對拿掉）
    if (!empty($searchId)) {
        $sql .= " WHERE CAST(ID AS CHAR) LIKE :id_like";
    }

    $stmt = $pdo->prepare($sql);

    // ✅ 改動 2：綁定模糊搜尋用的參數（只留一個）
    if (!empty($searchId)) {
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
