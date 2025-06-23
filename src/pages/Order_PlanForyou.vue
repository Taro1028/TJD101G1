<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import foodData from '@/data/LunchBoxItems.json'
import { useOrderStore } from '@/stores/orderStore.js';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
dayjs.locale('zh-tw');
import LeaveDialog from '@/components/Popup_OrderLeaveDialog.vue'
import LunchBox from '@/components/Popup_LunchBoxDetails.vue'
import MessageCard from '@/components/Popup_MessageCard.vue'

// 菜單內容
const menulist = ref(foodData)
const getImageUrl = (fileName) => {
    return new URL(`../assets/images/Order/${fileName}`, import.meta.url).href
}

// 背景圖
onMounted(() => {
    document.body.classList.add('custom-bg')
    // 在這裡呼叫 orderStore 的初始化函式
    console.log('Order_PlanForyou.vue: onMounted 鉤子執行，呼叫 orderStore.initializeOrderDates()');
    orderStore.initializeOrderDates(); // <-- 加入這行！
    
})
onUnmounted(() => {
    document.body.classList.remove('custom-bg')
})

// swiper 套件
const swiperOptions = {
    slidesPerView: 'auto',
    freeMode: true,
}

// Pinia 資料
const orderStore = useOrderStore();
const deliveryDates = computed(() => orderStore.deliveryDates);
const isAllDatesSelected = computed(() => {
  return orderStore.planForYouSelections.every(day =>
    day.meals.some(meal => meal.count > 0)
  )
})

const router = useRouter()

function handleNextClick() {
  if (isAllDatesSelected.value) {
    openPopup('message')
  } else {
    goNextDate()
  }
}

// 日期格式化（統一處理）
const formatDateWithOptions = (dateStr, { showYear = false, showWeekday = false } = {}) => {
    const d = dayjs(dateStr);
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][d.day()];
    const formatStr = showYear ? 'YYYY.MM.DD' : 'MM.DD';
    const base = d.format(formatStr);
    return showWeekday ? `${base}（${weekday}）` : base;
};

const formatDate = (dateStr) => formatDateWithOptions(dateStr, { showWeekday: true });
const formatPeriod = (dateStr) => formatDateWithOptions(dateStr, { showYear: true });

// 日期按鈕預設第一天
const selectedIndex = ref(0)

const props = defineProps({
  currentDate: String,   // 當天的日期
  mealName: String       // 餐盒名稱（例如「樂活元氣餐」）
})

const getTotalCount = (date) => orderStore.getTotalCountForDate(date)
const getTotalPrice = (date) => orderStore.getTotalPriceForDate(date)

const getMealSummary = (date) => {
  const day = orderStore.planForYouSelections.find(d => d.date === date)
  if (!day) return ''
  return day.meals
    .filter(meal => meal.count > 0)
    .map(meal => `${meal.name} * ${meal.count}`)
    .join(' / ')
}

// 找出該餐點當天的 count
const count = computed(() => {
  const day = orderStore.planForYouSelections.find(d => d.date === props.currentDate)
  return day?.meals.find(m => m.name === props.mealName)?.count || 0
})

function getCount(mealName) {
  const date = deliveryDates.value[selectedIndex.value]
  const day = orderStore.planForYouSelections.find(d => d.date === date)
  return day?.meals.find(m => m.name === mealName)?.count || 0
}

function increase(mealName) {
  const date = deliveryDates.value[selectedIndex.value]
  const currentCount = getCount(mealName)
  const total = getTotalCountForSelectedDate()
  if (total < 10) {
    orderStore.updateMealCount(date, mealName, currentCount + 1)
  }
}

function decrease(mealName) {
  const date = deliveryDates.value[selectedIndex.value]
  const currentCount = getCount(mealName)
  if (currentCount > 0) {
    orderStore.updateMealCount(date, mealName, currentCount - 1)
  }
}

function getTotalCountForSelectedDate() {
  const date = deliveryDates.value[selectedIndex.value]
  return orderStore.getTotalCountForDate(date)
}

