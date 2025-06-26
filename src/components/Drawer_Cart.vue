<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(true)
const isVisible = ref(false) // 新增：控制動畫顯示

// 關閉視窗 - 當作為路由使用時直接導航
const emit = defineEmits(['close'])

function closePopup() {
  // 先執行滑出動畫
  isVisible.value = false
  
  // 等待動畫完成後再關閉
  setTimeout(() => {
    // 如果是作為路由組件使用，直接導航回上一頁
    if (router.currentRoute.value.path === '/Cart') {
      router.go(-1) // 或者 router.push('/') 導回首頁
    } else {
      // 如果是作為彈窗組件使用，發送關閉事件
      emit('close')
    }
  }, 300) // 等待動畫時間
}

// 使用 cartStore 的 cartGroups getter，保持一致性
const cartGroups = computed(() => cartStore.cartGroups)

// 計算總金額 - 修正版本
const totalAmount = computed(() => {
  return cartGroups.value.reduce((sum, group) => {
    // 確保 total_amount 是數字
    const amount = parseFloat(group.total_amount) || 0
    return sum + amount
  }, 0)
})

// 安全的數字格式化函數
const formatPrice = (price) => {
  const num = parseFloat(price)
  
  if (isNaN(num) || !isFinite(num)) {
    // console.warn('Invalid price value:', price)
    return '0'
  }
  
  if (num > 999999999) {
    // console.warn('Price value too large:', num)
    return '999,999,999+'
  }
  
  return Math.round(num).toLocaleString()
}

// 格式化日期範圍顯示
const formatDateRange = (startDate, endDate, totalDays) => {
  if (!startDate) return ''
  
  // 如果只有1日，只顯示開始日期
  if (totalDays === 1) {
    const startDateObj = new Date(startDate)
    const year = startDateObj.getFullYear()
    const month = String(startDateObj.getMonth() + 1).padStart(2, '0')
    const day = String(startDateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day} (共 1 日)`
  }
  
  // 多日顯示範圍
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)
  
  const startYear = startDateObj.getFullYear()
  const startMonth = String(startDateObj.getMonth() + 1).padStart(2, '0')
  const startDay = String(startDateObj.getDate()).padStart(2, '0')
  
  const endYear = endDateObj.getFullYear()
  const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0')
  const endDay = String(endDateObj.getDate()).padStart(2, '0')
  
  const startFormatted = `${startYear}-${startMonth}-${startDay}`
  
  // 如果是同一年，結束日期不顯示年份
  const endFormatted = (startYear === endYear) 
    ? `${endMonth}-${endDay}` 
    : `${endYear}-${endMonth}-${endDay}`
  
  return `${startFormatted} — ${endFormatted} (共 ${totalDays} 日)`
}

// 刪除購物車群組
async function removeCartGroup(cartId, planType) {
  if (!confirm(`確定要刪除「${planType}」訂單嗎？`)) {
    return
  }
  
  try {
    await cartStore.removeCartItem(cartId)
  } catch (error) {
    alert('刪除失敗：' + error.message)
  }
}

function goNext() {
  // 先關閉彈窗再導向結帳頁面
  closePopup()
  setTimeout(() => {
    router.push('/Check_OrderInfo')
  }, 300)
}

// 載入購物車資料
onMounted(async () => {
  try {
    loading.value = true
    
    // 更好的防止背景滾動方式 - 保留捲軸佔位
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarWidth}px`
    
    // 檢查 cartStore 是否正確載入
    // console.log('cartStore:', cartStore)
    // console.log('fetchCartItemsFromBackend 函數:', cartStore.fetchCartItemsFromBackend)
    
    // 獲取購物車資料
    if (typeof cartStore.fetchCartItemsFromBackend === 'function') {
      await cartStore.fetchCartItemsFromBackend()
      
      // 調試輸出
      // console.log('=== Drawer_Cart 調試資訊 ===')
      // console.log('cartStore.items:', cartStore.items)
      // console.log('cartGroups:', cartGroups.value)
      // console.log('totalAmount:', totalAmount.value)
      // console.log('========================')
    } else {
      console.error('fetchCartItemsFromBackend 不是一個函數')
    }
  } catch (error) {
    console.error('載入購物車失敗:', error)
  } finally {
    loading.value = false
    // 組件載入完成後顯示滑入動畫
    setTimeout(() => {
      isVisible.value = true
    }, 50)
  }
})

