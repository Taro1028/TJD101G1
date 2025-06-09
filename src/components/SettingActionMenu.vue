<template>
  <div class="action-menu">
    <div class="menu-item" @click="handleMoveOrder">
      <i class="bi bi-list"></i> 移動菜單順序
    </div>
    <div class="menu-item" @click="handleEditContent">
      <i class="bi bi-pencil"></i> 編輯菜單內容
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['move-order', 'edit-content', 'close']);

const handleMoveOrder = () => {
  emit('move-order');
  emit('close'); // 點擊後關閉菜單
};

const handleEditContent = () => {
  emit('edit-content');
  emit('close'); // 點擊後關閉菜單
};
</script>

<style scoped lang="scss">
// 樣式同之前提供的 DailyMenuActionMenu.vue，只是名稱變了
.action-menu {
  position: absolute;
  background-color: white;
  border: 1px solid $neutral_300;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  padding: 12px 0;

  .menu-item {
    padding: 12px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: $font_p; 
    color: $neutral_700;

    &:hover {
      background-color: $neutral_100;
    }

    i {
      font-size: $font_h6; 
      color: $neutral_700;
    }
  }
}
</style>