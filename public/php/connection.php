<?php
$member = json_decode(file_get_contents("php://input"), true);
//MySQL相關資訊
$db_host = "127.0.0.1";
//$db_user = "tibamefe_since2021";
$db_user = "root";
// $db_pass = "vwRBSb.j&K#E";
$db_pass = "password";
// $db_select = "tibamefe_tjd101g1";
$db_select = "tibaeat";
$dsn = "mysql:host=" . $db_host . ";dbname=" . $db_select . ";charset=utf8";
$pdo = new PDO($dsn, $db_user, $db_pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_STRINGIFY_FETCHES => true, // ⭐ 關鍵！讓 BLOB 當字串取出
]);
