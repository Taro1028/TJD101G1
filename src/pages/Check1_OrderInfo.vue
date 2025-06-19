<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useMemberStore } from '@/stores/MemberStore'
import { useCheckoutStore } from '@/stores/checkoutStore'

const router = useRouter()
const cartStore = useCartStore()
const memberStore = useMemberStore()
const checkoutStore = useCheckoutStore()

const loading = ref(true)

// 使用 checkoutStore 的選中狀態
const selectedItems = computed(() => new Set(checkoutStore.selectedCartIds))
const showAllDetails = ref(new Set()) // 展開詳情的購物車項目

onMounted(async () => {
  document.body.classList.add('custom-bg')
  
  // 檢查登入狀態
  if (!memberStore.isAuthenticated) {
    alert('請先登入')
    router.push('/login')
    return
  }
  
  try {
    // 載入購物車資料
    await cartStore.fetchCartItemsFromBackend()
    
    // console.log('✅ 購物車資料載入完成')
    // console.log('購物車群組數量:', cartGroups.value.length)
    
    // 初始化 checkoutStore - 預設全選
    if (cartGroups.value.length > 0) {
      const allCartIds = cartGroups.value.map(group => group.cart_id)
      checkoutStore.setSelectedCartIds(allCartIds)
    }
  } catch (error) {
    // console.error('載入購物車資料失敗:', error)
    alert('載入購物車資料失敗，請重試')
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

// 購物車群組資料
const cartGroups = computed(() => cartStore.cartGroups)

// 全選狀態
const isAllSelected = computed(() => {
  return cartGroups.value.length > 0 && 
         cartGroups.value.every(group => selectedItems.value.has(group.cart_id))
})

// 計算選中項目的總數量和金額 - 使用 checkoutStore
const selectedSummary = computed(() => {
  return {
    count: checkoutStore.selectedTotalMeals,
    amount: checkoutStore.selectedTotalAmount,
    groupCount: checkoutStore.selectedCartIds.length
  }
})

// 格式化日期範圍
const formatDateRange = (startDate, endDate, totalDays) => {
  if (!startDate) return ''
  
  if (totalDays === 1) {
    const date = new Date(startDate)
    return `${formatDate(date)} (共 1 日)`
  }
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return `${formatDate(start)} — ${formatDate(end)} (共 ${totalDays} 日)`
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化單日顯示（用於詳情中）
const formatSingleDate = (dateStr) => {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[date.getDay()]
  
  return `${month}.${day} (${weekday})`
}

// 格式化餐點項目顯示
const formatMealItems = (mealItems) => {
  // 如果已經是陣列，直接使用
  if (Array.isArray(mealItems)) {
    return mealItems
      .filter(item => item.quantity > 0)
      .map(item => `${item.name} * ${item.quantity}`)
      .join(' / ')
  }
  
  // 如果是字串，嘗試解析
  if (typeof mealItems === 'string') {
    try {
      const parsed = JSON.parse(mealItems)
      if (Array.isArray(parsed)) {
        return parsed
          .filter(item => item.quantity > 0)
          .map(item => `${item.name} * ${item.quantity}`)
          .join(' / ')
      }
    } catch {
      return '餐點資訊錯誤'
    }
  }
  
  return '無餐點資訊'
}

// 安全的數字格式化
const formatPrice = (price) => {
  const num = Number(price)
  return isNaN(num) ? '0' : num.toLocaleString()
}

// 全選/取消全選
const toggleSelectAll = () => {
  checkoutStore.toggleSelectAll()
}

// 單項選擇
const toggleSelectItem = (cartId) => {
  checkoutStore.toggleCartSelection(cartId)
}

// 展開/收起詳情
const toggleDetails = (cartId) => {
  if (showAllDetails.value.has(cartId)) {
    showAllDetails.value.delete(cartId)
  } else {
    showAllDetails.value.add(cartId)
  }
}

// 刪除購物車項目
const removeCartItem = async (cartId, planType) => {
  if (!confirm(`確定要刪除「${planType}」訂單嗎？`)) {
    return
  }
  
  try {
    await cartStore.removeCartItem(cartId)
    // checkoutStore 會自動更新，因為是基於 cartStore 計算的
    showAllDetails.value.delete(cartId)
  } catch (error) {
    alert('刪除失敗：' + error.message)
  }
}

// 返回編輯（導向點餐頁面）
const goBackToOrder = () => {
  router.push('/Order/Select')
}

// 檢查是否可以繼續
const canProceed = computed(() => {
  return checkoutStore.canProceedToNextStep
})

// 下一步--進行付款
const goNext = () => {
  if (!canProceed.value) {
    alert('請至少選擇一個訂單項目')
    return
  }
  
  // 使用 checkoutStore 進入下一步
  checkoutStore.goToNextStep()
  router.push('/Check_PaymentInfo')
}
</script>

<template>
<FrontLayout>
    <div class="wrapper">
        <div class="shop">
            <img src="../assets/images/Order/cart_bag.svg" alt="">
            <h2>Tiba<span class="eat">EAT</span> | 購物車</h2>
        </div>
        <ul class="step">
            <li class="finish"><span class="finishspan">1</span>訂單資料</li>
            <li><span>2</span>付款資料</li>
            <li><span>3</span>完成結帳</li>
        </ul>
        
        <!-- 載入中狀態 -->
        <div v-if="loading" class="loading-container">
          <div class="loading">載入中...</div>
        </div>
        
        <!-- 空購物車狀態 -->
        <div v-else-if="cartGroups.length === 0" class="empty-container">
          <div class="empty-cart">
            <i class="bi bi-cart-x"></i>
            <h4>購物車是空的</h4>
            <p>請先選擇餐點加入購物車</p>
            <button class="btn-2" @click="goBackToOrder">前往點餐</button>
          </div>
        </div>
        
        <!-- 購物車內容 -->
        <div v-else class="infoContainer">
          <!-- 左側訂單資訊 -->
            <div class="orderData">
              <!-- 全選控制項目 -->
              <label class="checkedItemTitle">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                >
                <h5 class="title">預約項目 ({{ selectedSummary.groupCount }})</h5>
              </label>
              
              <!-- 訂單列表 -->
              <div class="orderlist">
                <!-- 訂單項目 -->
                <div 
                  v-for="group in cartGroups" 
                  :key="group.cart_id"
                  class="orderItem"
                >
                  <!-- 項目區塊(項目:包含標題資料 + 垃圾桶) -->
                  <div class="item">
                    <!-- 項目資料(標題、期間 & 展開按鈕) -->
                    <div class="itemMeta">
                      <label class="checkedItem">
                        <input 
                          type="checkbox" 
                          :checked="selectedItems.has(group.cart_id)"
                          @change="toggleSelectItem(group.cart_id)"
                        >
                        <h5 class="Itemtitle">
                          {{ group.display_title }}
                        </h5>
                      </label>
                      <div class="period_toggle">
                        <h5>{{ formatDateRange(group.order_start_date, group.order_end_date, group.total_days) }}</h5>
                        <button 
                          class="btn_accordion" 
                          @click="toggleDetails(group.cart_id)"
                        >
                          <i :class="showAllDetails.has(group.cart_id) ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                        </button>
                      </div>
                    </div>
                    <button 
                      class="btn_delete" 
                      @click="removeCartItem(group.cart_id, group.plan_type)"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                  
                  <!-- 項目資料的細項內容 -->
                  <div v-if="showAllDetails.has(group.cart_id)" class="content_container">
                    <!-- 項目資料的資料 -->
                    <div class="itemMetadata">
                      <!-- 標頭 -->
                      <div class="titleItem">
                        <h5 class="maintitle">預定日期與餐點項目</h5>
                        <h5 class="counttitle">餐盒數量</h5>
                        <h5>小計</h5>
                      </div>
                      <!-- 標身 - 每日餐點詳情 -->
                      <div 
                        v-for="item in group.items" 
                        :key="`${group.cart_id}-${item.date}`"
                        class="detailItem"
                      >
                        <div class="day_box">
                          <h6 class="day">{{ formatSingleDate(item.date) }}</h6>
                          <h6 class="box">{{ formatMealItems(item.meal_items) }}</h6>
                        </div>
                        <h6 class="count">{{ item.quantity || 0 }} 份餐盒</h6>
                        <h6 class="price">${{ formatPrice(item.dailyTotalAmount) }}</h6>
                      </div>
                    </div>
                    <button class="edit_btn" @click="goBackToOrder">回點餐編輯頁</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右側結帳資訊 -->
            <div class="payData">
                <div class="payment">
                    <h5 class="title">結帳項目</h5>
                    <div class="paymentblock">
                        <div class="payItem">
                            <h6>餐盒數總計</h6>
                            <h6>{{ selectedSummary.count }} 份餐盒</h6>
                        </div>
                        <div class="payItem">
                            <h6>金額合計</h6>
                            <h6>${{ formatPrice(selectedSummary.amount) }}</h6>
                        </div>
                        <div class="payItem">
                            <h6>餐盒金額總計</h6>
                            <h6>${{ formatPrice(selectedSummary.amount) }}</h6>
                        </div>
                    </div>
                </div>
                <div class="btnblock">
                    <button 
                      class="btn-2" 
                      @click="goNext"
                      :disabled="!canProceed"
                      :class="{ disabled: !canProceed }"
                    >
                      下一步
                    </button>
                </div>
            </div>
        </div>
    </div>
</FrontLayout>
</template>

<style>
.custom-bg{
background-image: url(../assets/images/Order/background.svg);
}
</style>

<style scoped lang="scss">
.wrapper{
    width: 1200px;
    margin: 40px auto 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.shop{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: $neutral_black;
}

.shop img{
    width: 48px;
}

.shop h2{
    font-size: $font_h2;
    font-weight: bold;
}

.eat{
  color: $primary_600;
}

.step {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 64px;
}

.step li {
    font-size: $font_h3;
    align-items: center;
    display: flex;
    color: $neutral_300;
}

.step .finish {
    color: $neutral_black;
}

.step span {
    display: block;
    font-size: $font_h5;
    margin-right: 8px;
    line-height: 2.25rem;
    width: 40px;
    height: 40px;
    background-color: $neutral_300;
    border-radius: 50%;
    text-align: center;
    color: $neutral_white;
}

.step .finishspan {
    background-color: $success_400;
}

// 載入和空狀態
.loading-container,
.empty-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading {
  font-size: 18px;
  color: #666;
}

.empty-cart {
  text-align: center;
  color: #666;
  
  i {
    font-size: 64px;
    margin-bottom: 16px;
    color: #ccc;
  }
  
  h4 {
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 24px;
  }
}

// 資訊區塊
.infoContainer{
    margin-top: 40px;
    display: flex;
    gap: 24px;
}

// 左側訂單資訊
.orderData{
    height:fit-content;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background-color: $neutral_white;
    border: 1px solid $neutral_100;
    border-radius: 8px;
    padding: 16px;
}

// 全選控制項目
.checkedItemTitle{
  display: flex;
  padding: 16px 8px;
  gap: 16px;
  border-bottom: 1px solid $neutral_700;
  cursor: pointer;
}

label,
input[type="checkbox"]{
    cursor: pointer;
}

// 訂單列表
.orderlist{
  display: flex;
  flex-direction: column;
}

// 訂單項目
.orderItem{
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 項目區塊(項目:包含標題資料 + 垃圾桶)
.item{
  padding: 16px 8px;
  display: flex;
  justify-content: space-between;
  gap: 60px;
}

// 項目資料(標題、期間 & 展開按鈕)
.itemMeta{
  display: flex;
  gap: 16px;
}

.checkedItem{
    display: flex;
    gap: 16px;
    align-items: center;
    cursor: pointer;
}

.checkedItem h5{
    font-size: $font_h5;
}

.Itemtitle{
  width: 143px;
}

.period_toggle{
  width: 395px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.period_toggle h5{
    font-size: $font_h5;
}

button{
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.btn_delete{
  opacity: .5;
  
  &:hover {
    opacity: 0.8;
    color: #ff4444;
  }
}

// 項目資料的細項
.content_container{
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-top: .5px solid $neutral_300;
}

// 項目資料的資料
.itemMetadata{
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.titleItem,
.detailItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.titleItem h5{
    font-size: $font_h5;
}

.titleItem h5:nth-child(3){
  width: 55px;
  text-align: right;
}

.price{
  width: 55px;
  text-align: right;
}

.maintitle,
.day_box{
  width: 480px;
}

.counttitle{
  width: 80px;
  text-align: left;
}

.detailItem h6{
    font-size: $font_h6;
}

.day{
  margin-bottom: 8px;
}

.day_box .box{
  font-weight: normal;
  color:  $neutral_700;
}

.edit_btn{
  align-self: end;
  background-color: $neutral_300;
  color: $neutral_700;
  padding: 12px 20px;
  border-radius: 24px;
  border: 2px solid $neutral_300;
  transition: 0.3s ease;

  &:hover{
  background-color: transparent;
  color: $neutral_black;
  }
}

// 結帳項目
.payment{
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: $neutral_white;
    border: 1px solid $neutral_100;
    padding: 16px;
    border-radius: 8px;
}

.title{
    font-size: $font_h5;
}

.checkedItem h6,
.payItem h6{
    font-size: $font_h6;
    font-weight: normal;
    padding: 4px 0;
}

// 右側結帳項目--子項目
.paymentblock{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.payItem{
    width: 300px;
    display: flex;
    justify-content: space-between;

    &:last-child::before{
        content: '';
        position: absolute;
        width: 300px;
        height: 1px;
        background-color: $neutral_black;
}}

.payItem:last-child h6{
    padding-top: 12px;
    font-weight: bold;
}

.btnblock{
    margin-top: 20px;
    display: flex;
    gap: 20px;
    justify-content: end;
}

.btn-2{
    width: fit-content;
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;

    &:hover:not(.disabled){
    background-color: transparent;
    color: $neutral_black;
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
}

// ---RWD---
@media screen and (max-width: 1200px){
  .wrapper{
    width: 900px;
}

.infoContainer{
  flex-direction: column;
}

.payItem{
  width: 100%;

  &:last-child::before{
        content: '';
        position: absolute;
        width: 688px;
        height: 1px;
        background-color: $neutral_black;
}
}

}

@media screen and (max-width: 950px){
.wrapper{
    width: 780px;
}

.step {
    gap: 16px;
}

.step li {
    font-size: $font_h5;
}

.step span {
    font-size: $font_h6;
    margin-right: 8px;
    line-height: 16px;
    width: 20px;
    height: 20px;
}
}

@media screen and (max-width: 800px){
.wrapper{
    width: 560px;
}

.infoContainer{
    gap: 20px;
}

.payItem{
    width: 100%;

    &:last-child::before{
        width: 530px;
}}

.checkedItem .Itemtitle,
.period_toggle h5,
.titleItem h5 {
    font-size: $font_h6;
}

.period_toggle,
.maintitle,
.day_box{
  width: 240px;
}

}

@media screen and (max-width: 580px){
.wrapper{
    width: 340px;
}

.shop{
    gap: 12px;
}

.shop h2{
    font-size: $font_h3;
}

.shop img{
    width: 40px;
}

.step {
    gap: 8px;
}

.checkedItemTitle,
.checkedItem{
    gap: 8px;
}

.payItem:last-child::before{
    width: 308px;
}

.item{
  gap: 20px;
}

.titleItem,
.itemMeta,
.detailItem{
  flex-direction: column;
  align-items: start;
  gap: 4px;
}

.titleItem h5:nth-child(3){
  width: fit-content;
  text-align: left;
}

.price{
  width: fit-content;
  text-align: left;
}

}
</style>