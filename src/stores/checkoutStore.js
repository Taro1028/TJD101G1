// stores/checkoutStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCartStore } from './cartStore'
import { useMemberStore } from './MemberStore'

export const useCheckoutStore = defineStore('checkout', () => {
  
  // 狀態定義 ================================


  // 結帳步驟
  const currentStep = ref(1) // 1: 訂單資料, 2: 付款資料, 3: 完成結帳

  // 選中的購物車項目
  const selectedCartIds = ref([]) // 存放選中的 cart_id 陣列

  // 訂購人資訊 (從會員資料載入)
  const ordererInfo = ref({
    name: '',
    phone: '',
    address: ''
  })

  // 收貨人資訊
  const consigneeInfo = ref({
    isSameAsOrderer: false, // 預設為不同訂購人
    name: '',
    phone: '',
    address: ''
  })

  // 常用收貨人列表
  const savedConsignees = ref([])

  // 發票資訊 - 簡化版本，只需要選擇類型
  const invoiceInfo = ref({
    type: 'member' // member, company, donation, mobile
  })

  // 付款資訊
  const paymentInfo = ref({
    method: 'ecpay'
  })

  // 訂單結果
  const orderResult = ref(null)

  // 表單驗證錯誤
  const validationErrors = ref({})

  // 載入狀態
  const isSubmitting = ref(false)


  // 計算屬性 ================================

  // 取得被選中的購物車項目
  const selectedCartItems = computed(() => {
    const cartStore = useCartStore()
    return cartStore.cartGroups.filter(group =>
      selectedCartIds.value.includes(group.cart_id)
    )
  })

  // 計算被選中項目的總金額 - 修正版本
  const selectedTotalAmount = computed(() => {
    return selectedCartItems.value.reduce((sum, group) => {
      // 計算每個 group 的總金額
      if (group.items && Array.isArray(group.items)) {
        const groupTotal = group.items.reduce((itemSum, item) => {
          const dailyAmount = parseFloat(item.dailyTotalAmount) || 0
          return itemSum + dailyAmount
        }, 0)
        return sum + groupTotal
      }
      // 如果有 total_amount 屬性則使用它
      return sum + (parseFloat(group.total_amount) || 0)
    }, 0)
  })

  // 計算被選中項目的總餐數 - 修正版本
  const selectedTotalMeals = computed(() => {
    return selectedCartItems.value.reduce((sum, group) => {
      // 計算每個 group 的總餐數
      if (group.items && Array.isArray(group.items)) {
        const groupMealCount = group.items.reduce((itemSum, item) => {
          const quantity = parseInt(item.quantity) || 0
          return itemSum + quantity
        }, 0)
        return sum + groupMealCount
      }
      // 如果有 total_meal_count 屬性則使用它
      return sum + (parseInt(group.total_meal_count) || 0)
    }, 0)
  })

  // 計算運費 (先寫死，之後可以改成動態計算)
  const shippingFee = computed(() => {
    return selectedCartItems.value.length > 0 ? 800 : 0
  })

  // 計算最終總金額 (餐費 + 運費)
  const finalTotalAmount = computed(() => {
    return selectedTotalAmount.value + shippingFee.value
  })

  // 檢查當前步驟是否可以進行下一步
  const canProceedToNextStep = computed(() => {
    switch (currentStep.value) {
      case 1:
        console.log('a');
        return selectedCartIds.value.length > 0
      case 2:
        console.log('b')
        return isStep2Valid.value
      case 3:
        console.log('c')
        return false
      default:
        console.log('d')
        return false
    }
  })

  // 檢查 Step 2 表單是否有效 - 簡化版本
  const isStep2Valid = computed(() => {
    // 檢查訂購人必填欄位
    const ordererValid = ordererInfo.value.name &&
      ordererInfo.value.phone &&
      ordererInfo.value.address

    // 檢查收貨人必填欄位
    let consigneeValid = true
    if (!consigneeInfo.value.isSameAsOrderer) {
      consigneeValid = consigneeInfo.value.name &&
        consigneeInfo.value.phone &&
        consigneeInfo.value.address
    }

    // 發票資訊只需要選擇類型即可，不需要額外驗證
    const invoiceValid = invoiceInfo.value.type !== ''

    return ordererValid && consigneeValid && invoiceValid
  })


  // 方法 ================================

  // 添加調試方法 - 用於檢查數據結構
  const debugCartData = () => {
    const cartStore = useCartStore()
    console.log('=== 購物車調試資訊 ===')
    console.log('cartGroups:', cartStore.cartGroups)
    console.log('selectedCartIds:', selectedCartIds.value)
    console.log('selectedCartItems:', selectedCartItems.value)
    console.log('selectedTotalMeals:', selectedTotalMeals.value)
    console.log('selectedTotalAmount:', selectedTotalAmount.value)

    // 詳細檢查每個選中的項目
    selectedCartItems.value.forEach((group, index) => {
      console.log(`Group ${index + 1}:`, {
        cart_id: group.cart_id,
        items: group.items,
        total_amount: group.total_amount,
        total_meal_count: group.total_meal_count
      })

      if (group.items) {
        group.items.forEach((item, itemIndex) => {
          console.log(`  Item ${itemIndex + 1}:`, {
            quantity: item.quantity,
            dailyTotalAmount: item.dailyTotalAmount
          })
        })
      }
    })
    console.log('==================')
  }

  // 會員資料調試方法
  const debugMemberData = () => {
    const memberStore = useMemberStore()
    console.log('=== 會員資料調試資訊 ===')
    console.log('memberStore.isAuthenticated:', memberStore.isAuthenticated)
    console.log('memberStore.memberId:', memberStore.memberId)
    console.log('memberStore.id:', memberStore.id)
    console.log('memberStore.member:', memberStore.member)
    console.log('SessionStorage memberData:', sessionStorage.getItem('memberData'))
    console.log('========================')
  }

  // 設定當前步驟
  const setCurrentStep = (step) => {
    if (step >= 1 && step <= 3) {
      currentStep.value = step
    }
  }

  // 進入下一步
  const goToNextStep = () => {
    if (canProceedToNextStep.value && currentStep.value < 3) {
      currentStep.value++
    }
  }

  // 回到上一步
  const goToPreviousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // 設定選中的購物車項目
  const setSelectedCartIds = (cartIds) => {
    selectedCartIds.value = [...cartIds]
    // 調試輸出
    console.log('設定選中項目:', cartIds)
    debugCartData()
  }

  // 切換購物車項目選擇狀態
  const toggleCartSelection = (cartId) => {
    const index = selectedCartIds.value.indexOf(cartId)
    if (index > -1) {
      selectedCartIds.value.splice(index, 1)
    } else {
      selectedCartIds.value.push(cartId)
    }
    console.log('切換選擇狀態:', cartId, '當前選中:', selectedCartIds.value)
  }

  // 全選/取消全選購物車項目
  const toggleSelectAll = () => {
    const cartStore = useCartStore()
    const allCartIds = cartStore.cartGroups.map(group => group.cart_id)

    if (selectedCartIds.value.length === allCartIds.length) {
      selectedCartIds.value = []
    } else {
      selectedCartIds.value = [...allCartIds]
    }
    console.log('全選切換後:', selectedCartIds.value)
  }

  // 載入會員資料到訂購人資訊
  const loadMemberInfo = async () => {
    try {
      const memberStore = useMemberStore()
      if (!memberStore.isAuthenticated) {
        throw new Error('請先登入')
      }

      // 確保會員資料已載入
      if (!memberStore.member) {
        console.log('會員資料未載入，嘗試重新載入...')
        await memberStore.fetchMember()
      }

      // 檢查會員資料是否存在
      if (!memberStore.member) {
        throw new Error('無法載入會員資料')
      }

      // 從會員資料載入 - 根據 MEMBERS 資料表欄位
      ordererInfo.value = {
        name: memberStore.member.M_NAME || '',
        phone: memberStore.member.PHONE || '',
        address: memberStore.member.ADDRESS || ''
      }

      console.log('✅ 會員資料載入完成:', ordererInfo.value)
      console.log('原始會員資料:', memberStore.member)
    } catch (error) {
      console.error('載入會員資料失敗:', error)
      // 如果載入失敗，設定空值避免錯誤
      ordererInfo.value = {
        name: '',
        phone: '',
        address: ''
      }
      throw error
    }
  }

  // 設定收貨人資訊
  const setConsigneeInfo = (info) => {
    consigneeInfo.value = { ...consigneeInfo.value, ...info }
  }

  // 同訂購人切換
  const toggleSameAsOrderer = () => {
    consigneeInfo.value.isSameAsOrderer = !consigneeInfo.value.isSameAsOrderer

    if (consigneeInfo.value.isSameAsOrderer) {
      // 複製訂購人資料
      consigneeInfo.value.name = ordererInfo.value.name
      consigneeInfo.value.phone = ordererInfo.value.phone
      consigneeInfo.value.address = ordererInfo.value.address
    } else {
      // 清空收貨人資料
      consigneeInfo.value.name = ''
      consigneeInfo.value.phone = ''
      consigneeInfo.value.address = ''
    }
  }

  // 設定發票資訊 - 簡化版本
  const setInvoiceInfo = (info) => {
    invoiceInfo.value = { ...invoiceInfo.value, ...info }
  }

  // 載入常用收貨人列表 - 改為真實 API 調用
  const loadSavedConsignees = async () => {
    try {
      const memberStore = useMemberStore()

      // 多重方式取得會員ID
      let memberId = null
      if (memberStore.memberId) {
        memberId = memberStore.memberId
      } else if (memberStore.id) {
        memberId = memberStore.id
      } else {
        throw new Error('無會員ID')
      }

      const env = import.meta.env.VITE_API_URL
      const baseUrl = env.endsWith('/') ? env : env + '/'
      const apiUrl = `${baseUrl}tjd101/g1/php/getConsignees.php?member_id=${memberId}`

      console.log('🔍 載入常用收貨人列表，API URL:', apiUrl)

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || '載入常用收貨人失敗')
      }

      // 轉換 API 資料格式為前端使用的格式
      savedConsignees.value = (result.data || []).map(item => ({
        id: item.ID,
        name: item.C_NAME,
        phone: item.C_PHONE || item.C_TELEPHONE,
        address: item.C_ADD
      }))

      // console.log('✅ 常用收貨人列表載入完成:', savedConsignees.value)

    } catch (error) {
      // console.error('❌ 載入常用收貨人失敗:', error)
      // 載入失敗時使用空陣列
      savedConsignees.value = []
    }
  }

  // 選擇常用收貨人
  const selectSavedConsignee = (consignee) => {
    consigneeInfo.value = {
      isSameAsOrderer: false,
      name: consignee.name,
      phone: consignee.phone,
      address: consignee.address
    }
    // console.log('✅ 已選擇常用收貨人:', consignee)
  }

  // 提交訂單並處理購物車刪除
  const submitOrder = async () => {
    if (isSubmitting.value) {
      // console.log('⚠️ 正在提交中，請勿重複操作')
      return
    }

    try {
      isSubmitting.value = true
      const memberStore = useMemberStore()
      const cartStore = useCartStore()
      

      // 調試會員資料
      debugMemberData()

      if (!memberStore.isAuthenticated) {
        throw new Error('請先登入才能提交訂單')
      }

      if (selectedCartIds.value.length === 0) {
        throw new Error('請選擇要結帳的項目')
      }

      // 🔥 修正：多重方式取得會員ID
      let memberId = null

      // 方法1: 從 memberStore.memberId (getter)
      if (memberStore.memberId) {
        memberId = memberStore.memberId
        // console.log('✅ 使用 memberStore.memberId:', memberId)
      }
      // 方法2: 從 memberStore.id (state)
      else if (memberStore.id) {
        memberId = memberStore.id
        // console.log('✅ 使用 memberStore.id:', memberId)
      }
      // 方法3: 如果有 member 物件，從中取得
      else if (memberStore.member && memberStore.member.M_ID) {
        memberId = memberStore.member.M_ID
        // console.log('✅ 使用 memberStore.member.M_ID:', memberId)
      }
      else if (memberStore.member && memberStore.member.ID) {
        memberId = memberStore.member.ID
        // console.log('✅ 使用 memberStore.member.ID:', memberId)
      }
      // 方法4: 如果上述都失敗，嘗試重新載入會員資料
      else {
        // console.log('⚠️ 無法取得會員ID，嘗試重新載入會員資料...')

        // 嘗試從 sessionStorage 載入
        const loaded = memberStore.loadFromsessionStorage()
        if (loaded && memberStore.id) {
          memberId = memberStore.id
          // console.log('✅ 從 sessionStorage 重新載入會員ID:', memberId)
        } else {
          throw new Error('無法取得會員ID，請重新登入')
        }
      }

      // 最終檢查
      if (!memberId || memberId <= 0) {
        throw new Error('會員ID無效，請重新登入')
      }

      // console.log('🔍 最終使用的會員ID:', memberId)

      // 準備訂單資料
      const orderData = {
        m_id: parseInt(memberId), // 確保是整數
        cart_ids: selectedCartIds.value,
        orderer_info: ordererInfo.value,
        consignee_info: consigneeInfo.value.isSameAsOrderer ? ordererInfo.value : consigneeInfo.value,
        invoice_info: invoiceInfo.value,
        payment_method: paymentInfo.value.method,
        meal_amount: selectedTotalAmount.value,
        shipping_fee: shippingFee.value,
        total_amount: finalTotalAmount.value
      }

      // console.log('準備提交訂單:', orderData)

      // 調用結帳 API
      const env = import.meta.env.VITE_API_URL
      const baseUrl = env.endsWith('/') ? env : env + '/'
      const apiUrl = `${baseUrl}tjd101/g1/php/checkout.php`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      // 先檢查回應的原始內容
      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // 檢查回應是否為有效 JSON
      let result
      try {
        result = JSON.parse(responseText)
        
      } catch (jsonError) {
        
        // 檢查是否包含 PHP 錯誤或額外輸出
        if (responseText.includes('=== 緊湊型時間戳')) {
          throw new Error('PHP 檔案包含測試程式碼，請移除所有 echo 和測試輸出')
        } else if (responseText.includes('<?php') || responseText.includes('?>')) {
          throw new Error('PHP 檔案有語法錯誤或額外輸出')
        } else if (responseText.includes('Warning:') || responseText.includes('Error:')) {
          throw new Error('PHP 執行錯誤: ' + responseText.substring(0, 200))
        } else {
          throw new Error('API 回應不是有效的 JSON 格式')
        }
      }

      if (!result.success) {
        throw new Error(result.message || '結帳失敗')
      }

      // 結帳成功後的處理
      orderResult.value = {
        success: true,
        message: result.message,
        created_at: new Date().toISOString(),

        // 重要：保持 API 回傳的完整 data 結構
        data: {
          order_ids: result.data.order_ids,
          order_numbers: result.data.order_numbers, 
          orders: result.data.orders,
          total_orders: result.data.total_orders,
          total_amount: result.data.total_amount,
          total_meal_count: result.data.total_meal_count,
          final_total: result.data.final_total,
          shipping_fee: result.data.shipping_fee,
          consignee_info: result.data.consignee_info,
          order_time: result.data.order_time,
          deleted_cart_count: result.data.deleted_cart_count,
          deleted_items_count: result.data.deleted_items_count,
          migrated_cards_count: result.data.migrated_cards_count,
          cart_to_order_mapping: result.data.cart_to_order_mapping
        },

        // 為了相容性，也在頂層放一份（但主要使用 data 內的）
        order_ids: result.data.order_ids,
        order_numbers: result.data.order_numbers,
        total_orders: result.data.total_orders,
        total_amount: result.data.total_amount,
        total_meal_count: result.data.total_meal_count,
        final_total: result.data.final_total
      }

      // 除錯輸出（確認資料結構）
      console.log('✅ 結帳成功，orderResult 結構:', {
        success: orderResult.value.success,
        hasData: !!orderResult.value.data,
        orderNumbers: orderResult.value.data?.order_numbers,
        orderNumbersType: typeof orderResult.value.data?.order_numbers,
        orderNumbersLength: orderResult.value.data?.order_numbers?.length,
        firstOrderNumber: orderResult.value.data?.order_numbers?.[0],
        orderIds: orderResult.value.data?.order_ids,
        totalOrders: orderResult.value.data?.total_orders,
        totalMealCount: orderResult.value.data?.total_meal_count,
        finalTotal: orderResult.value.data?.final_total
      })

      // 特別檢查訂單編號格式
      if (orderResult.value.data?.order_numbers && Array.isArray(orderResult.value.data.order_numbers)) {
        orderResult.value.data.order_numbers.forEach((num, index) => {
          const numStr = String(num)
          console.log(`訂單編號 ${index + 1}: ${numStr} (長度: ${numStr.length})`)

          // 解析時間+ID格式
          if (numStr.length === 12) {
            const year = 2000 + parseInt(numStr.substring(0, 2))
            const month = parseInt(numStr.substring(2, 4))
            const day = parseInt(numStr.substring(4, 6))
            const hour = parseInt(numStr.substring(6, 8))
            const minute = parseInt(numStr.substring(8, 10))
            const id = parseInt(numStr.substring(10, 12))

          }
        })
      }

      // 🔥 新增：保存購物車資訊到訂單結果中（用於完成頁面顯示）
      orderResult.value.selectedCartItems = selectedCartItems.value.map(item => ({
        cart_id: item.cart_id,
        plan_type: item.plan_type,
        display_title: item.plan_type,
        title: item.plan_type,
        total_amount: item.total_amount,
        total_meal_count: item.total_meal_count,
        items: item.items || []
      }))

      // 重要：重新載入購物車資料
      await cartStore.fetchCartItemsFromBackend()

      // 清空已選擇的項目
      selectedCartIds.value = []

      // 進入完成步驟
      currentStep.value = 3

      // 🔥 新增：儲存訂單資料到 sessionStorage
      saveOrderToSession(orderResult.value)

      return orderResult.value

    } catch (error) {
      console.error('提交訂單失敗:', error)

      // 詳細錯誤資訊
      if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        console.error('💡 這是 JSON 解析錯誤，通常是因為:')
        console.error('   1. PHP 檔案包含額外的輸出（echo, var_dump, 測試程式碼）')
        console.error('   2. PHP 語法錯誤')
        console.error('   3. 伺服器錯誤頁面')
        console.error('請檢查 PHP 檔案是否只輸出純 JSON')
      }

      // 設定錯誤狀態
      orderResult.value = {
        success: false,
        message: error.message || '結帳失敗，請稍後再試',
        error: error
      }

      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // 重新載入購物車數據（結帳後使用）
  const refreshCartAfterCheckout = async () => {
    try {
      const cartStore = useCartStore()
      console.log('🔄 結帳後重新載入購物車...')
      await cartStore.fetchCart()
      console.log('✅ 購物車數據已更新')
    } catch (error) {
      console.error('❌ 重新載入購物車失敗:', error)
    }
  }

  // 新增：檢查所選項目是否還有效（防止併發問題）
  const validateSelectedItems = () => {
    const cartStore = useCartStore()
    const validCartIds = cartStore.cartGroups.map(group => group.cart_id)

    // 過濾掉無效的選擇項目
    const filteredIds = selectedCartIds.value.filter(id => validCartIds.includes(id))

    if (filteredIds.length !== selectedCartIds.value.length) {
      console.log('⚠️ 部分選擇項目已失效，自動更新選擇')
      selectedCartIds.value = filteredIds
      return false // 有項目被過濾
    }

    return true // 所有項目都有效
  }

  // 重置結帳流程
  const resetCheckout = () => {
    currentStep.value = 1
    selectedCartIds.value = []
    ordererInfo.value = {
      name: '',
      phone: '',
      address: ''
    }
    consigneeInfo.value = {
      isSameAsOrderer: false,
      name: '',
      phone: '',
      address: ''
    }
    invoiceInfo.value = {
      type: 'member'
    }
    paymentInfo.value = {
      method: 'ecpay'
    }
    orderResult.value = null
    validationErrors.value = {}
    savedConsignees.value = []
    isSubmitting.value = false

    console.log('🔄 結帳流程已重置')
  }

  // 處理結帳成功後的跳轉
  const handleCheckoutComplete = async (redirectToOrders = true) => {
    try {
      // 可以在這裡加入額外的後處理邏輯
      console.log('✅ 結帳完成後處理...')

      if (redirectToOrders) {
        // 這裡可以使用 router 跳轉到訂單頁面
        // 由於是 store，需要在 component 中處理路由跳轉
        return { shouldRedirect: true, path: '/orders' }
      }

      return { shouldRedirect: false }
    } catch (error) {
      console.error('❌ 結帳完成後處理失敗:', error)
    }
  }

  // 🔥 新增：儲存訂單到 sessionStorage
  const saveOrderToSession = (orderResult) => {
    try {
      sessionStorage.setItem('orderResult', JSON.stringify(orderResult))
      console.log('✅ 訂單資料已儲存到 sessionStorage')
    } catch (error) {
      console.error('儲存訂單資料失敗:', error)
    }
  }

  // 🔥 新增：從 sessionStorage 載入訂單
  const loadOrderFromSession = () => {
    try {
      const saved = sessionStorage.getItem('orderResult')
      if (saved) {
        orderResult.value = JSON.parse(saved)
        console.log('✅ 從 sessionStorage 恢復訂單資料')
        return true
      }
    } catch (error) {
      console.error('載入訂單資料失敗:', error)
    }
    return false
  }

  // 🔥 新增：清除 sessionStorage 訂單資料
  const clearOrderFromSession = () => {
    try {
      sessionStorage.removeItem('orderResult')
      console.log('✅ 已清除 sessionStorage 訂單資料')
    } catch (error) {
      console.error('清除訂單資料失敗:', error)
    }
  }

  // 返回所有狀態和方法
  return {
    // 狀態
    currentStep,
    selectedCartIds,
    ordererInfo,
    consigneeInfo,
    savedConsignees,
    invoiceInfo,
    paymentInfo,
    orderResult,
    validationErrors,
    isSubmitting,

    // 計算屬性
    selectedCartItems,
    selectedTotalAmount,
    selectedTotalMeals,
    shippingFee,
    finalTotalAmount,
    canProceedToNextStep,
    isStep2Valid,

    // 方法
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    setSelectedCartIds,
    toggleCartSelection,
    toggleSelectAll,
    loadMemberInfo,
    setConsigneeInfo,
    toggleSameAsOrderer,
    setInvoiceInfo,
    loadSavedConsignees,
    selectSavedConsignee,
    submitOrder,
    resetCheckout,
    debugCartData,
    debugMemberData,
    refreshCartAfterCheckout,
    validateSelectedItems,
    handleCheckoutComplete,
    saveOrderToSession,
    loadOrderFromSession,
    clearOrderFromSession
  }
})