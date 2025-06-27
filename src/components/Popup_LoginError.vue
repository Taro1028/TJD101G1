<script setup>
import { useLoginErrorStore } from '@/stores/LoginErrorStore'

const loginErrorStore = useLoginErrorStore()

// 關閉彈窗函數（點擊背景時使用）
const handleClose = () => {
  loginErrorStore.closeLoginErrorPopup()
}

// 前往忘記密碼頁面（點擊按鈕時關閉彈窗）
const handleGoToForgotPassword = () => {
  // 點擊按鈕時立即關閉彈窗
  loginErrorStore.closeLoginErrorPopup()
}
</script>

<template>
  <div v-if="loginErrorStore.showLoginErrorPopup" class="overlay" @click="handleClose">
    <div class="alertlogin" @click.stop>
      <img src="../assets/images/Logo_L.svg" alt="">
      <h5>{{ loginErrorStore.errorMessage }}</h5>
      <router-link to="/ForgotPassword" class="btn" @click="handleGoToForgotPassword">前往忘記密碼</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
}

.alertlogin{
    width: 313px;
    margin: auto;
    padding: 24px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
}

h3{
    font-size: $font_h3;
}

h5{
    font-size: $font_h5;
    font-weight: normal;
    text-align: center;          
    white-space: pre-line;        
}

.btn{
    background-color: $neutral_black;
    color: $neutral_white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}
</style>