<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LeaveDialog from '@/components/Popup_OrderLeaveDialog.vue'
import MessageCard from '@/components/Popup_MessageCard.vue' 
import { usePlanCustomStore } from '@/stores/planCustomStore.js' // 引入 planCustomStore
import { useDateRangeStore } from '@/stores/dateRangeStore.js';
import dayjs from 'dayjs' 
import 'dayjs/locale/zh-tw' 
dayjs.locale('zh-tw')
import SettingActionMenu from '@/components/SettingActionMenu.vue'; // 新增的全局選單組件
import DailyMealEditPopup from '@/components/DailyMealEditPopup.vue'; // 新增的當日菜單編輯彈窗組件

// --- Store 相關 ---
const planCustomStore = usePlanCustomStore();
const dateRangeStore = useDateRangeStore();
const menuMode = computed(() => planCustomStore.menuMode); // 從 store 取得 menuMode
const isEditingModeActive = computed(() => planCustomStore.isEditingModeActive); // 從 store 取得 isEditingModeActive

// 從 Store 獲取數據
const customMealsByDate = computed(() => planCustomStore.customMealsByDate)
const deliveryDates = computed(() => planCustomStore.deliveryDates)
const CUSTOM_MEAL_PRICE = computed(() => planCustomStore.CUSTOM_MEAL_PRICE) // 獲取統一價格

// --- 路由 ---
const router = useRouter()

// --- 全局操作選單邏輯 (SettingActionMenu) ---
const showSettingActionMenu = ref(false); // 控制全局操作選單的顯示

function toggleSettingActionMenu() {
    showSettingActionMenu.value = !showSettingActionMenu.value;
}

function handleMoveOrder() {
    planCustomStore.setMenuMode('moveOrder'); // 設定全局模式為移動順序
    showSettingActionMenu.value = false; // 關閉浮動選單
    //console.log('進入移動菜單順序模式');
    // 這裡您可以啟動一個拖曳排序功能 (可能需要額外的庫，如 Vue.Draggable)
    // 或者簡化為僅顯示移動icon，實際排序通過另一個「儲存順序」按鈕觸發
}

function handleEditContent() {
    planCustomStore.setMenuMode('editContent'); // 設定全局模式為編輯內容
    showSettingActionMenu.value = false; // 關閉浮動選單
   // console.log('進入編輯菜單內容模式');
    // 進入此模式後，每個 day-item 會顯示鉛筆 icon
}

// 處理「完成」按鈕點擊，回到數量調整模式
function handleCompleteEdit() {
    planCustomStore.setMenuMode('quantity'); // 將模式重設回數量調整
    showSettingActionMenu.value = false;
   // console.log('完成編輯，回到數量調整模式');
    // 如果有任何暫存的編輯狀態，也可以在這裡重置，例如拖曳排序的狀態
}

// --- 單日菜單編輯彈窗邏輯 (DailyMealEditPopup) ---
const showDailyEditPopup = ref(false);
const editingDayMeal = ref(null); // 儲存當前正在編輯的 dayMeal 物件

function openDailyEditPopup(dayMeal) {
    editingDayMeal.value = dayMeal;
    showDailyEditPopup.value = true;
}

function closeDailyEditPopup() {
    showDailyEditPopup.value = false;
    editingDayMeal.value = null;
}

function handleMealUpdate(updatedMeal) {
    // 處理 DailyMealEditPopup 返回的更新後的菜單數據
    planCustomStore.updateCustomMeal(updatedMeal.date, updatedMeal.mainCourse, updatedMeal.sideDishes);
    closeDailyEditPopup();
}

// --- 生命週期 ---
// 背景圖
onMounted(() => {
    document.body.classList.add('custom-bg')
  // console.log('Order_Select3_PlanFree.vue: onMounted 執行')

    // 在此步驟初始化每天的菜單
    // 只有在確保前一步的選擇都完成時才執行初始化
    if (planCustomStore.selectedMainCourseTypes.length === 2 && 
        planCustomStore.selectedSideDishGroups.length === 5 && 
        planCustomStore.deliveryDates.length > 0) {
        planCustomStore.initializeCustomMealsByDate()
    } else {
        // 如果沒有完成前置選擇，導回 Step 2 (或 Step 1)
        alert('請先完成日期選擇、主菜及副菜組合！');
        // router.replace('/Order/PlanFree/Step2'); // 如果是 Step2 是進入點，則導回
        router.replace('/Order/Select'); // 更安全的做法，導回 選擇期間 讓使用者重新選擇
    }
})

