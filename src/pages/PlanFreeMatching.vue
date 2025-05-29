<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('custom-bg')
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})
</script>
<template>
    <FrontLayout>
    <div class="headline">
        <h1>自由搭配<span class="decorate"></span></h1>
        <ul class="step">
            <li class="finish"><span class="finishspan">1</span>選擇主菜</li>
            <li class="finish"><span class="finishspan">2</span>選擇副菜</li>
            <li class="finish"><span class="finishspan">3</span>確認菜單</li>
        </ul>
        <a href="#">回主選單</a>
    </div>
    <div class="operate">
        <div class="menubox">
            <div class="title">
                <div class="titletxt">
                    <h5>餐盒資訊</h5>
                    <div class="period"><h5>06.07(六) - 06.13(五)</h5></div>
                </div>
                <div class="set">...</div>
            </div>
            <hr>
            <div class="menulist">
                <div class="day-item">
                    <div class="item">
                    <h6>MON</h6>
                    <div class="meal">
                        <div class="mealname">🍱 薑燒豬肉餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">薑燒豬肉 / </span>
                            <span id="sidemeal">蕃茄炒蛋 / 金沙南瓜 / 蒜炒空心菜</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <div class="day-item">
                    <div class="item">
                    <h6>TUE</h6>
                    <div class="meal">
                        <div class="mealname">🍱 味噌豚骨餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">味噌豚骨 / </span>
                            <span id="sidemeal">川燙地瓜葉 / 紅蘿蔔炒蛋 / 乾煸四季豆</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <div class="day-item">
                    <div class="item">
                    <h6>WED</h6>
                    <div class="meal">
                        <div class="mealname">🍱 紅燒牛腩餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">紅燒牛腩 / </span>
                            <span id="sidemeal">醋拌黑木耳 / 清蒸花椰菜 / 九層塔煎蛋</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <div class="day-item">
                    <div class="item">
                    <h6>THU</h6>
                    <div class="meal">
                        <div class="mealname">🍱 梅干燉控肉餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">梅干燉控肉 / </span>
                            <span id="sidemeal">蕃茄炒蛋 / 金沙南瓜 / 蒜炒空心菜</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <div class="day-item">
                    <div class="item">
                    <h6>FRI</h6>
                    <div class="meal">
                        <div class="mealname">🍱 牛肉漢堡排餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">牛肉漢堡排 / </span>
                            <span id="sidemeal">川燙地瓜葉 / 紅蘿蔔炒蛋 / 乾煸四季豆</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <div class="day-item">
                    <div class="item">
                    <h6>SAT</h6>
                    <div class="meal">
                        <div class="mealname">🍱 紅燒獅子頭餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">紅燒獅子頭 / </span>
                            <span id="sidemeal">川燙地瓜葉 / 紅蘿蔔炒蛋 / 乾煸四季豆</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <div class="day-item">
                    <div class="item">
                    <h6>SUN</h6>
                    <div class="meal">
                        <div class="mealname">🍱 鐵板牛柳餐食</div>
                        <div class="mealinfo">
                            <span id="mainmeal">鐵板牛柳 / </span>
                            <span id="sidemeal">醋拌黑木耳 / 清蒸花椰菜 / 九層塔煎蛋</span>
                        </div>
                    </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-btn">-</button>
                        <div class="count">1</div>
                        <button class="increase-btn">+</button>
                    </div>
                </div>
                <h6 class="notice">單日餐盒數超過 10 份，請直接來電訂購</h6>
            </div>
        </div>
        <div class="image-btn">
            <img src="../assets/images/Order/box-complete.png" alt="">
            <div class="btnblock">
                <button class="btn-1">上一步</button>
                <button class="btn-2">訂購餐點</button>
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

// --- 標題 + 步驟 ---
.headline{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 1160px;
    margin: 40px auto;
}

h1{
    margin: 0;
    font-size: $font_h1;
    position: relative;
}

.decorate{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: $primary_600;
    position: absolute;
    left: 0;
    top: -2px;
    z-index: -1;
}

.step{
    display: flex;
    gap: 64px;
}

.step li{
    font-size: $font_h3;
    align-items: center;
    display: flex;
    color: $neutral_300;
}

.step .finish{
    color: $neutral_700;
}

.step span{
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

.step .finishspan{
    background-color: $neutral_700;
}

.headline a{
    text-decoration: none;
    color: $neutral_700;
    background-color: $primary_100;
    border: 1px solid $primary_100;
    padding: 12px 24px;
    border-radius: 20px;
    transition: 0.3s ease;


    &:hover{
    background-color: transparent;
    border: 1px solid $neutral_700;
    transition: 0.3s ease;
    }
}

// 操作區
.operate{
    width: 945px;
    margin: 0 auto 64px;
    display: flex;
    gap: 100px;
}

// 期間菜單
.menubox{
    width: 560px;
    padding: 20px 28px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 8px;
}
.title{
    display: flex;
    justify-content: space-between;
}

.titletxt{
    display: flex;
    gap: 16px;
}

.title h5{
    margin: 0;
    font-size: $font_h5;
}

// 菜單清單
.menulist{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// 單日項目
.day-item{
    display: flex;
    justify-content: space-between;
}

.item{
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 12px 16px 12px 0;
}

.item h6{
    width: 42px;
    margin: 0;
    font-size: $font_h6;
}
.meal{
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mealname{
    font-weight: bold;
}

.quantity-selector{
    display: flex;
    gap: 16px;
    justify-content: space-evenly;
    align-items: center;
}

.decrease-btn{
    background-color: $neutral_100;
    border: 1px solid $neutral_100;
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.increase-btn{
    background-color: $neutral_black;
    border: 1px solid $neutral_black;
    color: $neutral_white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.notice{
    margin: 0;
    font-size: $font_h6;
    font-weight: normal;
    color: $neutral_black;
    opacity: .7;
}


// 右側 圖片+按鈕
.image-btn{
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 80px;
}

.image-btn img{
    width: 200px;
    height: 200px;
}

.btnblock{
    display: flex;
    gap: 20px;
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
    transition: 0.3s ease;
    color: $neutral_700;
    }
}

.btn-2{
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

</style>