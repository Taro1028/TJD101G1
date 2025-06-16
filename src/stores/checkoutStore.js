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
    isSameAsOrderer: true, // 是否同訂購人
    name: '',
    phone: '',
    address: ''
  })

  // 常用收貨人列表
  const savedConsignees = ref([])

  // 發票資訊
  const invoiceInfo = ref({
    type: 'member', // member, company, donation, mobile
    companyTitle: '',
    taxId: '',
    donationCode: '',
    mobileBarcode: ''
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

  // 檢查 Step 2 表單是否有效
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

    // 檢查發票資訊
    let invoiceValid = true
    if (invoiceInfo.value.type === 'company') {
      invoiceValid = invoiceInfo.value.companyTitle && invoiceInfo.value.taxId
    } else if (invoiceInfo.value.type === 'mobile') {
      invoiceValid = invoiceInfo.value.mobileBarcode
    } else if (invoiceInfo.value.type === 'donation') {
      invoiceValid = invoiceInfo.value.donationCode
    }

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
    }
  }

  // 設定發票資訊
  const setInvoiceInfo = (info) => {
    invoiceInfo.value = { ...invoiceInfo.value, ...info }
  }

  // 載入常用收貨人列表 (模擬)
  const loadSavedConsignees = async () => {
    try {
      // 模擬資料，之後串接 API
      savedConsignees.value = [
        {
          id: 1,
          name: '林榮傑',
          phone: '0987-078-587',
          address: '104 臺北市中山區南京東路三段'
        },
        {
          id: 2,
          name: '王小明',
          phone: '0912-345-678',
          address: '110 臺北市信義區市府路1號'
        }
      ]
    } catch (error) {
      console.error('載入常用收貨人失敗:', error)
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

      // 模擬 API 呼叫
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
      isSameAsOrderer: true,
      name: '',
      phone: '',
      address: ''
    }
    invoiceInfo.value = {
      type: 'member',
      companyTitle: '',
      taxId: '',
      donationCode: '',
      mobileBarcode: ''
    }
    paymentInfo.value = {
      method: 'ecpay'
    }
    orderResult.value = null
    validationErrors.value = {}
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
    debugCartData // 新增調試方法
  }
})