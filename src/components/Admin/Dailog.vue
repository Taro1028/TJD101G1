<template>
  <div v-if="visible" class="dialog-overlay" @click.self="close">
    <div class="dialog-box">
      <!-- <slot /> -->
      <section class="webform">
        <h2 class="form-title">新增/修改</h2>

        <section class="s1">
          <div class="form-row">
            <label>網站資料編號</label>
            <input type="text" name="id" />
          </div>

          <div class="form-row">
            <label>標題</label>
            <input type="text" name="title" />
          </div>
        </section>

        <section class="s1">
          <div class="form-row">
            <label>內文</label>
            <input type="text" name="content" />
          </div>

          <div class="form-row">
            <label>圖片</label>
            <input type="text" name="image" />
          </div>
        </section>

        <section class="s1">
          <div class="form-row">
            <label>網站頁面</label>
            <input type="text" name="page" />
          </div>

          <div class="form-row">
            <label>城市</label>
            <select name="city">
              <option disabled selected value="">請選擇城市</option>
              <option>新北市</option>
              <option>台北市</option>
              <option>桃園市</option>
              <option>高雄市</option>
            </select>
          </div>
        </section>
        <div class="form-rowsp">
          <label>消息上下架狀態</label>
          <select name="status" class="st">
            <option value="上架">上架</option>
            <option value="下架">下架</option>
          </select>
        </div>

        <div class="form-button-group">
          <button type="button" class="btn save" @click="">儲存</button>
          <button type="button" class="btn cancel" @click="close">關閉</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["update:visible"]);

const close = () => {
  emit("update:visible", false);
};
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.dialog-box {
  background: $primary_50;
  //   padding: 1.5rem;
  border-radius: 8px;
  min-width: 300px;
}
.dialog-actions {
  text-align: right;
  margin-top: 1rem;
}
.form-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: $primary_400;
  //   border: 1px solid rgb(206, 126, 126);
  font-size: $font_h5;
  text-align: center;
}
.webform {
  display: flex;
  flex-direction: column;
}
.s1 {
  display: flex;
  padding: 30px;
}
.form-row {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.form-row input,
select {
  border: none;
}

.st {
  width: 50%;
}
.form-rowsp {
  display: flex;
  flex-direction: column;
  padding-left: 49px;
  padding-top: 20px;
  padding-bottom: 30px;
}
.form-button-group {
  display: flex;
  justify-content: center; /* 讓按鈕們整體置中 */
  gap: 20px; /* 按鈕之間間距 */
  margin-top: 30px;
}
.form-button-group button {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: none;
  background-color: $primary_600;
  border-radius: 4px;
  margin: 10px;
  color: #fff;
  cursor: pointer;
  padding: 0;
}
</style>
