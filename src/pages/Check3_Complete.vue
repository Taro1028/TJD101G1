<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, computed } from 'vue'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useMemberStore } from '@/stores/MemberStore'
import { useRouter } from 'vue-router'

// 🔥 加入這行 - 在任何邏輯執行前就記錄
console.log('🚀 Check3_Complete.vue 組件被載入！')

const checkoutStore = useCheckoutStore()
const memberStore = useMemberStore()
const router = useRouter()

onMounted(() => {
  console.log('🚀 Check3_Complete.vue onMounted 執行開始')

  // 🔥 新增：檢查 sessionStorage 內容
  console.log('🔍 檢查 sessionStorage 內容:')
  console.log('  orderResult:', sessionStorage.getItem('orderResult'))
  console.log('  memberData:', sessionStorage.getItem('memberData'))

  document.body.classList.add('custom-bg')

  // 🔥 修改：先嘗試從 sessionStorage 恢復訂單資料
  if (!checkoutStore.orderResult) {
    console.log('⚠️ 無訂單資料，嘗試從 sessionStorage 恢復...')
    const restored = checkoutStore.loadOrderFromSession()
    
    if (!restored) {
      console.log('❌ 無法恢復訂單資料')
      
      // 🔥 檢查是否來自綠界
      if (document.referrer.includes('ecpay.com.tw')) {
        console.log('🎯 來自綠界但無訂單資料，顯示基本付款成功訊息')
        // 🔥 設定基本的成功資料
        checkoutStore.orderResult = {
          success: true,
          message: '付款成功',
          data: {
            order_numbers: ['付款已完成'],
            final_total: 0,
            total_meal_count: 0,
            consignee_info: {
              name: memberStore.name || '收貨人',
              phone: memberStore.phone || '',
              address: memberStore.address || ''
            },
            order_time: new Date().toISOString()
          }
        }
        console.log('🔥 設定基本付款成功資料')
        return
      }
      
      // 如果不是來自綠界，導向訂單頁面
      console.log('↩️ 非綠界跳轉且無訂單資料，導向訂單頁面')
      router.push('/Check_OrderInfo')
      return
    }else{console.log('✅ 成功恢復訂單資料')}
  }else{
      console.log('✅ checkoutStore 中已有訂單資料')
    }
  
  // 🔥 嘗試從 sessionStorage 恢復登入狀態
  if (!memberStore.isAuthenticated) {
    console.log('⚠️ 未登入，嘗試從 sessionStorage 恢復...')
    const loaded = memberStore.loadFromsessionStorage()
    console.log('恢復結果:', loaded)
    
    if (!loaded || !memberStore.isAuthenticated) {
      alert('登入狀態已失效，請重新登入')
      router.push('/login')
      return
    }
  }
  
  // 檢查是否有訂單結果，如果沒有則導回訂單頁面
  // if (!checkoutStore.orderResult) {
  //   console.log('⚠️ 無訂單資料，導向訂單頁面')
  //   router.push('/Check_OrderInfo')
  //   return
  // }
  
  console.log('✅ 訂單完成頁面載入 (EAT格式支援)', checkoutStore.orderResult)
  
  // 🔥 詳細除錯 API 回傳結構 - 更新為 EAT 格式
  setTimeout(() => {
    debugOrderData()
    validateEATFormat()
  }, 100)
  
  // 設定當前步驟為完成結帳
  checkoutStore.setCurrentStep(3)
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

// 計算屬性
const orderResult = computed(() => checkoutStore.orderResult)

// 🔥 輔助函數：計算兩個日期之間的天數
const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end.getTime() - start.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 // +1 包含起始日
  return daysDiff
}

// 🔥 除錯函數 - 更新為 EAT 格式
const debugOrderData = () => {
  console.log('=== 訂單資料詳細除錯 (EAT格式) ===')
  console.log('完整 orderResult:', JSON.stringify(orderResult.value, null, 2))
  
  const result = orderResult.value
  if (result?.data) {
    console.log('✅ data 物件存在')
    console.log('data.order_numbers:', result.data.order_numbers, '類型:', typeof result.data.order_numbers)
    console.log('data.order_ids:', result.data.order_ids)
    console.log('data.total_meal_count:', result.data.total_meal_count)
    console.log('data.final_total:', result.data.final_total)
    console.log('data.consignee_info:', result.data.consignee_info)
    console.log('data.order_time:', result.data.order_time) // 🔥 新增
    console.log('data.orders:', result.data.orders) // 🔥 新增
    
    // 🔥 檢查購物車和訂單資料
    console.log('🛒 checkoutStore.selectedCartItems:', checkoutStore.selectedCartItems)
    
    // 🔥 檢查配送時間資料和訂單詳情
    if (result.data.orders && result.data.orders.length > 0) {
      console.log('📦 訂單詳情:')
      result.data.orders.forEach((order, index) => {
        console.log(`  訂單 ${index + 1}:`)
        console.log('    start_date:', order.start_date)
        console.log('    end_date:', order.end_date)
        console.log('    total_days:', order.total_days)
        console.log('    🔥 plan_type:', order.plan_type) // 🔥 保留這個，可能有值
        console.log('    total_amount:', order.total_amount)
        // 🔥 移除這些 undefined 欄位的輸出：
        // plan_name, meal_plan_name, combo_name, name, meal_count
      })
    }
    
    if (Array.isArray(result.data.order_numbers)) {
      result.data.order_numbers.forEach((num, index) => {
        const numStr = String(num)
        console.log(`order_numbers[${index}]:`, numStr, '長度:', numStr.length)
        
        // 🔥 解析 EAT 格式 (EAT + YYMMDD + 4位ID)
        if (numStr.startsWith('EAT') && numStr.length === 13) {
          try {
            const dateStr = numStr.substring(3, 9) // YYMMDD
            const idStr = numStr.substring(9, 13)  // 4位ID
            
            const year = 2000 + parseInt(dateStr.substring(0, 2))
            const month = parseInt(dateStr.substring(2, 4))
            const day = parseInt(dateStr.substring(4, 6))
            const orderId = parseInt(idStr)
            
            console.log(`  解析 EAT 格式: ${year}-${month}-${day} 訂單ID:${orderId}`)
          } catch (e) {
            console.error('解析 EAT 格式失敗:', e)
          }
        } else if (numStr.length === 12 && /^\d+$/.test(numStr)) {
          // 🔥 備用：舊的時間+ID格式
          const year = 2000 + parseInt(numStr.substring(0, 2))
          const month = parseInt(numStr.substring(2, 4))
          const day = parseInt(numStr.substring(4, 6))
          const hour = parseInt(numStr.substring(6, 8))
          const minute = parseInt(numStr.substring(8, 10))
          const id = parseInt(numStr.substring(10, 12))
          
          console.log(`  解析舊格式: ${year}-${month}-${day} ${hour}:${minute} ID:${id}`)
        } else {
          console.log(`  無法解析格式: ${numStr}`)
        }
      })
    }
  } else {
    console.log('❌ data 物件不存在')
  }
  console.log('========================')
}

// 🔥 新增：EAT 格式驗證
const validateEATFormat = () => {
  const orderNumbers = orderResult.value?.data?.order_numbers
  
  if (orderNumbers && Array.isArray(orderNumbers)) {
    orderNumbers.forEach((num, index) => {
      const numStr = String(num)
      
      console.log(`驗證訂單編號 ${index + 1}: ${numStr}`)
      
      if (numStr.startsWith('EAT')) {
        if (numStr.length === 13) {
          console.log('✅ EAT 格式正確')
          
          // 進一步驗證格式
          const dateStr = numStr.substring(3, 9)
          const idStr = numStr.substring(9, 13)
          
          if (/^\d{6}$/.test(dateStr) && /^\d{4}$/.test(idStr)) {
            console.log('✅ 日期和ID格式正確')
            console.log(`  日期部分: ${dateStr}`)
            console.log(`  ID部分: ${idStr}`)
          } else {
            console.log('❌ 日期或ID格式錯誤')
          }
        } else {
          console.log('❌ EAT 格式長度錯誤，應為13位')
        }
      } else {
        console.log('⚠️ 非 EAT 格式，可能是舊格式')
      }
    })
  }
}

// 🔥 修正：從正確的 API 回應結構取得收貨人資訊
const consigneeInfo = computed(() => {
  // 優先從 API 回傳的 data.consignee_info 取得
  if (orderResult.value?.data?.consignee_info) {
    return orderResult.value.data.consignee_info
  }
  
  // 備用方案：從 checkoutStore 取得
  return checkoutStore.consigneeInfo.isSameAsOrderer 
    ? checkoutStore.ordererInfo 
    : checkoutStore.consigneeInfo
})

// 格式化價格
const formatPrice = (price) => {
  const num = Number(price)
  return isNaN(num) ? '0' : num.toLocaleString()
}

// 🔥 修正：格式化訂單項目摘要 - 參考付款頁面邏輯
const orderSummary = computed(() => {
  console.log('🔍 計算訂單項目摘要...')
  
  // 🔥 方法1：優先使用 checkoutStore 中保留的購物車資料
  const selectedCartItems = checkoutStore.selectedCartItems
  if (selectedCartItems && selectedCartItems.length > 0) {
    console.log('✅ 使用購物車資料 (selectedCartItems):', selectedCartItems)
    
    if (selectedCartItems.length === 1) {
      const item = selectedCartItems[0]
      const displayTitle = item.display_title || item.title || '餐盒訂單'
      console.log('✅ 單項購物車項目:', displayTitle)
      return displayTitle
    }
    
    const firstItem = selectedCartItems[0]
    const firstTitle = firstItem.display_title || firstItem.title || '餐盒訂單'
    const result = `${firstTitle} 等${selectedCartItems.length}項`
    console.log('✅ 多項購物車摘要:', result)
    return result
  }
  
  // 🔥 方法2：備用 - 使用訂單資料中的 plan_type
  const orders = orderResult.value?.data?.orders
  const orderCount = orderResult.value?.data?.total_orders || 0
  
  if (orderCount === 0) return '無項目'
  
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    console.log('⚠️ 無 orders 資料，使用預設格式')
    return orderCount === 1 ? '餐盒訂單' : `餐盒訂單 等${orderCount}筆`
  }
  
  console.log('📦 使用訂單資料 (備用):', orders)
  
  // 單筆訂單：使用 plan_type
  if (orderCount === 1) {
    const firstOrder = orders[0]
    const planName = firstOrder.plan_type || '餐盒訂單'
    console.log('✅ 單筆訂單方案名稱:', planName)
    return planName
  }
  
  // 多筆訂單：顯示第一個方案名稱 + 等N筆
  const firstOrder = orders[0]
  const firstPlanName = firstOrder.plan_type || '餐盒訂單'
  const result = `${firstPlanName} 等${orderCount}筆`
  console.log('✅ 多筆訂單摘要:', result)
  return result
})

