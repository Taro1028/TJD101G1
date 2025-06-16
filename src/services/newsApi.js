// src/services/newsApi.js - 測試版本
const env = import.meta.env.VITE_API_URL || 'http://localhost'
const API_BASE = '/tjd101/g1/php'

// 統一的 fetch 包裝函數
const apiRequest = async (url, options = {}) => {
  const fullUrl = `${env}${API_BASE}${url}`

  console.log('🔗 發送請求到:', fullUrl)

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    console.log('📡 回應狀態:', response.status, response.statusText)
    console.log('📋 回應標頭:', [...response.headers.entries()])

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 先取得原始文字
    const rawText = await response.text()
    console.log('📄 原始回應前100字元:', rawText.substring(0, 100))
    console.log('📄 原始回應後100字元:', rawText.substring(Math.max(0, rawText.length - 100)))

    // 檢查是否包含 HTML
    if (rawText.includes('<!DOCTYPE') || rawText.includes('<html')) {
      console.error('❌ 回應包含 HTML!')
      throw new Error('伺服器回傳 HTML 而非 JSON')
    }

    // 嘗試解析 JSON
    let data
    try {
      data = JSON.parse(rawText)
      console.log('✅ JSON 解析成功')
    } catch (jsonError) {
      console.error('❌ JSON 解析失敗:', jsonError.message)
      console.error('📄 完整回應內容:', rawText)
      throw new Error(`JSON 解析失敗: ${jsonError.message}`)
    }

    // 檢查後端回傳的錯誤
    if (data.error) {
      throw new Error(data.message || '請求失敗')
    }

    console.log('📦 最終資料:', data)
    return { data }

  } catch (error) {
    console.error('❌ API 請求錯誤:', error)
    throw error
  }
}

// 建立查詢參數字串
const buildQueryString = (params) => {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  })

  const queryString = queryParams.toString()
  console.log('🔍 查詢參數:', queryString)
  return queryString
}

export const newsApi = {
  // 測試連線
  test: async () => {
    console.log('🧪 執行連線測試...')
    return apiRequest('/test_response.php')
  },

  // 獲取特定標籤的新聞 (News.vue 需要)
  getNewsByTag: async (tag, limit = 10) => {
    console.log('📰 載入分類新聞:', { tag, limit })
    const queryString = buildQueryString({ tag, limit })
    return apiRequest(`/news_by_tag.php?${queryString}`)
  },

  // 獲取單篇新聞詳情 (Newsitem.vue 需要)
  getNewsDetail: async (id) => {
    console.log('📄 載入新聞詳情:', { id })
    const queryString = buildQueryString({ id })
    return apiRequest(`/news_detail.php?${queryString}`)
  }
}

// 工具函數
export const newsUtils = {
  // 格式化日期
  formatDate: (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  },

  // 獲取標籤顯示名稱
  getTagDisplayName: (tag) => {
    const tagMap = {
      'focus': '焦點計畫',
      'depth': '深度專題',
      'lunch': '誰來午餐',
      '焦點計畫': '焦點計畫',
      '深度專題': '深度專題',
      '誰來午餐': '誰來午餐'
    }
    return tagMap[tag] || tag
  },

  // 處理 API 錯誤的顯示訊息
  getErrorMessage: (error) => {
    if (error.message.includes('Failed to fetch')) {
      return '網路連線問題，請檢查網路狀態'
    } else if (error.message.includes('404')) {
      return '找不到資源'
    } else if (error.message.includes('500')) {
      return '伺服器錯誤，請稍後再試'
    } else {
      return error.message || '發生未知錯誤'
    }
  }
}