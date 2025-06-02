<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted } from 'vue'

// 背景圖
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
        <div class="operate">
        </div>
    </FrontLayout>
</template>

<style>
.custom-bg {
    background-image: url(../assets/images/Order/background.svg);
}
</style>
<style scoped lang="scss">
// --- 標題 + 步驟 ---
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


    &:hover {
        background-color: transparent;
        border: 1px solid $neutral_700;
        transition: 0.3s ease;
    }
}

// 操作區
.operate {
    width: 945px;
    margin: 0 auto 64px;
    display: flex;
    gap: 100px;
}

// --- RWD ---
@media screen and (max-width: 1200px) {}
</style>