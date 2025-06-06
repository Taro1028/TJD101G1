<template>
<div class="page-container">
  <div class="content-wrapper">
    <div class="left-section">
       <RouterLink to="/front/Home"><img src="../assets/images//Logo_S.svg" alt="logo_s" /></RouterLink>
        <h1 class="signup-title">會員登入</h1>
        <p class="signup-subtitle">開始點餐吧</p>

        <!-- 建立帳號表單 -->
        <div class="signup_form">
          <div class="signup_form_component">
            <label for="name">姓名</label>
            <input
              type="text"
              id="EMAIL"
              name="name"
              class="signup_name"
              placeholder="登入帳號"
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
            />
          </div>

          <div>
            <a href="#" class="forgot-password">忘記密碼/帳號？</a>
          </div>

          <div>
          <RouterLink to="/front/Sign_Up" class="signup_link">還沒有帳號？點我註冊</RouterLink>
          </div>

          <!-- 快速註冊區塊 -->
          <div class="fast_signup">
            <p>快速登入</p>
            <div class="social_links">
              <a href="#"
                ><img src="../assets/images/Member/Google_color.svg" alt="google-signup"
              /></a>
              <a href="#"
                ><img src="../assets/images/Member/Line_color.svg" alt="line-signup"
              /></a>
            </div>
          </div>

          <button type="submit" class="signup_submit">建立</button>
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
const EMAIL = document.querySelector('#EMAIL');
const PASSWORD = document.querySelector('#PASSWORD');

  document.querySelector('button').addEventListener('click', async () => {
    if (!EMAIL.value) {
        alert('請輸入使用者email');
        return;
    }

    if (!PASSWORD.value) {
        alert('請輸入使用者密碼');
        return;
    }

    const resp = await fetch('/public/php/0606test_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            EMAIL: EMAIL.value,
            PASSWORD: PASSWORD.value
        })
    });

});


</script>

<style scoped lang="scss">
@font-face {
  font-family: 'jf-openhuninn';
  src: url('@/assets/font/jf-openhuninn-2.1.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'jf-openhuninn', sans-serif;
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

.signup-title{
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
a.signup_link{
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
    height: 100%;  
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