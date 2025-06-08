<template>
    <section class="accordion accordion--radio">
    <div class="tab">
        <input type="checkbox" name="accordion-2" id="rd1">
        <label for="rd1" class="tab__label"><i class="bi bi-envelope"> 訂單編號：020</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <p>本日餐盒：ＸＸＸＸ餐</p>
          <p>今日配送進度：已出貨</p>
          <div class="DeliveryStatusLine-container">
            <DeliveryStatusLine :status="3" />
          </div>
          <p>配送時間：2025/05/04～2025/05/05</p>
          <div class="OrderDetails-btn">
            <button class="details-button" @click="openModal">查看訂單明細</button>
          </div>
        </div>
    </div>
    <div class="tab">
        <input type="checkbox" name="accordion-2" id="rd2">
        <label for="rd2" class="tab__label"><i class="bi bi-envelope"> 訂單編號：019</i></label>
        <div class="tab__content">
          <p>訂單金額：XXX</p>
          <p>收件地址：臺北市中山區南京東路三段219號4樓</p>
          <p>本日餐盒：ＸＸＸＸ餐</p>
          <p>配送進度：已出貨</p>
          <div class="DeliveryStatusLine-container">
            <DeliveryStatusLine :status="4" />
          </div>
          <p>配送時間：2025/05/04～2025/05/05</p>
          <div class="OrderDetails-btn">
            <button class="details-button" @click="openModal">查看訂單明細</button>
          </div>
        </div>
    </div>
    </section>


    <!-- 彈出視窗 -->
    <div class="modal-overlay" :class="{ active: isModalOpen }" @click="closeModalOnOverlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">訂單明細 - {{ orderData.orderNumber }}</h2>
                <button class="modal-close" @click="closeModal">&times;</button>
            </div>
            
            <div class="order-info">
                <h3>訂單資訊</h3>
                <div class="info-row">
                    <span class="info-label">訂單編號：</span>
                    <span class="info-value">{{ orderData.orderNumber }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">訂單金額：</span>
                    <span class="info-value">${{ orderData.orderAmount }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">訂單項目：</span>
                    <span class="info-value">{{ orderData.orderItems }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">配送時間：</span>
                    <span class="info-value">{{ orderData.deliveryTime }}</span>
                </div>
            </div>

            <div class="order-info">
                <h3>收件資訊</h3>
                <div class="info-row">
                    <span class="info-label">收貨人：</span>
                    <span class="info-value">{{ orderData.recipient }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">手機：</span>
                    <span class="info-value">{{ orderData.phone }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">地址：</span>
                    <span class="info-value">{{ orderData.address }}</span>
                </div>
            </div>

            <div class="order-info">
                <h3>每日餐盒</h3>
                <div class="daily-meal" v-for="meal in orderData.dailyMeals" :key="meal.date">
                    <div class="meal-date">{{ meal.date }}</div>
                    <div class="meal-content">
                        <div class="meal-item" v-for="item in meal.items" :key="item">{{ item }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import DeliveryStatusLine from '../components/DeliveryStatusLine.vue';

import { ref, reactive } from 'vue'

// 響應式數據
const isModalOpen = ref(false)

const orderData = reactive({
    orderNumber: '020',
    orderAmount: '1,580',
    orderItems: '健康餐盒組合',
    deliveryTime: '2025/05/10~2025/05/12',
    recipient: '林榮傑',
    phone: '0912-345-678',
    address: '臺北市中山區南京東路三段219號4樓',
    dailyMeals: [
        {
            date: '2025/05/10 (週一)',
            items: [
                '主餐：XXXX',
                '配菜：AAAA、BBBB、CCCC',
            ]
        },
        {
            date: '2025/05/11 (週二)',
            items: [
                '主餐：XXXX',
                '配菜：AAAA、BBBB、CCCC',
            ]
        },
        {
            date: '2025/05/12 (週三)',
            items: [
                '主餐：XXXX',
                '配菜：AAAA、BBBB、CCCC',
            ]
        }
    ]
})

// 方法
const openModal = () => {
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}

const closeModalOnOverlay = (event) => {
    if (event.target === event.currentTarget) {
        closeModal()
    }
}

</script>

<style scoped>

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
      justify-content: space-between;
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