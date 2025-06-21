<?php
// php/cors.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json"); 



// php/cors.php

// 允許跨域
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Max-Age: 86400"); // 預請求快取 1 天

// ⛳ 處理 OPTIONS 預請求（最重要的一段）
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit;
// }

// 正常請求才送出 JSON 回應格式
header("Content-Type: application/json");
