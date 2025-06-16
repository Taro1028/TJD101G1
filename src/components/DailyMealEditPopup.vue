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
          <span>{{ localMainCourse ? localMainCourse.name : '未選擇主菜' }}</span>
        </div>
        <div class="section">
          <div class="title">
            <h6>🥬 副菜</h6>
            <button @click="openSideDishPicker"><i class="bi bi-arrow-repeat"></i></button>
          </div>
          <span>
            <template v-if="localSelectedSideDishGroup && localSelectedSideDishGroup.dishes && localSelectedSideDishGroup.dishes.length > 0">
              {{ localSelectedSideDishGroup.dishes.map(d => d.name).join(' / ') }}
            </template>
            <template v-else>未選擇副菜</template>
          </span>
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
    type: Object, // dayMeal 應該是包含 mainCourse 和 sideDishes 物件的完整數據
    required: true
  }
});

const emit = defineEmits(['close', 'update-meal']);

// !!! 修正點 1: 統一變數名稱為 localSelectedSideDishGroup !!!
const localMainCourse = ref(null);
const localSelectedSideDishGroup = ref(null); // 現在儲存副菜組合物件

// 從 store 獲取所有可能的主菜 (物件陣列)
const possibleMainDishesBasedOnTypes = computed(() => planCustomStore.possibleMainDishesBasedOnTypes);
// 從 store 獲取所有已選的副菜組合 (物件陣列)
// selectedSideDishGroups 現在就是副菜組合物件的陣列了
const selectedSideDishGroups = computed(() => planCustomStore.selectedSideDishGroups);

// 不再需要 availableSideDishOptions，因為 selectedSideDishGroups 已經是物件了
// const availableSideDishOptions = computed(() => planCustomStore.availableSideDishOptions);


// 監聽 props.dayMeal 的變化來初始化 local 狀態
watch(() => props.dayMeal, (newVal) => {
  console.log('DailyMealEditPopup: dayMeal prop changed:', newVal);
  if (newVal) {
    // 複製物件以確保響應性獨立且不會直接修改 props
    localMainCourse.value = newVal.mainCourse ? { ...newVal.mainCourse } : null;
    localSelectedSideDishGroup.value = newVal.sideDishes ? { ...newVal.sideDishes } : null;

    console.log('DailyMealEditPopup: localMainCourse after watch:', localMainCourse.value);
    console.log('DailyMealEditPopup: localSelectedSideDishGroup after watch:', localSelectedSideDishGroup.value);
  } else {
    console.warn('DailyMealEditPopup: dayMeal prop is null or undefined.');
    localMainCourse.value = null;
    localSelectedSideDishGroup.value = null;
  }
}, { immediate: true });

const getDayOfWeekShort = (dateStr) => {
  const d = dayjs(dateStr);
  const weekdayShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.day()];
  return weekdayShort;
};

// 傳遞完整的物件給父組件
const saveChanges = () => {
  if (!localMainCourse.value || !localSelectedSideDishGroup.value) {
    alert('主菜或副菜未選擇！');
    return;
  }
  emit('update-meal', {
    date: props.dayMeal.date,
    mainCourse: localMainCourse.value, // <-- 傳遞完整物件
    sideDishes: localSelectedSideDishGroup.value // <-- 傳遞完整物件
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
  // 複製物件以確保響應性獨立
  localMainCourse.value = { ...possibleMainDishesBasedOnTypes.value[randomIndex] };
  console.log('新主菜物件:', localMainCourse.value);
};

const openSideDishPicker = () => {
  console.log('--- 開始偵錯副菜隨機選擇 (DailyMealEditPopup) ---');
  // selectedSideDishGroups 現在已經是副菜組合物件的陣列了
  console.log('來自 store 的 selectedSideDishGroups.value (選中的副菜組合物件):', selectedSideDishGroups.value);

  // 確保 selectedSideDishGroups.value 有值
  if (!selectedSideDishGroups.value || selectedSideDishGroups.value.length === 0) {
    alert('無可選副菜組合，請先回到 Step 2 選擇副菜組合！');
    console.warn('selectedSideDishGroups 為空或未定義:', selectedSideDishGroups.value);
    return;
  }

  // !!! 修正點 2: 移除混淆的第二套邏輯，只保留正確的隨機選擇副菜組合物件的邏輯 !!!
  const randomIndex = Math.floor(Math.random() * selectedSideDishGroups.value.length);
  // 隨機選取的是一個副菜組合物件，並複製物件以確保響應性獨立
  localSelectedSideDishGroup.value = { ...selectedSideDishGroups.value[randomIndex] };

  console.log('新副菜組合物件:', localSelectedSideDishGroup.value);
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