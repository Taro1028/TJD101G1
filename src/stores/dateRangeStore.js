// stores/dateRangeStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue'; // 確保引入 ref

export const useDateRangeStore = defineStore('dateRange', () => {
  // 狀態 (State)
  const startDate = ref(''); // 使用 ref 包裝響應式狀態
  const endDate = ref('');   // 使用 ref 包裝響應式狀態

  // 動作 (Actions)
  // 將 setRange 改為 setDates，語義更明確，並與之前的討論保持一致
  function setDates(start, end) {
    startDate.value = start; // 修改 ref 的值需要透過 .value
    endDate.value = end;     // 修改 ref 的值需要透過 .value
  }

  // 額外增加一個清除日期的 action，方便重置
  function clearDates() {
    startDate.value = '';
    endDate.value = '';
  }

  // 導出狀態和動作
  return {
    startDate,
    endDate,
    setDates, // 導出 setDates 函式
    clearDates // 導出 clearDates 函式
  };
});