<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('custom-bg')
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

</script>
<template>
<FrontLayout>
    <div class="wrapper">
        <div class="messageCard">
            <img src="../assets/images/Order/cart_bag.svg" alt="">
            <h3>已加入購物車</h3>
            <h5>您訂購的餐點已添加至購物車</h5>
            <div class="btnblock">
            <button class="btn-1">繼續訂餐</button>
            <button class="btn-2">前往結帳</button>
            </div>
        </div>
    </div>
</FrontLayout>
</template>

<style>
.custom-bg{
background-image: url(../assets/images/Order/background.svg);
}
</style>
<style scoped lang="scss">

.wrapper{
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.messageCard{
    width: 282px;
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
    font-size: $font_h3;
}

h5{
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