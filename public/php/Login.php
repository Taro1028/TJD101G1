<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';
// require_once 'vendor/autoload.php'; //google


// 取得前端傳來的帳號密碼
$member = json_decode(file_get_contents("php://input"), true);

try {
        // ✅ Google 登入：如果有 idToken
        // if (isset($member['idToken'])) {
        //         $client = new Google_Client(['client_id' => '1010508992557-rlnbp3o2h7327jmco3726c6qei92s0et.apps.googleusercontent.com']); // 替換成你自己的
        //         $payload = $client->verifyIdToken($member['idToken']);

        //         if ($payload) {
        //                 $googleId = $payload['sub'];
        //                 $email = $payload['email'];
        //                 $name = $payload['name'];
        //                 $avatar = $payload['picture'];

        //                 // 檢查是否已註冊
        //                 $stmt = $pdo->prepare("SELECT * FROM MEMBERS WHERE GOOGLE_ID = :gid");
        //                 $stmt->execute([':gid' => $googleId]);
        //                 $result = $stmt->fetch();

        //                 // 沒有就自動註冊
        //                 if (!$result) {
        //                         $stmt = $pdo->prepare("INSERT INTO MEMBERS (GOOGLE_ID, EMAIL, M_NAME, AVATAR) VALUES (?, ?, ?, ?)");
        //                         $stmt->execute([$googleId, $email, $name, $avatar]);

        //                         $stmt = $pdo->prepare("SELECT * FROM MEMBERS WHERE GOOGLE_ID = :gid");
        //                         $stmt->execute([':gid' => $googleId]);
        //                         $result = $stmt->fetch();
        //                 }

        //                 // 檢查是否停權
        //                 if ((int)($result['BLACKLISTED'] ?? 0) === 1) {
        //                         echo json_encode([
        //                                 'success' => false,
        //                                 'blacklisted' => true,
        //                                 'message' => '此帳號已被停權',
        //                         ]);
        //                         exit;
        //                 }

        //                 // 登入成功
        //                 echo json_encode([
        //                         'success' => true,
        //                         'blacklisted' => false,
        //                         'ID' => $result['ID'],
        //                         'EMAIL' => $result['EMAIL'],
        //                         'M_NAME' => $result['M_NAME'],
        //                         'NICKNAME' => $result['NICKNAME'],
        //                         'GENDER' => $result['GENDER'],
        //                         'ADDRESS' => $result['ADDRESS'],
        //                         'TELEPHONE' => $result['TELEPHONE'],
        //                         'PHONE' => $result['PHONE'],
        //                         'EMERGENCY_CONTACTS_NAME' => $result['EMERGENCY_CONTACTS_NAME'],
        //                         'EMERGENCY_CONTACTS_PHONE' => $result['EMERGENCY_CONTACTS_PHONE'],
        //                         'BIRTHDAY' => $result['BIRTHDAY'],
        //                         'NOTE' => $result['NOTE'],
        //                         'AVATAR' => $result['AVATAR'],
        //                         'PASSWORD' => $result['PASSWORD']                           
        //                 ]);
        //                 exit;
        //         } else {
        //                 echo json_encode(['success' => false, 'message' => '無效的 Google token']);
        //                 exit;
        //         }
        // }

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
                        'PASSWORD' => $result['PASSWORD']
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
