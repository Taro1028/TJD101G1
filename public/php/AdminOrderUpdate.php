<?php
include_once 'cors.php'; // ← 如果你有跨域請保留
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');


include_once 'connection.php';
$input = json_decode(file_get_contents("php://input"), true);
$id     = intval($input['id']);
$status   = $input['status'];
try {
    $sql = "UPDATE ORDERS SET orders_status = :status
where  ID = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':status', $status);
    $stmt->bindValue(':id',   $id,   PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => '找不到訂單或狀態未變更']);
    } else {
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '資料庫錯誤：' . $e->getMessage()]);
}
