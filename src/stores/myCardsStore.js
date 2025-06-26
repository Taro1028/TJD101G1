import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 嘗試導入 memberStore（如果失敗也不影響運作）
let useMemberStore
try {
  const memberStoreModule = await import('@/stores/MemberStore')
  useMemberStore = memberStoreModule.useMemberStore
} catch (e) {
  console.warn('⚠️ 無法導入 MemberStore，將使用其他方式取得會員ID')
}

export const useMyCardsStore = defineStore('myCards', () => {
  // ===== 狀態管理 =====
  const cards = ref([])                    // 小卡列表
  const currentPage = ref(1)               // 當前頁面
  const totalPages = ref(0)                // 總頁數
  const totalItems = ref(0)                // 總小卡數
  const perPage = ref(6)                   // 每頁顯示數量
  const loading = ref(false)               // 載入狀態
  const error = ref(null)                  // 錯誤訊息

  // ===== 環境設定 =====
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  
  // 動態 API 端點
  const apiBaseUrl = computed(() => {
    if (isDevelopment) {
      return 'http://localhost/tjd101/g1/php'
    } else {
      return 'https://tibamef2e.com/tjd101/g1/php'
    }
  })

  // ===== 計算屬性 =====
  
  // 是否有上一頁
  const hasPreviousPage = computed(() => currentPage.value > 1)
  
  // 是否有下一頁
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  
  // 是否有小卡資料
  const hasCards = computed(() => cards.value.length > 0)
  
  // 是否為空狀態
  const isEmpty = computed(() => !loading.value && cards.value.length === 0)

  // ===== 工具方法 =====
  
  // 取得會員ID (動態從多個來源獲取)
  const getMemberId = () => {
    try {
      // 方法1: 嘗試從 memberStore 獲取
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
      
      // 方法4: 開發環境預設值
      if (isDevelopment) {
        console.warn('⚠️ 開發環境：使用預設會員ID = 1')
        return 1
      }
      
      throw new Error('無法取得會員ID，請確認是否已登入')
      
    } catch (error) {
      console.error('取得會員ID失敗:', error)
      if (!isDevelopment) {
        console.error('生產環境無法取得會員ID，需要重新登入')
      }
      return null
    }
  }

  // 組合完整的圖片 URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''
    
    // 如果已經是完整 URL，直接回傳
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // 組合完整的圖片 URL
    const baseUrl = isDevelopment 
      ? 'http://localhost/tjd101/g1/' 
      : 'https://tibamef2e.com/tjd101/g1/'
    
    // 確保路徑格式正確
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
    
    return baseUrl + cleanPath
  }

  // ===== 狀態控制方法 =====
  
  // 設定載入狀態
  const setLoading = (status) => {
    loading.value = status
  }

  // 設定錯誤狀態
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  // 清除錯誤狀態
  const clearError = () => {
    error.value = null
  }

  // 重置所有狀態
  const resetState = () => {
    cards.value = []
    currentPage.value = 1
    totalPages.value = 0
    totalItems.value = 0
    loading.value = false
    error.value = null
  }

  // ===== 主要 API 方法 =====
  
  // 載入小卡列表
  const fetchCards = async (page = 1, memberId = null) => {
    try {
      setLoading(true)
      clearError()

      const targetMemberId = memberId || getMemberId()
      
      if (!targetMemberId || targetMemberId <= 0) {
        throw new Error('無效的會員ID')
      }

      // console.log('🔍 載入小卡清單，會員ID:', targetMemberId, '頁面:', page)

      const apiUrl = `${apiBaseUrl.value}/get_member_cards.php?m_id=${targetMemberId}&page=${page}`
      
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || data.message || '載入小卡失敗')
      }

      // 更新狀態
      const responseData = data.data || {}
      
      cards.value = (responseData.cards || []).map(card => ({
        ...card,
        // 處理圖片 URL
        imageUrl: getImageUrl(card.image_path),
        originalImagePath: card.image_path
      }))
      
      currentPage.value = responseData.pagination?.current_page || 1
      totalPages.value = responseData.pagination?.total_pages || 0
      totalItems.value = responseData.pagination?.total_items || 0
      perPage.value = responseData.pagination?.per_page || 6

      // console.log('✅ 小卡載入成功:', {
      //   小卡數量: cards.value.length,
      //   當前頁面: currentPage.value,
      //   總頁數: totalPages.value,
      //   總小卡數: totalItems.value
      // })

      return responseData

    } catch (err) {
      console.error('❌ 載入小卡失敗:', err)
      setError(err.message || '載入小卡失敗')
      
      // 錯誤時清空小卡列表
      cards.value = []
      currentPage.value = 1
      totalPages.value = 0
      totalItems.value = 0
      
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== 分頁控制方法 =====
  
  // 跳轉到指定頁面
  const goToPage = async (page) => {
    if (page < 1 || page > totalPages.value) {
      console.warn('⚠️ 無效的頁碼:', page)
      return
    }
    
    await fetchCards(page)
  }

  // 上一頁
  const previousPage = async () => {
    if (hasPreviousPage.value) {
      await goToPage(currentPage.value - 1)
    }
  }

  // 下一頁
  const nextPage = async () => {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  // 重新載入當前頁面
  const refreshCurrentPage = async () => {
    await fetchCards(currentPage.value)
  }

  // ===== 初始化方法 =====
  
  // 初始化小卡資料
  const initialize = async (memberId = null) => {
    try {
      // console.log('🚀 初始化小卡 Store...')
      await fetchCards(1, memberId)
    } catch (error) {
      console.error('❌ 初始化小卡 Store 失敗:', error)
      // 不重新拋出錯誤，讓組件可以處理空狀態
    }
  }

  // ===== 回傳 Store API =====
  return {
    // 狀態
    cards,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    loading,
    error,
    
    // 計算屬性
    hasPreviousPage,
    hasNextPage,
    hasCards,
    isEmpty,
    
    // 方法
    fetchCards,
    goToPage,
    previousPage,
    nextPage,
    refreshCurrentPage,
    initialize,
    resetState,
    setLoading,
    setError,
    clearError,
    getImageUrl,
    getMemberId
  }
})