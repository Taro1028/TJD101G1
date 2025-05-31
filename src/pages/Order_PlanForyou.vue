<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted } from 'vue'

// 背景圖
onMounted(() => {
    document.body.classList.add('custom-bg')
})

onUnmounted(() => {
    document.body.classList.remove('custom-bg')
})

// swiper 套件
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const swiperOptions = {
    slidesPerView: 'auto',
    freeMode: true,
}

</script>
<template>
    <FrontLayout>
        <div class="headline">
            <h1>為你搭配<span class="decorate"></span></h1>
            <a href="#">回主選單</a>
        </div>
        <div class="operate">
            <div class="order-container">
                <div class="period-block">
                    <div class="period">2025.06.07 (六) - 06.13 (五)</div>
                    <div class="dateblock">
                        <Swiper 
                        v-bind="swiperOptions" 
                        class="date-swiper">
                            <SwiperSlide>
                                <div class="dateItem current">
                                    <div class="date">06.07 (六)</div>
                                    <div class="lunchboxtxt">訂 3 份餐盒<br>$1,070</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div class="dateItem">
                                    <div class="date">06.08 (日)</div>
                                    <div class="lunchboxtxt">請選擇餐點</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div class="dateItem">
                                    <div class="date">06.09 (一)</div>
                                    <div class="lunchboxtxt">請選擇餐點</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div class="dateItem">
                                    <div class="date">06.10 (二)</div>
                                    <div class="lunchboxtxt">請選擇餐點</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div class="dateItem">
                                    <div class="date">06.11 (三)</div>
                                    <div class="lunchboxtxt">請選擇餐點</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div class="dateItem">
                                    <div class="date">06.12 (四)</div>
                                    <div class="lunchboxtxt">請選擇餐點</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div class="dateItem">
                                    <div class="date">06.13 (五)</div>
                                    <div class="lunchboxtxt">請選擇餐點</div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <div class="order">
                    <div class="orderarea">
                        <div class="day">
                            <h3>06.07 (六)</h3>
                        </div>
                        <div class="lunchboxlist">
                        <Swiper 
                        v-bind="swiperOptions" 
                        class="lunchbox-swiper">
                            <SwiperSlide>
                            <div class="boxcard">
                                <div class="boxname">
                                    <h4>樂活元氣餐</h4>
                                </div>
                                <div class="imginfo">
                                    <img src="../assets/images/Order/box01.png" alt="">
                                    <div class="ingredients">
                                        <img src="../assets/images/Order/sesame.svg" alt="">
                                        <img src="../assets/images/Order/taiwanPork.svg" alt="">
                                        <img src="../assets/images/Order/seafood.svg" alt="">
                                        <img src="../assets/images/Order/aussieBeef.svg" alt="">
                                    </div>
                                </div>
                                <div class="detail-price">
                                    <div class="detail"><a href="#">詳細內容</a></div>
                                    <div class="price">$320</div>
                                </div>
                                <div class="quantity-selector">
                                    <button class="decrease-btn"><i class="bi bi-dash-circle-fill"></i></button>
                                    <div class="count">0</div>
                                    <button class="increase-btn"><i class="bi bi-plus-circle-fill"></i></button>
                                </div>
                            </div>
                            </SwiperSlide>
                            <SwiperSlide>
                            <div class="boxcard">
                                <div class="boxname">
                                    <h4>舒心控醣餐</h4>
                                </div>
                                <div class="imginfo">
                                    <img src="../assets/images/Order/box02.png" alt="">
                                    <div class="ingredients">
                                        <img src="../assets/images/Order/taiwanPork.svg" alt="">
                                        <img src="../assets/images/Order/seafood.svg" alt="">
                                        <img src="../assets/images/Order/aussieBeef.svg" alt="">
                                    </div>
                                </div>
                                <div class="detail-price">
                                    <div class="detail"><a href="#">詳細內容</a></div>
                                    <div class="price">$320</div>
                                </div>
                                <div class="quantity-selector">
                                    <button class="decrease-btn"><i class="bi bi-dash-circle-fill"></i></button>
                                    <div class="count">0</div>
                                    <button class="increase-btn"><i class="bi bi-plus-circle-fill"></i></button>
                                </div>
                            </div>
                            </SwiperSlide>
                            <SwiperSlide>
                            <div class="boxcard">
                                <div class="boxname">
                                    <h4>柔食樂活餐</h4>
                                </div>
                                <div class="imginfo">
                                    <img src="../assets/images/Order/box03.png" alt="">
                                    <div class="ingredients">
                                        <img src="../assets/images/Order/taiwanpork.svg" alt="">
                                    </div>
                                </div>
                                <div class="detail-price">
                                    <div class="detail"><a href="#">詳細內容</a></div>
                                    <div class="price">$320</div>
                                </div>
                                <div class="quantity-selector">
                                    <button class="decrease-btn"><i class="bi bi-dash-circle-fill"></i></button>
                                    <div class="count">0</div>
                                    <button class="increase-btn"><i class="bi bi-plus-circle-fill"></i></button>
                                </div>
                            </div>
                            </SwiperSlide>
                            <SwiperSlide>
                            <div class="boxcard">
                                <div class="boxname">
                                    <h4>蔬食養生餐</h4>
                                </div>
                                <div class="imginfo">
                                    <img src="../assets/images/Order/box04.png" alt="">
                                    <div class="ingredients">
                                        <img src="../assets/images/Order/sesame.svg" alt="">
                                        <img src="../assets/images/Order/vegatarianDiet.svg" alt="">
                                    </div>
                                </div>
                                <div class="detail-price">
                                    <div class="detail"><a href="#">詳細內容</a></div>
                                    <div class="price">$360</div>
                                </div>
                                <div class="quantity-selector">
                                    <button class="decrease-btn"><i class="bi bi-dash-circle-fill"></i></button>
                                    <div class="count">0</div>
                                    <button class="increase-btn"><i class="bi bi-plus-circle-fill"></i></button>
                                </div>
                            </div>
                            </SwiperSlide>
                        </Swiper>
                        </div>
                        <div class="notice">
                            <span><i class="bi bi-info-circle-fill"></i></span>
                            <h5>單日餐盒數超過 10 份，請直接來電訂購</h5>
                        </div>
                    </div>
                    <div class="ordertxt">
                        <h5 class="boxitem">餐盒項目：</h5>
                        <h5 class="subtotal">小計： $-</h5>
                    </div>
                    <div class="total_option-btn">
                    <div class="total">
                        <h5>總計金額：<br>$-</h5>
                    </div>
                    <div class="option-btn">
                        <button class="prevbtn" disabled>上一步</button>
                        <button class="nextbtn" disabled>下一步</button>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    </FrontLayout>
