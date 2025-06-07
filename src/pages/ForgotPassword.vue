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
          <p class="reset_text" :class="{ 'status-active': showStatus }">
            系統將為找回密碼，密碼將顯示在下方
        </p>
            <!-- 狀態欄 -->
           <div class="status-container" v-if="showStatus">
                <!-- 成功狀態 -->
                <div class="status-card success" v-if="statusType === 'success'">
                    <div class="status-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <h3>密碼找回成功！</h3>
                    <p>您的密碼為：</p>
                    <div class="new-password">
                        <span class="password-text">{{ newPassword }}</span>
                        <button class="copy-btn" @click="copyPassword">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    </div>
                    <p class="security-note">請在登入後立即修改密碼</p>
                </div>
                 <!-- 錯誤狀態 -->
                <div class="status-card error" v-if="statusType === 'error'">
                    <div class="status-icon">
                    <i class="bi bi-x-circle-fill"></i>
                    </div>
                    <h3>找不到此帳號</h3>
                    <p>查無此電子信箱，請確認後重新輸入</p>
                </div>
            </div>

          <button type="submit" class="signup_submit" @click="handleLogin">
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

// 響應式數據
const email = ref("");
const showStatus = ref(false);
const statusType = ref(""); // 'success' 或 'error'
const newPassword = ref("");

// 找回密碼處理函數
const handleLogin = async () => {
  // 清除之前的狀態
  showStatus.value = false;
  statusType.value = "";
  newPassword.value = "";

  // 驗證輸入
  if (!email.value) {
    alert("請輸入使用者email");
    return;
  }

  try {
    const response = await fetch("/tjd101/g1/php/", { //修改網址
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EMAIL: email.value,
      }),
    });

    // 處理響應
    if (response.ok) {
      const result = await response.json();
      console.log("找回密碼結果:", result);
      
      // 根據後端回應判斷成功或失敗
      if (result.success && result.password) {
        statusType.value = "success";
        newPassword.value = result.password; // 直接使用資料庫查找到的密碼
      } else {
        statusType.value = "error";
      }
    } else {
      console.error("請求失敗:", response.statusText);
      statusType.value = "error";
    }
  } catch (error) {
    console.error("網路錯誤:", error);
    alert("網路連線錯誤，請稍後再試");
    return;
  }

  // 顯示狀態區塊
  showStatus.value = true;
};

// 複製密碼到剪貼簿
const copyPassword = async () => {
  try {
    // Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(newPassword.value);
      alert("密碼已複製到剪貼簿！");
      return;
    }
    
    // 備用方案：使用 Selection API
    if (window.getSelection) {
      const textArea = document.createElement("textarea");
      textArea.value = newPassword.value;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      try {
        // 仍需要使用 execCommand，但加上 @ts-ignore 或註解說明
        const successful = document.execCommand('copy'); // 備用方案
        if (successful) {
          alert("密碼已複製到剪貼簿！");
        } else {
          throw new Error("複製失敗");
        }
      } catch (err) {
        throw new Error("複製失敗");
      } finally {
        document.body.removeChild(textArea);
      }
      return;
    }
    
    // 手動提示
    alert(`請手動複製密碼：${newPassword.value}`);
    
  } catch (error) {
    console.error("複製失敗:", error);
    // 降級處理：顯示密碼讓用戶手動複製
    alert(`複製失敗，請手動複製密碼：${newPassword.value}`);
  }
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

// 文字提示區塊
.reset_text {
    margin-bottom: 8rem;
    transition: margin-bottom 0.3s ease;
    
    &.status-active {
        margin-bottom: 2rem;
    }
}

// 找回密碼狀態訊息欄
.status-container {
  margin-top: $spacing_4;
  width: 100%;
}

.status-card {
  padding: $spacing_6;
  border-radius: 12px;
  text-align: center;
  
  &.success {
    background-color: rgba(140, 187, 74, 0.1);
    border: 1px solid $success_400;
  }
  
  &.error {
    background-color: rgba(229, 67, 67, 0.1);
    border: 1px solid $danger_500;
  }
}

.status-icon {
  font-size: 3rem;
  margin-bottom: $spacing_3;
  
  .success & {
    color: $success_400;
  }
  
  .error & {
    color: $danger_500;
  }
}

.status-card h3 {
  margin: 0 0 $spacing_2 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.status-card p {
  margin: 0 0 $spacing_2 0;
  color: $neutral_700;
}

.new-password {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing_2;
  margin: $spacing_3 0;
  padding: $spacing_3;
  background-color: $neutral_white;
  border-radius: 8px;
  border: 1px solid $neutral_300;
}

.password-text {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: $primary_600;
}

.copy-btn {
  background: none;
  border: none;
  color: $point_700;
  cursor: pointer;
  font-size: 1.1rem;
  
  &:hover {
    color: $primary_600;
  }
}

.security-note {
  font-size: 0.875rem;
  color: $neutral_700;
  font-style: italic;
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
