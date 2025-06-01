<script setup>
import { ref } from 'vue'
// import foodData from '@/data/foodList.json'

const activeIndex = ref(null)

const toggleAccordion = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

// 關閉視窗
const emit = defineEmits(['close'])

function closePopup() {
  emit('close')
}
</script>

<template>
<div class="overlay">
<div class="detailCard">
    <button class="closebtn"  @click="closePopup"><i class="bi bi-x-circle"></i></button>
    <div class="intro">
        <h4>樂活元氣餐</h4>
        <h6>隨著年齡增長，長輩的基礎代謝率逐漸下降，營養吸收效率也會變差，若攝取不足，很容易造成體力下滑、免疫力降低，甚至增加慢性病風險。樂活元氣餐專為健康長輩打造，以「高纖、優質蛋白、原型食材」為核心，調整適合銀髮族的營養比例，幫助補充能量、維持肌力、強化骨質與腸胃功能。每日一餐，讓長者吃得健康又開心，是延緩老化、活力樂齡的最佳選擇。</h6>
        <ul class="ingredients">
            <li>
                <img src="../assets/images/Order/sesame.svg" alt="">
                <p>芝麻過敏原</p>
            </li>
            <li>
                <img src="../assets/images/Order/seafood.svg" alt="">
                <p>海鮮過敏原</p>
            </li>
            <li>
                <img src="../assets/images/Order/aussieBeef.svg" alt="">
                <p>使用澳洲牛</p>
            </li>
        </ul>
    </div>
    <div class="info">
        <div class="img_price">
            <img src="../assets/images/Order/box01.png" alt="樂活元氣餐">
            <h5>售價 $320</h5>
        </div>
        <div class="infotxtblock">
            <div class="infotxt">
                <div class="foodtitle">
                    <h5>紅棗枸杞燉雞</h5>
                    <div class="accordion">
                    <span><i class="bi bi-chevron-up"></i></span>
                    <span><i class="bi bi-chevron-down"></i></span>
                    </div>
                </div>
                <div class="foodtxt">
                    <h6>紅棗枸杞燉雞富含補氣養血功效，土雞腿提供優質蛋白，有助維持肌肉量與增強體力。黃耆與枸杞能提升免疫力、促進血液循環，薑片驅寒暖胃。整體湯品溫潤養身，是日常補元氣、增強抵抗力的首選。</h6>
                </div>
            </div>
            <div class="infotxt">
                <div class="foodtitle">
                    <h5>南瓜豬肉燉豆腐</h5>
                    <span>></span>
                </div>
                <div class="foodtxt hidden">
                    <h6>使用低脂豬里肌與滑嫩豆腐搭配南瓜，兼具高蛋白與β-胡蘿蔔素，幫助增強免疫、保護眼睛與促進消化。豬肉先汆燙後清燉減少油脂負擔，適合平日養身、體力調理使用。</h6>
                </div>
            </div>
            <div class="infotxt">
                <div class="foodtitle">
                    <h5>香煎鮭魚佐野菜</h5>
                    <span>></span>
                </div>
                <div class="foodtxt hidden">
                    <h6>鮭魚富含Omega-3脂肪酸，有助心血管保護與腦部活化，搭配富含植化素的蔬菜一起料理，不僅營養完整且色香味俱全。適合日常維持記憶力與提升身心活力的銀髮族食用。</h6>
                </div>
            </div>
            <div class="infotxt">
                <div class="foodtitle">
                    <h5>蕃茄牛肉蔬菜</h5>
                    <span>></span>
                </div>
                <div class="foodtxt hidden">
                    <h6>此道料理富含鐵質與膠原蛋白，番茄中的茄紅素具抗氧化效果，能延緩細胞老化。牛肉提供補氣養血的營養來源，蔬菜燉煮入味、口感柔和，是銀髮族補鐵提神、強健身體的良方。</h6>
                </div>
            </div>
        </div>
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

.detailCard{
    width: 640px;
    margin: auto;
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
    background-color: $neutral_white;
    border: 1px solid $neutral_100;
    border-radius: 8px;
    position: relative;
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

.intro{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.intro h4{
    font-size: $font_h4;
    margin: 0;
}

.intro h6{
    font-size: $font_h6;
    margin: 0;
    font-weight: normal;
}

.ingredients{
    margin: 0;
    display: flex;
    gap: 32px;
}

.ingredients li{
    display: flex;
    gap: 4px;
}

.ingredients p{
    margin: 0;
}

.info{
    display: flex;
    gap: 64px;
}

.img_price{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.img_price img{
    display: block;
    width: 240px;
    height: 240px;
}

.img_price h5{
    margin: 0;
    font-size: $font_h5;
}

.infotxtblock{
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.infotxt{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.foodtitle{
    display: flex;
    justify-content: space-between;
}

.foodtitle h5{
    margin: 0;
    font-size: $font_h5;
}

.foodtitle span{
    display: block;
}

.foodtxt h6{
    font-size: $font_h6;
    font-weight: normal;
    margin: 0;
}

.hidden{
    display: none;
}

// --- RWD ---
@media screen and (max-width: 780px) {

.detailCard{
    width: 300px;
    max-height: 90vh;
    overflow-y: auto;
    gap: 20px;
    padding: 24px;
}

.ingredients{
    flex-direction: column;
    gap: 8px;
}

.info{
    flex-direction: column;
    gap: 20px;
    text-align: center;
}

.img_price img{
    width: 160px;
    height: 160px;
    align-self: center;
}

.foodtxt h6{
    text-align: left;
}

}


</style>