<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="left-section">
        <RouterLink to="/Home"
          ><img src="../assets/images//Logo_S.svg" alt="logo_s"
        /></RouterLink>
        <h1 class="signup-title">忘記密碼</h1>
        <p class="signup-subtitle">不要擔心，只要輸入你的信箱</p>

        <!-- 輸入電子信箱欄位 -->
        <div class="signup_form">
          <div class="signup_form_component">
            <label for="EMAIL">電子信箱</label>
            <input
              type="text"
              id="EMAIL"
              name="EMAIL"
              class="signup_name"
              placeholder="輸入註冊時的電子信箱"
              v-model="email"
            />
          </div>

          <div>
            <RouterLink to="/Login" class="signup_link"
              style="margin-bottom: 1rem;"><i class="bi bi-arrow-left"></i>回到登入頁面</RouterLink
            >
          </div>

          <button type="submit" class="signup_submit" @click="handleForgotPassword">
            找回密碼
          </button>
        </div>

      </div>
      <!-- 右側圖片區塊 -->
      <div class="right-section">
        <img src="../assets/images/Member/forgot_pic.svg" alt="忘記的插圖" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 只保留email的響應式數據，用於v-model綁定
const email = ref("");

// 處理忘記密碼按鈕點擊事件
const handleForgotPassword = () => {
  alert("功能尚未開發，敬請期待！");
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: "jf-openhuninn";
  src: url("@/assets/font/jf-openhuninn-2.1.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: "jf-openhuninn", sans-serif;
}

img {
  display: block;
}

a {
  text-decoration: none;
  color: black;
}

.page-container {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  background-color: $primary_50;
}

// 主要內容容器
.content-wrapper {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  min-height: 100vh;
}

/* 左側layout */
.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

.signup-title {
  font-size: 4.5rem;
  font-weight: bold;
  margin-top: $spacing_2;
  margin-bottom: $spacing_3;
}
.signup_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: $spacing_20;
  margin-bottom: $spacing_20;
}

.signup-subtitle {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 0;
}

/* 表單部分 */
.signup_form {
  display: flex;
  flex-direction: column;
  width: 320px;
  padding: 24px;
  margin-top: $spacing_3;
  border: $neutral_300 1px solid;
  border-radius: 8px;
  gap: $spacing_3;
}

/* signup_form_component 樣式 */
.signup_form_component label {
  display: block;
  line-height: 1.4;
  color: $neutral_black;
  margin-bottom: $spacing_2;
}

.signup_form_component input {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  background-color: $neutral_white;
  border: 1px solid $neutral_300;
  border-radius: 12px;
  color: $neutral_black;
  box-sizing: border-box;
}

.signup_form_component input::placeholder {
  color: $neutral_300;
}

.signup_form_component input:focus {
  outline: none;
  border-color: $primary_400;
  box-shadow: 0 0 0 2px rgba(241, 180, 46, 0.2);
}

.forgot-password {
  color: $neutral_300;
}
a.signup_link {
  color: $point_700;
}

.signup_submit {
  height: 40px;
  background-color: $primary_600;
  color: $neutral_white;
  border-radius: 999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: none;
}

.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;

  img {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    object-fit: cover;
    object-position: center;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .right-section {
    display: none;
  }
}
@media (max-width: 375px) {
  .page-container {
    min-height: 100vh;
    align-items: center;
    justify-content: center;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .left-section {
    width: 100%;
    max-width: 350px;
  }

  .right-section {
    display: none;
  }
}
</style>