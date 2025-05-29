<script setup>

</script>
<template>
<div class="overlay">
    <div class="alertlogin">
        <img src="../assets/images/Logo_L.svg" alt="">
        <h3>請先登入會員</h3>
        <h5>登入會員即可享受完整使用體驗</h5>
        <button class="btn">前往登入</button>
    </div>
</div>
</template>

<style scoped lang="scss">
.overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
}

.alertlogin{
    width: 313px;
    margin: auto;
    padding: 24px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
}

h3{
    margin: 0;
    font-size: $font_h3;
}

h5{
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.btn{
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;


    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}

</style>