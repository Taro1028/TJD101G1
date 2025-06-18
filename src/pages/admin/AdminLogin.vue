<template>
  <div class="wrapper">
    <img src="../../assets/images/Logo_S.svg" alt="" />
    <p>TibaEAT提膳家</p>
    <section class="login-form">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">帳號：</label>
          <input type="text" id="username" v-model="username" required />
        </div>

        <div class="form-group">
          <label for="password">密碼：</label>
          <input type="password" id="password" v-model="password" required />
        </div>

        <button type="submit">登入</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminMemberStore } from "../../stores/AdminMemberStore";

const router = useRouter();
const username = ref("");
const password = ref("");
const Adminmember = useAdminMemberStore();
const env = import.meta.env.VITE_API_URL;

const handleLogin = async () => {
  // 驗證輸入
  if (!username.value) {
    alert("請輸入使用者email");
    return;
  }

  if (!password.value) {
    alert("請輸入使用者密碼");
    return;
  }

  try {
    const response = await fetch(env + "/tjd101/g1/php/AdminLogin.php", {
      //FTP
      //response接收php echo回傳值
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      //ok http state狀態
      const result = await response.json();
      console.log("登入成功:", result);

      if (result.success) {
        //設定會員資料到 store
        Adminmember.setAdminMember(result.adminMember);
        console.log("會員 ID:", Adminmember.id);
        router.push("/admin/member");
      } else {
        alert("帳密有誤");
      }
    }
  } catch (error) {
    console.error("網路錯誤:", error);
    alert("網路連線錯誤，請稍後再試");
  }
};

</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.wrapper {
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: $primary_400;
}

.wrapper img {
  max-width: 200px;
  width: 15%;
  display: block;
  height: auto;
}
.wrapper p {
  padding: 20px;
  font-size: $font_h4;
  color: $primary_100;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: $primary_50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-form form {
  width: 100%;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 6px;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: $primary_600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: $primary_400;
}
</style>
