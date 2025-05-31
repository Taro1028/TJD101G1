<template>
    <div class="wrapper">
        <img src="../../assets/images/Logo_S.svg" alt="">
        <p>TibaEAT堤善加提膳家</p>
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

</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;      
  height: 100vh;            
  background-color: $primary_400; 
}

.wrapper img{
    width: 200px;
}
.wrapper p{
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