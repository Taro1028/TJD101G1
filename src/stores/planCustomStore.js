// src/stores/planCustomStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDateRangeStore } from './dateRangeStore';
import { getDatesInRange } from '@/utils/date';
import customMealOptions from '@/data/RandomDishes.json';

export const usePlanCustomStore = defineStore('planCustom', () => {
  // --- State (狀態) ---
  // Step 1: 用戶選擇的 2 種主菜類型 (e.g., ['pork', 'chicken'])
  const selectedMainCourseTypes = ref([]);
  // Step 1: 用戶選擇的 2 種主菜名稱 (這應該在 Step 2 或 Step 3 才確認下來)
  // 如果 Step 1 只是選類型，那這個狀態應該在後續步驟才填寫，或者這個變數的意義需要釐清
  // 目前看來，selectedMainDishes 應該是在 Step 3 隨機生成時，從 selectedMainCourseTypes 決定的
  // 但如果你想讓用戶在 Step 1 就直接選兩個具體主菜，那這個命名可以保留，但邏輯需要調整
  // 根據你的 `Order_Select1_PlanFree.vue`，你目前是選類型，所以我先假設這個變數在選具體菜時使用。
  // 為了目前的 Order_Select1_PlanFree.vue，我會將其視為「選定的主菜類型」
  // 因此，selectedMainCourseTypes 其實就是 selectedMeats 的內容
  // 我會將 selectedMainDishes 的用途調整為「隨機生成時會從這些選定的主菜類型的清單中挑選的總清單」
  // 讓 selectedMainDishes 成為一個內部計算屬性，包含所有可選的主菜名稱
  
  const selectedSideDishGroups = ref([]); // Step 2: 用戶選擇的 5 個副菜組合的索引

  const customMealsByDate = ref([]);      // Step 3: 每天實際隨機生成的菜單及數量

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
  // const availableSideDishOptions = ref([
  //   { img: 'images/Order/sidedish2.jpg', text: ['蕃茄炒蛋', '金沙南瓜', '蒜炒空心菜'] },
  //   { img: 'images/Order/sidedish1.jpg', text: ['蒜蓉花椰菜', '炒高麗菜', '醋拌黑木耳'] },
  //   { img: 'images/Order/sidedish3.jpg', text: ['鐵板豆芽菜', '蔥花炒蛋', '川燙青江菜'] },
  //   { img: 'images/Order/sidedish4.jpg', text: ['川燙地瓜葉', '乾煸四季豆', '紅蘿蔔炒蛋'] },
  //   { img: 'images/Order/sidedish5.jpg', text: ['香滷筍絲', '豆干炒芹菜', '炒三色椒'] },
  //   { img: 'images/Order/sidedish6.jpg', text: ['醋拌小黃瓜', '蒜香薯丁', '椒鹽杏鮑菇'] },
  //   { img: 'images/Order/sidedish7.jpg', text: ['酥炸豆腐', '涼拌海帶絲', '蒜炒菠菜'] },
  //   { img: 'images/Order/sidedish8.jpg', text: ['麻婆豆腐', '香滷白菜', '玉米粒炒蛋'] },
  // ]);

  // 獲取所有實際的副菜名稱列表 (從所有副菜組合中提取，用於隨機生成)
  const allPossibleSideDishes = computed(() => {
    return customMealOptions.sideDishes.flatMap(group => group.text);
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
  function setSelectedSideDishGroups(indices) {
    selectedSideDishGroups.value = indices;
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

// *** 關鍵修正點：從索引獲取完整的副菜組合物件陣列 ***
    const selectedSideDishObjects = selectedSideDishGroups.value.map(index => {
      // 確保索引有效
      if (index >= 0 && index < availableSideDishOptions.value.length) {
        return availableSideDishOptions.value[index]; // 這是整個副菜組合物件 { img: '', text: [] }
      }
      console.warn(`無效的副菜組合索引: ${index}`);
      return null; // 或者處理為空物件
    }).filter(group => group !== null); // 過濾掉無效的索引

    // 檢查確保我們確實選到了 5 個副菜組合 (如果期望是 5 個)
    if (selectedSideDishObjects.length !== 5) { // 如果 selectedSideDishGroups 確實傳遞了 5 個索引
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
        
        // 取得該組合的副菜名稱陣列
        const randomSideDishes = randomSideDishGroup.text; 

        meals.push({
            date,
            dayOfWeek: new Date(date).getDay(),
            mainCourse: randomMainDish,
            sideDishes: randomSideDishes, // 直接使用整個組合的副菜名稱
            count: 1, // 預設數量為 1
        });
    });
    customMealsByDate.value = meals;
    console.log('customMealsByDate 成功初始化:', customMealsByDate.value);
}

  // Step 3: 增加餐盒數量
  function increaseCustomCount(date) {
    const day = customMealsByDate.value.find(d => d.date === date);
    if (day && day.count < 10) {
      day.count++;
    }
  }

  // Step 3: 減少餐盒數量
  function decreaseCustomCount(date) {
    const day = customMealsByDate.value.find(d => d.date === date);
    if (day && day.count > 1) {
      day.count--;
    }
  }


  const menuMode = ref('quantity'); // 'quantity' (預設), 'moveOrder', 'editContent'
  const isEditingModeActive = computed(() => menuMode.value !== 'quantity');
  
  function setMenuMode(mode) {
    menuMode.value = mode;
}

// 更新單日餐盒內容的方法
function updateCustomMeal(date, newMainCourse, newSideDishes) {
    const index = customMealsByDate.value.findIndex(d => d.date === date);
    if (index !== -1) {
        customMealsByDate.value[index].mainCourse = newMainCourse;
        customMealsByDate.value[index].sideDishes = newSideDishes;
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
    return CUSTOM_MEAL_PRICE * day.count;
  }

  // 計算所有日期的總金額
  const getTotalAllCustomDatesPrice = computed(() => {
    return customMealsByDate.value.reduce((sum, day) => {
      return sum + getCustomTotalPriceForDate(day.date);
    }, 0);
  });

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
    // allPossibleSideDishes,

    // Action
    resetMainCourseSelection,
    setSelectedMainCourseTypes, // 設定已選主菜類型
    setSelectedSideDishGroups,
    initializeCustomMealsByDate,
    increaseCustomCount,
    decreaseCustomCount,
    getCustomTotalCountForDate,
    getCustomTotalPriceForDate,
    getTotalAllCustomDatesPrice,
    CUSTOM_MEAL_PRICE,
    menuMode,
    isEditingModeActive,
    setMenuMode,
    updateCustomMeal
  };
});