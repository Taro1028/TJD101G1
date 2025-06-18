<?php
// remove_cart_item.php
include_once 'cors_1.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

try {
    include_once 'connection.php';
    
    if (!isset($pdo)) {
        throw new Exception('資料庫連線失敗');
    }

    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($input['cart_id'])) {
        throw new Exception('缺少 cart_id 參數');
    }
    
    if (!isset($input['m_id'])) {
        throw new Exception('缺少 m_id 參數');
    }
    
    $cart_id = intval($input['cart_id']);
    $m_id = intval($input['m_id']);
    
    // 開始事務
    $pdo->beginTransaction();
    
    // 驗證購物車是否屬於該會員
    $verifySql = "SELECT ID FROM SHOPPING_CART WHERE ID = :cart_id AND M_ID = :m_id";
    $verifyStmt = $pdo->prepare($verifySql);
    $verifyStmt->execute([':cart_id' => $cart_id, ':m_id' => $m_id]);
    
    if (!$verifyStmt->fetch()) {
        throw new Exception('找不到指定的購物車項目或無權限操作');
    }
    
    // 🔥 關鍵修正：按正確順序刪除
    
    // 1. 先刪除 MESSAGE_CARDS（子表）
    $sql_message_cards = "DELETE FROM MESSAGE_CARDS WHERE SHOPPING_CART_ID = :cart_id";
    $stmt_message_cards = $pdo->prepare($sql_message_cards);
    $stmt_message_cards->execute([':cart_id' => $cart_id]);
    $deleted_cards = $stmt_message_cards->rowCount();
    
    // 2. 再刪除 CART_ITEMS（子表）
    $sql_items = "DELETE FROM CART_ITEMS WHERE SCART_ID = :cart_id";
    $stmt_items = $pdo->prepare($sql_items);
    $stmt_items->execute([':cart_id' => $cart_id]);
    $deleted_items = $stmt_items->rowCount();
    
    // 3. 最後刪除 SHOPPING_CART（父表）
    $sql_cart = "DELETE FROM SHOPPING_CART WHERE ID = :cart_id AND M_ID = :m_id";
    $stmt_cart = $pdo->prepare($sql_cart);
    $stmt_cart->execute([':cart_id' => $cart_id, ':m_id' => $m_id]);
    
    if ($stmt_cart->rowCount() === 0) {
        throw new Exception('刪除失敗，找不到指定的購物車項目');
    }
    
    // 提交事務
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => '購物車項目已刪除',
        'details' => [
            'deleted_cart' => 1,
            'deleted_items' => $deleted_items,
            'deleted_message_cards' => $deleted_cards
        ]
    ]);

} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("刪除購物車項目失敗: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>