// 🔥 修正：格式化配送時間 - 從實際訂單資料取得並加上天數
const deliveryPeriod = computed(() => {
  console.log('🔍 計算配送時間...')
  
  // 從 orderResult 中的 orders 取得配送期間
  const orders = orderResult.value?.data?.orders
  
  if (orders && orders.length > 0) {
    const firstOrder = orders[0]
    const startDate = firstOrder.start_date
    const endDate = firstOrder.end_date
    const totalDays = firstOrder.total_days
    
    console.log('📦 找到訂單配送資料:', { startDate, endDate, totalDays })
    
    if (startDate && endDate) {
      // 使用實際的訂單配送日期
      const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
      }
      
      const formattedStart = formatDate(startDate)
      const formattedEnd = formatDate(endDate)
      const days = totalDays || calculateDaysBetween(startDate, endDate)
      
      const result = `${formattedStart} — ${formattedEnd} 午間配送 共${days}日`
      console.log('✅ 配送時間計算結果:', result)
      return result
    }
  }
  
  console.log('⚠️ 無法取得訂單配送資料，使用預設邏輯')
  
  // 備用方案：使用預設配送時間邏輯
  const today = new Date()
  const startDateDefault = new Date(today)
  startDateDefault.setDate(today.getDate() + 3) // 3天後開始配送
  
  const endDateDefault = new Date(today)
  endDateDefault.setDate(today.getDate() + 9) // 9天後結束
  
  const formatDate = (date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }
  
  const daysDiff = 7 // 預設7天
  
  return `${formatDate(startDateDefault)} — ${formatDate(endDateDefault)} 午間配送 共${daysDiff}日`
})

