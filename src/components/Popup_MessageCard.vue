<script setup>
// import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goNext() {
//   if (!canProceed.value) return

//   // 把資料存在 localStorage（或改用 pinia）
//   localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes.value))

  // 導向下一頁
  router.push('/Order/AddCart')
}

function goMessage() {
//   if (!canProceed.value) return

//   // 把資料存在 localStorage（或改用 pinia）
//   localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes.value))

  // 導向下一頁
  router.push('/Order/MessageCards')
}

</script>
<template>
<div class="overlay">
    <div class="messageCard">
        <img src="../assets/images/Order/card.svg" alt="">
        <h3>需要留言小卡嗎?</h3>
        <h5>會與配送餐點一併送達</h5>
        <div class="btnblock">
        <button class="btn-1" @click="goNext">不用，謝謝</button>
        <button class="btn-2" @click="goMessage">我要留言</button>
        </div>
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

.messageCard{
    width: 282px;
    margin: auto;
    padding: 24px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

h3{
    margin: 0;
    font-size: $font_h3;
}

h5{
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.btnblock{
    display: flex;
    gap: 40px;
}

.btn-1{
    background-color: $neutral_300;
    color: $neutral_700;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;


    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_700;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
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