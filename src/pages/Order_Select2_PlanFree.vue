<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import LeaveDialog from '@/components/Popup_OrderLeaveDialog.vue'

// 背景圖
onMounted(() => {
    document.body.classList.add('custom-bg')
})

onUnmounted(() => {
    document.body.classList.remove('custom-bg')
})


const dishes = [
  {
    img: new URL('@/assets/images/Order/sidedish1.jpg', import.meta.url).href,
    text: ['蒜蓉花椰菜', '炒高麗菜', '醋拌黑木耳']
  },
  {
    img: new URL('@/assets/images/Order/sidedish2.jpg', import.meta.url).href,
    text: ['蕃茄炒蛋', '金沙南瓜', '蒜炒空心菜']
  },
  {
    img: new URL('@/assets/images/Order/sidedish3.jpg', import.meta.url).href,
    text: ['鐵板豆芽菜', '蔥花炒蛋', '川燙青江菜']
  },
  {
    img: new URL('@/assets/images/Order/sidedish4.jpg', import.meta.url).href,
    text: ['川燙地瓜葉', '乾煸四季豆', '紅蘿蔔炒蛋']
  },
  {
    img: new URL('@/assets/images/Order/sidedish5.jpg', import.meta.url).href,
    text: ['香滷筍絲', '豆干炒芹菜', '炒三色椒']
  },
  {
    img: new URL('@/assets/images/Order/sidedish6.jpg', import.meta.url).href,
    text: ['醋拌小黃瓜', '蒜香薯丁', '椒鹽杏鮑菇']
  },
  {
    img: new URL('@/assets/images/Order/sidedish7.jpg', import.meta.url).href,
    text: ['酥炸豆腐', '涼拌海帶絲', '蒜炒菠菜']
  },
  {
    img: new URL('@/assets/images/Order/sidedish8.jpg', import.meta.url).href,
    text: ['麻婆豆腐', '香滷白菜', '玉米粒炒蛋']
  },
  
]

// Props & Emit
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:modelValue'])

// 本地選取資料
const selectedDishes = ref([...props.modelValue])

function toggleDish(index) {
  const i = selectedDishes.value.indexOf(index)
  if (i > -1) {
    selectedDishes.value.splice(i, 1)
  } else if (selectedDishes.value.length < 5) {
    selectedDishes.value.push(index)
  }
}

function isDisabled(index) {
  return selectedDishes.value.length >= 5 && !selectedDishes.value.includes(index)
}

// 判斷符合 下一步 條件
const canProceed = computed(() => selectedDishes.value.length === 5)

const router = useRouter()
function goNext() {
    if (!canProceed.value) return
    localStorage.setItem('selectedSideDishes', JSON.stringify(selectedDishes.value))
    router.push('/Order/Loading')

}

// Popup
const showPopup = ref(null)

function openPopup(value) {
    showPopup.value = value
}

function closePopup() {
    showPopup.value = null
}

</script>

<template>
    <FrontLayout>
        <div class="headline">
            <div class="title-btn">
                <h1>自由搭配<span class="decorate"></span></h1>
                <div><a class="mobile" @click="openPopup('leave')">回主選單</a>
                <LeaveDialog v-if="showPopup === 'leave'" @close="closePopup" />
                </div>
            </div>
            <ul class="step">
                <li class="finish"><span class="finishspan">1</span>選擇主菜</li>
                <li class="finish"><span class="finishspan">2</span>選擇副菜</li>
                <li><span>3</span>確認菜單</li>
            </ul>
            <a class="desktop" @click="openPopup('leave')">回主選單</a>
            <LeaveDialog v-if="showPopup === 'leave'" @close="closePopup" />
        </div>
        <div class="operate">
            <h3>副菜組合 8 選 5</h3>
            <div class="select">
            <div class="selectblock">
                <button
                v-for="(item, index) in dishes"
                :key="index"
                class="dish-button"
                :class="{ selected: selectedDishes.includes(index), disabled: isDisabled(index) }"
                @click="toggleDish(index)"
                :disabled="isDisabled(index) && !selectedDishes.includes(index)"
                >
                <img :src="item.img" :alt="item.name" />
                <h5 v-for="line in item.text" :key="line">{{ line }}</h5>
                </button>
            </div>
            <img class="mainbox" src="../assets/images/Order/mainbox2.png" alt="mainbox2">
            </div>
            <div class="btnblock">
                <button class="btn-1">上一步</button>
                <button class="btn-2"
                        :disabled="!canProceed" 
                        @click="goNext">下一步</button>
            </div>
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
    background-color: $neutral_black;
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
    }
}

