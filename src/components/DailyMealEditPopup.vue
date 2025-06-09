<template>
  <div v-if="dayMeal" class="daily-meal-edit-popup">
    <div class="popup-content">
      <div class="header">
        <button class="cancel-btn" @click="$emit('close')">取消</button>
        <h4>{{ getDayOfWeekShort(dayMeal.date) }}</h4>
        <button class="complete-btn" @click="saveChanges">完成</button>
      </div>
      <div class="body">
        <div class="section">
          <div class="title">
            <h6>🍱 主菜</h6>
            <button @click="openMainCoursePicker"><i class="bi bi-arrow-repeat"></i></button>
          </div>
          <span>{{ localMainCourse }}</span>
        </div>
        <div class="section">
          <div class="title">
            <h6>🥬 副菜</h6>
            <button @click="openSideDishPicker"><i class="bi bi-arrow-repeat"></i></button>
          </div>
          <span>{{ localSideDishes.join(' / ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
dayjs.locale('zh-tw');

import { usePlanCustomStore } from '@/stores/planCustomStore.js';
const planCustomStore = usePlanCustomStore();

const props = defineProps({
  dayMeal: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'update-meal']);

const localMainCourse = ref('');
const localSideDishes = ref([]);

const possibleMainDishesBasedOnTypes = computed(() => planCustomStore.possibleMainDishesBasedOnTypes);

// 這個就是儲存副菜組合「索引」的 computed 屬性
const selectedSideDishGroups = computed(() => planCustomStore.selectedSideDishGroups); // <-- 這裡就是 selectedSideDishGroups

// 這個是包含所有副菜組合選項的列表，從 store 取得
const availableSideDishOptions = computed(() => planCustomStore.availableSideDishOptions);


watch(() => props.dayMeal, (newVal) => {
  if (newVal) {
    localMainCourse.value = newVal.mainCourse;
    localSideDishes.value = [...newVal.sideDishes];
  }
}, { immediate: true });

const getDayOfWeekShort = (dateStr) => {
  const d = dayjs(dateStr);
  const weekdayShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.day()];
  return weekdayShort;
};

const saveChanges = () => {
  emit('update-meal', {
    date: props.dayMeal.date,
    mainCourse: localMainCourse.value,
    sideDishes: localSideDishes.value
  });
};

const openMainCoursePicker = () => {
  console.log('--- 開始偵錯主菜隨機選擇 (DailyMealEditPopup) ---');
  console.log('來自 store 的 possibleMainDishesBasedOnTypes.value:', possibleMainDishesBasedOnTypes.value);

  if (!possibleMainDishesBasedOnTypes.value || possibleMainDishesBasedOnTypes.value.length === 0) {
    alert('無可選主菜，請確認是否已選擇主菜類型並產生菜單！');
    console.warn('possibleMainDishesBasedOnTypes 為空或未定義:', possibleMainDishesBasedOnTypes.value);
    return;
  }
  const randomIndex = Math.floor(Math.random() * possibleMainDishesBasedOnTypes.value.length);
  localMainCourse.value = possibleMainDishesBasedOnTypes.value[randomIndex];
  console.log('新主菜:', localMainCourse.value);
};

const openSideDishPicker = () => {
  console.log('--- 開始偵錯副菜隨機選擇 (DailyMealEditPopup) ---');
  // 請注意，這裡的 selectedSideDishGroups 就是選中的索引陣列
  console.log('來自 store 的 selectedSideDishGroups.value (選中的索引):', selectedSideDishGroups.value); // <-- 使用 selectedSideDishGroups
  console.log('來自 store 的 availableSideDishOptions.value (所有副菜組合選項):', availableSideDishOptions.value);

  // 確保 selectedSideDishGroups.value 和 availableSideDishOptions.value 有值
  if (!selectedSideDishGroups.value || selectedSideDishGroups.value.length === 0) { // <-- 使用 selectedSideDishGroups
    alert('無可選副菜組合，請先回到 Step 2 選擇副菜組合！');
    console.warn('selectedSideDishGroups 為空或未定義:', selectedSideDishGroups.value); // <-- 使用 selectedSideDishGroups
    return;
  }
  if (!availableSideDishOptions.value || availableSideDishOptions.value.length === 0) {
      alert('副菜選項數據未載入，請檢查 PlanCustomStore。');
      console.error('availableSideDishOptions 為空或未定義:', availableSideDishOptions.value);
      return;
  }


  // 從已選的索引中隨機選擇一個索引
  const randomSelectedGroupIndexInIndicesArray = Math.floor(Math.random() * selectedSideDishGroups.value.length); // <-- 使用 selectedSideDishGroups
  const actualDishOptionIndex = selectedSideDishGroups.value[randomSelectedGroupIndexInIndicesArray]; // <-- 使用 selectedSideDishGroups

  // 根據這個索引從 availableSideDishOptions 獲取完整的副菜組合物件
  const selectedGroupObject = availableSideDishOptions.value[actualDishOptionIndex];

  console.log('隨機選擇到的索引:', actualDishOptionIndex);
  console.log('對應的副菜組合物件:', selectedGroupObject);

  if (selectedGroupObject && Array.isArray(selectedGroupObject.text)) {
    localSideDishes.value = [...selectedGroupObject.text]; // 複製該組合的 text 陣列
    console.log('新副菜:', localSideDishes.value);
  } else {
    console.error('錯誤：無法從選定的副菜索引獲取有效的副菜組合陣列。檢查 availableSideDishOptions 或 selectedSideDishGroups 的數據。'); // <-- 這裡也改為 selectedSideDishGroups
    alert('副菜數據結構錯誤，請檢查 PlanCustomStore 中的副菜數據！');
  }
};
</script>

<style scoped lang="scss">

.daily-meal-edit-popup {
  position: absolute;
  top: 64px;
  right: 120px;
  background-color: $neutral_white;
  border-radius: 12px;
  border: 1px solid $neutral_300;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 240px; /* 根據設計圖調整寬度 */
  padding: 12px 12px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font_h6;
}

.header button{
    border: none;
    background-color: transparent;
    padding: 12px 8px;
    cursor: pointer;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
    }

.body{
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid $neutral_300;
    padding: 16px;
    border-radius: 12px;

    h6{
      font-size: $font_h6;
    }
}

.title{
    display: flex;
    gap: 16px;
    align-items: center;

    button {
      width: 24px;
      height: 24px;
      cursor: pointer;
      color: $neutral_700;
      border: none;
      background-color: transparent;

    }

    button i{
      font-size: $font_h5;
    }
}

.meal-item {
    background-color: $neutral_300;
    border-radius: 12px;
    padding: 12px;
    font-size: $font_p;
    color: $neutral_700;
}

</style>