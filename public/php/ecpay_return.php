<?php
// ecpay_return.php - 處理綠界返回結果
include_once 'cors_1.php';
include_once 'connection.php';

// 設定台灣時區
date_default_timezone_set('Asia/Taipei');

// 綠界測試環境設定
define('ECPay_HashKey', 'pwFHCqoQDkhnLpBNjx2J');
define('ECPay_HashIV', 'EkRm7iFT261dpevs');

// 驗證綠界檢查碼函數
function verifyECPayCheckValue($params, $hashKey, $hashIV) {
    $checkMacValue = $params['CheckMacValue'];
    unset($params['CheckMacValue']); // 移除檢查碼
    
    ksort($params);
    
    $checkStr = "HashKey={$hashKey}&";
    foreach ($params as $key => $value) {
        $checkStr .= "{$key}={$value}&";
    }
    $checkStr .= "HashIV={$hashIV}";
    
    // URL Encode
    $checkStr = urlencode($checkStr);
    $checkStr = strtolower($checkStr);
    
    $calculatedCheckValue = strtoupper(hash('sha256', $checkStr));
    
    return $calculatedCheckValue === $checkMacValue;
}

// 記錄日誌函數
function logPaymentResult($data, $isValid = true) {
    $logFile = __DIR__ . '/payment_logs.txt';
    $timestamp = date('Y-m-d H:i:s');
    $status = $isValid ? 'VALID' : 'INVALID';
    
    $logEntry = "[{$timestamp}] {$status} - " . json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

try {
    // 獲取 POST 資料
    $returnData = $_POST;
    
    if (empty($returnData)) {
        throw new Exception('未收到付款結果資料');
    }
    
    // 記錄原始資料
    logPaymentResult(['raw_data' => $returnData]);
    
    // 驗證檢查碼
    if (!verifyECPayCheckValue($returnData, ECPay_HashKey, ECPay_HashIV)) {
        logPaymentResult($returnData, false);
        throw new Exception('付款結果驗證失敗');
    }
    
    // 解析訂單編號
    $merchantTradeNo = $returnData['MerchantTradeNo'];
    $rtnCode = $returnData['RtnCode'];
    $rtnMsg = $returnData['RtnMsg'];
    $tradeNo = $returnData['TradeNo'];
    $tradeAmt = $returnData['TradeAmt'];
    $paymentDate = $returnData['PaymentDate'];
    $paymentType = $returnData['PaymentType'];
    $paymentTypeChargeFee = $returnData['PaymentTypeChargeFee'] ?? '0';
    
    // 從 MerchantTradeNo 解析出真正的訂單編號
    // 格式：EAT2506180001_timestamp
    $orderNumber = explode('_', $merchantTradeNo)[0];
    
    $pdo->beginTransaction();
    
    // 根據付款結果更新訂單狀態
    if ($rtnCode == '1') {
        // 付款成功
        $orderStatus = 'PAID';
        $updateSql = "UPDATE ORDERS 
                      SET ORDERS_STATUS = ?, 
                          PAYMENT_STATUS = 'COMPLETED',
                          PAYMENT_DATE = ?,
                          ECPAY_TRADE_NO = ?,
                          PAYMENT_TYPE = ?,
                          PAYMENT_FEE = ?,
                          ORDERS_UPDATE_AT = NOW()
                      WHERE ORDER_NUMBER = ?";
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            $orderStatus,
            $paymentDate,
            $tradeNo,
            $paymentType,
            $paymentTypeChargeFee,
            $orderNumber
        ]);
        
        $affectedRows = $updateStmt->rowCount();
        
        if ($affectedRows > 0) {
            $pdo->commit();
            
            // 記錄成功
            logPaymentResult([
                'status' => 'SUCCESS',
                'order_number' => $orderNumber,
                'trade_no' => $tradeNo,
                'amount' => $tradeAmt,
                'payment_date' => $paymentDate,
                'payment_type' => $paymentType
            ]);
            
            // 返回成功給綠界
            echo "1|OK";
            
        } else {
            throw new Exception('找不到對應訂單或更新失敗');
        }
        
    } else {
        // 付款失敗
        $orderStatus = 'PAYMENT_FAILED';
        $updateSql = "UPDATE ORDERS 
                      SET ORDERS_STATUS = ?, 
                          PAYMENT_STATUS = 'FAILED',
                          PAYMENT_ERROR = ?,
                          ORDERS_UPDATE_AT = NOW()
                      WHERE ORDER_NUMBER = ?";
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            $orderStatus,
            $rtnMsg,
            $orderNumber
        ]);
        
        $pdo->commit();
        
        // 記錄失敗
        logPaymentResult([
            'status' => 'FAILED',
            'order_number' => $orderNumber,
            'error_code' => $rtnCode,
            'error_message' => $rtnMsg
        ]);
        
        // 返回成功給綠界（表示我們已收到通知）
        echo "1|OK";
    }
    
} catch (PDOException $e) {
    $pdo->rollBack();
    logPaymentResult(['error' => 'Database error: ' . $e->getMessage()], false);
    echo "0|Database Error";
    
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    logPaymentResult(['error' => $e->getMessage()], false);
    echo "0|Error: " . $e->getMessage();
}
?>