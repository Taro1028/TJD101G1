<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanCustomStore } from '@/stores/planCustomStore.js'; // 引入 Pinia Store
import LeaveDialog from '@/components/Popup_OrderLeaveDialog.vue'

const baseUrl = ref(import.meta.env.BASE_URL);

// 引入 Pinia Store
const planCustomStore = usePlanCustomStore();
const router = useRouter();

// 背景圖
onMounted(() => {
    document.body.classList.add('custom-bg');
    // 從 Pinia store 恢復上次的選擇
    // 使用結構賦值確保是值的複製，避免響應式代理問題
    localSelectedSideDishGroups.value = [...planCustomStore.selectedSideDishGroups];
    console.log('Order_Select2_PlanFree mounted, restored selected side dish groups:', localSelectedSideDishGroups.value);

    // 可以在這裡加入驗證，如果 Step 1 的主菜沒有選，就導回 Step 1
    if (planCustomStore.selectedMainCourseTypes.length !== 2) {
      console.warn('Step 1 main course types not selected. Redirecting to Step 1.');
      router.replace('/Order/PlanFree/Step1'); // 強制用戶從 Step 1 開始
    }
})

onUnmounted(() => {
    document.body.classList.remove('custom-bg')
})

const localSelectedSideDishGroups = ref([]);

const availableSideDishOptions = computed(() => planCustomStore.availableSideDishOptions);

function toggleDish(item) {
    const existingItemIndex = localSelectedSideDishGroups.value.findIndex(selectedItem => selectedItem.id === item.id);
    if (existingItemIndex > -1) {
        // 如果已選中，則移除
        localSelectedSideDishGroups.value.splice(existingItemIndex, 1);
    } else if (localSelectedSideDishGroups.value.length < 5) {
        // 如果未選中且數量小於 5，則新增 (新增的是整個物件)
        localSelectedSideDishGroups.value.push(item); // <-- 新增的是整個物件
    } else {
        // 如果已滿 5 個，則提示
        alert('最多只能選擇 5 組副菜喔！');
        return; // 不更新選擇
    }
    // 同步更新 Pinia Store 中的 selectedSideDishGroups
    planCustomStore.setSelectedSideDishGroups(localSelectedSideDishGroups.value); // <-- 傳遞物件陣列
    console.log('Pinia store selectedSideDishGroups updated:', [...planCustomStore.selectedSideDishGroups]);
}


// 判斷是否選中（UI 狀態）
function isSelected(item) {
    return localSelectedSideDishGroups.value.some(selectedItem => selectedItem.id === item.id);
}

// 判斷是否禁用（UI 狀態）
function isDisabled(item) {
    // 當前項目未選中，且已選項目數量達到上限時禁用
    return !isSelected(item) && localSelectedSideDishGroups.value.length >= 5;
}

// 判斷符合 下一步 條件
const canProceed = computed(() => localSelectedSideDishGroups.value.length === 5);


// 下一步邏輯
function goNext() {
    if (!canProceed.value) {
        alert('請選擇五組副菜組合！'); // 增加提示
        return;
    }
    // 在進入 Step 3 (確認菜單) 之前，初始化每天的餐盒內容
    // 這裡會根據 Step 1 和 Step 2 的選擇隨機生成菜單
    planCustomStore.initializeCustomMealsByDate(); 
    router.push('/Order/Select3_PlanFree'); // 確保路徑正確
}

// 上一步邏輯 (返回 Step 1)
function goPrevious() {
    router.push('/Order/Select1_PlanFree'); 
}

// Popup
const showPopup = ref(null)

function openPopup(value) {
    showPopup.value = value
}

function closePopup() {
    showPopup.value = null
}

// 清除原本選擇的選項
function handleLeaveConfirmed() {
  planCustomStore.resetMainCourseSelection(); // 清除主菜選擇
  planCustomStore.setSelectedSideDishGroups([]); // 清除副菜組合選擇
  planCustomStore.customMealsByDate = []; // 清除已生成的每日菜單

  router.push('/Order/Select'); 

  closePopup(); 
}

</script>

<template>
    <FrontLayout>
        <div class="headline">
            <div class="title-btn">
                <h1>自由搭配<span class="decorate"></span></h1>
                <div><a class="mobile" @click="openPopup('leave')">回主選單</a></div>
            </div>
            <ul class="step">
                <li class="finish"><span class="finishspan">1</span>選擇主菜</li>
                <li class="finish"><span class="finishspan">2</span>選擇副菜</li>
                <li><span>3</span>確認菜單</li>
            </ul>
            <a class="desktop" @click="openPopup('leave')">回主選單</a>
            <LeaveDialog v-if="showPopup === 'leave'" @close="closePopup" @confirm-leave="handleLeaveConfirmed" />
        </div>
        <div class="operate">
            <h3>副菜組合 8 選 5 ({{ localSelectedSideDishGroups.length }}/5)</h3>
            <div class="select">
                <div class="selectblock">
                    <button
                        v-for="(item, index) in availableSideDishOptions"
                        :key="item.id"
                        class="dish-button"
                        :class="{ selected: isSelected(item), disabled: isDisabled(item) }"
                        @click="toggleDish(item)"
                        :disabled="isDisabled(item) && !isSelected(item)"
                    >
                        <img :src="baseUrl+'images/Order/'+item.img" :alt="item.groupName || item.name" />
                        <h5 v-for="dish in item.dishes" :key="dish.id">{{ dish.name }}</h5>
                    </button>
                </div>
                <img class="mainbox" src="../assets/images/Order/mainbox2.png" alt="mainbox2">
            </div>
            <div class="btnblock">
                <button class="btn-1" @click="goPrevious">上一步</button>
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
    opacity: .4;
}

.dish-button.selected {
    opacity: 1;
}

.dish-button.disabled {
background-color: $neutral_100;
  opacity: 0.2;
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