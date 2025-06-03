<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import Popup from '@/components/Popup_SelectConsignee.vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  document.body.classList.add('custom-bg')
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})

// Popup - SelectConsignee
const showPopup = ref(false)

function openPopup() {
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
}

const router = useRouter()

// 上一步--訂單資料
function goPrev(){
    router.push('/Check_OrderInfo')
}

// 下一步--結帳
function goNext() {
    // if (!canProceed.value) return
    // localStorage.setItem('selectedSideDishes', JSON.stringify(selectedDishes.value))
    router.push('/Check_Complete')

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
            <li class="finish"><span class="finishspan">2</span>付款資料</li>
            <li><span>3</span>完成結帳</li>
        </ul>
        <div class="infoContainer">
            <div class="infoData">
                <div class="consumer">
                    <h5 class="title">訂購人資訊</h5>
                    <div class="consumertxt">
                        <div class="txtItem">
                            <h6>姓名</h6>
                            <h6>王美娟</h6>
                        </div>
                        <div class="txtItem">
                            <h6>手機</h6>
                            <h6>0978-587-078</h6>
                        </div>
                        <div class="txtItem">
                            <h6>地址</h6>
                            <h6>臺北市中山區南京東路三段</h6>
                        </div>
                        <div class="txtItem">
                            <h6>付款方式</h6>
                            <img src="../assets/images/Order/cashflow.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="consignee">
                    <h5 class="title">收貨人資訊</h5>
                    <div class="consigneetxt">
                        <div class="select">
                        <label class="checkedItem">
                            <input type="checkbox">
                            <h6>同訂購人</h6>
                        </label>
                        <div>
                            <a class="common"
                            @click="openPopup">
                                選擇/新增常用收貨人 
                                <i class="bi bi-chevron-right"></i>
                            </a>
                            <Popup v-if="showPopup" @close="closePopup" />
                        </div>
                        </div>
                        <div class="txtItem">
                            <h6>姓名</h6>
                            <input class="txt" type="text" placeholder="請輸入姓名">
                        </div>
                        <div class="txtItem">
                            <h6>手機</h6>
                            <input class="txt" type="text" placeholder="請輸入手機號碼">
                        </div>
                        <div class="txtItem">
                            <h6>地址</h6>
                            <input class="txt" type="text" placeholder="請輸入地址">
                        </div>
                    </div>
                </div>
                <div class="invoice">
                    <h5 class="title">發票資訊</h5>
                    <label class="checkedItem">
                        <input type="radio" name="invoice" checked>
                        <h6>會員載具</h6>
                    </label>
                    <label class="checkedItem">
                        <input type="radio" name="invoice">
                        <h6>公司發票</h6>
                    </label>
                    <label class="checkedItem">
                        <input type="radio" name="invoice">
                        <h6>捐贈發票</h6>
                    </label>
                    <label class="checkedItem">
                        <input type="radio" name="invoice">
                        <h6>手機載具</h6>
                    </label>
                    <h6 class="notice"><i class="bi bi-info-circle-fill"></i>依統一發票使用辦法規定：發票一經開立不得任意更改或改開發票。</h6>
                </div>
            </div>
            <div class="payData">
                <div class="payment">
                    <h5 class="title">結帳明細</h5>
                    <div class="paymentblock">
                        <div class="payItem">
                            <h6>訂單項目</h6>
                            <h6>自由搭配 + 小卡</h6>
                        </div>
                        <div class="payItem">
                            <h6>餐盒數總計</h6>
                            <h6>50 份餐盒</h6>
                        </div>
                        <div class="payItem">
                            <h6>金額合計</h6>
                            <h6>$17,450</h6>
                        </div>
                        <div class="payItem">
                            <h6>運費</h6>
                            <h6>$800</h6>
                        </div>
                        <div class="payItem">
                            <h6>金額總計</h6>
                            <h6>$18,150</h6>
                        </div>
                    </div>
                </div>
                <div class="payissue">
                <div class="paymentnotice">
                    <p>結帳完成即視為已同意 </p>
                    <a href="#" class="servelink">服務條款</a>
                </div>
                <div class="total">
                    <h5>總付款金額</h5><span>$18,150</span>
                </div>
                </div>
                <div class="btnblock">
                    <button class="btn-1" @click="goPrev">上一步</button>
                    <button class="btn-2" @click="goNext">結帳</button>
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
    width: 1000px;
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

// 左側資訊
.infoData,
.payData{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.consumer,
.consignee,
.invoice,
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

.consumertxt,
.consigneetxt{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.txtItem{
    display: flex;
    gap: 20px;
}

.select{
    display: flex;
    align-items: center;
}

.checkedItem{
    display: flex;
    gap: 12px;

    &:hover{
        cursor: pointer;
    }
}

input[type="checkbox"],
input[type="radio"]{
    cursor: pointer;
}

.txtItem h6,
.checkedItem h6,
.payItem h6{
    font-size: $font_h6;
    font-weight: normal;
    padding: 4px 0;
}

.common{
    margin-left: 24px;
    border: none;
    background-color: transparent;

    &:hover{
        cursor: pointer;
    }
}

.txt{
    border: none;
    padding: 4px 0;
    background-color: transparent;
}

// 發票注意事項
.notice{
    font-size: $font_h6;
    font-weight: normal;
    color: $neutral_700;
    display: flex;
    gap: 12px;
}

// 右側結帳明細
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

.payissue{
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
}

.paymentnotice{
    font-size: $font_p;
    display: flex;
    gap: 4px;
}

.total{
    display: flex;
    gap: 8px;
}

.total h5{
    font-size: $font_h5;
    color: $neutral_black;

}

.total span{
    display: block;
    font-size: $font_h5;
    font-weight: bold;
    color: $primary_600;
}

.paymentnotice a{
    text-decoration: none;
    color: $point_700;

    &:hover{
        text-decoration: underline;
    }
}

.btnblock{
    display: flex;
    gap: 20px;
    justify-content: end;
}

.btn-1{
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
    transition: 0.3s ease;
    color: $neutral_black;
    }
}

//  ---RWD---
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
    flex-direction: column;
    gap: 20px;
}

.payItem{
    width: 100%;

    &:last-child::before{
        width: 510px;
}}

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

.checkedItem{
    gap: 8px;
}

.payItem:last-child::before{
    width: 308px;
}

}
</style>