const getTotalAllDates = computed(() => {
    return orderStore.planForYouSelections.reduce((sum, day) => {
    return sum + day.meals.reduce((subtotal, meal) => subtotal + meal.count * meal.price, 0)
  }, 0)
})

function hasSelectedMeal(index) {
  const dayData = orderStore.planForYouSelections[index]
  if (!dayData || !dayData.meals) return false

  return dayData.meals.some(function(meal) {
    return meal.count > 0
  })
}

const formatNumber = (number) => {
  return number.toLocaleString('zh-TW')
}

// Popup
const showPopup = ref(null)
const selectedMenu = ref(null)

function openPopup(type, payload = null) {
    showPopup.value = type
  if (type === 'content' && payload) {
    selectedMenu.value = payload
  }
}
function closePopup() {
    showPopup.value = null
    selectedMenu.value = null
}

// 清除原本選擇的選項
function handleLeaveConfirmed() {
  orderStore.resetSelection(); // 清除選擇

  router.push('/Order/Select'); 

  closePopup(); 
}

// 上、下一步
function goPrevDate() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

function goNextDate() {
  if (selectedIndex.value < deliveryDates.value.length - 1) {
    selectedIndex.value++
  }
}

const isNextDisabled = computed(() => {
  const isLastDate = selectedIndex.value === orderStore.planForYouSelections.length - 1
  const todayMeals = orderStore.planForYouSelections[selectedIndex.value]?.meals || []
  const todayHasNoSelection = todayMeals.every(meal => meal.count === 0)
  return isLastDate && todayHasNoSelection
})
</script>

