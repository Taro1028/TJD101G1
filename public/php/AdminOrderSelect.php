<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include_once 'connection.php';
include_once 'cors.php';

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $searchId = $input['searchId'] ?? '';

    // 基本 SQL
    $sql = "SELECT 
                o.ID AS order_id,
                o.ORDER_NUMBER,
                o.M_ID,
                o.PLAN_TYPE,
                o.ORDER_START_DATE,
                o.ORDER_END_DATE,
                o.TOTAL_DAYS,
                o.TOTAL_MEAL_COUNT,
                o.TOTAL_AMOUNT,
                o.ORDERS_CREATE_AT,
                o.ORDERS_UPDATE_AT,
                o.ORDERS_STATUS,
                o.CONSIGNEE_NAME,
                o.CONSIGNEE_PHONE,
                o.CONSIGNEE_ADDRESS,
                o.TRANSACTION_ID,
                o.PAYMENT_STATUS,
                o.PAID_AT,
                i.ID AS item_id,
                i.MEAL_DATE,
                i.MEAL_ITEMS,
                i.COUNT,
                i.TOTAL_AMOUNT AS item_amount
            FROM ORDERS o
            JOIN MEMBERS m ON o.M_ID = m.ID
            JOIN ORDERS_ITEMS i ON o.ID = i.ORDERS_ID";

    // 加入條件（可模糊搜尋訂單編號或訂單 ID）
    if (!empty($searchId)) {
        $sql .= " WHERE o.ID = :id_exact";//要這個判斷

    }

    // 預設排序（可選）
    // $sql .= " ORDER BY o.ID DESC";

    $stmt = $pdo->prepare($sql);

    if (!empty($searchId)) {
         $stmt->bindValue(':id_exact', (int)$searchId, PDO::PARAM_INT);
    }

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($results as &$row) {
        // 將 MEAL_ITEMS 轉為陣列
        if (isset($row['MEAL_ITEMS'])) {
            $row['MEAL_ITEMS'] = json_decode($row['MEAL_ITEMS'], true);
        }
    }

    echo json_encode([
        'success' => true,
        'members' => $results
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '伺服器錯誤：' . $e->getMessage()
    ]);
}
