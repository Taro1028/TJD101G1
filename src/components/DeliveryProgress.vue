<template>
    <section class="accordion accordion--radio">
        <!--動態渲染每筆訂單 -->
        <div 
            v-for="(order, index) in orders" 
            :key="order.ID" 
            class="tab"
        >
            <input 
                type="checkbox" 
                name="accordion-orders" 
                :id="`order-${order.ID}`"
            >
            <label 
                :for="`order-${order.ID}`" 
                class="tab__label"
            >
                <i class="bi bi-envelope"> 訂單編號：{{ order.ORDER_NUMBER }}</i>
            </label>
            <div class="tab__content">
                <p>訂單金額：${{ formatAmount(order.TOTAL_AMOUNT) }}</p>
                <p>收件地址：{{ order.CONSIGNEE_ADDRESS || '地址未設定' }}</p>
                <p>訂單項目：{{ order.PLAN_TYPE }}</p>
                <p>訂單狀態：{{ order.STATUS_TEXT }}</p>
                <div class="DeliveryStatusLine-container">
                    <DeliveryStatusLine :status="order.STATUS_NUMBER" />
                </div>
                <p>配送期間：{{ order.DELIVERY_PERIOD }}</p>
                <div class="OrderDetails-btn">
                    <button 
                        class="details-button" 
                        @click="openModal(order)"
                    >
                        查看訂單明細
                    </button>
                </div>
            </div>
        </div>

        <!--無訂單時的提示 -->
        <div v-if="!orders || orders.length === 0" class="no-orders">
            <div class="no-orders-content">
                <i class="bi bi-inbox"></i>
                <h3>目前沒有訂單</h3>
                <p>您還沒有任何訂單記錄</p>
            </div>
        </div>
    </section>

    <!--訂單明細彈出視窗 -->
    <div class="modal-overlay" :class="{ active: isModalOpen }" @click="closeModalOnOverlay">
        <div class="modal-content" v-if="selectedOrder">
            <div class="modal-header">
                <h2 class="modal-title">訂單明細 - {{ selectedOrder.ORDER_NUMBER }}</h2>
                <button class="modal-close" @click="closeModal">&times;</button>
            </div>
            
            <!--  訂單資訊 -->
            <div class="order-info">
                <h3>訂單資訊</h3>
                <div class="info-row">
                    <span class="info-label">訂單編號：</span>
                    <span class="info-value">{{ selectedOrder.ORDER_NUMBER }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">訂單金額：</span>
                    <span class="info-value">${{ formatAmount(selectedOrder.TOTAL_AMOUNT) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">訂單項目：</span>
                    <span class="info-value">{{ selectedOrder.PLAN_TYPE }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">配送期間：</span>
                    <span class="info-value">{{ selectedOrder.DELIVERY_PERIOD }}</span>
                </div>
            </div>

            <!--  收件資訊 -->
            <div class="order-info">
                <h3>收件資訊</h3>
                <div class="info-row">
                    <span class="info-label">收件人：</span>
                    <span class="info-value">{{ selectedOrder.CONSIGNEE_NAME || '未設定' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">手機：</span>
                    <span class="info-value">{{ selectedOrder.CONSIGNEE_PHONE || '未設定' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">地址：</span>
                    <span class="info-value">{{ selectedOrder.CONSIGNEE_ADDRESS || '未設定' }}</span>
                </div>
            </div>

            <!--  每日餐盒 -->
            <div class="order-info">
                <h3>每日餐盒</h3>
                <div 
                    class="daily-meal" 
                    v-for="item in selectedOrder.ORDER_ITEMS" 
                    :key="`${selectedOrder.ID}-${item.MEAL_DATE}`"
                >
                    <div class="meal-date">{{ formatMealDate(item.MEAL_DATE) }}</div>
                    <div class="meal-content">
                        <div 
                            class="meal-item" 
                            v-for="mealItem in item.MEAL_ITEMS_PARSED" 
                            :key="mealItem.name"
                        >
                            主菜：{{ mealItem.name }}
                        </div>
                        <!--  如果沒有解析成功的餐點，顯示原始資料 -->
                        <div 
                            v-if="!item.MEAL_ITEMS_PARSED || item.MEAL_ITEMS_PARSED.length === 0" 
                            class="meal-item"
                        >
                            {{ item.MEAL_ITEMS || '餐點資訊未設定' }}
                        </div>
                    </div>
                </div>
                
                <!--  如果沒有餐盒項目 -->
                <div v-if="!selectedOrder.ORDER_ITEMS || selectedOrder.ORDER_ITEMS.length === 0" class="no-meal-items">
                    <p>此訂單暫無餐盒明細</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import DeliveryStatusLine from '../components/DeliveryStatusLine.vue';
import { ref, computed } from 'vue'

//  接收父元件傳入的訂單資料
const props = defineProps({
    orders: {
        type: Array,
        default: () => []
    }
})

//  響應式數據
const isModalOpen = ref(false)
const selectedOrder = ref(null)

//  格式化金額 - 使用千分位逗號
const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '0'
    return Number(amount).toLocaleString()
}

//  格式化餐點日期
const formatMealDate = (dateString) => {
    if (!dateString) return '日期未設定'
    
    try {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        // 取得星期幾
        const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
        const weekday = weekdays[date.getDay()]
        
        return `${year}/${month}/${day} (${weekday})`
    } catch (error) {
        console.error('日期格式化錯誤:', error)
        return dateString
    }
}

//  打開訂單明細彈窗
const openModal = (order) => {
    selectedOrder.value = order
    isModalOpen.value = true
    
    console.log('🔍 查看訂單明細:', {
        訂單編號: order.ORDER_NUMBER,
        訂單項目數: order.ORDER_ITEMS?.length || 0,
        餐盒明細: order.ORDER_ITEMS
    })
}

//  關閉彈窗
const closeModal = () => {
    isModalOpen.value = false
    selectedOrder.value = null
}

//  點擊背景關閉彈窗
const closeModalOnOverlay = (event) => {
    if (event.target === event.currentTarget) {
        closeModal()
    }
}

</script>

<style scoped>

/*  無訂單狀態樣式 */
.no-orders {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    text-align: center;
}

.no-orders-content {
    color: #666;
}

.no-orders-content i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ccc;
}

.no-orders-content h3 {
    margin: 0 0 0.5rem 0;
    color: #999;
}

.no-orders-content p {
    margin: 0;
    color: #bbb;
}

/* 手風琴摺頁內容 */
.tab {
  position: relative;
}
.tab input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
.tab__content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.35s;
}
.tab input:checked ~ .tab__content {
  max-height: 18rem;
}

/* 手風琴外觀 */
.accordion {
  color: #f6f4ef; 
  border: 2px solid;
  border-radius: 0.5rem;
  overflow: hidden;
}
.tab__label,
.tab__close {
  display: flex;
  color: #4f4f4f;
  background: #f6f4ef; 
  cursor: pointer;
}
.tab__label {
  justify-content: space-between;
  padding: 1rem;
}

.tab__label i {
  font-style: normal;
  font-size: 20px;
}

.tab__label::after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transform: rotate(90deg);
  transition: all 0.35s;
}
.tab input:checked + .tab__label::after {
  transform: rotate(270deg);
}
.tab__content p {
  margin: 0;
  padding: 0.9rem;
  color: #262626;
  line-height: 0.3;
}
.tab__close {
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}
.accordion--radio {
  color: #b0b0b0;
}

/* 下拉指示箭頭動畫 */
.tab input:not(:checked) + .tab__label:hover::after {
  animation: bounce .5s infinite;
}
@keyframes bounce {
  25% {
    transform: rotate(90deg) translate(.25rem);
  }
  75% {
    transform: rotate(90deg) translate(-.25rem);
  }
}

/* 進度條元件容器設定 */
.DeliveryStatusLine-container {
  display: flex;
  justify-content: center;
  padding: 0 12px;
  width: 100%;
  box-sizing: border-box;
}

/* 詳細訂單按鈕 */
.OrderDetails-btn {
  padding: 0 0.9rem 0.9rem 0.9rem;
}

.details-button {
  background: #f1b42e;
  color: #262626;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.details-button:hover {
  background: #cf6610;
  color: #ffffff;
}

/* 詳細訂單彈窗頁面 */
  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  }

  .modal-overlay.active {
      display: flex;
  }

  .modal-content {
      background: #ffffff;
      border-radius: 8px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #e7e7e7;
      padding-bottom: 12px;
  }

  .modal-title {
      font-size: 18px;
      font-weight: bold;
      color: #262626;
      margin: 0;
  }

  .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #4f4f4f;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .modal-close:hover {
      color: #262626;
  }

  .order-info {
      margin-bottom: 20px;
  }

  .order-info h3 {
      color: #262626;
      font-size: 16px;
      margin: 0 0 12px 0;
      border-bottom: 1px solid #e7e7e7;
      padding-bottom: 8px;
  }

  .info-row {
      display: flex;
      justify-content: start;
      margin-bottom: 8px;
      padding: 4px 0;
  }

  .info-label {
      color: #4f4f4f;
      font-weight: 500;
  }

  .info-value {
      color: #262626;
  }

  /* 每日餐盒摺頁樣式 */
  .daily-meal {
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      margin-bottom: 12px;
      overflow: hidden;
  }

  .meal-date {
      background: #f1b42e;
      color: #262626;
      padding: 8px 12px;
      font-weight: 500;
      font-size: 14px;
  }

  .meal-content {
      padding: 12px;
      background: #f6f4ef;
  }

  .meal-item {
      color: #4f4f4f;
      margin-bottom: 4px;
      font-size: 14px;
  }

  .meal-item:last-child {
      margin-bottom: 0;
  }

  /*  無餐盒項目樣式 */
  .no-meal-items {
      text-align: center;
      padding: 20px;
      color: #999;
  }

  .no-meal-items p {
      margin: 0;
      font-style: italic;
  }

  @media (max-width: 600px) {
  .tab__label i {
    font-size: 16px;
  }
  .tab input:checked ~ .tab__content {
  max-height: 20rem;
  }
  .modal-content {
  padding: 16px;
  margin: 20px;
  }
          
  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-value {
    margin-top: 4px;
  }
}

@media (max-width: 460px) {
  .tab__content p {
    line-height: 1.2;
  }
  .tab input:checked ~ .tab__content {
  max-height: 24rem;
  }
  .DeliveryStatusLine-container {
    padding: 0 12px;
  }

}

</style>