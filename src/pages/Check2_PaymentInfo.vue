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
    
    // console.log('✅ 付款頁面資料載入完成')
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
    // 🔥 修正：多重方式取得會員ID
    let memberId = null
    
    if (memberStore.memberId) {
      memberId = memberStore.memberId
    } else if (memberStore.id) {
      memberId = memberStore.id
    } else {
      // 嘗試重新從 sessionStorage 載入
      const loaded = memberStore.loadFromsessionStorage()
      if (loaded && memberStore.id) {
        memberId = memberStore.id
      }
    }
    
    if (!memberId) {
      throw new Error('無會員ID，請重新登入')
    }
    
    // console.log('🔍 使用會員ID:', memberId)
    
    // 修改 API 路徑，使用完整路徑
    const env = import.meta.env.VITE_API_URL || 'http://localhost'
    const apiUrl = env + `/tjd101/g1/php/getMemberInfo.php?member_id=${memberId}`
    // console.log('📡 API URL:', apiUrl)
    
    const response = await fetch(apiUrl)
    
    // console.log('📊 API Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    // console.log('📋 API Response Data:', result)
    
    if (!result.success) {
      throw new Error(result.message || '獲取會員資料失敗')
    }
    
    // console.log('✅ PHP API 會員資料:', result.data)
    
    // 🔥 重要：同步更新 memberStore 的會員資料
    memberStore.updateMember({
      id: result.data.ID,
      name: result.data.M_NAME,
      phone: result.data.PHONE,
      address: result.data.ADDRESS,
      email: result.data.EMAIL
    })
    
    // 設定 checkoutStore 的訂購人資訊
    checkoutStore.ordererInfo.name = result.data.M_NAME || ''
    checkoutStore.ordererInfo.phone = result.data.PHONE || ''
    checkoutStore.ordererInfo.address = result.data.ADDRESS || ''
    
    // console.log('✅ 訂購人資料設定完成:', checkoutStore.ordererInfo)
    
  } catch (error) {
    console.error('❌ 獲取會員資料失敗:', error)
    throw error // 讓上層處理錯誤
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
// 計算總配送天數用於顯示
const totalDeliveryDays = computed(() => {
  return selectedCartItems.value.reduce((sum, group) => {
    return sum + (parseInt(group.total_days) || 0)
  }, 0)
})

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
    return `${item.display_title}`
  }
  
  return `${items[0].display_title} 等 ${items.length} 項`
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
    
    // 🔥 修改：分兩步驟處理
    submitOrder()
}

