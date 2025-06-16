// src/stores/planCustomStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDateRangeStore } from './dateRangeStore';
import { getDatesInRange } from '@/utils/date';
import customMealOptions from '@/data/RandomDishes.json'; // 確保這個路徑正確且文件有內容
import { useCartStore } from './cartStore';

export const usePlanCustomStore = defineStore('planCustom', () => {
  // --- State (狀態) ---
  // Step 1: 用戶選擇的 2 種主菜類型 (e.g., ['pork', 'chicken'])
  const selectedMainCourseTypes = ref([]);
  // Step 2: 用戶選擇的 5 個副菜組合的索引
  const selectedSideDishGroups = ref([]); 
  // Step 3: 每天實際隨機生成的菜單及數量
  const customMealsByDate = ref([]);       

  const CUSTOM_MEAL_PRICE = 390; // 自由搭配餐盒統一價格



  // --- Getters (計算屬性) ---
  const dateRangeStore = useDateRangeStore();

  const deliveryDates = computed(() => {
    const start = dateRangeStore.startDate;
    const end = dateRangeStore.endDate;
    if (!start || !end) {
      return [];
    }
    return getDatesInRange(start, end);
  });

  // 獲取所有主菜選項，用於 Step 1 頁面顯示（按類型分類）
  const availableMainCourseOptions = computed(() => customMealOptions.mainCourses);

  // 根據已選的主菜類型，計算出所有可能的具體主菜列表
  const possibleMainDishesBasedOnTypes = computed(() => {
    const dishes = [];
    selectedMainCourseTypes.value.forEach(type => {
      if (customMealOptions.mainCourses[type]) {
        dishes.push(...customMealOptions.mainCourses[type]);
      }
    });
    return dishes;
  });

  // 獲取所有副菜組合選項，用於 Step 2 頁面顯示
  const availableSideDishOptions = computed(() => customMealOptions.sideDishes);

  // 計算所有日期的總金額 (自由搭配的總金額，包含數量)
  const getTotalAllCustomDatesPrice = computed(() => {
    return customMealsByDate.value.reduce((sum, day) => {
      // 自由搭配是單一價格 * 數量
      return sum + (day.count * CUSTOM_MEAL_PRICE);
    }, 0);
  });

  // 計算所有日期的總餐盒數量
  const getTotalAllCustomDatesCount = computed(() => {
    return customMealsByDate.value.reduce((sum, day) => {
        return sum + day.count;
    }, 0);
  });


  // --- Actions (動作) ---

  // 重置主菜類型選擇
  function resetMainCourseSelection() {
    selectedMainCourseTypes.value = [];
    console.log('Main course selection reset.');
  }

  // Step 1: 設定選擇的主菜類型
  function setSelectedMainCourseTypes(types) {
    selectedMainCourseTypes.value = types;
  }

  // Step 2: 設定選擇的 5 個副菜組合索引
  function setSelectedSideDishGroups(sideDishObjects) {
    selectedSideDishGroups.value = sideDishObjects;
  }

  // Step 3: 初始化每天的餐盒內容（隨機生成）
  function initializeCustomMealsByDate() {
    console.log('--- 進入 PlanCustomStore initializeCustomMealsByDate 函式 ---');
    console.log('日期範圍:', deliveryDates.value);
    console.log('已選主菜類型:', selectedMainCourseTypes.value);
    console.log('已選副菜組合索引:', selectedSideDishGroups.value);

    // 檢查關鍵數據是否齊全
    if (!deliveryDates.value.length || selectedMainCourseTypes.value.length !== 2 || selectedSideDishGroups.value.length !== 5) {
      console.error('PlanCustomStore: 初始化失敗，缺少日期、主菜類型或副菜組合。');
      customMealsByDate.value = [];
      return;
    }

    // 從已選的主菜類型中，獲取所有可能的主菜名稱
    const mainDishesToPickFrom = possibleMainDishesBasedOnTypes.value;
    if (mainDishesToPickFrom.length === 0) {
      console.error('沒有可供選擇的主菜！請檢查 customMealOptions.json 或選取邏輯。');
      customMealsByDate.value = [];
      return;
    }

    // *** 關鍵修正點： selectedSideDishObjects 已經是正確的副菜組合物件陣列了 ***
    const selectedSideDishObjects = selectedSideDishGroups.value; // <-- 直接使用 state

    // 檢查確保我們確實選到了 5 個副菜組合
    if (selectedSideDishObjects.length !== 5) {
      console.error('PlanCustomStore: 未選到足夠的副菜組合！');
      customMealsByDate.value = [];
      return;
    }

    const meals = [];
    deliveryDates.value.forEach(date => {
      // 隨機選擇一個主菜 (從已選類型中抽取)
      const randomMainDish = mainDishesToPickFrom[Math.floor(Math.random() * mainDishesToPickFrom.length)];

      // 從已選的 5 個副菜組合中，隨機選擇一個組合
      const randomSideDishGroup = selectedSideDishObjects[Math.floor(Math.random() * selectedSideDishObjects.length)];

      meals.push({
        date,
        dayOfWeek: new Date(date).getDay(),
        mainCourse: { // <-- 儲存主菜的 ID、名稱、價格等資訊
          id: randomMainDish.id,
          name: randomMainDish.name,
          price: randomMainDish.price,
          category: randomMainDish.category,
          subCategory: randomMainDish.subCategory
        },
        sideDishes: { // <-- 儲存副菜組合的 ID、名稱、價格等資訊
          id: randomSideDishGroup.id,
          groupName: randomSideDishGroup.groupName, // 組合的名稱
          price: randomSideDishGroup.price || 0, // 副菜組合通常是 0
          category: randomSideDishGroup.category,
          dishes: randomSideDishGroup.dishes.map(d => ({ // 儲存組成這個組合的單個副菜資訊
            id: d.id, name: d.name, price: d.price, category: d.category
          }))
        },
        count: 1, // 預設數量為 1
      });
    });
    customMealsByDate.value = meals;
    console.log('customMealsByDate 成功初始化:', customMealsByDate.value);
  }

  // Step 3: 增加餐盒數量
  function increaseCustomCount(date) {
    const day = customMealsByDate.value.find(d => d.date === date);
    if (day && day.count < 10) { // 假設最多 10 份
      day.count++;
    }
  }

  // Step 3: 減少餐盒數量
  function decreaseCustomCount(date) {
    const day = customMealsByDate.value.find(d => d.date === date);
    if (day && day.count > 1) { // 假設最少 1 份
      day.count--;
    }
  }


  const menuMode = ref('quantity'); // 'quantity' (預設), 'moveOrder', 'editContent'
  const isEditingModeActive = computed(() => menuMode.value !== 'quantity');

  function setMenuMode(mode) {
    menuMode.value = mode;
  }

  // 更新單日餐盒內容的方法
  function updateCustomMeal(date, newMainCourse, newSideDishGroup) {
    const index = customMealsByDate.value.findIndex(d => d.date === date);
    if (index !== -1) {
      customMealsByDate.value[index].mainCourse = { // <-- 確保儲存的是物件
        id: newMainCourse.id,
        name: newMainCourse.name,
        price: newMainCourse.price,
        category: newMainCourse.category,
        subCategory: newMainCourse.subCategory
      };
      customMealsByDate.value[index].sideDishes = { // <-- 確保儲存的是物件
        id: newSideDishGroup.id,
        groupName: newSideDishGroup.groupName || newSideDishGroup.name,
        price: newSideDishGroup.price,
        category: newSideDishGroup.category,
        dishes: newSideDishGroup.dishes.map(d => ({
            id: d.id, name: d.name, price: d.price, category: d.category
        }))
      };
      console.log(`更新了 ${date} 的餐盒內容:`, customMealsByDate.value[index]);
    }
  }

  // Step 3: 獲取某天的餐盒總份數
  function getCustomTotalCountForDate(date) {
    const day = customMealsByDate.value.find(d => d.date === date);
    return day ? day.count : 0;
  }

  // Step 3: 獲取某天的餐盒總價格
  function getCustomTotalPriceForDate(date) {
    const day = customMealsByDate.value.find(d => d.date === date);
    if (!day) return 0;
    // 自由搭配的價格是固定的 CUSTOM_MEAL_PRICE
    return CUSTOM_MEAL_PRICE * day.count;
  }

  // 新增 Action: 將所有 customMealsByDate 內容加入購物車
async function addAllCustomMealsToCart(messageCardId = null) {
  if (customMealsByDate.value.length === 0) {
    alert('請先生成自由搭配餐點！');
    return;
  }

  try {
    const orderItems = [];

    // 將每一天的餐點轉換為後端所需格式
    customMealsByDate.value.forEach(mealDay => {
      if (mealDay.count > 0) {
        // 簡化的 meal_items 格式，與為你搭配保持一致
        const mealItemsContent = [{
          name: `${mealDay.mainCourse.name}餐食`,
          price: CUSTOM_MEAL_PRICE,
          quantity: mealDay.count
        }];

        orderItems.push({
          plan_type: '自由搭配',
          meal_date: mealDay.date,
          meal_items: JSON.stringify(mealItemsContent),
          count: mealDay.count,
          total_amount: CUSTOM_MEAL_PRICE * mealDay.count,
          order_start_date: deliveryDates.value[0],
          order_end_date: deliveryDates.value[deliveryDates.value.length - 1],
          total_days: deliveryDates.value.length
        });
      }
    });

    // === 除錯資訊 ===
    console.log('=== 自由搭配 - 準備傳送的資料 ===');
    console.log('orderItems:', JSON.stringify(orderItems, null, 2));
    console.log('messageCardId:', messageCardId);
    console.log('================================');

    // 直接傳送 orderItems 和 messageCardId，與為你搭配的格式一致
    const cartStore = useCartStore();
    await cartStore.addOrderToBackendAndLocalCart(orderItems, messageCardId);
    
    console.log('自由搭配餐點已成功加入購物車');
  } catch (error) {
    console.error('新增自由搭配餐點到購物車失敗:', error);
    throw error; // 重新拋出錯誤，讓上層處理
  }
}

  // 可選：重置整個 planCustomStore 狀態的方法
  function resetPlanCustomState() {
    selectedMainCourseTypes.value = [];
    selectedSideDishGroups.value = [];
    customMealsByDate.value = [];
    // 其他需要重置的狀態
    console.log('PlanCustomStore 狀態已重置。');
  }


  return {
    // 狀態
    selectedMainCourseTypes, // 儲存用戶選擇的「類型」
    selectedSideDishGroups,
    customMealsByDate,

    // Getter
    deliveryDates,
    availableMainCourseOptions, // 原始的主菜類型選項
    possibleMainDishesBasedOnTypes, // 根據選定類型過濾出的實際主菜清單
    availableSideDishOptions,
    getTotalAllCustomDatesPrice, // 新增的 Getter
    getTotalAllCustomDatesCount, // 新增的 Getter


    // Action
    resetMainCourseSelection,
    setSelectedMainCourseTypes,
    setSelectedSideDishGroups,
    initializeCustomMealsByDate,
    increaseCustomCount,
    decreaseCustomCount,
    getCustomTotalCountForDate,
    getCustomTotalPriceForDate,
    CUSTOM_MEAL_PRICE,
    menuMode,
    isEditingModeActive,
    setMenuMode,
    updateCustomMeal,
    addAllCustomMealsToCart, 
    resetPlanCustomState
  };
});