onUnmounted(() => {
  // 恢復原始狀態
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
</script>

<template>
<div class="overlay" :class="{ 'overlay-visible': isVisible }" @click="closePopup">
    <div class="shopCart" :class="{ 'cart-visible': isVisible }" @click.stop>
        <button class="closebtn" @click="closePopup">
          <i class="bi bi-x-circle"></i>
        </button>
        
        <div class="orderitem">
            <div class="title">
              <h3>購物車</h3>
            </div>
            
            <!-- 載入中狀態 -->
            <div v-if="loading" class="loading">
              載入中...
            </div>
            
            <!-- 空購物車狀態 -->
            <div v-else-if="cartGroups.length === 0" class="empty-cart">
                <div class="empty-icon">
                    <i class="bi bi-cart-x"></i>
                </div>
              <h5>購物車是空的</h5>
              <span>快去選擇您喜歡的餐點吧！</span>
            </div>
            
            <!-- 購物車項目列表 -->
            <div v-else class="itemlist">
                <div 
                  v-for="group in cartGroups" 
                  :key="group.cart_id"
                  class="item"
                >
                    <div class="iteminfo">
                        <div class="infotitle">
                          <h4>{{ group.display_title }}</h4>
                        </div>
                        <div class="period">
                          {{ formatDateRange(group.order_start_date, group.order_end_date, group.total_days) }}
                        </div>
                        <div class="count">{{ group.total_meal_count || 0 }} 份餐盒</div>
                    </div>
                    <div class="price">${{ formatPrice(group.total_amount) }}</div>
                    <button 
                      class="btn-delete" 
                      @click="removeCartGroup(group.cart_id, group.plan_type)"
                      title="刪除此訂單"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="gopay">
            <div class="subtotal">
                <span>小計</span>
                <span>${{ formatPrice(totalAmount) }}</span>
            </div>
            <button 
              class="btn-2" 
              @click="goNext"
              :disabled="cartGroups.length === 0 || loading"
            >
              前往結帳
            </button>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0);
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    z-index: 1001;
    
    // 背景淡入動畫
    transition: background-color 0.3s ease;
    
    &.overlay-visible {
        background-color: rgba(0, 0, 0, 0.4);
    }
}

.shopCart{
    width: 30%;
    height: 100%;
    padding: 24px 48px;
    background-color: $neutral_white;
    display: flex;
    flex-direction: column;
    gap: 64px;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    
    // 初始狀態：隱藏在右側
    transform: translateX(100%);
    opacity: 0;
    
    // 滑動動畫
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                opacity 0.3s ease;
    
    &.cart-visible {
        transform: translateX(0);
        opacity: 1;
    }
}

.closebtn{
    position: absolute;
    right: 24px;
    top: 20px;
    background-color: transparent;
    border: none;
    width: 32px;
    height: 32px;
    padding: 0;

    &:hover{
        cursor: pointer;
    }
}

.closebtn i{
    font-size: 24px;
}

.orderitem,
.gopay{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.title{
    width: 100%;
    border-bottom: 1px solid $neutral_black;
}

h3{
    font-size: $font_h3;
    padding-bottom: 8px;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #666;
  font-size: 14px;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
  color: $neutral_700;
  
  h5 {
    margin-bottom: 8px;
    font-size: $font_h4;
  }
  
  span {
    font-size: $font_h6;
    opacity: 0.7;
  }
}

.empty-icon {
    font-size: $font_h1;
    color: $neutral_300;
    margin-bottom: 24px;
  }

.itemlist{
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-height: 400px;
    overflow-y: auto;
}

.item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
}

.iteminfo{
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    margin-right: 16px;
}

.infotitle h4{
    font-size: $font_h4;
    margin: 0;
}

.period, .count {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.price {
  font-weight: 600;
  margin-right: 12px;
  white-space: nowrap;
}

.btn-delete{
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    
    &:hover i {
      opacity: 0.7;
      color: #ff4444;
    }
}

.btn-delete i{
    font-size: $font_h4;
    opacity: .5;
    transition: all 0.2s ease;
}

.gopay{
    border-top: 1px solid #000;
    padding-top: 12px;
}

.subtotal{
    display: flex;
    justify-content: space-between;
}

.subtotal span{
    font-size: $font_h5;
    font-weight: bold;
}

.btn-2{
    margin-top: 12px;
    width: 117px;
    align-self: end;
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;

    &:hover:not(:disabled){
      background-color: transparent;
      color: $neutral_black;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
}

@media screen and (max-width: 1200px){
.shopCart{
    width: 50%;
}
}

@media screen and (max-width: 800px){
.shopCart{
    width: 60%;
}
}

@media screen and (max-width: 600px){
.shopCart{
    width: 340px;
    padding: 20px;
    overflow-y: auto;
}

h3{
    font-size: $font_h4;
}

.infotitle h4{
    font-size: $font_h5;
}

.itemlist{
    max-height: 300px;
}

}
</style>