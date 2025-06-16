<?php
// deleteConsignee.php - 刪除常用收貨人
include_once 'cors_1.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
ob_start();

include_once 'connection.php';

// 檢查請求方法
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '不支援的請求方法'
    ]);
    exit;
}

// 獲取參數
$consigneeId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$memberId = isset($_GET['member_id']) ? (int)$_GET['member_id'] : 0;

if ($consigneeId <= 0 || $memberId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '無效的收貨人ID或會員ID'
    ]);
    exit;
}

try {
    // 刪除收貨人（確保只能刪除自己的收貨人）
    $stmt = $pdo->prepare("
        DELETE FROM CONSIGNEES 
        WHERE ID = :id AND M_ID = :member_id
    ");
    
    $stmt->bindParam(':id', $consigneeId, PDO::PARAM_INT);
    $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => '常用收貨人刪除成功'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => '找不到要刪除的收貨人'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '刪除常用收貨人失敗: ' . $e->getMessage()
    ]);
}
?>