// 🔥 修改：分兩步驟提交訂單
const submitOrder = async () => {
  try {
    loading.value = true
    
    // console.log('🚀 步驟1：開始創建訂單...')
    
    // === 步驟1：調用 checkout.php 創建訂單 ===
    // 🔥 修正：獲取會員ID的方式
    let memberId = null
    
    if (memberStore.memberId) {
      memberId = memberStore.memberId
    } else if (memberStore.id) {
      memberId = memberStore.id
    } else {
      // 嘗試重新從 sessionStorage 載入
      const loaded = memberStore.loadFromsessionStorage()
      if (loaded && memberStore.id) {
        memberId = memberStore.id
      }
    }
    
    if (!memberId) {
      throw new Error('無會員ID，請重新登入')
    }
    
    // console.log('🔍 使用會員ID:', memberId)
    
    const orderData = {
      m_id: memberId,
      cart_ids: checkoutStore.selectedCartIds,
      consignee_info: checkoutStore.consigneeInfo.isSameAsOrderer 
        ? checkoutStore.ordererInfo 
        : checkoutStore.consigneeInfo,
      
      meal_amount: checkoutStore.selectedTotalAmount,     // 便當金額
      shipping_fee: checkoutStore.shippingFee,            // 運費
      total_amount: checkoutStore.finalTotalAmount        // 總金額(含運費)
    }

    console.log('💰 傳送到 checkout.php 的金額資料:', {
      便當金額: orderData.meal_amount,
      運費: orderData.shipping_fee,
      總金額: orderData.total_amount,
      計算確認: orderData.meal_amount + orderData.shipping_fee === orderData.total_amount
    })

    // console.log('📦 訂單資料:', orderData)
    const env = import.meta.env.VITE_API_URL || 'http://localhost'
    const checkoutResponse = await fetch(`${env}/tjd101/g1/php/checkout.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    if (!checkoutResponse.ok) {
      throw new Error(`訂單創建失敗: HTTP ${checkoutResponse.status}`)
    }

    const checkoutResult = await checkoutResponse.json()
    // console.log('✅ 訂單創建結果:', checkoutResult)

    if (!checkoutResult.success) {
      throw new Error(checkoutResult.message || '訂單創建失敗')
    }

    // 🔥 新增：保存完整訂單資料到 checkoutStore
    checkoutStore.orderResult = {
      success: true,
      message: checkoutResult.message,
      data: {
        order_ids: checkoutResult.data.order_ids,
        order_numbers: checkoutResult.data.order_numbers,
        orders: checkoutResult.data.orders,
        total_orders: checkoutResult.data.total_orders,
        total_amount: checkoutResult.data.total_amount,
        total_meal_count: checkoutResult.data.total_meal_count,
        final_total: checkoutResult.data.final_total,
        // shipping_fee: checkoutResult.data.shipping_fee,
        consignee_info: checkoutResult.data.consignee_info,
        order_time: checkoutResult.data.order_time
      },
      // 🔥 重要：保存購物車資訊
      selectedCartItems: checkoutStore.selectedCartItems.map(item => ({
        cart_id: item.cart_id,
        plan_type: item.plan_type,
        display_title: item.plan_type,
        title: item.plan_type,
        total_amount: item.total_amount,
        total_meal_count: item.total_meal_count,
        items: item.items || []
      }))
    }

    // 🔥 新增：保存到 sessionStorage
    checkoutStore.saveOrderToSession(checkoutStore.orderResult)
    // console.log('✅ 訂單資料已保存到 sessionStorage')

    // console.log('🚀 步驟2：準備綠界付款...')

    // === 步驟2：調用 ecpay_payment.php 準備綠界付款 ===
    const paymentData = {
      order_numbers: checkoutResult.data.order_numbers,
      total_amount: checkoutResult.data.final_total,
      item_name: generateItemName(checkoutResult.data),
      consignee_info: checkoutResult.data.consignee_info
    }

    // console.log('💳 付款資料:', paymentData)

    const paymentResponse = await fetch(`${env}/tjd101/g1/php/ecpay_payment.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    if (!paymentResponse.ok) {
      throw new Error(`付款準備失敗: HTTP ${paymentResponse.status}`)
    }

    const paymentResult = await paymentResponse.json()
    // console.log('💳 綠界付款準備結果:', paymentResult)
    
    // 🔥 新增：詳細檢查回傳資料結構
    // console.log('🔍 檢查 paymentResult 結構:')
    // console.log('  - success:', paymentResult.success)
    // console.log('  - message:', paymentResult.message)
    // console.log('  - data:', paymentResult.data)
    if (paymentResult.data) {
      // console.log('  - data.action_url:', paymentResult.data.action_url)
      // console.log('  - data.form_data:', paymentResult.data.form_data)
    }

    if (paymentResult.success && paymentResult.data && paymentResult.data.action_url) {
      console.log('🚀 跳轉到綠界付款頁面...')
      
      // === 步驟3：創建表單並跳轉到綠界 ===
      submitECPayForm(paymentResult.data)
      
    } else {
      console.error('❌ 付款資料不完整:', paymentResult)
      throw new Error(paymentResult.message || '付款準備失敗：缺少必要資料')
    }

  } catch (error) {
    console.error('❌ 結帳失敗:', error)
    alert('結帳失敗：' + error.message)
    loading.value = false
  }
}

// 🔥 新增：生成商品名稱
const generateItemName = (orderData) => {
  const orders = orderData.orders || []
  
  if (orders.length === 0) {
    return '餐盒訂購'
  }
  
  if (orders.length === 1) {
    return orders[0].plan_type || '餐盒訂購'
  }
  
  // 多筆訂單：使用第一個 + 等N筆
  const firstName = orders[0].plan_type || '餐盒訂購'
  return `${firstName}等${orders.length}筆`
}

// 🔥 新增：提交綠界表單
const submitECPayForm = (paymentData) => {
  // console.log('📋 創建綠界付款表單...', paymentData)
  
  // 創建隱藏表單
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = paymentData.action_url
  form.style.display = 'none'

  // 添加表單欄位
  Object.keys(paymentData.form_data).forEach(key => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = paymentData.form_data[key]
    form.appendChild(input)
    
    // console.log(`表單欄位 ${key}: ${paymentData.form_data[key]}`)
  })

  // 添加到頁面並提交
  document.body.appendChild(form)
  
  // console.log('🚀 跳轉到綠界付款頁面:', paymentData.action_url)
  form.submit()

  // 清理表單
  setTimeout(() => {
    if (document.body.contains(form)) {
      document.body.removeChild(form)
    }
  }, 1000)
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
                            <h6>餐盒金額合計</h6>
                            <h6>${{ formatPrice(selectedTotalAmount) }}</h6>
                        </div>
                        <div class="payItem">
                            <h6>運費 ({{ totalDeliveryDays }}天 × $100)</h6>
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