.desktop {
    display: block;
}

.headline .mobile {
    display: none;
}

// 操作區
.operate {
    width: 1160px;
    margin: 0 auto 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h3 {
    font-size: $font_h3;
    margin-bottom: 16px;
}

.select{
    display: flex;
    gap: 40px;
}

// 選取區塊
.selectblock{
    width: 600px;
    height: 470px;
    border: 2px dashed $primary_600;
    border-radius: 12px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 40px;
    padding: 20px;
}

.mainbox{
    display: block;
    width: 200px;
    height: 200px;
    align-self: flex-end;
}

.selectblock img{
    display: block;
    width: 100px;
    height: 100px;
    margin-bottom: 12px;
    border-radius: 4px;
}

.dish-button{
    width: 120px;
    height: 215px;
    padding: 8px;
    text-align: center;
    background-color: $neutral_white;
    border-radius: 8px;
    border: 1px solid $neutral_black;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: .5;
}

.dish-button.selected {
    opacity: 1;
}

.dish-button.disabled {
background-color: $neutral_100;
  opacity: 0.3;
  pointer-events: none;
}

.dish-button h5{
    font-size: $font_h5;
    font-weight: normal;
    line-height: 1.4;
}

// 上一步、下一步按鈕

.btnblock{
    display: flex;
    align-self: flex-end;
    gap: 20px;
    margin-top: 40px;
}

.btn-1 {
    background-color: $neutral_300;
    color: $neutral_700;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: transparent;
        color: $neutral_black;
    }
}

.btn-2 {
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;
    cursor: pointer;

    &:not(:disabled):hover {
        background-color: transparent;
        color: $neutral_black;
    }

    &:disabled {
        background-color: $neutral_300;
        border: 2px solid $neutral_300;
        cursor: not-allowed;
    }
}

// --- RWD ---
@media screen and (max-width: 1200px) {
     .headline {
        width: 800px;
        flex-direction: column;
        align-items: start;
        gap: 40px;
    }

    .title-btn {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .headline .mobile {
        display: inline-flex;
        align-items: center;
        height: 20px;

    }

    .headline .desktop {
        display: none;
    }

    .step {
        align-self: center;
        gap: 16px;
    }

    .operate {
        width: 800px;
    }

    .select{
        width: 800px;
        flex-direction: column;
        
    }

    .selectblock,
    .mainbox{
    align-self: center;
    }
}

@media screen and (max-width: 850px) {
.headline {
        width: 520px;
    }

.step li {
    font-size: $font_h4;
}

.step span {
    font-size: $font_h6;
    margin-right: 8px;
    line-height: 16px;
    width: 20px;
    height: 20px;
}

.operate,
.select {
    width: 520px;
}

.select{
    gap: 20px;
}

.selectblock{
    width: 90%;
    height: auto;
}
}

@media screen and (max-width: 550px) {
.headline,
.operate, 
.select{
        width: 340px;
    }

h1 {
    font-size: $font_h3;
}

.decorate {
    width: 60px;
    height: 60px;
}

.step {
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

h3 {
    font-size: $font_h4;
}

.operate {
    width: 340px;
}

.dish-button{
    height: 190px;
}

.dish-button h5{
    font-size: $font_h6;
    line-height: 1.2;
}

.mainbox{
    width: 160px;
    height: 160px;
}

.btnblock {
        margin-top: 20px;
        align-self: center;
    }

}
</style>