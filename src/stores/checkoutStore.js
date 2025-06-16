// stores/checkoutStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCartStore } from './cartStore'
import { useMemberStore } from './MemberStore'

export const useCheckoutStore = defineStore('checkout', () => {
  // ================================
  // 狀態定義
  // ================================

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

  // ================================
  // 計算屬性
  // ================================

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
        return selectedCartIds.value.length > 0
      case 2:
        return isStep2Valid.value
      case 3:
        return false
      default:
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

  // ================================
  // 方法
  // ================================

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
      
      if (!memberStore.memberId) {
        throw new Error('無會員ID')
      }

      const env = import.meta.env.VITE_API_URL || 'http://localhost'
      const baseUrl = env.endsWith('/') ? env : env + '/'
      const apiUrl = `${baseUrl}tjd101/g1/php/getConsignees.php?member_id=${memberStore.memberId}`
      
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
      
      console.log('✅ 常用收貨人列表載入完成:', savedConsignees.value)
      
    } catch (error) {
      console.error('❌ 載入常用收貨人失敗:', error)
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
    console.log('✅ 已選擇常用收貨人:', consignee)
  }

  // 提交訂單
  const submitOrder = async () => {
    try {
      const memberStore = useMemberStore()

      if (!memberStore.isAuthenticated) {
        throw new Error('請先登入才能提交訂單')
      }

      // 準備訂單資料
      const orderData = {
        m_id: memberStore.member.M_ID,
        cart_ids: selectedCartIds.value,
        orderer_info: ordererInfo.value,
        consignee_info: consigneeInfo.value.isSameAsOrderer ? ordererInfo.value : consigneeInfo.value,
        invoice_info: invoiceInfo.value,
        payment_method: paymentInfo.value.method,
        meal_amount: selectedTotalAmount.value,
        shipping_fee: shippingFee.value,
        total_amount: finalTotalAmount.value
      }

      console.log('準備提交訂單:', orderData)

      // 模擬 API 呼叫 - 之後改為真實 API
      const mockResult = {
        success: true,
        order_id: 'ORD' + Date.now(),
        order_number: '2506' + String(Date.now()).slice(-3),
        message: '訂單提交成功',
        ...orderData
      }

      orderResult.value = mockResult
      currentStep.value = 3

      return mockResult

    } catch (error) {
      console.error('提交訂單失敗:', error)
      throw error
    }
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
    debugCartData
  }
})