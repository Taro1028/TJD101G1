<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="left-section">
        <router-link to="/Home"
          ><img src="../assets/images//Logo_S.svg" alt="logo_s"
        /></router-link>
        <h1 class="signup-title">會員登入</h1>
        <p class="signup-subtitle">開始點餐吧</p>

        <!-- 建立帳號表單 -->
        <div class="signup_form">
          <div class="signup_form_component">
            <label for="name">帳號</label>
            <input
              type="text"
              id="EMAIL"
              name="name"
              class="signup_name"
              placeholder="請輸入註冊信箱"
              v-model="email"
            />
          </div>

          <div class="signup_form_component">
            <label for="password">密碼</label>
            <input
              type="password"
              name="password"
              id="PASSWORD"
              class="signup_password"
              placeholder="8-16個英數組成"
              v-model="password"
            />
          </div>

          <div>
            <router-link to="/ForgotPassword" class="forgot-password"
              >忘記密碼？</router-link
            >
          </div>

          <div>
            <router-link to="/Sign_Up" class="signup_link"
              >還沒有帳號？點我註冊</router-link
            >
          </div>

          <!-- 快速註冊區塊 -->
          <div class="fast_signup">
            <p>快速登入</p>
            <div class="social_links">
              <a href="#"
                ><img
                  src="../assets/images/Member/Google_color.svg"
                  alt="google-signup"
              /></a>
              <button @click="handleLineLogin" class="line-button" aria-label="使用 Line 登入">
                <img src="../assets/images/Member/Line_color.svg" alt="line-signup" />
              </button>
              <!-- <a href="#"
                ><img
                  src="../assets/images/Member/Line_color.svg"
                  alt="line-signup"
                  aria-label="使用 Line 登入" 
                  @click="handleLineLogin"
              /></a> -->
            </div>
          </div>

          <button type="submit" class="signup_submit" @click="handleLogin">
            登入
          </button>
        </div>
        <!-- 註冊表單結束 -->
      </div>
      <!-- 右側圖片區塊 -->
      <div class="right-section">
        <img src="../assets/images/Member/login_pic.svg" alt="外送插圖" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useMemberStore } from "../stores/MemberStore";
import { useModalStore } from "../stores/ModalStore";
import { useRouter } from "vue-router";

const member = useMemberStore();
const modalStore = useModalStore();
const router = useRouter();

// 響應式數據
const email = ref("");
const password = ref("");
const env = import.meta.env.VITE_API_URL;
// const env = "";
// 登入處理函數
const handleLogin = async () => {
  // 驗證輸入
  if (!email.value) {
    alert("請輸入使用者email");
    return;
  }

  if (!password.value) {
    alert("請輸入使用者密碼");
    return;
  }

  try {
    const response = await fetch(env + "/tjd101/g1/php/Login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EMAIL: email.value,
        PASSWORD: password.value,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("登入成功:", result);
      if (result.blacklisted) {
        alert("會員已停權");
      } else {
        // 設定會員資料到 store
        member.setMember(result);
        console.log("會員 ID:", member.id);

        // 🔔 優先檢查 ModalStore 的重定向路徑
        let redirectPath = "/Home";

        if (modalStore.hasRedirectPath) {
          // 如果有彈窗設定的重定向路徑，使用它
          redirectPath = modalStore.redirectPath;
          modalStore.clearRedirectPath(); // 清除重定向路徑
        } else {
          // 否則檢查 URL query 參數
          redirectPath = router.currentRoute.value.query.redirect || "/Home";
        }

        // 關閉登入彈窗（如果有開啟的話）
        modalStore.closeLoginPopup();

        // 跳轉到指定頁面
        router.push(redirectPath);
      }
    } else {
      console.error("登入失敗:", response.statusText);
      alert("登入失敗，請檢查您的帳號密碼");
    }
  } catch (error) {
    console.error("網路錯誤:", error);
    alert("網路連線錯誤，請稍後再試");
  }
};

function handleLineLogin() {
  const lineClientId = import.meta.env.VITE_LINE_CLIENT_ID; // 您的 LINE Channel ID
  const lineRedirectUri = import.meta.env.VITE_LINE_REDIRECT_URI; // 您的回調 URL
  const lineAuthState = 'your_random_state_string'; // 為了安全，請生成一個隨機的 state 字串
  // const lineScope = 'profile openid email'; // 請求的權限，例如 profile, openid, email
  const lineScope = 'profile openid'; // 請求的權限，例如 profile, openid


  // 將 state 存儲起來，以便回調時驗證
  localStorage.setItem('line_auth_state', lineAuthState);

  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineClientId}&redirect_uri=${encodeURIComponent(lineRedirectUri)}&state=${lineAuthState}&scope=${lineScope}`;
  
  console.log('Line Auth URL:', lineAuthUrl); // 為了除錯，您可以打印出這個 URL 看看是否正確

  window.location.href = lineAuthUrl;
}
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
/* 快速註冊區塊 */
.fast_signup {
  padding: 48px 28px 16px 28px;
  margin: 0 auto;
  text-align: center;
}
.fast_signup p {
  margin-bottom: $spacing_2;
}
.social_links {
  display: flex;
  gap: $spacing_2;
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
    min-height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.line-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
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
