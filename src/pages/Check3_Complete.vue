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
        <div class="shop">
            <img src="../assets/images/Order/cart_bag.svg" alt="">
            <h2>Tiba<span class="eat">EAT</span> | 購物車</h2>
        </div>
    <ul class="step">
        <li class="finish"><span class="finishspan">1</span>訂單資料</li>
        <li class="finish"><span class="finishspan">2</span>付款資料</li>
        <li class="finish"><span class="finishspan">3</span>完成結帳</li>
    </ul>
    <div class="orderpaper">
        <div class="info">
            <div class="title">
                <i class="bi bi-check-circle"></i>
                <h3>訂單完成</h3>
            </div>
            <h4>感謝您的訂購與支持，我們將處理您的訂單</h4>
            <div class="receipt">
                <h5>訂單編號： 2506071</h5>
                <h5>訂單項目： 為你搭配 + 小卡 / 50份餐盒</h5>
                <h5>配送時間： 2025.06.07 — 2025.06.13 午間配送 (7日)</h5>
                <h5>收貨人： 林榮傑</h5>
                <h5>手機： 0987-078-587</h5>
                <h5>地址： 104 臺北市中山區南京東路三段</h5>
            </div>
            <div class="btnblock">
            <button class="btn-1">查看訂單</button>
            <router-link to="/Order" class="btn-2">繼續訂餐</router-link>
            </div>
        </div>
        <div class="slogan">
            <img src="../assets/images/Logo_L.svg" alt="">
            <h4>吃得下、吃得好，是我們的堅持。</h4>
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
    width: 900px;
    margin: 40px auto 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.shop{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: $neutral_black;
}

.shop img{
    width: 48px;
}

.shop h2{
    font-size: $font_h2;
    font-weight: bold;
}

.eat{
  color: $primary_600;
}

.step {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 64px;
}

.step li {
    font-size: $font_h3;
    align-items: center;
    display: flex;
    color: $neutral_300;
}

.step .finish {
    color: $neutral_black;
}

.step span {
    display: block;
    font-size: $font_h5;
    margin-right: 8px;
    line-height: 2.25rem;
    width: 40px;
    height: 40px;
    background-color: $neutral_300;
    border-radius: 50%;
    text-align: center;
    color: $neutral_white;
}

.step .finishspan {
    background-color: $success_400;
}

.orderpaper{
    margin: 40px auto;
    width: 520px;
    padding: 24px 32px;
    background-color: $neutral_white;
    display: flex;
    flex-direction: column;
    gap: 64px;
    border: 1px solid $neutral_100;
    border-radius: 8px;
}

.info{
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.title{
    display: flex;
    align-items: center;
    gap: 20px;
}

.title h3{
    font-size: $font_h3;
    font-weight: normal;
}

.title i{
    font-size: $font_h1;
    color: $primary_400;
}

h4{
    font-size: $font_h4;
    font-weight: normal;
}

.receipt{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.receipt h5{
    font-size: $font_h5;
    font-weight: normal;
}

.btnblock{
    display: flex;
    gap: 40px;
    justify-content: end;
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
    color: $neutral_black;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;
    text-decoration: none;

    &:hover{
    background-color: transparent;
    color: $neutral_black;
    }
}

.slogan{
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.slogan img{
    display: block;
    width: 313px;
}

.slogan h4{
    font-size: $font_h4;
    font-weight: bold;
}

@media screen and (max-width: 950px){
.wrapper{
    width: 500px;
}

.step {
    gap: 16px;
}

.step li {
    font-size: $font_h5;
}

.step span {
    font-size: $font_h6;
    margin-right: 8px;
    line-height: 16px;
    width: 20px;
    height: 20px;
}

.orderpaper{
    width: 400px;
    margin: 20px;
    padding: 20px;
}
}

@media screen and (max-width: 550px){
.wrapper{
    width: 340px;
}

.shop{
    gap: 12px;
}

.shop h2{
    font-size: $font_h3;
}

.shop img{
    width: 40px;
}

.step {
    gap: 8px;
    
}

.orderpaper{
    width: 310px;
    padding: 16px;
    gap: 20px;
}

.title{
    gap: 12px;
}

.title h2,
.title i{
    font-size: $font_h3;
}

.receipt h5{
    font-size: $font_h6;
}

.btnblock{
    justify-content: center;
}

.slogan img{
    width: 280px;
}

.slogan h4{
    font-size: $font_h5;
}

}

</style>