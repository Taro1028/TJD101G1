<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
// 取得前端送來的 JSON 輸入
$memberCenter = json_decode(file_get_contents("php://input"), true);

// 引入資料庫連線（connection.php 檔案已包含 $pdo）
include_once 'connection.php';
include_once 'cors.php';

try {
        // 查詢該帳號是否存在

        $sql = "UPDATE MEMBERS
                SET NICKNAME =:nickname,
                GENDER =:gender,
                ADDRESS =:address,
                EMAIL =:email,
                PHONE =:phone,
                TELEPHONE =:telephone,
                
                EMERGENCY_CONTACTS_NAME =:ecn,
                EMERGENCY_CONTACTS_PHONE =:ecp,
                NOTE =:note,
                AVATAR =:avatar
                WHERE id = :id;
                ";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $memberCenter['id']);
        $stmt->bindValue(':gender', $memberCenter['gender']);
        $stmt->bindValue(':nickname', $memberCenter['nickname']);
        // $stmt->bindValue(':password', $memberCenter['password']);
        $stmt->bindValue(':address', $memberCenter['address']);
        $stmt->bindValue(':email', $memberCenter['email']);
        $stmt->bindValue(':phone', $memberCenter['phone']);
        $stmt->bindValue(':telephone', $memberCenter['telephone']);
        $stmt->bindValue(':ecn', $memberCenter['emergency_contacts_name']);
        $stmt->bindValue(':ecp', $memberCenter['emergency_contacts_phone']);
        $stmt->bindValue(':note', $memberCenter['note']);
        $stmt->bindValue(':avatar', $memberCenter['avatar']);
        $stmt->execute();

        $selectStmt = $pdo->prepare("SELECT * FROM MEMBERS WHERE id = :id");
        $selectStmt->bindValue(':id', $memberCenter['id']);
        $selectStmt->execute();
        $updatedMember = $selectStmt->fetch(PDO::FETCH_ASSOC);
        $updatedMember['success'] = true;

        if ($stmt->rowCount() > 0) {

                echo json_encode([
                        'success' => true,
                        'message' => '更新成功',
                        'member' => $updatedMember
                ]);
        } else {

                echo json_encode([
                        'success' => false,
                        'message' => '資料無變更或找不到該 ID',
                        'member' => $updatedMember
                ]);
        }
} catch (PDOException $e) {
        // SQL 錯誤處理
        echo json_encode([
                'success' => false,
                'message' => '伺服器錯誤：' . $e->getMessage()
        ]);
}
