<script setup>
import { useModalStore } from '@/stores/ModalStore'

const modalStore = useModalStore()

// 關閉彈窗函數（點擊背景時使用）
const handleClose = () => {
  modalStore.closeSuccessPopup()
}

// 返回收件者管理（點擊按鈕時關閉彈窗）
const handleGoToRecipients = () => {
  // 點擊按鈕時立即關閉彈窗
  modalStore.closeSuccessPopup()
}
</script>

<template>
  <div v-if="modalStore.showSuccessPopup" class="overlay" @click="handleClose">
    <div class="alertlogin" @click.stop>
      <img src="../assets/images/Logo_L.svg" alt="">
      <h5>{{ modalStore.successMessage }}</h5>
      <router-link to="/MemberCenter/Recipients" class="btn" @click="handleGoToRecipients">返回收件者管理</router-link>
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