<template>
    <FrontLayout>
        <div class="headline">
            <h1>為你搭配<span class="decorate"></span></h1>
            <a @click="openPopup('leave')">回主選單</a>
            <LeaveDialog v-if="showPopup === 'leave'" @close="closePopup" @confirm-leave="handleLeaveConfirmed" />
        </div>
        <div class="operate">
            <div class="order-container">
                <div class="period-block">
                    <div class="period" v-if="deliveryDates.length">
                        <template v-if="deliveryDates.length === 1">
                            {{ formatDateWithOptions(deliveryDates[0], { showYear: true, showWeekday: true }) }}
                        </template>
                        <template v-else>
                            {{ formatDateWithOptions(deliveryDates[0], { showYear: true, showWeekday: true }) }}– 
                            {{ formatDateWithOptions(deliveryDates.at(-1), { showYear: false, showWeekday: true }) }}
                        </template>
                    </div>
                    <div class="dateblock">
                        <Swiper v-bind="swiperOptions" class="date-swiper">
                            <SwiperSlide 
                                v-for="(date, index) in deliveryDates" 
                                :key="index">
                                <div class="dateItem"
                                    @click="selectedIndex = index"
                                    :class="{ 
                                            active: selectedIndex === index,
                                            done: hasSelectedMeal(index) 
                                            }">
                                    <div class="date">{{ formatDate(date) }}</div>
                                    <div class="lunchboxtxt">
                                        <template v-if="getTotalCount(date) > 0">
                                            訂 {{ getTotalCount(date) }} 份餐盒 · ${{ getTotalPrice(date).toLocaleString('zh-TW') }}
                                        </template>
                                        <template v-else>
                                            請選擇餐點
                                        </template>
                                    </div>
                                </div>  
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <LunchBox v-if="showPopup === 'content'" :menu="selectedMenu" @close="closePopup" />
                <div class="order">
                    <div class="orderarea">
                        <div class="day">
                            <h3 v-if="deliveryDates.length">{{ formatDate(deliveryDates[selectedIndex]) }}</h3>
                        </div>
                        <div class="lunchboxlist">
                            <Swiper v-bind="swiperOptions" class="lunchbox-swiper">
                                <SwiperSlide
                                    v-for="menuitem in menulist" 
                                    :key="menuitem.title">
                                    <div class="boxcard">
                                        <div class="boxname">
                                            <h4>{{ menuitem.title }}</h4>
                                        </div>
                                        <div class="imginfo">
                                            <img :src="getImageUrl(menuitem.boximage)" :alt="menuitem.title">
                                            <div class="ingredients">
                                                <img 
                                                v-for="(ingredient, idx) in menuitem.ingredients"
                                                :key="idx"
                                                :src="getImageUrl(ingredient.icon)"
                                                :alt="ingredient.label">
                                            </div>
                                        </div>
                                        <div class="detail-price">
                                            <div class="detail"><a @click="openPopup('content', menuitem)">詳細內容</a></div>
                                            <div class="price">${{ menuitem.price.toLocaleString('zh-TW') }}</div>
                                        </div>
                                        <div class="quantity-selector">
                                            <button
                                                class="decrease-btn"
                                                @click="decrease(menuitem.title)"
                                                :disabled="getCount(menuitem.title) <= 0"
                                                :class="{'active-decrease':menuitem.title > 1 }">
                                                <i class="bi bi-dash-circle-fill"></i>
                                            </button>
                                            <div class="count">{{ getCount(menuitem.title) }}</div>
                                            <button
                                                class="increase-btn"
                                                @click="increase(menuitem.title)"
                                                :disabled="getTotalCountForSelectedDate() >= 10"
                                                :class="{'active-increase':getTotalCountForSelectedDate() >= 10 }">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div class="notice">
                            <span><i class="bi bi-info-circle-fill"></i></span>
                            <h5>單日餐盒數超過 10 份，請直接來電訂購</h5>
                        </div>
                    </div>
                    <div class="ordertxt">
                        <h5 class="boxitem">餐盒項目：{{ getMealSummary(deliveryDates[selectedIndex]) }}</h5>
                        <h5 class="subtotal">小計：${{ getTotalPrice(deliveryDates[selectedIndex]).toLocaleString('zh-TW') }}</h5>
                    </div>
                    <div class="total_option-btn">
                        <div class="total">
                            <h5>總計金額：<br>${{ getTotalAllDates.toLocaleString('zh-TW') }}</h5>
                        </div>
                        <div class="option-btn">
                            <button class="prevbtn"
                                    :disabled="selectedIndex === 0"
                                    @click="goPrevDate">
                                上一步
                            </button>
                            <button 
                                    :disabled="isNextDisabled"
                                    :class="{
                                            nextbtn: !isAllDatesSelected,
                                            finish: isAllDatesSelected
                                    }"
                                    @click="handleNextClick">
                                    {{ isAllDatesSelected ? '訂購餐點' : '下一步' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <MessageCard 
            v-if="showPopup === 'message'" 
            :plan-type="'為你搭配'" 
            @close="closePopup" 
            />
        </div>
    </FrontLayout>
</template>

<style>
.custom-bg {
    background-image: url(../assets/images/Order/background.svg);
}
</style>
<style scoped lang="scss">
.headline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 1050px;
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
    background-color: $primary_400;
    position: absolute;
    left: 0;
    top: -2px;
    z-index: -1;
}

.headline a {
    text-decoration: none;
    color: $neutral_700;
    background-color: $primary_100;
    border: 1px solid $primary_100;
    padding: 12px 24px;
    border-radius: 24px;
    transition: 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: transparent;
        border: 1px solid $neutral_700;
        transition: 0.3s ease;
    }
}

// 操作區
.operate {
    margin: 0 auto 64px;
}

// 點餐容器
.order-container {
    width: 1050px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
}

// 期間區塊
.period-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.period {
    color: $neutral_black;
    border-bottom: 1px solid $neutral_black;
    padding: 8px 0;
}

.dateblock {
    width: 100%;
    display: flex;
    justify-content: flex-start;
}

.swiper-slide {
    flex-shrink: 1;
    width: fit-content;
}

.date-swiper {
    width: 100%;
}

.lunchbox-swiper {
    width: auto;
    margin-left: 0;
}

