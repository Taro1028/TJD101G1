<?php
// getRecipients.php - 獲取會員的收件人資料
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
    // 查詢會員的收件人資料（最新的3筆，按ID DESC排序）
    $stmt = $pdo->prepare("
        SELECT 
            ID,
            C_NAME,
            C_ADD,
            C_TELEPHONE,
            C_PHONE,
            C_CONTACTS_NAME,
            C_CONTACTS_PHONE,
            C_NOTE,
            M_ID
        FROM CONSIGNEES 
        WHERE M_ID = :member_id 
        ORDER BY ID DESC
        LIMIT 3
    ");
    
    $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
    $stmt->execute();
    
    $recipients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 轉換資料格式，確保有3個位置（空的用null填充）
    $formattedRecipients = [
        'recipient1' => null,
        'recipient2' => null,
        'recipient3' => null
    ];
    
    // 將查詢到的資料依序填入
    $keys = ['recipient1', 'recipient2', 'recipient3'];
    for ($i = 0; $i < count($recipients) && $i < 3; $i++) {
        $recipient = $recipients[$i];
        $formattedRecipients[$keys[$i]] = [
            'id' => (int)$recipient['ID'],
            'name' => $recipient['C_NAME'] ?? '',
            'address' => $recipient['C_ADD'] ?? '',
            'telephone' => $recipient['C_TELEPHONE'] ?? '',
            'phone' => $recipient['C_PHONE'] ?? '',
            'contactsName' => $recipient['C_CONTACTS_NAME'] ?? '',
            'contactsPhone' => $recipient['C_CONTACTS_PHONE'] ?? '',
            'note' => $recipient['C_NOTE'] ?? ''
        ];
    }
    
    // 成功回傳資料
    echo json_encode([
        'success' => true,
        'data' => $formattedRecipients,
        'count' => count($recipients),
        'message' => '收件人資料獲取成功'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '查詢收件人資料失敗: ' . $e->getMessage()
    ]);
}
?>