<script setup>
const emit = defineEmits(['close'])

function closePopup() {
  emit('close')
}
</script>
<template>
<div class="overlay">
    <div class="orderleave">
        <div class="alerttxt">
        <i class="bi bi-info-circle-fill"></i>
        <h4>尚未完成訂購，離開將會重新載入餐盒資訊</h4>
        </div>
        <h5>確定離開本頁面嗎？</h5>
        <div class="btnblock">
        <router-link to="/Order/Select" class="btn-1">確定</router-link>
        <button @click="closePopup" class="btn-2">取消</button>
        </div>
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

.orderleave{
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

.alerttxt{
    display: flex;
}

i{
    font-size: $font_h4;
    padding: 4px 8px 0 0;
}

h4{
    font-size: $font_h4;
}

h5{
    font-size: $font_h5;
    font-weight: normal;
}

.btnblock{
    display: flex;
    gap: 40px;
}

.btn-1{
    background-color: $neutral_300;
    color: $neutral_700;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    text-decoration: none;
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

// --- RWD ---
.orderleave{
    width: 260px;
    padding: 20px;
}

</style>