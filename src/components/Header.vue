<template>
    <header>
        <a href="#">
            <img src="../assets/images/Logo_S.svg" alt="logo_s">
        </a>

        <ul class="header_nav">
            <li><a href="#">餐盒介紹</a></li>
            <li><a href="#">預約訂餐</a></li>
            <li><a href="#">關於我們</a></li>
            <li><a href="#">登入/註冊</a></li>
        </ul>
    </header>

</template>

<script setup>

</script>

<style scoped lang="scss">
@use "@/assets/sass/basic/color.scss" as *;
@use "@/assets/sass/basic/font.scss" as *;


header {
    width: 1440px;
    height: 60px;
    display: flex;
    padding: 0 48px;
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