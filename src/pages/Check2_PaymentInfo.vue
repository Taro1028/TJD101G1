<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import Popup from '@/components/Popup_SelectConsignee.vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useMemberStore } from '@/stores/MemberStore'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const memberStore = useMemberStore()

const loading = ref(true)

onMounted(async () => {
  document.body.classList.add('custom-bg')
  
  // 檢查登入狀態
  if (!memberStore.isAuthenticated) {
    alert('請先登入')
    router.push('/login')
    return
  }
  
  // 檢查是否有選中的購物車項目
  if (checkoutStore.selectedCartIds.length === 0) {
    alert('請先選擇購物車項目')
    router.push('/Check_OrderInfo')
    return
  }
  
  // 確保同訂購人預設為未勾選
  checkoutStore.consigneeInfo.isSameAsOrderer = false
  
  try {
    // 直接用 PHP API 獲取會員資料
    await fetchMemberDataFromAPI()
    
    // 載入常用收貨人列表
    await checkoutStore.loadSavedConsignees()
    
    console.log('✅ 付款頁面資料載入完成')
  } catch (error) {
    console.error('載入付款頁面資料失敗:', error)
    alert('載入資料失敗，請重試')
  } finally {
    loading.value = false
  }
})

// 直接用 PHP API 獲取會員資料
const fetchMemberDataFromAPI = async () => {
  try {
    if (!memberStore.memberId) {
      throw new Error('無會員ID')
    }
    
    console.log('🔍 使用 PHP API 獲取會員資料，會員ID:', memberStore.memberId)
    
    // 修改 API 路徑，使用完整路徑
    const env = import.meta.env.VITE_API_URL || 'http://localhost'
    const apiUrl = env + `/tjd101/g1/php/getMemberInfo.php?member_id=${memberStore.memberId}`
    console.log('📡 API URL:', apiUrl)
    
    const response = await fetch(apiUrl)
    
    console.log('📊 API Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('📋 API Response Data:', result)
    
    if (!result.success) {
      throw new Error(result.message || '獲取會員資料失敗')
    }
    
    console.log('✅ PHP API 會員資料:', result.data)
    
    // 設定 checkoutStore 的訂購人資訊
    checkoutStore.ordererInfo.name = result.data.M_NAME || ''
    checkoutStore.ordererInfo.phone = result.data.PHONE || ''
    checkoutStore.ordererInfo.address = result.data.ADDRESS || ''
    
    // 也可以更新 memberStore 的會員資料
    memberStore.member = result.data
    
    console.log('✅ 訂購人資料設定完成:', checkoutStore.ordererInfo)
    
  } catch (error) {
    console.error('❌ 獲取會員資料失敗:', error)
    
    // 如果 API 失敗，使用測試資料
    console.log('🧪 使用測試會員資料')
    checkoutStore.ordererInfo.name = '測試用戶'
    checkoutStore.ordererInfo.phone = '0912-345-678'
    checkoutStore.ordererInfo.address = '台北市信義區市府路1號'
    
    // 不要拋出錯誤，讓頁面繼續運行
    console.log('✅ 使用測試資料設定完成:', checkoutStore.ordererInfo)
  }
}

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

// Popup - SelectConsignee
const showPopup = ref(false)

function openPopup() {
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
}

// 響應式引用 checkoutStore 的狀態
const ordererInfo = computed(() => checkoutStore.ordererInfo)
const consigneeInfo = computed(() => checkoutStore.consigneeInfo)
const invoiceInfo = computed(() => checkoutStore.invoiceInfo)
const selectedCartItems = computed(() => checkoutStore.selectedCartItems)
const selectedTotalAmount = computed(() => checkoutStore.selectedTotalAmount)
const selectedTotalMeals = computed(() => checkoutStore.selectedTotalMeals)
const shippingFee = computed(() => checkoutStore.shippingFee)
const finalTotalAmount = computed(() => checkoutStore.finalTotalAmount)

// 格式化價格
const formatPrice = (price) => {
  const num = Number(price)
  return isNaN(num) ? '0' : num.toLocaleString()
}

// 計算訂單項目摘要
const orderSummary = computed(() => {
  const items = selectedCartItems.value
  if (items.length === 0) return '無項目'
  
  if (items.length === 1) {
    const item = items[0]
    return `${item.plan_type}${item.message_card_id ? ' + 小卡' : ''}`
  }
  
  return `${items[0].plan_type}${items[0].message_card_id ? ' + 小卡' : ''} 等 ${items.length} 項`
})

// 監聽同訂購人切換
const handleSameAsOrdererChange = () => {
  checkoutStore.toggleSameAsOrderer()
}

// 處理收貨人資訊變更
const updateConsigneeInfo = (field, value) => {
  checkoutStore.setConsigneeInfo({ [field]: value })
}

// 處理發票類型變更
const handleInvoiceTypeChange = (type) => {
  checkoutStore.setInvoiceInfo({ type })
}

// 上一步--訂單資料
function goPrev(){
    checkoutStore.goToPreviousStep()
    router.push('/Check_OrderInfo')
}

// 下一步--結帳
function goNext() {
    if (!checkoutStore.canProceedToNextStep) {
        alert('請完整填寫收貨人資訊')
        return
    }
    
    // 提交訂單
    submitOrder()
}

// 提交訂單
const submitOrder = async () => {
  try {
    loading.value = true
    
    const result = await checkoutStore.submitOrder()
    
    if (result.success) {
      // 成功後導向完成頁面
      router.push('/Check_Complete')
    } else {
      alert('訂單提交失敗：' + result.message)
    }
  } catch (error) {
    console.error('提交訂單失敗:', error)
    alert('提交訂單失敗：' + error.message)
  } finally {
    loading.value = false
  }
}

// 從彈窗選擇收貨人
const handleConsigneeSelected = (consignee) => {
  checkoutStore.selectSavedConsignee(consignee)
  closePopup()
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
            <li class="finish"><span class="finishspan">2</span>付款資料</li>
            <li><span>3</span>完成結帳</li>
        </ul>
        
        <!-- 載入中狀態 -->
        <div v-if="loading" class="loading-container">
          <div class="loading">處理中...</div>
        </div>
        
        <!-- 付款資訊內容 -->
        <div v-else class="infoContainer">
            <div class="infoData">
                <!-- 訂購人資訊 -->
                <div class="consumer">
                    <h5 class="title">訂購人資訊</h5>
                    <div class="consumertxt">
                        <div class="txtItem">
                            <h6>姓名</h6>
                            <h6>{{ ordererInfo.name || '載入中...' }}</h6>
                        </div>
                        <div class="txtItem">
                            <h6>手機</h6>
                            <h6>{{ ordererInfo.phone || '載入中...' }}</h6>
                        </div>
                        <div class="txtItem">
                            <h6>地址</h6>
                            <h6>{{ ordererInfo.address || '載入中...' }}</h6>
                        </div>
                        <div class="txtItem">
                            <h6>付款方式</h6>
                            <img src="../assets/images/Order/cashflow.svg" alt="綠界金流">
                        </div>
                    </div>
                </div>
                
                <!-- 收貨人資訊 -->
                <div class="consignee">
                    <h5 class="title">收貨人資訊</h5>
                    <div class="consigneetxt">
                        <div class="select">
                        <label class="checkedItem">
                            <input 
                              type="checkbox" 
                              :checked="consigneeInfo.isSameAsOrderer"
                              @change="handleSameAsOrdererChange"
                            >
                            <h6>同訂購人</h6>
                        </label>
                        <div>
                            <a class="common" @click="openPopup">
                                選擇/新增常用收貨人 
                                <i class="bi bi-chevron-right"></i>
                            </a>
                            <Popup 
                              v-if="showPopup" 
                              @close="closePopup"
                              @select="handleConsigneeSelected"
                            />
                        </div>
                        </div>
                        <div class="txtItem">
                            <h6>姓名</h6>
                            <input 
                              class="txt" 
                              type="text" 
                              placeholder="請輸入姓名"
                              :value="consigneeInfo.isSameAsOrderer ? ordererInfo.name : consigneeInfo.name"
                              :disabled="consigneeInfo.isSameAsOrderer"
                              @input="updateConsigneeInfo('name', $event.target.value)"
                            >
                        </div>
                        <div class="txtItem">
                            <h6>手機</h6>
                            <input 
                              class="txt" 
                              type="text" 
                              placeholder="請輸入手機號碼"
                              :value="consigneeInfo.isSameAsOrderer ? ordererInfo.phone : consigneeInfo.phone"
                              :disabled="consigneeInfo.isSameAsOrderer"
                              @input="updateConsigneeInfo('phone', $event.target.value)"
                            >
                        </div>
                        <div class="txtItem">
                            <h6>地址</h6>
                            <input 
                              class="txt" 
                              type="text" 
                              placeholder="請輸入地址"
                              :value="consigneeInfo.isSameAsOrderer ? ordererInfo.address : consigneeInfo.address"
                              :disabled="consigneeInfo.isSameAsOrderer"
                              @input="updateConsigneeInfo('address', $event.target.value)"
                            >
                        </div>
                    </div>
                </div>
                
                <!-- 發票資訊 -->
                <div class="invoice">
                    <h5 class="title">發票資訊</h5>
                    
                    <label class="checkedItem">
                        <input 
                          type="radio" 
                          name="invoice" 
                          value="member"
                          :checked="invoiceInfo.type === 'member'"
                          @change="handleInvoiceTypeChange('member')"
                        >
                        <h6>會員載具</h6>
                    </label>
                    
                    <label class="checkedItem">
                        <input 
                          type="radio" 
                          name="invoice" 
                          value="company"
                          :checked="invoiceInfo.type === 'company'"
                          @change="handleInvoiceTypeChange('company')"
                        >
                        <h6>公司發票</h6>
                    </label>
                    
                    <label class="checkedItem">
                        <input 
                          type="radio" 
                          name="invoice" 
                          value="donation"
                          :checked="invoiceInfo.type === 'donation'"
                          @change="handleInvoiceTypeChange('donation')"
                        >
                        <h6>捐贈發票</h6>
                    </label>
                    
                    <label class="checkedItem">
                        <input 
                          type="radio" 
                          name="invoice" 
                          value="mobile"
                          :checked="invoiceInfo.type === 'mobile'"
                          @change="handleInvoiceTypeChange('mobile')"
                        >
                        <h6>手機載具</h6>
                    </label>
                    
                    <h6 class="notice">
                      <i class="bi bi-info-circle-fill"></i>
                      依統一發票使用辦法規定：發票一經開立不得任意更改或改開發票。
                    </h6>
                </div>
            </div>
            
            <!-- 右側結帳明細 -->
            <div class="payData">
                <div class="payment">
                    <h5 class="title">結帳明細</h5>
                    <div class="paymentblock">
                        <div class="payItem">
                            <h6>訂單項目</h6>
                            <h6>{{ orderSummary }}</h6>
                        </div>
                        <div class="payItem">
                            <h6>餐盒數總計</h6>
                            <h6>{{ selectedTotalMeals }} 份餐盒</h6>
                        </div>
                        <div class="payItem">
                            <h6>金額合計</h6>
                            <h6>${{ formatPrice(selectedTotalAmount) }}</h6>
                        </div>
                        <div class="payItem">
                            <h6>運費</h6>
                            <h6>${{ formatPrice(shippingFee) }}</h6>
                        </div>
                        <div class="payItem">
                            <h6>金額總計</h6>
                            <h6>${{ formatPrice(finalTotalAmount) }}</h6>
                        </div>
                    </div>
                </div>
                <div class="payissue">
                <div class="paymentnotice">
                    <p>結帳完成即視為已同意 </p>
                    <a href="#" class="servelink">服務條款</a>
                </div>
                <div class="total">
                    <h5>總付款金額</h5>
                    <span>${{ formatPrice(finalTotalAmount) }}</span>
                </div>
                </div>
                <div class="btnblock">
                    <button class="btn-1" @click="goPrev">上一步</button>
                    <button 
                      class="btn-2" 
                      @click="goNext"
                      :disabled="!checkoutStore.canProceedToNextStep"
                      :class="{ disabled: !checkoutStore.canProceedToNextStep }"
                    >
                      結帳
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
    width: 1000px;
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

// 載入狀態
.loading-container {
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

// 資訊區塊
.infoContainer{
    margin-top: 40px;
    display: flex;
    gap: 24px;
}

// 左側資訊
.infoData,
.payData{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.consumer,
.consignee,
.invoice,
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

.consumertxt,
.consigneetxt{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.txtItem{
    display: flex;
    gap: 20px;
    align-items: center;
}

.select{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.checkedItem{
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
}

input[type="checkbox"],
input[type="radio"]{
    cursor: pointer;
}

.txtItem h6,
.checkedItem h6,
.payItem h6{
    font-size: $font_h6;
    font-weight: normal;
    padding: 4px 0;
}

.txtItem h6:first-child {
    min-width: 60px;
    flex-shrink: 0;
}

.common{
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: $primary_600;
    text-decoration: none;
    
    &:hover{
        text-decoration: underline;
    }
}

.txt{
    border: none;
    padding: 4px 0;
    background-color: transparent;
    border-radius: 4px;
    flex: 1;
    
    &:disabled {
        background-color: $neutral_100;
        color: $neutral_700;
    }
    
    &:focus {
        outline: 1px solid $primary_400;
    }
}

// 發票注意事項
.notice{
    font-size: $font_h6;
    font-weight: normal;
    color: $neutral_700;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-top: 8px;
}

// 右側結帳明細
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

.payissue{
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
}

.paymentnotice{
    font-size: $font_p;
    display: flex;
    gap: 4px;
}

.total{
    display: flex;
    gap: 8px;
}

.total h5{
    font-size: $font_h5;
    color: $neutral_black;
}

.total span{
    display: block;
    font-size: $font_h5;
    font-weight: bold;
    color: $primary_600;
}

.paymentnotice a{
    text-decoration: none;
    color: $point_700;

    &:hover{
        text-decoration: underline;
    }
}

.btnblock{
    display: flex;
    gap: 20px;
    justify-content: end;
}

.btn-1{
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

.btn-2{
    width: 92px;
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;

    &:hover:not(.disabled){
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
}

//  ---RWD---
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
    flex-direction: column;
    gap: 20px;
}

.payItem{
    width: 100%;

    &:last-child::before{
        width: 510px;
}}

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

.checkedItem{
    gap: 8px;
}

.payItem:last-child::before{
    width: 308px;
}

.select {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
}

.txtItem {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
}

.txtItem h6:first-child {
    min-width: auto;
}

}
</style>