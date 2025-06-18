<?php
// saveRecipient.php - 儲存/更新收件人資料
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
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '不支援的請求方法'
    ]);
    exit;
}

// 獲取 JSON 資料
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '無效的 JSON 資料'
    ]);
    exit;
}

// 驗證必填欄位
$memberId = isset($data['member_id']) ? (int)$data['member_id'] : 0;
$recipientId = isset($data['id']) ? (int)$data['id'] : 0; // 用於更新，0表示新增
$name = isset($data['name']) ? trim($data['name']) : '';
$address = isset($data['address']) ? trim($data['address']) : '';
$telephone = isset($data['telephone']) ? trim($data['telephone']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$contactsName = isset($data['contacts_name']) ? trim($data['contacts_name']) : '';
$contactsPhone = isset($data['contacts_phone']) ? trim($data['contacts_phone']) : '';
$note = isset($data['note']) ? trim($data['note']) : '';

if ($memberId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '無效的會員ID'
    ]);
    exit;
}

// 檢查必填欄位（收件人姓名、地址、手機、緊急聯絡人姓名、緊急聯絡人電話）
if (empty($name) || empty($address) || empty($phone) || empty($contactsName) || empty($contactsPhone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '請填寫完整的收件人資料（收件人姓名、地址、手機、緊急聯絡人姓名、緊急聯絡人電話為必填）'
    ]);
    exit;
}

try {
    if ($recipientId > 0) {
        // 更新現有收件人
        $stmt = $pdo->prepare("
            UPDATE CONSIGNEES SET 
                C_NAME = :name,
                C_ADD = :address,
                C_TELEPHONE = :telephone,
                C_PHONE = :phone,
                C_CONTACTS_NAME = :contacts_name,
                C_CONTACTS_PHONE = :contacts_phone,
                C_NOTE = :note
            WHERE ID = :id AND M_ID = :member_id
        ");
        
        $stmt->bindParam(':id', $recipientId, PDO::PARAM_INT);
        $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':telephone', $telephone, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_name', $contactsName, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_phone', $contactsPhone, PDO::PARAM_STR);
        $stmt->bindParam(':note', $note, PDO::PARAM_STR);
        
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => '收件人資料更新成功',
                'data' => [
                    'id' => $recipientId,
                    'action' => 'update'
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => '收件人資料更新失敗，可能是資料沒有變更或收件人不存在'
            ]);
        }
        
    } else {
        // 新增收件人
        $stmt = $pdo->prepare("
            INSERT INTO CONSIGNEES (
                C_NAME, C_ADD, C_TELEPHONE, C_PHONE, 
                C_CONTACTS_NAME, C_CONTACTS_PHONE, C_NOTE, M_ID
            ) VALUES (
                :name, :address, :telephone, :phone,
                :contacts_name, :contacts_phone, :note, :member_id
            )
        ");
        
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':telephone', $telephone, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_name', $contactsName, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_phone', $contactsPhone, PDO::PARAM_STR);
        $stmt->bindParam(':note', $note, PDO::PARAM_STR);
        $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
        
        $stmt->execute();
        
        $newId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => '收件人資料新增成功',
            'data' => [
                'id' => (int)$newId,
                'action' => 'insert'
            ]
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '儲存收件人資料失敗: ' . $e->getMessage()
    ]);
}
?>