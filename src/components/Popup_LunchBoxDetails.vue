<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import foodData from '@/data/LunchBoxItems.json'

// 接收父元件傳來的單筆 menu 資料
const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
})

// 選中的 dish index
const activeDishIndex = ref(0)  

// 要 new URL 圖片字串
const getImageUrl = (fileName) => {
    return new URL(`../assets/images/Order/${fileName}`, import.meta.url).href
}

function toggleDish(index) {
    activeDishIndex.value = activeDishIndex.value === index ? null : index
}

// 手風琴效果
function beforeEnter(el) {
    el.style.height = '0'
    el.style.opacity = '0'
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
}

function enter(el) {
    const height = el.scrollHeight
    el.style.height = height + 'px'
    el.style.opacity = '1'
}

function afterEnter(el) {
    el.style.height = 'auto' // 避免展開後被限制高度
}

function leave(el) {
    el.style.height = el.scrollHeight + 'px' // 設定初始高度以開始過渡
    el.offsetHeight // 觸發 reflow（必要）
    el.style.height = '0'
    el.style.opacity = '0'
}

// 關閉視窗
const emit = defineEmits(['close'])

function closePopup() {
    emit('close')
}
</script>

<template>
    <div class="overlay">
        <div class="detailCard">
            <button class="closebtn" @click="closePopup"><i class="bi bi-x-circle"></i></button>
            <div class="intro">
                <h4>{{ menu.title }}</h4>
                <h6>{{ menu.description }}</h6>
                <ul class="ingredients">
                    <li v-for="(item, i) in menu.ingredients" :key="i">
                        <img :src="getImageUrl(item.icon)" :alt="item.label" />
                        <p>{{ item.label }}</p>
                    </li>
                </ul>
            </div>
            <div class="info">
                <div class="img_price">
                    <img :src="getImageUrl(menu.boximage)" :alt="menu.title" />
                    <h5>售價 ${{ menu.price }}</h5>
                </div>
                <div class="infotxtblock">
                    <div class="infotxt" v-for="(dish, index) in menu.dishes" :key="index">
                        <div class="foodtitle" @click="toggleDish(index)">
                            <h5>{{ dish.name }}</h5>

                            <i :class="activeDishIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'"></i>

                        </div>
                        <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @leave="leave">
                            <div class="foodtxt" v-show="activeDishIndex === index">
                                <h6>{{ dish.description }}</h6>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
}

.detailCard {
    width: 640px;
    margin: auto;
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
    background-color: $neutral_white;
    border: 1px solid $neutral_100;
    border-radius: 8px;
    position: relative;
}

.closebtn {
    position: absolute;
    right: 24px;
    top: 20px;
    background-color: transparent;
    border: none;
    width: 32px;
    height: 32px;
    padding: 0;

    &:hover {
        cursor: pointer;
    }
}

.closebtn i {
    font-size: 24px;
}

.intro {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.intro h4 {
    font-size: $font_h4;
    margin: 0;
}

.intro h6 {
    font-size: $font_h6;
    margin: 0;
    font-weight: normal;
}

.ingredients {
    margin: 0;
    display: flex;
    gap: 32px;
}

.ingredients li {
    display: flex;
    gap: 4px;
}

.ingredients p {
    margin: 0;
}

.info {
    width: 640px;
    display: flex;
    gap: 64px;
}

.img_price {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.img_price img {
    display: block;
    width: 240px;
    height: 240px;
}

.img_price h5 {
    margin: 0;
    font-size: $font_h5;
}

.infotxtblock {
    width: 336px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.infotxt {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.foodtitle {
    display: flex;
    justify-content: space-between;

    &:hover{
        cursor: pointer;
    }

    &:hover h5{
    opacity: .6;
    }
}

.foodtitle i {
    cursor: pointer;
}

.foodtitle h5 {
    font-size: $font_h5;
    transition: 0.3s ease;
}

.foodtxt h6 {
    font-size: $font_h6;
    font-weight: normal;
    margin: 0;
}

.hidden {
    display: none;
}

// --- RWD ---
@media screen and (max-width: 780px) {

    .detailCard {
        width: 300px;
        max-height: 90vh;
        overflow-y: auto;
        gap: 20px;
        padding: 24px;
    }

    .ingredients {
        flex-direction: column;
        gap: 8px;
    }

    .info {
        width: 300px;
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }

    .infotxtblock {
        width: 300px;
    }

    .img_price img {
        width: 160px;
        height: 160px;
        align-self: center;
    }

    .foodtxt h6 {
        text-align: left;
    }

}
</style>