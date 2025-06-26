<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, computed, ref } from 'vue' // 移除 watch，因為不再需要 computed setter
import { usePlanCustomStore } from '@/stores/planCustomStore.js';
import { useRouter } from 'vue-router'
import LeaveDialog from '@/components/Popup_OrderLeaveDialog.vue' // 引入 LeaveDialog

// 背景圖
onMounted(() => {
  document.body.classList.add('custom-bg')
  // 從 store 恢復上次的選擇（如果有的話）
  // 這裡需要將 store 中的 selectedMainCourseTypes 複製到 localSelectedMeats
  // 確保組件內部的 ref 與 store 狀態同步
  localSelectedMeats.value = [...planCustomStore.selectedMainCourseTypes];
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

const planCustomStore = usePlanCustomStore();
const router = useRouter();


const meats = [
  { value: 'pork', label: '豬肉', img: new URL('@/assets/images/Order/taiwanPork.svg', import.meta.url).href },
  { value: 'beef', label: '牛肉', img: new URL('@/assets/images/Order/aussieBeef.svg', import.meta.url).href },
  { value: 'fish', label: '魚肉', img: new URL('@/assets/images/Order/seafood.svg', import.meta.url).href },
  { value: 'chicken', label: '雞肉', img: new URL('@/assets/images/Order/chicken.svg', import.meta.url).href }
]

// 使用一個 local ref 來管理 checkbox 的選擇狀態，然後在 `toggleSelect` 時更新 Pinia Store
const localSelectedMeats = ref([]);

// 判斷是否符合 下一步 條件
const canProceed = computed(() => localSelectedMeats.value.length === 2);

// 切換選擇邏輯
function toggleSelect(value) {
  const index = localSelectedMeats.value.indexOf(value);

  if (index >= 0) {
    // 如果已選中，則移除
    localSelectedMeats.value.splice(index, 1);
  } else {
    // 如果未選中
    if (localSelectedMeats.value.length < 2) {
      // 如果未滿兩個，則新增
      localSelectedMeats.value.push(value);
    } else {
      // 如果已滿兩個，則提示
    //   console.log('localSelectedMeats.value.length:', localSelectedMeats.value.length);
    //   console.log('預期觸發 alert，已選:', [...localSelectedMeats.value]);
      alert('最多只能選擇 2 種主菜喔！');
      return; // 不更新 localSelectedMeats
    }
  }
//   console.log('點擊後 localSelectedMeats:', [...localSelectedMeats.value]);
  // 每當 localSelectedMeats 變動時，同步更新 Pinia Store 中的 selectedMainCourseTypes
  planCustomStore.setSelectedMainCourseTypes(localSelectedMeats.value);
//   console.log('Pinia store updated:', [...planCustomStore.selectedMainCourseTypes]);
}

// 判斷是否選中（UI 狀態）
function isSelected(value) {
  return localSelectedMeats.value.includes(value);
}

// 判斷是否禁用（UI 狀態）
function isDisabled(value) {
  // 當前項目未選中，且已選項目數量達到上限時禁用
  return !isSelected(value) && localSelectedMeats.value.length >= 2;
}

// 下一步邏輯
function goNext() {
  if (!canProceed.value) {
    alert('請選擇兩種主菜！'); // 增加提示
    return;
  }
  router.push('/Order/Select2_PlanFree'); // 確保路徑正確
}

// Popup 邏輯
const showPopup = ref(null)

function openPopup(value) {
  showPopup.value = value
}

function closePopup() {
  showPopup.value = null
}

// 清除原本選擇的選項
function handleLeaveConfirmed() {
  planCustomStore.resetMainCourseSelection(); 
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
        <a class="mobile" @click="openPopup('leave')">回主選單</a>
      </div>
      <ul class="step">
        <li class="finish"><span class="finishspan">1</span>選擇主菜</li>
        <li><span>2</span>選擇副菜</li>
        <li><span>3</span>確認菜單</li>
      </ul>
      <a class="desktop" @click="openPopup('leave')">回主選單</a>
      <LeaveDialog v-if="showPopup === 'leave'" @close="closePopup" @confirm-leave="handleLeaveConfirmed" />
    </div>

    <div class="operate">
      <h3>主菜 4 選 2 ({{ localSelectedMeats.length }}/2)</h3>
      <div class="checkboxblock">
        <label v-for="item in meats" :key="item.value"
            :class="{ 'selected-label': isSelected(item.value), 'disabled-label': isDisabled(item.value) }"
            @click="toggleSelect(item.value)"> 
            <div class="custom-checkbox">
                <i class="bi bi-check-square-fill" v-if="isSelected(item.value)"></i>
                <i class="bi bi-square" v-else></i>
            </div>
            <h4>{{ item.label }}</h4>
        </label>
      </div>
      <div class="selectimg">
        <div class="mainblock">
          <img src="../assets/images/Order/mainblock.png" alt="mainblock">
          <div class="selectmeal">
            <button v-for="item in meats" :key="item.value" class="btn"
                :class="[item.value + '-btn', isSelected(item.value) ? 'active' : '', isDisabled(item.value) ? 'disabled-btn' : '']"
                @click="toggleSelect(item.value)"> <img :src="item.img" :alt="item.label" />
            </button>
          </div>
        </div>
        <img class="mainbox" src="../assets/images/Order/mainbox1.png" alt="mainbox1">
      </div>
      <div class="btnblock">
        <button class="btn-1" @click="router.back()">上一步</button>
        <button class="btn-2" 
                :disabled="!canProceed" 
                @click="goNext">下一步
        </button>
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
    display: block;
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

// checkbox區塊
.checkboxblock {
    display: flex;
    gap: 40px;
}

.checkboxblock label {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
}

.checkboxblock h4 {
    font-size: $font_h4;
    font-weight: normal;
}

.checkboxblock input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: $primary_400;
    cursor: pointer;
    display: none;
}

// 選擇圖片區塊
.selectimg {
    margin-top: 40px;
    width: 500px;
    height: 420px;

    position: relative;
}

// 對話框
.mainblock {
    position: relative;
}

.selectmeal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.selectmeal .btn {
    position: absolute;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
}

.pork-btn {
    top: 25%;
    left: 15%;
}

.beef-btn {
    top: 25%;
    left: 35%;
}

.fish-btn {
    bottom: 28%;
    left: 15%;
}

.chicken-btn {
    bottom: 28%;
    left: 35%;
}

.selectmeal .btn img {
    width: 60px;
    display: block;
    height: auto;
    opacity: 0.4;
    transition: all 0.2s ease;
}

.selectmeal .btn:hover img,
.selectmeal .btn.active img {
    opacity: 1;
    transform: scale(1.05);
}

// 便當盒
.mainbox {
    width: 200px;
    height: 200px;

    position: absolute;
    right: 0;
    bottom: 0;
}

// 下一步按鈕
.btnblock {
    display: flex;
    align-self: flex-end;
    gap: 20px;
}

.btn-1 {
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    opacity: 0;
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

    .operate {
        width: 520px;
    }

    .selectimg {
        width: 340px;
    }

    .mainblock img {
        width: 280px;
    }

    .pork-btn {
        top: 25%;
        left: 20%;
    }

    .beef-btn {
        top: 25%;
        left: 45%;
    }

    .fish-btn {
        bottom: 28%;
        left: 20%;
    }

    .chicken-btn {
        bottom: 28%;
        left: 45%;
    }
}

@media screen and (max-width: 550px) {
    .headline {
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

    .checkboxblock h4 {
        font-size: $font_h5;
    }

    .checkboxblock {
        gap: 12px;
    }

    .mainbox {
        width: 160px;
        height: 160px;
    }

    .btnblock {
        margin-top: 20px;
        align-self: center;
    }

    .btn-1 {
        display: none;
    }

}
</style>