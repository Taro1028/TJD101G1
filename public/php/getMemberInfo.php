<?php
// add_to_cart.php - 支援用戶關聯版本
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
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '不支援的請求方法'
    ]);
    exit;
}

// 獲取會員ID參數
$memberId = isset($_GET['member_id']) ? (int)$_GET['member_id'] : 0;

if ($memberId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '無效的會員ID'
    ]);
    exit;
}

try {
    // 查詢會員資料
    $stmt = $pdo->prepare("
        SELECT 
            ID,
            M_NAME,
            PHONE,
            ADDRESS,
            EMAIL,
            GENDER,
            BIRTHDAY
        FROM MEMBERS 
        WHERE ID = :member_id
    ");
    
    $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
    $stmt->execute();
    
    $member = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($member) {
        // 成功找到會員資料
        echo json_encode([
            'success' => true,
            'data' => $member,
            'message' => '會員資料獲取成功'
        ]);
    } else {
        // 找不到會員
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => '找不到會員資料'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '查詢會員資料失敗: ' . $e->getMessage()
    ]);
}
?>