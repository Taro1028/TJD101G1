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
        // 建立 SQL 插入語法（對應欄位名稱）
        $sql = "INSERT INTO MEMBERS (
        M_NAME,             -- 姓名
        GENDER,              -- 性別
        ADDRESS,          -- 地址
        EMAIL,            -- 信箱
        PASSWORD,         -- 密碼
        TELEPHONE,        -- 家用電話
        PHONE,            -- 手機
        EMERGENCY_CONTACTS_NAME,    -- 備用聯絡人姓名
        EMERGENCY_CONTACTS_PHONE,    -- 備用聯絡人手機
        BIRTHDAY
    ) VALUES (
        :name,
        :sex,
        :address,
        :email,
        :password,
        :telephone,
        :phone,
        :contactsName,
        :contactsPhone,
        :birthday
    )";

        $stmt = $pdo->prepare($sql);

        // 綁定參數陣列關聯式
        $stmt->bindValue(':name', $member['name']);
        $stmt->bindValue(':sex', $member['sex']);
        $stmt->bindValue(':address', $member['address']);
        $stmt->bindValue(':email', $member['email']);
        $stmt->bindValue(':password', $member['password']);
        $stmt->bindValue(':telephone', $member['telephone']);
        $stmt->bindValue(':phone', $member['phone']);
        $stmt->bindValue(':contactsName', $member['contactsName']);
        $stmt->bindValue(':contactsPhone', $member['contactsPhone']);
        $stmt->bindValue(':birthday', $member['birthday']);


        $stmt->execute();

        echo json_encode([
                'success' => true,
                'message' => '註冊成功'
        ]);
} catch (PDOException $e) {
        echo json_encode([
                'success' => false,
                'message' => '註冊失敗：' . $e->getMessage()
        ]);
}