// 🔥 訂單編號處理 - 支援 EAT 格式
const orderNumbers = computed(() => {
  console.log('🔍 檢查 EAT 格式訂單編號...')
  
  // 方法1: 從 API 回傳的 data.order_numbers 取得（最優先）
  if (orderResult.value?.data?.order_numbers && Array.isArray(orderResult.value.data.order_numbers)) {
    const numbers = orderResult.value.data.order_numbers
    console.log('✅ 找到 data.order_numbers:', numbers)
    
    if (numbers.length === 0) return ''
    
    if (numbers.length === 1) {
      const orderNumber = String(numbers[0])
      console.log('✅ 單一訂單編號:', orderNumber, '長度:', orderNumber.length)
      return orderNumber // 顯示完整編號，如：EAT2506180001
    }
    
    // 多筆訂單
    const firstNumber = String(numbers[0])
    return `${firstNumber} 等 ${numbers.length} 筆`
  }
  
  // 方法2: 從頂層 order_numbers 取得
  if (orderResult.value?.order_numbers && Array.isArray(orderResult.value.order_numbers)) {
    const numbers = orderResult.value.order_numbers
    console.log('✅ 找到頂層 order_numbers:', numbers)
    
    if (numbers.length === 1) {
      return String(numbers[0])
    }
    return `${numbers[0]} 等 ${numbers.length} 筆`
  }
  
  // 🔥 備用方案：使用 order_ids（這會顯示 #ID 格式）
  if (orderResult.value?.data?.order_ids && Array.isArray(orderResult.value.data.order_ids)) {
    const ids = orderResult.value.data.order_ids
    console.log('⚠️ 只找到 order_ids，使用備用格式:', ids)
    
    if (ids.length === 1) {
      return `#${ids[0]}`
    }
    return `#${ids[0]} 等 ${ids.length} 筆`
  }
  
  console.log('❌ 找不到任何訂單編號')
  return '無訂單編號'
})

