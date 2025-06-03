<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  document.body.classList.add('custom-bg')
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

const router = useRouter()

// 下一步--進行付款
function goNext() {
    // if (!canProceed.value) return
    // localStorage.setItem('selectedSideDishes', JSON.stringify(selectedDishes.value))
    router.push('/Check_PaymentInfo')

}

</script>
<template>
<FrontLayout>
    <div class="wrapper">
        <div class="shop">
            <img src="../assets/images/Order/cart_bag.svg" alt="">
            <h2>Tiba<span class="eat">EAT</span> | 購物車</h2>
        </div>
        <ul class="step">
            <li class="finish"><span class="finishspan">1</span>訂單資料</li>
            <li><span>2</span>付款資料</li>
            <li><span>3</span>完成結帳</li>
        </ul>
        <div class="infoContainer">
          <!-- 左側訂單資訊 -->
            <div class="orderData">
              <!-- 全選控制項目 -->
              <label class="checkedItemTitle">
                <input type="checkbox" name="" id="">
                <h5 class="title">預約項目 (1)</h5>
              </label>
              <!-- 訂單列表 -->
              <div class="orderlist">
                <!-- 訂單項目 -->
                <div class="orderItem">
                  <!-- 項目區塊(項目:包含標題資料 + 垃圾桶) -->
                  <div class="item">
                    <!-- 項目資料(標題、期間 & 展開按鈕) -->
                    <div class="itemMeta">
                      <label class="checkedItem"><input type="checkbox" name="" id="">
                            <h5 class="Itemtitle">自由搭配</h5>
                      </label>
                      <div class="period_toggle">
                        <h5>2025-06-07 — 2025-06-13 (共 7 日)</h5>
                        <button class="btn_accordion"><i class="bi bi-chevron-down"></i></button>
                      </div>
                    </div>
                    <button class="btn_delete"><i class="bi bi-trash3"></i></button>
                  </div>
                </div>
                <div class="orderItem">
                  <!-- 項目區塊(項目:包含標題資料 + 垃圾桶) -->
                  <div class="item">
                    <!-- 項目資料(標題、期間 & 展開按鈕) -->
                    <div class="itemMeta">
                      <label class="checkedItem"><input type="checkbox" name="" id="">
                            <h5 class="Itemtitle">為你搭配 + 小卡</h5>
                      </label>
                      <div class="period_toggle">
                        <h5>2025-06-07 — 2025-06-13 (共 7 日)</h5>
                        <button class="btn_accordion"><i class="bi bi-chevron-up"></i></button>
                      </div>
                    </div>
                    <button class="btn_delete"><i class="bi bi-trash3"></i></button>
                  </div>
                  <!-- 項目資料的細項內容 -->
                  <div class="content_container">
                    <!-- 項目資料的資料 -->
                    <div class="itemMetadata">
                      <!-- 標頭 -->
                      <div class="titleItem">
                        <h5 class="maintitle">預定日期與餐點項目</h5>
                        <h5>餐盒數量</h5>
                        <h5>小計</h5>
                      </div>
                      <!-- 標身 -->
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.07 (六)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.08 (日)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.09 (一)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.10 (二)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.11 (三)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.12 (四)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                      <div class="detailItem">
                        <div class="day_box">
                          <h6 class="day">06.13 (五)</h6>
                          <h6 class="box">樂活元氣餐 * 1 / 舒心控醣餐 * 2 / 柔食樂活餐 * 4 / 蔬食養生餐 * 3</h6>
                        </div>
                        <h6 class="count">10 份餐盒</h6>
                        <h6 class="price">$3,480</h6>
                      </div>
                    </div>
                    <button class="edit_btn">回點餐編輯頁</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="payData">
                <div class="payment">
                    <h5 class="title">結帳項目</h5>
                    <div class="paymentblock">
                        <div class="payItem">
                            <h6>餐盒數總計</h6>
                            <h6>50 份餐盒</h6>
                        </div>
                        <div class="payItem">
                            <h6>金額合計</h6>
                            <h6>$17,450</h6>
                        </div>
                        <div class="payItem">
                            <h6>餐盒金額總計</h6>
                            <h6>$17,450</h6>
                        </div>
                    </div>
                </div>
                <div class="btnblock">
                    <button class="btn-2" @click="goNext">下一步</button>
                </div>
            </div>
        </div>
    </div>
</FrontLayout>
</template>

