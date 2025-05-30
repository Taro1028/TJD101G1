<script setup>

</script>

<template>
    <header>
        <router-link to="/Home">
            <img src="../assets/images/Logo_S.svg" alt="logo_s">
        </router-link>

        <ul class="header_nav">
            <li><router-link to="/LuchBox">餐盒介紹</router-link></li>
            <li><router-link to="/Order">預約訂餐</router-link></li>
            <li><router-link to="/About">關於我們</router-link></li>
            <li><router-link to="/Member">登入/註冊</router-link></li>
        </ul>
    </header>

</template>

<style scoped lang="scss">

header {
    max-width: 100%;
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