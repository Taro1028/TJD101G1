<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';

//前端傳來的帳號密碼
$member = json_decode(file_get_contents("php://input"), true);

try {
        $sql = "SELECT * FROM MEMBERS WHERE EMAIL = :usr AND PASSWORD = :pwd";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':usr', $member['EMAIL']);
        $stmt->bindValue(':pwd', $member['PASSWORD']);
        $stmt->execute();

        $result = $stmt->fetch();

        if ($result) {
                $isBlacklisted = isset($result['BLACKLISTED']) && (int)$result['BLACKLISTED'] === 1;

                if ($isBlacklisted) {
                        echo json_encode([
                                'success' => false,
                                'blacklisted' => true,
                                'message' => '此帳號已被停權',
                        ]);
                        exit;
                }

                // 登入成功，回傳必要會員資料（❗️移除 PASSWORD）
                echo json_encode([
                        'success' => true,
                        'blacklisted' => false,
                        'ID' => $result['ID'],
                        'EMAIL' => $result['EMAIL'],
                        'M_NAME' => $result['M_NAME'],
                        'NICKNAME' => $result['NICKNAME'],
                        'GENDER' => $result['GENDER'],
                        'ADDRESS' => $result['ADDRESS'],
                        'TELEPHONE' => $result['TELEPHONE'],
                        'PHONE' => $result['PHONE'],
                        'EMERGENCY_CONTACTS_NAME' => $result['EMERGENCY_CONTACTS_NAME'],
                        'EMERGENCY_CONTACTS_PHONE' => $result['EMERGENCY_CONTACTS_PHONE'],
                        'BIRTHDAY' => $result['BIRTHDAY'],
                        'NOTE' => $result['NOTE'],
                ]);
        } else {
                echo json_encode([
                        'success' => false,
                        'message' => '帳號或密碼錯誤'
                ]);
        }
} catch (PDOException $e) {
        echo json_encode([
                'success' => false,
                'message' => '伺服器錯誤：' . $e->getMessage()
        ]);
}
