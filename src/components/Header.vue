<script setup>

</script>

<template>
    <header>
        <router-link to="/front/Home">
            <img src="../assets/images/Logo_S.svg" alt="logo_s">
        </router-link>

        <ul class="header_nav">
            <li><router-link to="/front/LuchBox">餐盒介紹</router-link></li>
            <li><router-link to="/front/Order">預約訂餐</router-link></li>
            <li><router-link to="/front/About">關於我們</router-link></li>
            <li><router-link to="/front/Member">登入/註冊</router-link></li>
        </ul>
    </header>

</template>

<style scoped lang="scss">

header {
    width: 1440px;
    height: 60px;
    display: flex;
    padding: 0;
    padding-left: 48px;
    padding-right: 48px;
    justify-content: space-between;
    align-items: center;
    background-color: $primary_100;
}

header a {
    display: block;
}

header a .img {
    display: block;
    height: 48px;
}

.header_nav {
    padding: 0;
    margin: 0;
    height: 100%;
    display: flex;
    list-style-type: none;
    gap: 8px;
}

.header_nav li {
    padding: 8px;
}

.header_nav li a {
    display: block;
    color: $neutral_black;
    text-decoration: none;
    line-height: 36px;

    &:hover {
        color: $primary_600;
    }
}
</style>