<?php
$member = json_decode(file_get_contents("php://input"), true);
//MySQL相關資訊
$db_host = "127.0.0.1";
$db_user = "tibamefe_since2021";
$db_pass = "vwRBSb.j&K#E";
$db_select = "tibamefe_tjd101g1";
$dsn = "mysql:host=" . $db_host . ";dbname=" . $db_select . ";charset=utf8";
$pdo = new PDO($dsn, $db_user, $db_pass);
?>