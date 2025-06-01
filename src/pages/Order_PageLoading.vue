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
    <div class="headline">
        <h1>自由搭配<span class="decorate"></span></h1>
        <ul class="step">
            <li class="finish"><span class="finishspan">1</span>選擇主菜</li>
            <li class="finish"><span class="finishspan">2</span>選擇副菜</li>
            <li><span>3</span>確認菜單</li>
        </ul>
        <a href="#">回主選單</a>
    </div>
    <div class="wrapper">
        <div class="loading">
            <img src="../assets/images/Order/loading.svg" alt="">
            <h3>隨機產生菜單...</h3>
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
    min-height: calc(100vh - 60px - 135px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.headline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 1160px;
    margin: 40px auto;
}

h1 {
    margin: 0;
    font-size: $font_h1;
    position: relative;
}

.decorate {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: $primary_600;
    position: absolute;
    left: 0;
    top: -2px;
    z-index: -1;
}

.step {
    display: flex;
    gap: 64px;
}

.step li {
    font-size: $font_h3;
    align-items: center;
    display: flex;
    color: $neutral_300;
}

.step .finish {
    color: $neutral_700;
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
    background-color: $neutral_700;
}

.headline a {
    text-decoration: none;
    color: $neutral_700;
    background-color: $primary_100;
    border: 1px solid $primary_100;
    padding: 12px 24px;
    border-radius: 24px;
    transition: 0.3s ease;
    opacity: 0;
    cursor: default;

    &:hover {
        background-color: transparent;
        border: 1px solid $neutral_700;
        transition: 0.3s ease;
    }
}

.loading{
    width: 282px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

h3{
    font-size: $font_h3;
    color: $neutral_700;
}

@media screen and (max-width: 1200px) {
.wrapper{
    min-height: calc(100vh - 60px - 140px);
}

.headline {
    width: 800px;
    flex-direction: column;
    align-items: start;
    gap: 40px;
}

.headline a{
    display: none;
}

.step {
    align-self: center;
    gap: 16px;
}

.loading{
    margin-bottom: 160px;
}

}

@media screen and (max-width: 850px){
.wrapper{
    min-height: calc(100vh - 60px - 140px);

}

.headline {
    width: 340px;
    gap: 40px;
}

.step{
    gap: 8px;
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

}

@media screen and (max-width: 580px){
.wrapper{
    min-height: calc(100vh - 60px - 180px);
    align-items: start;
}

h1{
    font-size: $font_h3;
}

.decorate{
    width: 60px;
    height: 60px;
}

.loading{
    margin: 80px;
}

img{
    width: 80px;
    height: 80px;
}

h3{
    font-size: $font_h4;
}

}

</style>