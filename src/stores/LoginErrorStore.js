// src/stores/LoginErrorStore.js
import { defineStore } from 'pinia'

export const useLoginErrorStore = defineStore('loginError', {
  state: () => ({
    // 登入失敗彈窗狀態
    showLoginErrorPopup: false,
    // 錯誤訊息
    errorMessage: '登入失敗，請確認帳號密碼是否正確，或使用忘記密碼功能'
  }),
  
  actions: {
    // 顯示登入失敗彈窗
    openLoginErrorPopup(message = '登入失敗\n請確認帳號密碼是否正確\n或使用忘記密碼功能') {
      this.showLoginErrorPopup = true
      this.errorMessage = message
    },
    
    // 關閉登入失敗彈窗
    closeLoginErrorPopup() {
      this.showLoginErrorPopup = false
      this.errorMessage = ''
    }
  }
})