<?php
$member = json_decode(file_get_contents("php://input"), true);
//MySQL相關資訊
include 'connection.php';

//建立SQL語法
$sql = "SELECT ID, EMAIL, PASSWORD 
        FROM `MEMBER`
        WHERE EMAIL = :usr and PASSWORD = :pwd";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':usr', $member['EMAIL']);
$stmt->bindValue(':pwd', $member['PASSWORD']);
$stmt->execute();

$result = $stmt->fetch();
$respBody['ID'] = $result['ID'];
$respBody['EMAIL'] = $result['EMAIL'];
$respBody['PASSWORD'] = $result['PASSWORD'];

echo json_encode($respBody);
?>