onUnmounted(() => {
    document.body.classList.remove('custom-bg')
})

// --- Popup 彈窗邏輯 (LeaveDialog, MessageCard) ---
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
    dateRangeStore.clearDates(); // 清除日期選擇
    planCustomStore.customMealsByDate = []; // 清除已生成的每日菜單
    planCustomStore.setMenuMode('quantity'); // 重置菜單模式

    router.push('/Order/Select');

    closePopup();
}

// --- 日期和價格相關計算屬性與函數 ---
// 日期格式化函數
const formatDateWithOptions = (dateStr, { showYear = false, showWeekday = false } = {}) => {
    const d = dayjs(dateStr)
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][d.day()]
    const formatStr = showYear ? 'YYYY.MM.DD' : 'MM.DD'
    const base = d.format(formatStr)
    return showWeekday ? `${base} (${weekday})` : base
}

// 顯示期間範圍（例如「06.07(六) - 06.13(五)」）
const customPeriodDisplay = computed(() => {
    if (deliveryDates.value.length === 0) {
        return '';
    } else if (deliveryDates.value.length === 1) {
        // 如果只有一天，只顯示單日
        return formatDateWithOptions(deliveryDates.value[0], { showYear: false, showWeekday: true });
    } else {
        // 如果超過一天，顯示範圍
        const start = deliveryDates.value[0];
        const end = deliveryDates.value[deliveryDates.value.length - 1];
        return `${formatDateWithOptions(start, { showYear: false, showWeekday: true })} - ${formatDateWithOptions(end, { showYear: false, showWeekday: true })}`;
    }
})

// 獲取星期幾的簡寫 (MON, TUE 等)
const getDayOfWeekShort = (dateStr) => {
    const d = dayjs(dateStr)
    const weekdayShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.day()]
    return weekdayShort
}

// 增加餐盒數量
function increaseCount(date) {
    planCustomStore.increaseCustomCount(date)
}

// 減少餐盒數量
function decreaseCount(date) {
    planCustomStore.decreaseCustomCount(date)
}

// 計算總天數
const totalDeliveryDays = computed(() => deliveryDates.value.length);

// 計算數量合計
const totalMealsCount = computed(() => {
    return customMealsByDate.value.reduce((sum, dayMeal) => sum + dayMeal.count, 0);
});

// 計算總計金額
const getTotalAllDatesPrice = computed(() => {
    // return planCustomStore.getTotalAllCustomDatesPrice;
    // 直接從 store 獲取總金額，因為 store 已經根據主菜價格計算
    return planCustomStore.getTotalAllCustomDatesPrice;
});

// 下一步/訂購餐點按鈕邏輯
const isOrderButtonDisabled = computed(() => {
    // 如果沒有生成菜單，或者總數量為 0，則禁用按鈕
    return customMealsByDate.value.length === 0 || totalMealsCount.value === 0
});

function handleOrderClick() {
    // 這裡可以導航到結帳頁面，或者觸發加入購物車的 API
    openPopup('message') // 假設點擊訂購餐點會彈出訊息
}
</script>