</template>

<style>
.custom-bg {
    background-image: url(../assets/images/Order/background.svg);
}
</style>
<style scoped lang="scss">
.headline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 1050px;
    margin: 40px auto;
}

h1 {
    margin: 0;
    font-size: $font_h1;
    position: relative;
}

.decorate {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: $primary_400;
    position: absolute;
    left: 0;
    top: -2px;
    z-index: -1;
}

.headline a {
    text-decoration: none;
    color: $neutral_700;
    background-color: $primary_100;
    border: 1px solid $primary_100;
    padding: 12px 24px;
    border-radius: 24px;
    transition: 0.3s ease;


    &:hover {
        background-color: transparent;
        border: 1px solid $neutral_700;
        transition: 0.3s ease;
    }
}

// 操作區
.operate {
    margin: 0 auto 64px;
}

// 點餐容器
.order-container {
    width: 1050px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
}

// 期間區塊
.period-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.period {
    color: $neutral_black;
    border-bottom: 1px solid $neutral_black;
    padding: 8px 0;
}

.dateblock{
    width: 100%;
    display: flex;
    align-self: center;
}

.swiper-slide {
    flex-shrink: 1;
}

.date-swiper,
.lunchbox-swiper {
    width: auto;
}

.dateItem {
    width: 126px;
    height: 88px;
    padding: 4px 12px;
    margin-right: 20px;
    border-radius: 8px;
    border: 1px solid $neutral_300;
    background-color: $primary_50;
}

.current {
    background-color: $primary_100;
}

.complete {
    background-color: $primary_600;
}

.date {
    color: $neutral_black;
    padding-bottom: 4px;
}

.lunchboxtxt {
    color: $neutral_700;
}

// 點餐區
.order {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.orderarea {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.day {
    padding: 8px 16px;
}

.day h3 {
    font-size: $font_h3;
    margin: 0;
}

.lunchboxlist {
    display: flex;
    gap: 48px;
    align-self: center;
}

// 餐盒卡片
.boxcard {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px 20px;
    margin: 0 40px;
    border: 1px solid $neutral_300;
    border-radius: 20px;
}

.boxname {
    border-bottom: 1px solid $neutral_black;
    padding: 4px;
}

.boxname h4 {
    margin: 0;
    font-size: $font_h4;
    text-align: center;
}

.imginfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.imginfo img {
    display: block;
    width: 160px;
    height: 160px;
    margin: 0 auto;
}

.ingredients {
    display: flex;
    gap: 12px;
    align-self: start;
}

.imginfo .ingredients img {
    display: block;
    width: 20px;
    height: 20px;
}

.detail-price {
    display: flex;
    justify-content: space-between;
}

.detail a {
    font-weight: bold;
    color: $primary_400;
}

.price {
    font-weight: bold;
    color: $primary_950;
}

.quantity-selector {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.decrease-btn {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    opacity: 25%;
}

.increase-btn {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
}

// 注意事項
.notice {
    display: flex;
    gap: 8px;
    color: $neutral_black;
    opacity: .7;
}

.notice span {
    padding-top: 2px;
}

.notice h5 {
    font-size: $font_h5;
    font-weight: normal;
}

// 餐盒細項統計
.ordertxt {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.boxitem {
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.subtotal {
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.total_option-btn{
    display: flex;
    justify-content: space-between;
}

.total {
    display: flex;
    flex-shrink: 0;
}

.total h5 {
    font-weight: bold;
    font-size: $font_h5;
}

.option-btn {
    display: flex;
    justify-content: end;
    gap: 16px;
}

.prevbtn {
    padding: 12px 24px;
    background-color: $primary_100;
    border: 1px solid $primary_100;
    border-radius: 24px;
}

.nextbtn {
    padding: 12px 24px;
    background-color: $primary_400;
    border: 1px solid $primary_400;
    border-radius: 24px;
}

.disabled {
    opacity: .5;
}

// --- RWD ---
@media screen and (max-width: 1200px) {
    .headline {
        width: 800px;
    }

    .order-container {
        width: 800px;
        flex-direction: column;
        justify-self: center;
    }

    .boxcard {
    padding: 16px;
    margin: 0 18px;
    }

    .imginfo img {
    width: 100px;
    height: 100px;
    }

}

@media screen and (max-width: 920px) {
    .headline {
        width: 520px;
    }

    .order-container {
        width: 520px;
    }

    .lunchboxlist{
        width: 100%;
    }

    .boxcard{
        width: 162px;
    }

}

@media screen and (max-width: 580px) {
    .headline {
        width: 343px;
    }

    .order-container {
        width: 343px;
    }

    h1{
    font-size: $font_h3;
    }

    .decorate{
        width: 60px;
        height: 60px;
    }
}
</style>