.dateItem {
    width: 100px;
    height: 64px;
    padding: 4px 12px;
    margin-right: 20px;
    border-radius: 8px;
    border: 1px solid $neutral_300;
    background-color: $primary_50;
    cursor: pointer;
}

.dateItem.done {
    background-color: $primary_400;
}

.dateItem.active {
    background-color: $primary_100;
}

.complete {
    background-color: $primary_600;
}

.date {
    color: $neutral_black;
    padding-bottom: 4px;
}

.lunchboxtxt {
    color: $neutral_700;
}

// 點餐區
.order {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.orderarea {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.day {
    padding: 8px 16px;
}

.day h3 {
    font-size: $font_h3;
    margin: 0;
}

.lunchboxlist {
    display: flex;
    // gap: 48px;
    // align-self: center;
}

// 餐盒卡片
.boxcard {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px 20px;
    margin: 0 32px;
    border: 1px solid $neutral_300;
    border-radius: 20px;
}

.boxname {
    border-bottom: 1px solid $neutral_black;
    padding: 4px;
}

.boxname h4 {
    margin: 0;
    font-size: $font_h4;
    text-align: center;
}

.imginfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.imginfo img {
    display: block;
    width: 160px;
    height: 160px;
    margin: 0 auto;
}

.ingredients {
    display: flex;
    gap: 12px;
    align-self: start;
}

.imginfo .ingredients img {
    display: block;
    width: 20px;
    height: 20px;
}

.detail-price {
    display: flex;
    justify-content: space-between;
}

.detail a {
    text-decoration: underline;
    display: block;
    cursor: pointer;
    font-weight: bold;
    color: $primary_400;
}

.price {
    font-weight: bold;
    color: $primary_950;
}

.quantity-selector {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
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

// 注意事項
.notice {
    display: flex;
    gap: 8px;
    color: $neutral_black;
    opacity: .7;
}

.notice span {
    padding-top: 2px;
}

.notice h5 {
    font-size: $font_h5;
    font-weight: normal;
}

// 餐盒細項統計
.ordertxt {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.boxitem {
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.subtotal {
    font-size: $font_h5;
    font-weight: normal;
}

.total_option-btn {
    display: flex;
    justify-content: space-between;
}

.total {
    display: flex;
    flex-shrink: 0;
}

.total h5 {
    font-weight: bold;
    font-size: $font_h5;
}

.option-btn {
    display: flex;
    justify-content: end;
    gap: 16px;
}

.prevbtn {
    padding: 12px 24px;
    background-color: $primary_100;
    border: 1px solid $primary_100;
    border-radius: 24px;
    
    &:hover{
        cursor: pointer;
    }
}

.finish{
    padding: 12px 24px;
    background-color: $neutral_black;
    color: $neutral_white;
    border-radius: 24px;
}

.nextbtn {
    padding: 12px 24px;
    background-color: $primary_400;
    border: 1px solid $primary_400;
    border-radius: 24px;
    cursor: pointer;
}

.disabled {
    opacity: .5;
}

.prevbtn:disabled,
.nextbtn:disabled {
    cursor: not-allowed;
}

// --- RWD ---
@media screen and (max-width: 1200px) {
    .headline {
        width: 800px;
    }

    .order-container {
        width: 800px;
        flex-direction: column;
        justify-self: center;
    }

    .boxcard {
        padding: 16px;
        margin: 0 18px;
    }

    .imginfo img {
        width: 100px;
        height: 100px;
    }

}

@media screen and (max-width: 920px) {
    .headline {
        width: 520px;
    }

    .order-container {
        width: 520px;
    }

    .lunchboxlist {
        width: 100%;
    }

    .boxcard {
        width: 162px;
    }

}

@media screen and (max-width: 580px) {
    .headline {
        width: 343px;
    }

    .order-container {
        width: 343px;
    }

    h1 {
        font-size: $font_h3;
    }

    .decorate {
        width: 60px;
        height: 60px;
    }

    .total_option-btn {
        flex-direction: column;
        gap: 20px;
    }

    .option-btn {
        justify-content: center;
    }
}
</style>