<template>
    <FrontLayout>
        <div class="headline">
            <div class="title-btn">
                <h1>自由搭配<span class="decorate"></span></h1>
                <div>
                    <a class="mobile" @click="openPopup('leave')">回主選單</a>
                </div>
            </div>
            <ul class="step">
                <li class="finish"><span class="finishspan">1</span>選擇主菜</li>
                <li class="finish"><span class="finishspan">2</span>選擇副菜</li>
                <li class="finish"><span class="finishspan">3</span>確認菜單</li>
            </ul>
            <a class="desktop" @click="openPopup('leave')">回主選單</a>
            <LeaveDialog v-if="showPopup === 'leave'" @close="closePopup" @confirm-leave="handleLeaveConfirmed" />
        </div>
        <div class="operate">
            <div class="menubox">
                <div class="title">
                    <div class="titletxt">
                        <h5>餐盒資訊</h5>
                        <div class="period">
                            <h5>{{ customPeriodDisplay }}</h5>
                        </div>
                    </div>
                    <button v-if="!isEditingModeActive" class="set" @click="toggleSettingActionMenu">
                        <i class="bi bi-three-dots"></i>
                    </button>
                    <button v-else class="set complete-btn" @click="handleCompleteEdit">
                        完成
                    </button>

                    <SettingActionMenu
                        v-if="showSettingActionMenu && !isEditingModeActive"
                        @close="toggleSettingActionMenu"
                        @move-order="handleMoveOrder"
                        @edit-content="handleEditContent"
                        style="position: absolute; top: 64px; right: 24px; z-index: 100;" />
                </div>
                <hr>
                <div class="menulist">
                    <div class="day-item" v-for="dayMeal in customMealsByDate" :key="dayMeal.date">
                        <div class="item">
                            <h6>{{ getDayOfWeekShort(dayMeal.date) }}</h6>
                            <div class="meal">
                                <div class="mealname">🍱 {{ dayMeal.mainCourse.name }}餐食</div>
                                <div class="mealinfo">
                                    <span id="mainmeal">{{ dayMeal.mainCourse.name }} / </span>
                                    <span id="sidemeal">
                                        <template v-for="(dish, index) in dayMeal.sideDishes.dishes" :key="dish.id">
                                            {{ dish.name }}
                                            <template v-if="index < dayMeal.sideDishes.dishes.length - 1"> / </template>
                                        </template>
                                    </span>
                                </div>
                            </div>
                            <div class="price">${{ CUSTOM_MEAL_PRICE.toLocaleString() }}</div>
                        </div>

                        <div class="action-area">
                            <div v-if="menuMode === 'quantity'" class="quantity-selector">
                                <button
                                    class="decrease-btn"
                                    @click="decreaseCount(dayMeal.date)"
                                    :disabled="dayMeal.count <= 1"
                                    :class="{ 'active-decrease': dayMeal.count > 1 }"
                                >
                                    <i class="bi bi-dash-circle-fill"></i>
                                </button>
                                <div class="count">{{ dayMeal.count }}</div>
                                <button
                                    class="increase-btn"
                                    @click="increaseCount(dayMeal.date)"
                                    :disabled="dayMeal.count >= 10"
                                    :class="{ 'active-increase': dayMeal.count >= 10 }"
                                >
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            </div>
                            <div v-else-if="menuMode === 'moveOrder'" class="move-order-action">
                                <button class="move-btn">
                                    <i class="bi bi-list"></i> </button>
                            </div>
                            <div v-else-if="menuMode === 'editContent'" class="edit-content-action">
                                <button class="edit-btn" @click="openDailyEditPopup(dayMeal)">
                                    <i class="bi bi-pencil"></i> </button>
                            </div>
                        </div>
                    </div>
                    <h6 class="notice"><i class="bi bi-info-circle-fill"></i> 單日餐盒數超過 10 份，請直接來電訂購</h6>
                </div>
                <DailyMealEditPopup
                    v-if="showDailyEditPopup"
                    :day-meal="editingDayMeal"
                    @close="closeDailyEditPopup"
                    @update-meal="handleMealUpdate"
                />
            </div>
            <div class="image-btn">
                <div class="priceinfo">
                    <span class="perblock">訂購期間：&nbsp;<span>{{ customPeriodDisplay }}<br>(共 {{ totalDeliveryDays }} 天)</span>
                    </span>
                    <span>餐盒金額： ${{ CUSTOM_MEAL_PRICE.toLocaleString() }} 元</span>
                    <span>數量合計： {{ totalMealsCount }} 份</span>
                    <span>總計金額： ${{ getTotalAllDatesPrice.toLocaleString() }}</span>
                </div>
                <img src="../assets/images/Order/box-complete.png" alt="">
                <div class="btnblock">
                    <button class="btn-1" @click="router.back()">上一步</button>
                    <div>
                        <button class="btn-2" @click="handleOrderClick" :disabled="isOrderButtonDisabled">
                            訂購餐點
                        </button>
                        <MessageCard 
                            v-if="showPopup === 'message'" 
                            :plan-type="'自由搭配'" 
                            @close="closePopup" 
                            />
                    </div>
                </div>
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

.desktop {
    display: block;
}

.headline .mobile {
    display: none;
}

