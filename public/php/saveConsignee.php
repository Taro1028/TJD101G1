<?php
// saveConsignee.php
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

// 驗證必填欄位 - 修正參數名稱對應
$memberId = isset($data['member_id']) ? (int)$data['member_id'] : 0;
$name = isset($data['name']) ? trim($data['name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$address = isset($data['address']) ? trim($data['address']) : '';
$telephone = isset($data['telephone']) ? trim($data['telephone']) : '';
$note = isset($data['note']) ? trim($data['note']) : '';
$contactsName = isset($data['contacts_name']) ? trim($data['contacts_name']) : '';
$contactsPhone = isset($data['contacts_phone']) ? trim($data['contacts_phone']) : '';
$consigneeId = isset($data['id']) ? (int)$data['id'] : 0; // 用於更新

if ($memberId <= 0 || empty($name) || empty($phone) || empty($address) || empty($contactsName) || empty($contactsPhone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '請填寫完整的收貨人資料（收貨人姓名、手機、地址、緊急聯絡人姓名、緊急聯絡人電話為必填）'
    ]);
    exit;
}

try {
    if ($consigneeId > 0) {
        // 更新現有收貨人
        $stmt = $pdo->prepare("
            UPDATE CONSIGNEES SET 
                C_NAME = :name,
                C_PHONE = :phone,
                C_ADD = :address,
                C_TELEPHONE = :telephone,
                C_NOTE = :note,
                C_CONTACTS_NAME = :contacts_name,
                C_CONTACTS_PHONE = :contacts_phone
            WHERE ID = :id AND M_ID = :member_id
        ");
        
        $stmt->bindParam(':id', $consigneeId, PDO::PARAM_INT);
        $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':telephone', $telephone, PDO::PARAM_STR);
        $stmt->bindParam(':note', $note, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_name', $contactsName, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_phone', $contactsPhone, PDO::PARAM_STR);
        
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'data' => ['id' => $consigneeId],
                'message' => '常用收貨人更新成功'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => '找不到要更新的收貨人或無變更'
            ]);
        }
        
    } else {
        // 新增收貨人
        $stmt = $pdo->prepare("
            INSERT INTO CONSIGNEES (
                M_ID, 
                C_NAME, 
                C_PHONE, 
                C_ADD, 
                C_TELEPHONE,
                C_NOTE,
                C_CONTACTS_NAME,
                C_CONTACTS_PHONE
            ) VALUES (
                :member_id, 
                :name, 
                :phone, 
                :address, 
                :telephone,
                :note,
                :contacts_name,
                :contacts_phone
            )
        ");
        
        $stmt->bindParam(':member_id', $memberId, PDO::PARAM_INT);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':telephone', $telephone, PDO::PARAM_STR);
        $stmt->bindParam(':note', $note, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_name', $contactsName, PDO::PARAM_STR);
        $stmt->bindParam(':contacts_phone', $contactsPhone, PDO::PARAM_STR);
        
        $stmt->execute();
        
        $newId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $newId],
            'message' => '常用收貨人新增成功'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '儲存常用收貨人失敗: ' . $e->getMessage()
    ]);
}
?>