// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDateRangeStore } from './dateRangeStore';
import { getDatesInRange } from '@/utils/date';
import foodData from '@/data/LunchBoxItems.json';
import { useCartStore } from './cartStore'; // 導入 cartStore

export const useOrderStore = defineStore('order', () => {
  const selectedPlan = ref(''); // 這是您選擇的為你搭配方案，例如 '經典為你配'
  const planForYouSelections = ref([]); // 這是每天餐點的選擇和數量

  const dateRangeStore = useDateRangeStore();
  const cartStore = useCartStore(); // 獲取 cartStore 實例

  const deliveryDates = computed(() => {
    const start = dateRangeStore.startDate;
    const end = dateRangeStore.endDate;

    if (!start || !end) {
      return [];
    }
    return getDatesInRange(start, end);
  });

  // ***** initializeOrderDates 保持不變，因為它已經正確初始化 planForYouSelections 結構 *****
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
          id: item.id, // 確保從 foodData 獲取 ID
          name: item.title, // 使用 title 作為名稱
          count: 0,
          price: item.price
          // 在這裡不需要添加 category，因為 LunchBoxItems.json 的頂層 item 就是一個套餐
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

    if (newTotal <= 10 && newCount >= 0) { // 假設每天最多 10 份，且數量不能為負
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

  // 新增 computed properties 計算整個訂單的總數和總金額
  const totalMealCount = computed(() => {
    return planForYouSelections.value.reduce((totalDaysSum, day) => {
      return totalDaysSum + day.meals.reduce((totalMealsPerDay, meal) => totalMealsPerDay + (meal.count || 0), 0);
    }, 0);
  });

  const totalPrice = computed(() => {
    return planForYouSelections.value.reduce((totalDaysSum, day) => {
      return totalDaysSum + day.meals.reduce((totalPricePerDay, meal) => totalPricePerDay + (meal.count * meal.price || 0), 0);
    }, 0);
  });

  const totalDays = computed(() => {
    return deliveryDates.value.length; // 這是總天數
  });


  // 新增 Action: 將所有為你搭配餐點加入購物車 (在確認訂單時呼叫)
  async function addPlanForYouToCart(messageCardId = null) { // 允許傳入留言小卡內容
    if (!cartStore) {
      console.error("Cart store not available.");
      return;
    }

    if (planForYouSelections.value.length === 0) {
      alert('請先選擇為您搭配的餐點！');
      return;
    }

    const orderItems = []; // 準備傳遞給後端的 orderItems 陣列

    for (const daySelection of planForYouSelections.value) {
      const selectedMealsForDay = daySelection.meals.filter(meal => meal.count > 0);

      if (selectedMealsForDay.length === 0) {
        continue; // 如果這天沒有選擇餐點，則跳過
      }

      // 對於固定套餐，meal_items_json 應該只有一個主要商品 (固定套餐本身)
      const mealItemsContent = [];
      let dailyTotalCount = 0;
      let dailyTotalPrice = 0;

      for (const meal of selectedMealsForDay) {
        const originalFoodItem = foodData.find(f => f.id === meal.id); // 使用 ID 來查找原始數據
        if (!originalFoodItem) {
          console.error('無法找到對應的餐點ID:', meal.id);
          alert(`餐點ID "${meal.id}" 數據不完整，無法加入購物車。`);
          return; // 選擇中斷並提示用戶
        }

        // 將固定套餐本身作為 meal_items 中的一個項目
        mealItemsContent.push({
          name: originalFoodItem.title,
          quantity: meal.count,
          price: originalFoodItem.price
        });

        dailyTotalCount += meal.count;
        dailyTotalPrice += meal.count * meal.price;
      }

      orderItems.push({
        plan_type: '為你搭配', // 每個項目都需要方案類型
        meal_date: daySelection.date,
        meal_items: JSON.stringify(mealItemsContent),
        count: dailyTotalCount,
        total_amount: dailyTotalPrice,
        order_start_date: deliveryDates.value[0], // 每個項目都需要起始日期
        order_end_date: deliveryDates.value[deliveryDates.value.length - 1], // 每個項目都需要結束日期
        total_days: totalDays.value // 每個項目都需要總天數
      });
    }

    console.log('orderStore: 準備發送訂單項目給 cartStore (為你搭配):', orderItems);

    try {
      await cartStore.addOrderToBackendAndLocalCart(orderItems, messageCardId);
      alert('所有為您搭配餐點已成功加入購物車！');
    } catch (error) {
      console.error('將為你搭配餐點加入購物車失敗:', error);
      alert('加入購物車失敗，請稍後再試。');
    }
  }

  // 可選：重置整個 orderStore 狀態的方法
  function resetOrderState() {
    selectedPlan.value = '';
    planForYouSelections.value = [];
    // 其他需要重置的狀態
    console.log('OrderStore 狀態已重置。');
  }

  return {
    resetSelection,
    selectedPlan,
    planForYouSelections,
    deliveryDates,
    initializeOrderDates,
    updateMealCount,
    getTotalCountForDate,
    getTotalPriceForDate,
    totalMealCount, // 新增的 Getter
    totalPrice,     // 新增的 Getter
    totalDays,      // 新增的 Getter
    addPlanForYouToCart, // 新增的 Action
    resetOrderState // 新增的 Action
  };
});