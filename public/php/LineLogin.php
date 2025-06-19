<?php
header('Content-Type: application/json');
ini_set('display_errors', 0); // 不輸出 HTML 錯誤
ini_set('log_errors', 1);     // 只寫入 log

include_once 'connection.php';
include_once 'cors.php';

// LINE 開發者資訊
$line_client_id = '2007574091';
$line_client_secret = '573592083730417e5bd749b98ca6a8e2';
// $line_redirect_uri = 'http://localhost:5173/tjd101/g1/LineCallback';
// 若部署正式站請改用以下
$line_redirect_uri = 'https://tibamef2e.com/tjd101/g1/LineCallback'; 

// 取得前端傳來的 code 與 redirect_uri
$input = file_get_contents('php://input');
$data = json_decode($input, true);
$code = $data['code'] ?? null;
$frontend_redirect_uri = $data['redirect_uri'] ?? null;

// 檢查 code 與 redirect_uri
if (empty($code) || $frontend_redirect_uri !== $line_redirect_uri) {
    echo json_encode(['success' => false, 'message' => '無效的請求或回調 URI 不匹配。']);
    exit();
}

// 步驟 1：向 LINE 交換 access_token
$token_url = 'https://api.line.me/oauth2/v2.1/token';
$post_fields = [
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => $line_redirect_uri,
    'client_id' => $line_client_id,
    'client_secret' => $line_client_secret,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

$token_response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$token_data = json_decode($token_response, true);

// 取得 access_token 與 id_token
if ($http_code !== 200 || !isset($token_data['access_token']) || !isset($token_data['id_token'])) {
    error_log('LINE Token 交換失敗: ' . $token_response);
    echo json_encode(['success' => false, 'message' => 'LINE 授權碼交換失敗。']);
    exit();
}

$access_token = $token_data['access_token'];
$id_token = $token_data['id_token'];

// 步驟 2：解析 ID Token
$id_token_parts = explode('.', $id_token);
if (count($id_token_parts) !== 3) {
    echo json_encode(['success' => false, 'message' => '無效的 ID Token。']);
    exit();
}

$payload_encoded = $id_token_parts[1];
$payload_json = base64_decode(str_replace(['-', '_'], ['+', '/'], $payload_encoded));
$payload = json_decode($payload_json, true);

// 抽取 LINE 使用者資訊
$LINE_ID = $payload['sub'] ?? null;
$M_NAME = $payload['name'] ?? 'LINE 使用者';
// $line_email = $payload['email'] ?? null;

if (empty($LINE_ID)) {
    echo json_encode(['success' => false, 'message' => '無法取得 LINE 使用者 ID。']);
    exit();
}

// 步驟 3：查詢資料庫中是否已有此使用者
try {
    $stmt = $pdo->prepare("SELECT * FROM MEMBERS WHERE LINE_ID = ?");
    $stmt->execute([$LINE_ID]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($member) {
        // 已註冊：更新名稱與登入時間
        $update = $pdo->prepare("UPDATE MEMBERS SET M_NAME = ? WHERE LINE_ID = ?");
        $update->execute([$M_NAME, $LINE_ID]);

        // 重新取得最新資料
        $stmt = $pdo->prepare("SELECT * FROM MEMBERS WHERE LINE_ID = ?");
        $stmt->execute([$LINE_ID]);
        $member = $stmt->fetch(PDO::FETCH_ASSOC);
        $message = 'LINE 會員登入成功！';
    } else {
        // 🔧 修正：註冊新會員時不需要 email 欄位（因為 LINE 可能沒有提供）
        $stmt = $pdo->prepare("INSERT INTO MEMBERS (M_NAME, LINE_ID) VALUES (?, ?)");
        $stmt->execute([$M_NAME, $LINE_ID]);
        $new_id = $pdo->lastInsertId();

        $stmt = $pdo->prepare("SELECT * FROM MEMBERS WHERE ID = ?");
        $stmt->execute([$new_id]);
        $member = $stmt->fetch(PDO::FETCH_ASSOC);
        $message = 'LINE 會員註冊並登入成功！';
    }

    // 🔧 修正：回傳格式要符合前端 MemberStore 的期望格式
    echo json_encode([
        'success' => true,
        'message' => $message,
        'member_info' => [
            // 使用與一般登入相同的欄位名稱
            'success' => true,
            'id' => $member['ID'],
            'ID' => $member['ID'],
            'M_NAME' => $member['M_NAME'],
            'name' => $member['M_NAME'],
            'EMAIL' => $member['EMAIL'] ?? '',
            'email' => $member['EMAIL'] ?? '',
            'PHONE' => $member['PHONE'] ?? '',
            'phone' => $member['PHONE'] ?? '',
            'GENDER' => $member['GENDER'] ?? '',
            'gender' => $member['GENDER'] ?? '',
            'BIRTHDAY' => $member['BIRTHDAY'] ?? '',
            'birthday' => $member['BIRTHDAY'] ?? '',
            'LINE_ID' => $member['LINE_ID'],
            'ADDRESS' => $member['ADDRESS'] ?? '',
            'TELEPHONE' => $member['TELEPHONE'] ?? '',
            'EMERGENCY_CONTACTS_NAME' => $member['EMERGENCY_CONTACTS_NAME'] ?? '',
            'EMERGENCY_CONTACTS_PHONE' => $member['EMERGENCY_CONTACTS_PHONE'] ?? '',
            'AVATAR' => $member['AVATAR'] ?? '',
            'NOTE' => $member['NOTE'] ?? '',
            'NICKNAME' => $member['NICKNAME'] ?? '',
            'PASSWORD' => '' // LINE 登入不需要密碼
        ]
    ]);
} catch (PDOException $e) {
    error_log("資料庫錯誤: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '資料庫錯誤，請稍後再試。']);
}
?>