// 🔥 修正：總餐盒數
const totalMealCount = computed(() => {
  return orderResult.value?.data?.total_meal_count || 0
})

// 🔥 修正：最終總金額
const finalTotalAmount = computed(() => {
  return orderResult.value?.data?.final_total || 0
})

// 🔥 修正：根據索引取得訂單方案名稱 - 參考購物車資料
const getOrderPlanName = (index) => {
  // 🔥 方法1：優先使用 checkoutStore 中保留的購物車資料
  const selectedCartItems = checkoutStore.selectedCartItems
  if (selectedCartItems && selectedCartItems.length > index) {
    const item = selectedCartItems[index]
    const displayTitle = item.display_title || item.title || '餐盒訂單'
    console.log(`✅ 購物車項目 ${index + 1} 名稱:`, displayTitle)
    return displayTitle
  }
  
  // 🔥 方法2：備用 - 使用訂單資料
  const orders = orderResult.value?.data?.orders
  if (!orders || !Array.isArray(orders) || index >= orders.length) {
    return '餐盒訂單'
  }
  
  const order = orders[index]
  const planName = order.plan_type || '餐盒訂單'
  console.log(`✅ 訂單 ${index + 1} 方案名稱:`, planName)
  return planName
}

// 🔥 修正：從 API 回傳時間解析完整時間（包含時分秒）
const orderCreatedTime = computed(() => {
  console.log('🔍 解析訂單時間...')
  
  // 🔥 優先使用 API 回傳的完整時間
  if (orderResult.value?.data?.order_time) {
    try {
      // API 回傳格式：2025-06-18 14:30:25
      const apiTime = orderResult.value.data.order_time
      console.log('✅ 找到 API 時間:', apiTime)
      
      const date = new Date(apiTime)
      
      if (!isNaN(date.getTime())) {
        const formatted = date.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
        console.log('✅ 格式化後的時間:', formatted)
        return formatted
      }
    } catch (e) {
      console.error('解析 API 時間失敗:', e)
    }
  }
  
  // 🔥 方法2：從 EAT 格式訂單編號解析日期（只有日期，沒有時分秒）
  const orderNumbersArray = orderResult.value?.data?.order_numbers || orderResult.value?.order_numbers
  
  if (orderNumbersArray && orderNumbersArray.length > 0) {
    const orderNumber = String(orderNumbersArray[0])
    console.log('🔍 嘗試從訂單編號解析時間:', orderNumber)
    
    // 🔥 解析 EAT 格式：EAT + YYMMDD + 4位ID
    if (orderNumber.startsWith('EAT') && orderNumber.length === 13) {
      try {
        const dateStr = orderNumber.substring(3, 9) // YYMMDD 部分
        
        const year = 2000 + parseInt(dateStr.substring(0, 2))
        const month = parseInt(dateStr.substring(2, 4))
        const day = parseInt(dateStr.substring(4, 6))
        
        // 建立日期物件（因為沒有時分秒，使用當天開始時間）
        const date = new Date(year, month - 1, day)
        
        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
          const formatted = date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          console.log('✅ 從 EAT 格式解析的日期:', formatted)
          return formatted
        }
      } catch (e) {
        console.error('解析 EAT 格式時間失敗:', e)
      }
    }
    // 🔥 備用：舊的12位時間+ID格式 (YYMMDDHHMM + ID)
    else if (orderNumber.length === 12 && /^\d+$/.test(orderNumber)) {
      try {
        const year = 2000 + parseInt(orderNumber.substring(0, 2))
        const month = parseInt(orderNumber.substring(2, 4))
        const day = parseInt(orderNumber.substring(4, 6))
        const hour = parseInt(orderNumber.substring(6, 8))
        const minute = parseInt(orderNumber.substring(8, 10))
        // 後2位是ID，不是時間
        
        const date = new Date(year, month - 1, day, hour, minute)
        if (date.getFullYear() === year) {
          const formatted = date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
          console.log('✅ 從舊格式解析的時間:', formatted)
          return formatted
        }
      } catch (e) {
        console.error('解析舊格式時間失敗:', e)
      }
    }
  }
  
  console.log('❌ 無法解析訂單時間，使用當前時間')
  // 最後備用：使用當前時間
  return new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

// 查看訂單功能
const viewOrder = () => {
  const orderNumbers = orderResult.value?.data?.order_numbers || orderResult.value?.order_numbers
  console.log('查看 EAT 格式訂單:', orderNumbers)
  router.push(`/MemberCenter/MyOrders`)
}

// 繼續訂餐功能
const continueOrdering = () => {
  checkoutStore.resetCheckout()
  router.push('/Order/Select')
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
            <li class="finish"><span class="finishspan">3</span>完成結帳</li>
        </ul>
        
        <div class="orderpaper" v-if="orderResult">
            <div class="info">
                <div class="title">
                    <i class="bi bi-check-circle"></i>
                    <h3>訂單完成</h3>
                </div>
                <h4>感謝您的訂購與支持，我們將處理您的訂單</h4>
                
                <div class="receipt">
                    <h5>訂單編號： {{ orderNumbers }}</h5>
                    <h5>訂單項目： {{ orderSummary }} / {{ totalMealCount }}份餐盒</h5>
                    <h5>訂單金額： ${{ formatPrice(finalTotalAmount) }}</h5>
                    <h5>配送時間： {{ deliveryPeriod }}</h5>
                    <h5>收貨人： {{ consigneeInfo.name }}</h5>
                    <h5>手機： {{ consigneeInfo.phone }}</h5>
                    <h5>地址： {{ consigneeInfo.address }}</h5>
                </div>
                
                <!-- 🔥 多筆 EAT 格式訂單詳情 - 使用 plan_type -->
                <div v-if="orderResult?.data?.order_numbers && orderResult.data.order_numbers.length > 1" class="order-details">
                    <h6>訂單明細：</h6>
                    <div v-for="(orderNumber, index) in orderResult.data.order_numbers" :key="orderNumber" class="order-item">
                        <span class="order-info">
                            訂單 {{ orderNumber }} - {{ getOrderPlanName(index) }}
                        </span>
                    </div>
                </div>
                <!-- 🔥 備用：如果沒有 data.order_numbers，檢查頂層 -->
                <div v-else-if="orderResult?.order_numbers && orderResult.order_numbers.length > 1" class="order-details">
                    <h6>訂單明細：</h6>
                    <div v-for="(orderNumber, index) in orderResult.order_numbers" :key="orderNumber" class="order-item">
                        <span class="order-info">
                            訂單 {{ orderNumber }} - {{ getOrderPlanName(index) }}
                        </span>
                    </div>
                </div>
                <!-- 🔥 最後備用：使用 order_ids -->
                <div v-else-if="orderResult?.data?.order_ids && orderResult.data.order_ids.length > 1" class="order-details">
                    <h6>訂單明細：</h6>
                    <div v-for="(orderId, index) in orderResult.data.order_ids" :key="orderId" class="order-item">
                        <span class="order-info">
                            訂單 #{{ orderId }} - {{ getOrderPlanName(index) }}
                        </span>
                    </div>
                </div>
                
                <!-- 🔥 修正：顯示完整的訂單時間 -->
                <div v-if="orderCreatedTime" class="order-time-info">
                    <h5>訂單時間： {{ orderCreatedTime }}</h5>
                </div>
                
                <div class="btnblock">
                    <button class="btn-1" @click="viewOrder">查看訂單</button>
                    <button class="btn-2" @click="continueOrdering">繼續訂餐</button>
                </div>
            </div>
            
            <div class="slogan">
                <img src="../assets/images/Logo_L.svg" alt="">
                <h4>吃得下、吃得好，是我們的堅持。</h4>
            </div>
        </div>
        
        <!-- 載入中或無訂單資料時的提示 -->
        <div v-else class="orderpaper">
            <div class="info">
                <div class="title">
                    <i class="bi bi-exclamation-circle"></i>
                    <h3>無訂單資料</h3>
                </div>
                <h4>找不到訂單資料，請重新下單</h4>
                
                <div class="btnblock">
                    <button class="btn-2" @click="continueOrdering">開始訂餐</button>
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
    width: 900px;
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

.orderpaper{
    margin: 40px auto;
    width: 520px;
    padding: 24px 32px;
    background-color: $neutral_white;
    display: flex;
    flex-direction: column;
    gap: 64px;
    border: 1px solid $neutral_100;
    border-radius: 8px;
}

.info{
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.title{
    display: flex;
    align-items: center;
    gap: 20px;
}

.title h3{
    font-size: $font_h3;
    font-weight: normal;
}

.title i{
    font-size: $font_h1;
    color: $primary_400;
}

h4{
    font-size: $font_h4;
    font-weight: normal;
}

.receipt{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.receipt h5{
    font-size: $font_h5;
    font-weight: normal;
}

// 多筆訂單詳情樣式 - 保持原有樣式
.order-details {
    margin-top: 16px;
    padding: 16px;
    background-color: $neutral_100;
    border-radius: 8px;
}

.order-details h6 {
    font-size: $font_h6;
    font-weight: bold;
    margin-bottom: 12px;
    color: $neutral_700;
}

.order-item {
    margin-bottom: 8px;
    padding: 8px 0;
    border-bottom: 1px solid $neutral_300;
    
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
}

.order-info {
    font-size: $font_p;
    color: $neutral_700;
}

// 🔥 新增：訂單時間樣式 - 保持與原有樣式一致
.order-time-info {
    margin-top: 16px;
    padding: 12px;
    background-color: $neutral_100;
    border-radius: 6px;
}

.order-time-info h5 {
    font-size: $font_h6;
    color: $neutral_700;
    font-weight: normal;
}

.btnblock{
    display: flex;
    gap: 40px;
    justify-content: end;
}

.btn-1{
    background-color: $neutral_300;
    color: $neutral_700;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;
    cursor: pointer;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;
    text-decoration: none;
    cursor: pointer;

    &:hover{
    background-color: transparent;
    color: $neutral_black;
    border: 2px solid $neutral_black;
    }
}

.slogan{
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.slogan img{
    display: block;
    width: 313px;
}

.slogan h4{
    font-size: $font_h4;
    font-weight: bold;
}

@media screen and (max-width: 950px){
.wrapper{
    width: 500px;
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

.orderpaper{
    width: 400px;
    margin: 20px;
    padding: 20px;
}
}

@media screen and (max-width: 550px){
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

.orderpaper{
    width: 310px;
    padding: 16px;
    gap: 20px;
}

.title{
    gap: 12px;
}

.title h2,
.title i{
    font-size: $font_h3;
}

.title h3{
    font-size: $font_h4;
}

.info h4{
    font-size: $font_h5;
}

.info{
    gap: 20px;
}

.receipt h5{
    font-size: $font_h6;
}

.btnblock{
    margin-top: 12px;
    justify-content: center;
}

.slogan img{
    width: 280px;
}

.slogan h4{
    font-size: $font_h5;
}
}
</style>