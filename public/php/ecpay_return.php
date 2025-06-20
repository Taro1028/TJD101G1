<?php
// ecpay_return.php - 處理綠界返回結果
include_once 'cors_1.php';
include_once 'connection.php';

// 設定台灣時區
date_default_timezone_set('Asia/Taipei');

// 🔥 修正：使用正確的綠界測試環境設定
define('ECPay_HashKey', 'pwFHCqoQZGmho4w6');  // 修正 HashKey
define('ECPay_HashIV', 'EkRm7iFT261dpevs');

// 驗證綠界檢查碼函數
function verifyECPayCheckValue($params, $hashKey, $hashIV) {
    $checkMacValue = $params['CheckMacValue'];
    unset($params['CheckMacValue']); // 移除檢查碼
    
    ksort($params);
    
    $encoded = http_build_query($params);
    $encoded = urldecode($encoded);
    $macString = "HashKey={$hashKey}&{$encoded}&HashIV={$hashIV}";
    $macString = urlencode($macString);
    $macString = strtolower($macString);
    
    // URL encode 特殊字符處理
    $macString = str_replace('%21', '!', $macString);
    $macString = str_replace('%28', '(', $macString);
    $macString = str_replace('%29', ')', $macString);
    $macString = str_replace('%2a', '*', $macString);
    $macString = str_replace('%2d', '-', $macString);
    $macString = str_replace('%2e', '.', $macString);
    $macString = str_replace('%5f', '_', $macString);
    $macString = str_replace('%7e', '~', $macString);
    
    $calculatedCheckValue = strtoupper(hash('sha256', $macString));
    
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
    
    // 解析付款結果
    $merchantTradeNo = $returnData['MerchantTradeNo'];
    $rtnCode = $returnData['RtnCode'];
    $rtnMsg = $returnData['RtnMsg'];
    $tradeNo = $returnData['TradeNo'];
    $tradeAmt = $returnData['TradeAmt'];
    $paymentDate = $returnData['PaymentDate'];
    $paymentType = $returnData['PaymentType'];
    $paymentTypeChargeFee = $returnData['PaymentTypeChargeFee'] ?? '0';
    
    // 🔥 修正：從 MerchantTradeNo 解析出訂單編號
    // 新格式可能是：EAT25061801123456 (沒有底線)
    // 需要從批次記錄中找到對應的訂單
    
    // 先嘗試從批次記錄找到對應關係
    $batchLogFile = __DIR__ . '/batch_payments.json';
    $batchPayments = [];
    $relatedOrderNumbers = [];
    
    if (file_exists($batchLogFile)) {
        $batchPayments = json_decode(file_get_contents($batchLogFile), true) ?: [];
        
        // 直接從批次記錄中找到對應的訂單編號
        if (isset($batchPayments[$merchantTradeNo])) {
            $relatedOrderNumbers = $batchPayments[$merchantTradeNo]['order_numbers'];
            logPaymentResult(['found_batch_info' => $batchPayments[$merchantTradeNo]]);
        }
    }
    
    // 如果批次記錄中沒找到，嘗試從 MerchantTradeNo 解析
    if (empty($relatedOrderNumbers)) {
        // 解析邏輯：找到 EAT + 6位日期的部分
        if (preg_match('/^(EAT\d{6})/', $merchantTradeNo, $matches)) {
            $datePrefix = $matches[1]; // 例如：EAT250618
            
            // 查詢資料庫中以此日期開頭的訂單
            $searchQuery = "SELECT ORDER_NUMBER FROM ORDERS WHERE ORDER_NUMBER LIKE ? ORDER BY ID DESC";
            $searchStmt = $pdo->prepare($searchQuery);
            $searchStmt->execute([$datePrefix . '%']);
            $possibleOrders = $searchStmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (!empty($possibleOrders)) {
                // 如果找到多個，取最新的（假設是同批次）
                $relatedOrderNumbers = [$possibleOrders[0]];
                logPaymentResult(['parsed_from_merchant_trade_no' => $merchantTradeNo, 'found_orders' => $possibleOrders]);
            }
        }
    }
    
    // 如果還是沒找到，記錄錯誤
    if (empty($relatedOrderNumbers)) {
        throw new Exception("無法從 MerchantTradeNo 找到對應訂單: {$merchantTradeNo}");
    }
    
    logPaymentResult(['merchant_trade_no' => $merchantTradeNo, 'related_orders' => $relatedOrderNumbers]);
    
    $pdo->beginTransaction();
    
    // 🔥 根據付款結果更新所有相關訂單的狀態
    if ($rtnCode == '1') {
        // 付款成功：更新所有相關訂單
        $placeholders = str_repeat('?,', count($relatedOrderNumbers) - 1) . '?';
        $updateSql = "UPDATE ORDERS 
                      SET ORDERS_STATUS = 'CO', 
                          PAYMENT_STATUS = 'PAID',
                          PAID_AT = ?,
                          TRANSACTION_ID = ?,
                          ORDERS_UPDATE_AT = NOW()
                      WHERE ORDER_NUMBER IN ($placeholders)";
        
        $params = array_merge([
            $paymentDate,
            $tradeNo
        ], $relatedOrderNumbers);
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute($params);
        
        $affectedRows = $updateStmt->rowCount();
        
        if ($affectedRows > 0) {
            $pdo->commit();
            
            // 記錄成功
            logPaymentResult([
                'status' => 'SUCCESS',
                'merchant_trade_no' => $merchantTradeNo,
                'related_orders' => $relatedOrderNumbers,
                'updated_count' => $affectedRows,
                'trade_no' => $tradeNo,
                'amount' => $tradeAmt,
                'payment_date' => $paymentDate
            ]);
            
            // 清理批次記錄
            if (isset($batchPayments[$merchantTradeNo])) {
                unset($batchPayments[$merchantTradeNo]);
                file_put_contents($batchLogFile, json_encode($batchPayments, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            }
            
            // 返回成功給綠界
            echo "1|OK";
            
        } else {
            throw new Exception('找不到對應訂單或更新失敗');
        }
        
    } else {
        // 付款失敗：更新所有相關訂單
        $placeholders = str_repeat('?,', count($relatedOrderNumbers) - 1) . '?';
        $updateSql = "UPDATE ORDERS 
                      SET ORDERS_STATUS = 'PD', 
                          PAYMENT_STATUS = 'FAILED',
                          ORDERS_UPDATE_AT = NOW()
                      WHERE ORDER_NUMBER IN ($placeholders)";
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute($relatedOrderNumbers);
        
        $pdo->commit();
        
        // 記錄失敗
        logPaymentResult([
            'status' => 'FAILED',
            'merchant_trade_no' => $merchantTradeNo,
            'related_orders' => $relatedOrderNumbers,
            'error_code' => $rtnCode,
            'error_message' => $rtnMsg
        ]);
        
        // 返回成功給綠界（表示我們已收到通知）
        echo "1|OK";
    }
    
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
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