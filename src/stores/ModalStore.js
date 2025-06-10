// src/stores/ModalStore.js
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    // 登入彈窗狀態
    showLoginPopup: false,
    // 登入後要重定向的路徑
    redirectPath: '',
    // 彈窗訊息（可選）
    loginMessage: ''
  }),
  
  getters: {
    // 檢查是否有重定向路徑
    hasRedirectPath: (state) => !!state.redirectPath
  },
  
  actions: {
    // 顯示登入彈窗
    openLoginPopup(redirectTo = '/Home', message = '請先登入才能繼續使用此功能') {
      this.showLoginPopup = true
      this.redirectPath = redirectTo
      this.loginMessage = message
      console.log('顯示登入彈窗，重定向路徑:', redirectTo)
    },
    
    // 關閉登入彈窗
    closeLoginPopup() {
      this.showLoginPopup = false
      this.redirectPath = ''
      this.loginMessage = ''
      console.log('關閉登入彈窗')
    },
    
    // 清除重定向路徑（登入成功後使用）
    clearRedirectPath() {
      this.redirectPath = ''
    }
  }
})