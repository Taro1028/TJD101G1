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
          FROM ADMIN 
          WHERE A_NAME = :usr AND A_PASSWORD = :pwd";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':usr', $member['username']);
    $stmt->bindValue(':pwd', $member['password']);
    $stmt->execute();

    $result = $stmt->fetch(); //資料庫回傳值根據sql語法SELECT * 

    if ($result) {
        // 登入成功（不回傳密碼）
        echo json_encode([
            'success' => true,
            'adminMember' => $result

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
