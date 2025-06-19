import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
//  此為會員中心-訂單總覽用狀態管理器
//  嘗試導入 memberStore（如果失敗也不影響運作）
let useMemberStore
try {
  const memberStoreModule = await import('@/stores/MemberStore')
  useMemberStore = memberStoreModule.useMemberStore
} catch (e) {
  console.warn('⚠️ 無法導入 MemberStore，將使用其他方式取得會員ID')
}

export const useOrderListStore = defineStore('orderList', () => {
  //  狀態管理
  const orders = ref([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalOrders = ref(0)
  const perPage = ref(5)
  const loading = ref(false)
  const error = ref(null)

  //  環境變數檢測
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  
  //  動態API端點
  const apiBaseUrl = computed(() => {
    if (isDevelopment) {
      return 'http://localhost/tjd101/g1/php'
    } else {
      // 生產環境 - 請根據實際部署路徑修改
      return 'https://tibamef2e.com/tjd101/g1/php'
    }
  })

  //  取得會員ID (動態從多個來源獲取)
  const getMemberId = () => {
    try {
      // 方法1: 嘗試從 memberStore 獲取 (如果可用)
      if (typeof useMemberStore !== 'undefined') {
        const memberStore = useMemberStore()
        if (memberStore && (memberStore.id || memberStore.memberId)) {
          return memberStore.id || memberStore.memberId
        }
      }
      
      // 方法2: 從 localStorage 獲取會員資料
      const memberData = localStorage.getItem('memberData')
      if (memberData) {
        try {
          const parsed = JSON.parse(memberData)
          if (parsed.id || parsed.memberId || parsed.M_ID) {
            return parsed.id || parsed.memberId || parsed.M_ID
          }
        } catch (e) {
          console.warn('解析 localStorage memberData 失敗:', e)
        }
      }
      
      // 方法3: 從 sessionStorage 獲取
      const sessionMemberData = sessionStorage.getItem('memberData')
      if (sessionMemberData) {
        try {
          const parsed = JSON.parse(sessionMemberData)
          if (parsed.id || parsed.memberId || parsed.M_ID) {
            return parsed.id || parsed.memberId || parsed.M_ID
          }
        } catch (e) {
          console.warn('解析 sessionStorage memberData 失敗:', e)
        }
      }
      
      // 方法4: 從 URL 參數獲取 (如果有)
      const urlParams = new URLSearchParams(window.location.search)
      const urlMemberId = urlParams.get('memberId') || urlParams.get('member_id')
      if (urlMemberId) {
        return parseInt(urlMemberId)
      }
      
      // 方法5: 開發環境預設值
      if (isDevelopment) {
        console.warn('⚠️ 開發環境：使用預設會員ID = 1')
        return 1
      }
      
      // 如果都找不到，拋出錯誤
      throw new Error('無法取得會員ID，請確認是否已登入')
      
    } catch (error) {
      console.error('取得會員ID失敗:', error)
      //  生產環境下如果取不到會員ID，應該跳轉到登入頁
      if (!isDevelopment) {
        console.error('生產環境無法取得會員ID，需要重新登入')
        // 可以在這裡加入跳轉邏輯，例如：
        // window.location.href = '/login'
      }
      return null
    }
  }

  //  查詢訂單列表
  const fetchOrders = async (page = 1, memberId = null) => {
    try {
      loading.value = true
      error.value = null

      const targetMemberId = memberId || getMemberId()
      
      if (!targetMemberId || targetMemberId <= 0) {
        throw new Error('無效的會員ID')
      }

      const response = await fetch(`${apiBaseUrl.value}/get_orders.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: targetMemberId,
          page: page
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || '查詢訂單失敗')
      }

      //  更新狀態
      orders.value = data.data.orders || []
      currentPage.value = data.data.pagination.current_page
      totalPages.value = data.data.pagination.total_pages
      totalOrders.value = data.data.pagination.total_orders
      perPage.value = data.data.pagination.per_page

      console.log('✅ 訂單查詢成功:', {
        訂單數量: orders.value.length,
        當前頁面: currentPage.value,
        總頁數: totalPages.value,
        總訂單數: totalOrders.value
      })

      return data.data

    } catch (err) {
      console.error('❌ 查詢訂單失敗:', err)
      error.value = err.message || '查詢訂單失敗'
      
      //  錯誤時清空訂單列表
      orders.value = []
      currentPage.value = 1
      totalPages.value = 0
      totalOrders.value = 0
      
      throw err
    } finally {
      loading.value = false
    }
  }

  //  切換頁面
  const goToPage = async (page) => {
    if (page < 1 || page > totalPages.value) {
      console.warn('⚠️ 無效的頁碼:', page)
      return
    }
    
    await fetchOrders(page)
  }

  //  上一頁
  const previousPage = async () => {
    if (currentPage.value > 1) {
      await goToPage(currentPage.value - 1)
    }
  }

  //  下一頁
  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  //  重新載入當前頁面
  const refresh = async () => {
    await fetchOrders(currentPage.value)
  }

  //  計算屬性
  const hasOrders = computed(() => orders.value.length > 0)
  const hasPreviousPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  
  //  分頁按鈕列表 (最多顯示5個按鈕)
  const pageNumbers = computed(() => {
    const pages = []
    const maxButtons = 5
    const total = totalPages.value
    const current = currentPage.value

    if (total <= maxButtons) {
      // 總頁數少於等於5頁，顯示全部
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 總頁數超過5頁，智慧顯示
      let start = Math.max(1, current - 2)
      let end = Math.min(total, start + maxButtons - 1)
      
      // 如果結尾頁碼太少，調整開始頁碼
      if (end - start < maxButtons - 1) {
        start = Math.max(1, end - maxButtons + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  })

  //  根據訂單ID查找訂單
  const findOrderById = (orderId) => {
    return orders.value.find(order => order.ID === orderId || order.ID === String(orderId))
  }

  //  根據訂單編號查找訂單
  const findOrderByNumber = (orderNumber) => {
    return orders.value.find(order => order.ORDER_NUMBER === orderNumber)
  }

  //  取得訂單狀態統計
  const getStatusStats = computed(() => {
    const stats = {
      total: orders.value.length,
      pending: 0,
      confirmed: 0,
      packing: 0,
      delivering: 0,
      finished: 0
    }

    orders.value.forEach(order => {
      const status = order.ORDERS_STATUS?.toUpperCase()
      switch (status) {
        case 'PENDING':
        case 'PD':
          stats.pending++
          break
        case 'CONFIRMED':
        case 'CO':
          stats.confirmed++
          break
        case 'PACKING':
        case 'PC':
          stats.packing++
          break
        case 'DELIVERING':
        case 'DV':
          stats.delivering++
          break
        case 'FINISHED':
        case 'FN':
          stats.finished++
          break
      }
    })

    return stats
  })

  //  清空狀態
  const reset = () => {
    orders.value = []
    currentPage.value = 1
    totalPages.value = 0
    totalOrders.value = 0
    loading.value = false
    error.value = null
  }

  //  初始化 (載入第一頁)
  const initialize = async (memberId = null) => {
    try {
      console.log('🚀 初始化訂單列表...')
      await fetchOrders(1, memberId)
    } catch (err) {
      console.error('❌ 初始化訂單列表失敗:', err)
    }
  }

  return {
    // 狀態
    orders,
    currentPage,
    totalPages,
    totalOrders,
    perPage,
    loading,
    error,

    // 計算屬性
    hasOrders,
    hasPreviousPage,
    hasNextPage,
    pageNumbers,
    getStatusStats,

    // 方法
    fetchOrders,
    goToPage,
    previousPage,
    nextPage,
    refresh,
    findOrderById,
    findOrderByNumber,
    reset,
    initialize
  }
})
