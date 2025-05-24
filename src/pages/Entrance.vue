<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.path)
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="logo">
        <img src="@/assets/images/Logo_L.svg" />
        <h1>提膳家</h1>
      </div>
      <div class="entrance">
        <router-link to="/front/Home" class="front">
          <h1>前台</h1>
        </router-link>
        <router-link to="/admin" class="admin">
          <h1>後台</h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

.wrapper{
  width: 100%;
  height: 100vh;
  background-color: $primary_100;
}

.container{
  width: 740px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}


.logo img{
  display: block;
  height: 60px;
  margin: 0 auto;
}

h1{
  font-size: 48px;
}

.entrance{
  width: 100%;
  display: flex;
  gap: 180px;
}

.entrance a{
  text-decoration: none;
}

.front, .admin{
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.front{
  background-color: $primary_400;
}

.admin{
  background-color: $primary_600;
}

.front h1{
  color: $neutral_black;
}

.admin h1{
  color: $neutral_white;
}

</style>