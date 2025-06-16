<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
// 取得前端送來的 JSON 輸入
$member = json_decode(file_get_contents("php://input"), true);

// 引入資料庫連線（connection.php 檔案已包含 $pdo）
include_once 'connection.php';
include_once 'cors.php';

try {
        // 查詢該帳號是否存在
        $sql = "SELECT * 
          FROM MEMBERS 
          WHERE EMAIL = :usr AND PASSWORD = :pwd";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':usr', $member['EMAIL']);
        $stmt->bindValue(':pwd', $member['PASSWORD']);
        $stmt->execute();

        $result = $stmt->fetch();

        if ($result) {
                // 登入成功（不回傳密碼）
                echo json_encode([
                        'success' => true,
                        'ID' => $result['ID'],
                        'EMAIL' => $result['EMAIL'],
                        'M_NAME' => $result['M_NAME'],
                        'NICKNAME' => $result['NICKNAME'],
                        'GENDER' => $result['GENDER'],
                        'ADDRESS' => $result['ADDRESS'],
                        'PASSWORD' => $result['PASSWORD'],
                        'TELEPHONE' => $result['TELEPHONE'],
                        'PHONE' => $result['PHONE'],
                        'EMERGENCY_CONTACTS_NAME' => $result['EMERGENCY_CONTACTS_NAME'],
                        'EMERGENCY_CONTACTS_PHONE' => $result['EMERGENCY_CONTACTS_PHONE'],
                        'BIRTHDAY' => $result['BIRTHDAY'],
                        'NOTE' => $result['NOTE'],
                ]);
        } else {
                // 查無資料
                echo json_encode([
                        'success' => false,
                        'message' => '帳號或密碼錯誤'
                ]);
        }
} catch (PDOException $e) {
        // SQL 錯誤處理
        echo json_encode([
                'success' => false,
                'message' => '伺服器錯誤：' . $e->getMessage()
        ]);
}