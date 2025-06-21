<?php
include_once 'cors.php'; // ← 如果你有跨域請保留
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');


include_once 'connection.php';

$input = json_decode(file_get_contents("php://input"), true);
$id     = intval($input['id'] ?? 0);
$flag   = intval($input['flag'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少會員 ID']);
    exit;
}

try {
    $sql  = "UPDATE MEMBERS SET BLACKLISTED = :flag WHERE ID = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':flag', $flag, PDO::PARAM_INT);
    $stmt->bindValue(':id',   $id,   PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => '找不到該會員或狀態未變更']);
    } else {
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '資料庫錯誤：' . $e->getMessage()]);
}
