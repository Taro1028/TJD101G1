<script setup>
// import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 關閉視窗
const emit = defineEmits(['close'])

function closePopup() {
  emit('close')
}

function goNext() {
//   if (!canProceed.value) return

//   // 把資料存在 localStorage（或改用 pinia）
//   localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes.value))

  // 導向下一頁
  router.push('/Check_OrderInfo')
}

</script>
<template>
<div class="overlay">
    <div class="shopCart">
        <button class="closebtn"  @click="closePopup"><i class="bi bi-x-circle"></i></button>
        <div class="orderitem">
            <div class="title"><h3>購物車</h3></div>
            <div class="itemlist">
                <div class="item">
                    <div class="iteminfo">
                        <div class="infotitle"><h4>為你搭配 + 小卡</h4></div>
                        <div class="period">2025-06-07—06-13 (共 7 日)</div>
                        <div class="count">50 份餐盒</div>
                    </div>
                    <div class="price">$17,450</div>
                    <button class="btn-delete"><i class="bi bi-trash3"></i></button>
                </div>
            </div>
        
        </div>
        <div class="gopay">
            <div class="subtotal">
                <span>小計</span>
                <span>$17,450</span>
            </div>
            <button class="btn-2" @click="goNext">前往結帳</button>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.overlay{
    position: fixed;
    top: 60px;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
}

.shopCart{
    width: 30%;
    height: 100%;
    padding: 24px 48px;
    background-color: $neutral_white;
    display: flex;
    flex-direction: column;
    gap: 64px;
    align-items: center;
    position: fixed;
    top: 60px;
    right: 0;
}

.closebtn{
    position: absolute;
    right: 24px;
    top: 20px;
    background-color: transparent;
    border: none;
    width: 32px;
    height: 32px;
    padding: 0;

    &:hover{
        cursor: pointer;
    }
}

.closebtn i{
    font-size: 24px;
}

.orderitem,
.gopay{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.title{
    width: 100%;
    border-bottom: 1px solid $neutral_black;
}

h3{
    font-size: $font_h3;
    padding-bottom: 8px;
}

.itemlist{
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.item{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.iteminfo{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.infotitle h4{
    font-size: $font_h4;
}

.btn-delete{
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.btn-delete i{
    font-size: $font_h4;
    opacity: .5;
}

.gopay{
    border-top: 1px solid #000;
    padding-top: 12px;
}

.subtotal{
    display: flex;
    justify-content: space-between;
}

.subtotal span{
    font-size: $font_h5 ;
    font-weight: bold;
}

.btn-2{
    margin-top: 12px;
    width: 117px;
    align-self: end;
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;


    &:hover{
    background-color: transparent;
    color: $neutral_black;
    }
}

@media screen and (max-width: 1200px){
.shopCart{
    width: 50%;
}
}

@media screen and (max-width: 800px){
.shopCart{
    width: 60%;
}
}

@media screen and (max-width: 600px){
.shopCart{
    width: 340px;
    padding: 20px;
    overflow-y: auto;
}

h3{
    font-size: $font_h4;
}

.infotitle h4{
    font-size: $font_h5;
}

}

</style>