// 操作區
.operate {
    width: 1060px;
    margin: 0 auto 64px;
    display: flex;
    gap: 40px;
}

// 期間菜單
.menubox {
    width: 612px;
    height: fit-content;
    padding: 20px 28px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 8px;
    position: relative;
}

.title {
    display: flex;
    justify-content: space-between;
}

.titletxt {
    display: flex;
    align-items: center;
    gap: 16px;
}

.title h5 {
    margin: 0;
    font-size: $font_h5;
}

.set {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: transparent;
    border: 2px solid $neutral_black;
    cursor: pointer;
    display: flex; /* Added for centering content */
    align-items: center; /* Added for centering content */
    justify-content: center; /* Added for centering content */
}

// 新增「完成」按鈕的樣式
.complete-btn {
    width: 52px;
    border: none;
    color: $neutral_black;
    font-size: $font_h5;
    font-weight: bold;

    &:hover {
        cursor: pointer;
        color: $primary_600;
    }
}


// 菜單清單
.menulist {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// 單日項目
.day-item {
    position: relative;
    display: flex;
    justify-content: space-between;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: .5px;
        background-color: $neutral_300;
    }
}

.item {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 12px 20px 12px 0;
}

.item h6 {
    width: 42px;
    margin: 0;
    font-size: $font_h6;
}

.meal {
    width: 368px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mealname {
    font-weight: bold;
}

.price{
    font-weight: bold;
}

.quantity-selector {
    display: flex;
    gap: 12px;
    justify-content: space-evenly;
    align-items: center;
}

.count{
    text-align: center;
    width: 20px; // 確保數字有足夠的空間
}

.decrease-btn {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
}

.increase-btn {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
}

.quantity-selector button:disabled i {
    color: $neutral_300;
    cursor: not-allowed;
}

.decrease-btn.active-decrease i {
    color: $neutral_black;
}

.increase-btn.active-increase i {
    color: $neutral_300;
    cursor: not-allowed;
}

.action-area{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // 為 action-area 設置一個固定的寬度，防止切換時佈局抖動
    min-width: 116px; // 假設和 quantity-selector 寬度差不多
}

.move-order-action button,
.edit-content-action button{
    border: 1px solid transparent;
    background-color: transparent;
    font-size: 24px;
    border-radius: 8px;
    width: 40px; /* 確保按鈕大小一致 */
    height: 40px; /* 確保按鈕大小一致 */
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover{
        cursor: pointer;
        background-color: $neutral_100;
    }
}

.notice {
    margin: 0;
    font-size: $font_h6;
    font-weight: normal;
    color: $neutral_black;
    opacity: .7;
}


// 右側 圖片+按鈕
.image-btn {
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 40px;
}

.image-btn img {
    width: 200px;
    height: 200px;
}

.priceinfo{
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 18px;
    font-weight: bold;
}

.perblock{
    display: flex;
}

.btnblock {
    display: flex;
    gap: 20px;
}

.btn-1 {
    background-color: $neutral_300;
    color: $neutral_700;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;


    &:hover {
        background-color: transparent;
        transition: 0.3s ease;
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


    &:hover {
        background-color: transparent;
        transition: 0.3s ease;
        color: $neutral_black;
    }

    &:disabled {
        background-color: $neutral_300;
        color: $neutral_700;
        border-color: $neutral_300;
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
    flex-direction: column;
    align-items: center;
    gap: 40px;
}

.image-btn{
    gap: 40px;
    align-items: center;
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

.operate{
    width: 520px;
}

.menubox{
    width: 460px;
}

.meal{
    width: fit-content;
}

}

@media screen and (max-width: 550px){
.headline,
.operate{
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

.complete-btn{
    width: 48px;
    font-size: $font_h6;
}

.titletxt{
    gap: 8px;
}

.action-area{
    min-width: auto;
}

.move-order-action button,
.edit-content-action button{
    font-size: 20px;
    border-radius: 8px;
    width: 40px; 
    height: 40px; 

}

.menubox{
    width: 312px;
    padding: 16px;
}

.title h5{
    font-size: $font_h6;
}

.item{
    flex-direction: column;
    align-items: start;
}

.image-btn{
    width: 340px;
}

.priceinfo{
    font-size: $font_h6;
}

.image-btn img{
    width: 160px;
    height: 160px;
}

}

</style>