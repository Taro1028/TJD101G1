import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useRecipientsStore = defineStore('recipients', () => {
  // 載入狀態
  const loading = ref(false)
  const error = ref(null)

  // 三個收件人的資料結構
  const recipients = reactive({
    recipient1: {
      id: null,
      name: '',
      address: '',
      telephone: '',
      phone: '',
      contactsName: '',
      contactsPhone: '',
      note: ''
    },
    recipient2: {
      id: null,
      name: '',
      address: '',
      telephone: '',
      phone: '',
      contactsName: '',
      contactsPhone: '',
      note: ''
    },
    recipient3: {
      id: null,
      name: '',
      address: '',
      telephone: '',
      phone: '',
      contactsName: '',
      contactsPhone: '',
      note: ''
    }
  })

  // 重置特定收件人資料
  const resetRecipient = (recipientKey) => {
    recipients[recipientKey] = {
      id: null,
      name: '',
      address: '',
      telephone: '',
      phone: '',
      contactsName: '',
      contactsPhone: '',
      note: ''
    }
  }

  // 重置所有收件人資料
  const resetAllRecipients = () => {
    resetRecipient('recipient1')
    resetRecipient('recipient2')
    resetRecipient('recipient3')
  }

  // 設定特定收件人資料
  const setRecipient = (recipientKey, data) => {
    recipients[recipientKey] = {
      id: data.id || null,
      name: data.name || '',
      address: data.address || '',
      telephone: data.telephone || '',
      phone: data.phone || '',
      contactsName: data.contactsName || '',
      contactsPhone: data.contactsPhone || '',
      note: data.note || ''
    }
  }

  // 獲取特定收件人資料
  const getRecipient = (recipientKey) => {
    return recipients[recipientKey]
  }

  // 檢查收件人是否有資料
  const hasRecipientData = (recipientKey) => {
    const recipient = recipients[recipientKey]
    return recipient.name !== '' || recipient.address !== '' || recipient.phone !== ''
  }

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

  // API 調用方法
  const loadRecipientsFromAPI = async (memberId) => {
    try {
      setLoading(true)
      clearError()

      // 獲取 API URL
      const env = import.meta.env.VITE_API_URL || 'http://localhost'
      const apiUrl = `${env}/tjd101/g1/php/getRecipients.php?member_id=${memberId}`
      
      // console.log('🔍 載入收件人資料，API URL:', apiUrl)
      // console.log('🆔 會員ID:', memberId)

      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      // console.log('📋 API 回傳結果:', result)

      if (!result.success) {
        throw new Error(result.message || '載入收件人資料失敗')
      }

      // 重置所有收件人資料
      resetAllRecipients()

      // 設定從 API 載入的資料
      const data = result.data || {}
      
      if (data.recipient1) {
        setRecipient('recipient1', data.recipient1)
      }
      if (data.recipient2) {
        setRecipient('recipient2', data.recipient2)
      }
      if (data.recipient3) {
        setRecipient('recipient3', data.recipient3)
      }

      // console.log('✅ 收件人資料載入完成')
      // console.log('📊 載入的資料:', {
      //   recipient1: data.recipient1 || '無資料',
      //   recipient2: data.recipient2 || '無資料', 
      //   recipient3: data.recipient3 || '無資料'
      // })

    } catch (error) {
      console.error('❌ 載入收件人資料失敗:', error)
      setError('載入收件人資料失敗，請重試')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 儲存收件人資料到 API
  const saveRecipientToAPI = async (memberId, recipientKey, recipientData) => {
    try {
      setLoading(true)
      clearError()

      // 獲取 API URL
      const env = import.meta.env.VITE_API_URL || 'http://localhost'
      const apiUrl = `${env}/tjd101/g1/php/saveRecipient.php`
      
      // console.log('💾 儲存收件人資料，API URL:', apiUrl)
      // console.log('🆔 會員ID:', memberId)
      // console.log('📝 收件人資料:', recipientData)

      // 準備要傳送的資料
      const saveData = {
        member_id: memberId,
        id: recipientData.id || 0, // 0 表示新增，有值表示更新
        name: recipientData.name || '',
        address: recipientData.address || '',
        telephone: recipientData.telephone || '',
        phone: recipientData.phone || '',
        contacts_name: recipientData.contactsName || '',
        contacts_phone: recipientData.contactsPhone || '',
        note: recipientData.note || ''
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      // console.log('📋 API 儲存結果:', result)

      if (!result.success) {
        throw new Error(result.message || '儲存收件人資料失敗')
      }

      // 如果是新增，更新本地的 ID
      if (result.data && result.data.action === 'insert') {
        recipients[recipientKey].id = result.data.id
        // console.log('✅ 新增成功，更新 ID:', result.data.id)
      }

      // console.log('✅ 收件人資料儲存成功')
      return result

    } catch (error) {
      console.error('❌ 儲存收件人資料失敗:', error)
      setError('儲存收件人資料失敗，請重試')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    // 狀態
    loading,
    error,
    recipients,
    
    // 方法
    resetRecipient,
    resetAllRecipients,
    setRecipient,
    getRecipient,
    hasRecipientData,
    setLoading,
    setError,
    clearError,
    loadRecipientsFromAPI,
    saveRecipientToAPI 
  }
})