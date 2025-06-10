<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const env = import.meta.env.VITE_API_URL;
// const env = "";
const form = reactive({
  name: "",
  sex: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
  telephone: "",
  phone: "",
  contactsName: "",
  contactsPhone: "",
  birthday: "",
});

const handleSubmit = async () => {
  if (
    !form.name ||
    !form.sex ||
    !form.address ||
    !form.email ||
    !form.password ||
    !form.confirmPassword ||
    !form.phone
  ) {
    alert("請填寫所有必填欄位");
    return;
  }
  if (form.password !== form.confirmPassword) {
    alert("密碼與確認密碼不一致");
    return;
  }
  try {
    console.log(JSON.stringify(form));
    const response = await fetch(env + "/tjd101/g1/php/sign_up.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        sex: form.sex,
        address: form.address,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        telephone: form.telephone,
        phone: form.phone,
        contactsName: form.contactsName,
        contactsPhone: form.contactsPhone,
        birthday: form.birthday,
      }),
    });

    // 處理響應
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        alert("註冊成功，請登入！");
        router.push("/Login");
      } else {
        alert("註冊失敗，請重新輸入！");
      }
    }
    //   const result = await response.json();
    //   console.log("登入成功:", result);
    //   // 這裡可以添加登入成功後的邏輯，例如跳轉頁面
    // } else {
    //   console.error("登入失敗:", response.statusText);
    //   alert("登入失敗，請檢查您的帳號密碼");
    // }
  } catch (error) {
    console.error("網路錯誤:", error);
    alert("網路連線錯誤，請稍後再試");
  }
};
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 左側區塊 -->
      <div class="left-section">
        <router-link to="/home">
          <img src="../assets/images/Logo_S.svg" alt="logo_s" />
        </router-link>
        <h1 class="signup-title">加入會員</h1>
        <p class="signup-subtitle">從每餐感受到連結</p>

        <!-- 註冊表單 -->
        <form class="signup_form" @submit.prevent="handleSubmit">
          <div class="signup_form_component">
            <label for="name">姓名</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              placeholder="請輸入姓名"
            />
          </div>

          <div class="signup_form_radio">
            <label>性別</label>
            <label
              ><input type="radio" value="男" v-model="form.sex" />男</label
            >
            <label
              ><input type="radio" value="女" v-model="form.sex" />女</label
            >
          </div>

          <div class="signup_form_component">
            <label for="address">地址</label>
            <input
              type="text"
              id="address"
              v-model="form.address"
              placeholder="請輸入地址"
            />
          </div>

          <div class="signup_form_component">
            <label for="email">電子信箱</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="請輸入有效之電子信箱"
            />
          </div>
          <div class="signup_form_component">
            <label for="birthday">生日</label>
            <input
              type="text"
              id="birthday"
              v-model="form.birthday"
              placeholder="請輸入生日 (例如 YYYYMMDD)"
              required
            />
          </div>

          <div class="signup_form_component">
            <label for="password">密碼</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              placeholder="至少8-16個英數組成"
            />
          </div>

          <div class="signup_form_component">
            <label for="confirm_password">確認密碼</label>
            <input
              type="password"
              id="confirm_password"
              v-model="form.confirmPassword"
              placeholder="請再次輸入密碼"
            />
          </div>

          <div class="signup_form_component">
            <label for="telephone">電話</label>
            <input
              type="tel"
              id="telephone"
              v-model="form.telephone"
              placeholder="請輸入電話"
            />
          </div>

          <div class="signup_form_component">
            <label for="phone">手機</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              placeholder="請輸入手機號碼"
            />
          </div>

          <div class="signup_form_component">
            <label for="contacts_name">備用聯絡人姓名</label>
            <input
              type="text"
              id="contacts_name"
              v-model="form.contactsName"
              placeholder="請輸入備用聯絡人姓名"
            />
          </div>

          <div class="signup_form_component">
            <label for="contacts_phone">備用聯絡人手機</label>
            <input
              type="tel"
              id="contacts_phone"
              v-model="form.contactsPhone"
              pattern="^09\d{8}$"
              placeholder="請輸入備用聯絡人手機號碼"
            />
          </div>

          <router-link to="/Login" class="longin-link"
            >已經有帳號？點我登入</router-link
          >

          <!-- 快速註冊區塊 -->
          <div class="fast_signup">
            <p>快速註冊</p>
            <div class="social_links">
              <a href="#"
                ><img
                  src="../assets/images/Member/Google_color.svg"
                  alt="google-signup"
              /></a>
              <a href="#"
                ><img
                  src="../assets/images/Member/Line_color.svg"
                  alt="line-signup"
              /></a>
            </div>
          </div>

          <button type="submit" class="signup_submit">建立</button>
        </form>
      </div>

      <!-- 右側圖片 -->
      <div class="right-section">
        <img src="../assets/images/Member/login_pic.svg" alt="外送插圖" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
img {
  display: block;
}
.page-container {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  background-color: $primary_50;
}

a {
  text-decoration: none;
  color: black;
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
  // margin-top: 3rem;
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

.longin-link {
  color: $point_700;
}

.signup_form_radio {
  color: $neutral_black;
  align-items: center;
  margin: 8px 0;
  gap: 10px;
}

.signup_form_radio input[type="radio"] {
  transform: scale(1.5);
  margin-right: 4px;
  width: 40px;
  height: 12px;
  margin-left: 48px;
  background-color: $neutral_white;
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