<style>
.custom-bg{
background-image: url(../assets/images/Order/background.svg);
}
</style>
<style scoped lang="scss">
.wrapper{
    width: 1200px;
    margin: 40px auto 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.shop{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: $neutral_black;
}

.shop img{
    width: 48px;
}

.shop h2{
    font-size: $font_h2;
    font-weight: bold;
}

.eat{
  color: $primary_600;
}

.step {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 64px;
}

.step li {
    font-size: $font_h3;
    align-items: center;
    display: flex;
    color: $neutral_300;
}

.step .finish {
    color: $neutral_black;
}

.step span {
    display: block;
    font-size: $font_h5;
    margin-right: 8px;
    line-height: 2.25rem;
    width: 40px;
    height: 40px;
    background-color: $neutral_300;
    border-radius: 50%;
    text-align: center;
    color: $neutral_white;
}

.step .finishspan {
    background-color: $success_400;
}

// 資訊區塊
.infoContainer{
    margin-top: 40px;
    display: flex;
    gap: 24px;
}

// 左側訂單資訊
.orderData{
    height:fit-content;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background-color: $neutral_white;
    border: 1px solid $neutral_100;
    border-radius: 8px;
    padding: 16px;
}

// 全選控制項目
.checkedItemTitle{
  display: flex;
  padding: 16px 8px;
  gap: 16px;

  border-bottom: 1px solid $neutral_700;
}

label,
input[type="checkbox"]{
    cursor: pointer;
}

// 訂單列表
.orderlist{
  display: flex;
  flex-direction: column;
}

// 訂單項目
.orderItem{
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 項目區塊(項目:包含標題資料 + 垃圾桶)
.item{
  padding: 16px 8px;
  display: flex;
  gap: 60px;
}

// 項目資料(標題、期間 & 展開按鈕)
.itemMeta{
  display: flex;
  gap: 16px;
}

.checkedItem{
    display: flex;
    gap: 16px;
    align-items: center;

    &:hover{
        cursor: pointer;
    }
}

.checkedItem h5{
    font-size: $font_h5;
}

.Itemtitle{
  width: 143px;
}

.period_toggle{
  display: flex;
  gap: 24px;
}

.period_toggle h5{
    font-size: $font_h5;
}

button{
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.btn_delete{
  opacity: .5;
}

// 項目資料的細項
.content_container{
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-top: .5px solid $neutral_300;

}

// 項目資料的資料
.itemMetadata{
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.titleItem,
.detailItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.titleItem h5{
    font-size: $font_h5;
}

.maintitle{
  width: 470px;
}

.detailItem h6{
    font-size: $font_h6;
}

.day{
  margin-bottom: 8px;
}

.day_box .box{
  font-weight: normal;
  color:  $neutral_700;
}

.edit_btn{
  align-self: end;
  background-color: $neutral_300;
  color: $neutral_700;
  padding: 12px 20px;
  border-radius: 24px;
  border: 2px solid $neutral_300;
  transition: 0.3s ease;


  &:hover{
  background-color: transparent;
  color: $neutral_black;
  }
}

// 結帳項目
.payment{
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: $neutral_white;
    border: 1px solid $neutral_100;
    padding: 16px;
    border-radius: 8px;
}

.title{
    font-size: $font_h5;
}

.checkedItem h6,
.payItem h6{
    font-size: $font_h6;
    font-weight: normal;
    padding: 4px 0;
}

// 右側結帳項目--子項目
.paymentblock{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.payItem{
    width: 300px;
    display: flex;
    justify-content: space-between;

    &:last-child::before{
        content: '';
        position: absolute;
        width: 300px;
        height: 1px;
        background-color: $neutral_black;
}}

.payItem:last-child h6{
    padding-top: 12px;
    font-weight: bold;
}

.btnblock{
    margin-top: 20px;
    display: flex;
    gap: 20px;
    justify-content: end;
}

.btn-2{
    width: 92px;
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

// ---RWD---
@media screen and (max-width: 1200px){
  .wrapper{
    width: 900px;
}

.infoContainer{
  flex-direction: column;
}

.payItem{
  width: 100%;

  &:last-child::before{
        content: '';
        position: absolute;
        width: 688px;
        height: 1px;
        background-color: $neutral_black;
}
}

}

@media screen and (max-width: 950px){
.wrapper{
    width: 780px;
}

.step {
    gap: 16px;
}

.step li {
    font-size: $font_h5;
}

.step span {
    font-size: $font_h6;
    margin-right: 8px;
    line-height: 16px;
    width: 20px;
    height: 20px;
}
}

@media screen and (max-width: 800px){
.wrapper{
    width: 560px;
}

.infoContainer{
    gap: 20px;
}

.payItem{
    width: 100%;

    &:last-child::before{
        width: 530px;
}}

.checkedItem .Itemtitle,
.period_toggle h5,
.titleItem h5 {
    font-size: $font_h6;
}

.period_toggle,
.maintitle,
.day_box{
  width: 240px;
}

}

@media screen and (max-width: 580px){
.wrapper{
    width: 340px;
}

.shop{
    gap: 12px;
}

.shop h2{
    font-size: $font_h3;
}

.shop img{
    width: 40px;
}

.step {
    gap: 8px;
    
}

.checkedItemTitle{

}

.checkedItemTitle,
.checkedItem{
    gap: 8px;
}

.payItem:last-child::before{
    width: 308px;
}

.item{
  gap: 20px;
}

.titleItem,
.itemMeta,
.detailItem{
  flex-direction: column;
  align-items: start;
  gap: 4px;
}

}
</style>