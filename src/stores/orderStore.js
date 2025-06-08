// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDateRangeStore } from './dateRangeStore';
import { getDatesInRange } from '@/utils/date';
import foodData from '@/data/LunchBoxItems.json'; // 確保這個路徑正確且文件有內容

export const useOrderStore = defineStore('order', () => {
  const selectedPlan = ref('');
  const planForYouSelections = ref([]); // 這是需要被填充的陣列

  const dateRangeStore = useDateRangeStore();

  const deliveryDates = computed(() => {
    const start = dateRangeStore.startDate;
    const end = dateRangeStore.endDate;

    if (!start || !end) {
      return [];
    }
    return getDatesInRange(start, end);
  });

  // ***** 將 initializeOrderDates 修正回完整邏輯 *****
  function initializeOrderDates() {
    console.log('--- 進入 OrderStore initializeOrderDates 函式 ---');
    console.log('步驟 1: deliveryDates.value (從 getter 取得的值) 是:', deliveryDates.value);
    console.log('步驟 2: foodData (從 LunchBoxItems.json 導入的資料) 是:', foodData);

    if (!deliveryDates.value || deliveryDates.value.length === 0) {
      console.warn('OrderStore: deliveryDates 是空的，跳過 planForYouSelections 的初始化。');
      planForYouSelections.value = [];
      return;
    }

    if (!foodData || !Array.isArray(foodData) || foodData.length === 0) {
      console.error('OrderStore: foodData 是空的、不是陣列，或未正確載入。無法初始化餐點。');
      planForYouSelections.value = [];
      return;
    }

    try {
      planForYouSelections.value = deliveryDates.value.map(date => ({
        date,
        meals: foodData.map(item => ({
          name: item.title,
          count: 0,
          price: item.price
        }))
      }));
      console.log('步驟 3: planForYouSelections 成功初始化！目前的內容是:', planForYouSelections.value);
    } catch (error) {
      console.error('初始化 planForYouSelections 時發生錯誤:', error);
      planForYouSelections.value = [];
    }
  }
  // ***** 修正結束 *****

  function resetSelection() {
    planForYouSelections.value = [];
    console.log('Main course selection reset.');
  }

  function updateMealCount(date, mealName, newCount) {
    const day = planForYouSelections.value.find(d => d.date === date);
    if (!day) return;

    const totalCount = day.meals.reduce((sum, meal) => sum + meal.count, 0);
    const currentMeal = day.meals.find(m => m.name === mealName);
    if (!currentMeal) return;

    const countDifference = newCount - currentMeal.count;
    const newTotal = totalCount + countDifference;

    if (newTotal <= 10 && newCount >= 0) {
      currentMeal.count = newCount;
    }
  }

  function getTotalCountForDate(date) {
    const day = planForYouSelections.value.find(d => d.date === date);
    if (!day) return 0;
    return day.meals.reduce((sum, meal) => sum + meal.count, 0);
  }

  function getTotalPriceForDate(date) {
    const day = planForYouSelections.value.find(d => d.date === date);
    if (!day) return 0;
    return day.meals.reduce((sum, meal) => sum + meal.count * meal.price, 0);
  }

  return {
    resetSelection,
    selectedPlan,
    planForYouSelections,
    deliveryDates,
    initializeOrderDates,
    updateMealCount,
    getTotalCountForDate,
    getTotalPriceForDate
  };
});