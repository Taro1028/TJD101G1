<?php
// 引入現有的連線檔案和 CORS 設定
require_once 'connection.php';
require_once 'cors.php';

// 設定回應格式
header('Content-Type: application/json; charset=utf-8');

// 只允許 POST 請求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => '只允許 POST 請求'
    ]);
    exit;
}

try {
    // 檢查必要資料是否存在
    if (!isset($_POST['cardData']) || !isset($_FILES['cardImage'])) {
        throw new Exception('缺少必要資料：卡片資料或圖片檔案');
    }
    
    // 解析卡片資料
    $cardData = json_decode($_POST['cardData'], true);
    if (!$cardData) {
        throw new Exception('卡片資料格式錯誤');
    }
    
    // 處理檔案上傳
    $uploadResult = handleFileUpload($_FILES['cardImage']);
    if (!$uploadResult['success']) {
        throw new Exception($uploadResult['error']);
    }
    
    // 修正：ORDERS_ID 設為 NULL
    $sql = "INSERT INTO MESSAGE_CARDS (MESSAGE_TEXT, SELECTED_COLOR, STICKERS_DATA, IMAGE_PATH, ORDERS_ID) 
            VALUES (:message_text, :selected_color, :stickers_data, :image_path, :orders_id)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':message_text' => $cardData['messageText'] ?? '',
        ':selected_color' => $cardData['selectedColor'] ?? '#FFE299',
        ':stickers_data' => json_encode($cardData['stickers'] ?? []),
        ':image_path' => $uploadResult['path'],
        ':orders_id' => null  // 設為 NULL
    ]);
    
    if (!$result) {
        $errorInfo = $stmt->errorInfo();
        throw new Exception('資料庫儲存失敗: ' . $errorInfo[2]);
    }
    
    // 回傳成功訊息
    echo json_encode([
        'success' => true,
        'message' => '卡片儲存成功',
        'cardId' => $pdo->lastInsertId(),
        'imagePath' => $uploadResult['path'],
        'debug' => [
            'messageText' => $cardData['messageText'] ?? '',
            'selectedColor' => $cardData['selectedColor'] ?? '#FFE299',
            'stickersCount' => count($cardData['stickers'] ?? []),
            'ordersId' => null
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => [
            'post_data' => $_POST,
            'files_data' => array_keys($_FILES),
            'sql_error' => isset($stmt) ? $stmt->errorInfo() : 'No statement prepared'
        ]
    ]);
}

/*
 處理檔案上傳的函數
 */
function handleFileUpload($file) {
    // 檢查檔案是否上傳成功
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return [
            'success' => false, 
            'error' => '檔案上傳失敗，錯誤代碼：' . $file['error']
        ];
    }
    
    // 檢查檔案類型
    $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        return [
            'success' => false, 
            'error' => '不支援的檔案類型，僅支援 PNG、JPG、JPEG'
        ];
    }
    
    // 檢查檔案大小（限制 5MB）
    if ($file['size'] > 5 * 1024 * 1024) {
        return [
            'success' => false, 
            'error' => '檔案太大，請勿超過 5MB'
        ];
    }
    
    // 儲存目錄路徑
    $uploadDir = __DIR__ . '/../images/MessageCards/';
    
    // 除錯：輸出實際路徑
    error_log("Upload directory: " . $uploadDir);
    error_log("Real path: " . realpath(dirname($uploadDir)));
    
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            return [
                'success' => false, 
                'error' => '無法建立儲存目錄: ' . $uploadDir
            ];
        }
    }
    
    // 產生唯一檔名
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (empty($extension)) {
        $extension = ($mimeType === 'image/png') ? 'png' : 'jpg';
    }
    
    $filename = 'card_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // 除錯：輸出檔案路徑
    error_log("Target file path: " . $filepath);
    
    // 移動檔案到指定位置
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return [
            'success' => true,
            'path' => 'images/MessageCards/' . $filename,  // 正確的相對路徸
            'fullPath' => $filepath,
            'size' => $file['size'],
            'type' => $mimeType
        ];
    } else {
        return [
            'success' => false, 
            'error' => '檔案儲存失敗，目標路徑：' . $filepath
        ];
    }
}
?>