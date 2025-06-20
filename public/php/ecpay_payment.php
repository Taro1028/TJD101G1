<?php
// ecpay_payment.php - 處理綠界付款跳轉
include_once 'cors_1.php';

// 🔥 確保 CORS 和 OPTIONS 處理在最前面
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 設定錯誤報告
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// 設定回應格式
header('Content-Type: application/json; charset=utf-8');

// 設定台灣時區
date_default_timezone_set('Asia/Taipei');

// 🔥 綠界測試環境設定
$hashKey = 'pwFHCqoQZGmho4w6';
$hashIV = 'EkRm7iFT261dpevs';
$merchantID = '3002607';

// 🔥 綠界加密函式
function generateCheckMacValue($params, $hashKey, $hashIV) {
    ksort($params);
    $encoded = http_build_query($params);
    $encoded = urldecode($encoded);
    $macString = "HashKey=$hashKey&$encoded&HashIV=$hashIV";
    $macString = urlencode($macString);
    $macString = strtolower($macString);
    $macString = str_replace('%21', '!', $macString);
    $macString = str_replace('%28', '(', $macString);
    $macString = str_replace('%29', ')', $macString);
    $macString = str_replace('%2a', '*', $macString);
    $macString = str_replace('%2d', '-', $macString);
    $macString = str_replace('%2e', '.', $macString);
    $macString = str_replace('%5f', '_', $macString);
    $macString = str_replace('%7e', '~', $macString);
    return strtoupper(hash('sha256', $macString));
}

// 檢查請求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '不支援的請求方法'
    ]);
    exit;
}

// 獲取請求資料
$input = json_decode(file_get_contents('php://input'), true);

// 🔥 除錯：記錄收到的資料
error_log('ecpay_payment.php 收到的資料: ' . json_encode($input, JSON_UNESCAPED_UNICODE));

// 驗證必要欄位
if (!isset($input['order_numbers']) || !isset($input['total_amount'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '缺少必要的付款參數',
        'received_data' => $input
    ]);
    exit;
}

try {
    $orderNumbers = $input['order_numbers'];
    $totalAmount = (int)$input['total_amount'];
    $itemName = $input['item_name'] ?? '餐盒訂購';
    
    // 🔥 修正：生成綠界商店交易編號（只能包含數字和英文字母，不能有底線）
    $timestamp = time();
    $timestampSuffix = substr($timestamp, -6); // 取時間戳記後6位
    
    // 🔥 重要：移除底線，改用純數字/字母組合
    // 原格式：EAT2506180001_123456 (有底線，不符合綠界規定)
    // 新格式：EAT2506180001123456 (純英數，但可能超過20字符)
    // 最佳格式：EAT25061801123456 (移除訂單編號中的前導0，確保在20字符內)
    
    $firstOrderNumber = $orderNumbers[0]; // 例如：EAT2506180001
    
    // 如果直接組合會超過20字符，就縮短訂單編號部分
    $merchantTradeNo = $firstOrderNumber . $timestampSuffix;
    
    if (strlen($merchantTradeNo) > 20) {
        // 縮短策略：保留 EAT + 日期 + 部分ID + 時間戳
        $eatPrefix = substr($firstOrderNumber, 0, 9); // EAT250618
        $orderIdPart = substr($firstOrderNumber, 9); // 0001
        $shortOrderId = ltrim($orderIdPart, '0') ?: '1'; // 移除前導0，如果全是0則改為1
        
        $merchantTradeNo = $eatPrefix . $shortOrderId . $timestampSuffix;
        
        // 如果還是太長，截取前20字符
        if (strlen($merchantTradeNo) > 20) {
            $merchantTradeNo = substr($merchantTradeNo, 0, 20);
        }
    }
    
    // 🔥 確保只包含英數字符（移除任何特殊字符）
    $merchantTradeNo = preg_replace('/[^a-zA-Z0-9]/', '', $merchantTradeNo);
    
    // 🔥 除錯：記錄生成過程
    error_log("原始訂單編號: {$firstOrderNumber}");
    error_log("時間戳後綴: {$timestampSuffix}");
    error_log("最終商店交易編號: {$merchantTradeNo} (長度: " . strlen($merchantTradeNo) . ")");
    
    // 🔥 驗證最終格式
    if (strlen($merchantTradeNo) > 20) {
        throw new Exception("商店交易編號超過20字符: {$merchantTradeNo}");
    }
    
    if (!preg_match('/^[a-zA-Z0-9]+$/', $merchantTradeNo)) {
        throw new Exception("商店交易編號包含非法字符: {$merchantTradeNo}");
    }
    
    // 🔥 記錄批次付款資訊（用於後續處理）
    $batchPaymentData = [
        'merchant_trade_no' => $merchantTradeNo,
        'order_numbers' => $orderNumbers,
        'total_amount' => $totalAmount,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $batchLogFile = __DIR__ . '/batch_payments.json';
    $existingBatches = [];
    if (file_exists($batchLogFile)) {
        $existingBatches = json_decode(file_get_contents($batchLogFile), true) ?: [];
    }
    $existingBatches[$merchantTradeNo] = $batchPaymentData;
    file_put_contents($batchLogFile, json_encode($existingBatches, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    
    // 🔥 綠界 API 網址
    $actionURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
    
    // 🔥 返回網址設定
    $baseURL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . 
               '://' . $_SERVER['HTTP_HOST'];
    
    // 🔥 組建綠界所需參數
    $orderData = [
        'MerchantID' => $merchantID,
        'MerchantTradeNo' => $merchantTradeNo,
        'MerchantTradeDate' => date('Y/m/d H:i:s'),
        'PaymentType' => 'aio',
        'TotalAmount' => $totalAmount,
        'TradeDesc' => 'TibaEAT 餐盒訂購',
        'ItemName' => $itemName,
        'ReturnURL' => $baseURL . '/tjd101/g1/php/ecpay_return.php',
        'ChoosePayment' => 'Credit',
        'ClientBackURL' => $baseURL . '/tjd101/g1/#/Check_Complete',
        'NeedExtraPaidInfo' => 'N',
        'EncryptType' => 1
    ];
    
    // 🔥 生成檢查碼
    $orderData['CheckMacValue'] = generateCheckMacValue($orderData, $hashKey, $hashIV);
    
    // 🔥 記錄付款請求日誌
    $logFile = __DIR__ . '/payment_requests.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] Payment Request - " . json_encode([
        'merchant_trade_no' => $merchantTradeNo,
        'order_numbers' => $orderNumbers,
        'total_amount' => $totalAmount,
        'item_name' => $itemName,
        'form_data' => $orderData
    ], JSON_UNESCAPED_UNICODE) . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    
    // 🔥 返回綠界表單資料
    echo json_encode([
        'success' => true,
        'message' => '付款資料準備完成',
        'data' => [
            'action_url' => $actionURL,
            'form_data' => $orderData,
            'merchant_trade_no' => $merchantTradeNo,
            'debug_info' => [
                'received_order_numbers' => $orderNumbers,
                'received_total_amount' => $totalAmount,
                'generated_merchant_trade_no' => $merchantTradeNo,
                'batch_log_saved' => file_exists($batchLogFile)
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log('ecpay_payment.php 錯誤: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '付款處理失敗：' . $e->getMessage(),
        'debug_info' => [
            'input_data' => $input,
            'error_line' => $e->getLine(),
            'error_file' => $e->getFile()
        ]
    ]);
}
?>