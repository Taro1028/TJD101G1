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

          <div class="signup_form_component" :class="{ 'password-error': !passwordValidation.isValid && password }">
            <label for="password">密碼</label>
            <div class="password-input-container">
              <input
                type="password"
                name="password"
                id="PASSWORD"
                class="signup_password"
                :class="{ 'error': !passwordValidation.isValid && password }"
                placeholder="8-16個英數組成"
                v-model="password"
                @input="validatePassword"
              />
              <span class="error-icon" v-show="!passwordValidation.isValid && password">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </span>
            </div>
            <span class="error-message" v-show="!passwordValidation.isValid && password">
              {{ passwordValidation.errorMessage }}
            </span>
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
              <a href="#" @click.prevent="loginWithGoogle"
                ><img
                  src="../assets/images/Member/Google_color.svg"
                  alt="google-signup"
              /></a>
              <button
                @click="handleLineLogin"
                class="line-button"
                aria-label="使用 Line 登入"
              >
                <img
                  src="../assets/images/Member/Line_color.svg"
                  alt="line-signup"
                />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            class="signup_submit" 
            @click="handleLogin"
            :disabled="!canSubmit"
            :class="{ 'disabled': !canSubmit }"
          >
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
import { ref, computed, watch } from "vue";
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

// 密碼驗證狀態
const passwordValidation = ref({
  isValid: true,
  errorMessage: ""
});

// 密碼格式驗證函數
const validatePassword = () => {
  const passwordValue = password.value;
  
  if (!passwordValue) {
    passwordValidation.value = {
      isValid: true,
      errorMessage: ""
    };
    return;
  }

  // 檢查長度 (8-16位)
  if (passwordValue.length < 8 || passwordValue.length > 16) {
    passwordValidation.value = {
      isValid: false,
      errorMessage: "密碼長度必須為8-16位"
    };
    return;
  }

  // 檢查是否只包含英文字母和數字
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(passwordValue)) {
    passwordValidation.value = {
      isValid: false,
      errorMessage: "密碼只能包含英文字母和數字"
    };
    return;
  }

  // 檢查是否至少包含一個字母和一個數字
  const hasLetter = /[a-zA-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  
  if (!hasLetter || !hasNumber) {
    passwordValidation.value = {
      isValid: false,
      errorMessage: "密碼必須同時包含英文字母和數字"
    };
    return;
  }

  // 所有檢查通過
  passwordValidation.value = {
    isValid: true,
    errorMessage: ""
  };
};

// 計算是否可以提交表單
const canSubmit = computed(() => {
  return email.value && password.value && passwordValidation.value.isValid;
});

// 監聽密碼變化，自動驗證
watch(password, validatePassword);

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

  // 檢查密碼格式
  if (!passwordValidation.value.isValid) {
    alert("密碼格式不正確：" + passwordValidation.value.errorMessage);
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
  const lineClientId = import.meta.env.VITE_LINE_CLIENT_ID;
  const lineRedirectUri = import.meta.env.VITE_LINE_REDIRECT_URI;
  const lineAuthState = "your_random_state_string";
  const lineScope = "profile openid";

  localStorage.setItem("line_auth_state", lineAuthState);

  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineClientId}&redirect_uri=${encodeURIComponent(
    lineRedirectUri
  )}&state=${lineAuthState}&scope=${lineScope}`;

  console.log("Line Auth URL:", lineAuthUrl);
  window.location.href = lineAuthUrl;
}

function loginWithGoogle() {
  google.accounts.id.initialize({
    client_id:
      "1010508992557-rlnbp3o2h7327jmco3726c6qei92s0et.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });

  google.accounts.id.prompt();
}

function handleCredentialResponse(response) {
  fetch(env + "/tjd101/g1/php/Login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: response.credential }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        console.log(result);
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
        alert("登入失敗：" + result.message);
      }
    });
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
.signup_form_component {
  &.password-error {
    .password-input-container {
      border-color: $danger_500;
    }
  }

  label {
    display: block;
    line-height: 1.4;
    color: $neutral_black;
    margin-bottom: $spacing_2;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 12px 16px;
    background-color: $neutral_white;
    border: 1px solid $neutral_300;
    border-radius: 12px;
    color: $neutral_black;
    box-sizing: border-box;

    &.error {
      border-color: $danger_500;
      box-shadow: 0 0 0 2px rgba(229, 67, 67, 0.2);
    }

    &::placeholder {
      color: $neutral_300;
    }

    &:focus {
      outline: none;
      border-color: $primary_400;
      box-shadow: 0 0 0 2px rgba(241, 180, 46, 0.2);
    }
  }
}

/* 密碼輸入容器 */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;

  .error-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: $danger_500;
    font-size: 16px;
    z-index: 2;
  }
}

/* 錯誤訊息樣式 */
.error-message {
  display: block;
  color: $danger_500;
  font-size: 0.875rem;
  margin-top: 4px;
  line-height: 1.4;
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

  p {
    margin-bottom: $spacing_2;
  }
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

  &.disabled {
    background-color: $neutral_300;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:not(.disabled):hover {
    background-color: $primary_950;
  }
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