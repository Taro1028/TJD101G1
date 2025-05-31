<template>
  <section class="wrap">
    <section class="s1">
      <h3>
        {{ content.title }}
      </h3>
      <article class="ss1">
        <img :src="content.picture" alt="" />
        <div class="b">
          <p class="inf">{{ content.description }}</p>
          <button>{{ text }}</button>
        </div>
      </article>
    </section>

    <section>
      <article v-for="(item, index) in content.item" :key="index" class="box">
        <img :src="item.picture" alt="" />

        <article>
          <h5>{{ item.name }}</h5>
          <p>功效：</p>
          <p class="inf">{{ item.description }}</p>
          <article class="toggle" @click="toggleAccordion(index)">
            <i
              class="bi"
              :class="
                openIndex === index ? 'bi-caret-up-fill' : 'bi-caret-down-fill'
              "
            ></i>
          </article>
          <p v-show="openIndex === index" class="ingredients">{{ item.ingredients }}</p>
        </article>
      </article>

      <!-- <article class="box">
            <img src="../assets/images/LunchBox/title1item2.png" alt="">
            <article>
                <h5>南瓜豬肉燉豆腐</h5>
                <p>功效：</p>
                <p class="inf">使用低脂豬里肌與滑嫩豆腐搭配南瓜，兼具高蛋白與β-胡蘿蔔素，幫助增強免疫、保護眼睛與促進消化。豬肉先汆燙後清燉減少油脂負擔，適合平日養身、體力調理使用。</p>
                <article class="toggle">
                    <img src="../assets/images/LunchBox/toggledown-button.png
                    " alt="">
                </article>
            </article>
        </article>

        <article class="box">
            <img src="../assets/images/LunchBox/title1item3.png" alt="">
            <article>
                <h5>蕃茄牛肉燉蔬菜</h5>
                <p>功效：</p>
                <p class="inf">此道料理富含鐵質與膠原蛋白，番茄中的茄紅素具抗氧化效果，能延緩細胞老化。牛肉提供補氣養血的營養來源，蔬菜燉煮入味、口感柔和，是銀髮族補鐵提神、強健身體的良方。</p>
                <article class="toggle">
                    <img src="../assets/images/LunchBox/toggledown-button.png
                    " alt="">
                </article>
            </article>
        </article>

        <article class="box">
            <img src="../assets/images/LunchBox/title1item4.png" alt="">
            <article>
                <h5>香煎鮭魚佐野菜</h5>
                <p>功效：</p>
                <p class="inf">鮭魚富含Omega-3脂肪酸，有助心血管保護與腦部活化，搭配富含植化素的蔬菜一起料理，不僅營養完整且色香味俱全。適合日常維持記憶力與提升身心活力的銀髮族食用。</p>
                <article class="toggle">
                    <img src="../assets/images/LunchBox/toggledown-button.png
                    " alt="">
                </article>
            </article>
        </article> -->
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
defineProps(["content", "text"]);

const openIndex = ref(null)
function toggleAccordion(index) {
  openIndex.value = openIndex.value === index ? null : index
}


// const product=ref({
//     title: '樂活元氣餐',
//     picture:new URL('../assets/images/LunchBox/boxitemtitle1.png', import.meta.url).href,

//     description: '隨著年齡增長，長輩的基礎代謝率逐漸下降，營養吸收效率也會變差，若攝取不足，很容易造成體力下滑、免疫力降低，甚至增加慢性病風險。樂活元氣餐專為健康長輩打造，以「高纖、優質蛋白、原型食材」為核心，調整適合銀髮族的營養比例，幫助補充能量、維持肌力、強化骨質與腸胃功能。每日一餐，讓長者吃得健康又開心，是延緩老化、活力樂齡的最佳選擇。',

//     item:[{

//         picture:new URL('../assets/images/LunchBox/title1item1.png', import.meta.url).href,
//         name:'紅棗枸杞燉雞',
//         description:'紅棗枸杞燉雞富含補氣養血功效，土雞腿提供優質蛋白，有助維持肌肉量與增強體力。黃耆與枸杞能提升免疫力、促進血液循環，薑片驅寒暖胃。整體湯品溫潤養身，是日常補元氣、增強抵抗力的首選。',
//     },
//     {
//         picture:new URL('../assets/images/LunchBox/title1item2.png', import.meta.url).href,
//         name:'南瓜豬肉燉豆腐',
//         description:'使用低脂豬里肌與滑嫩豆腐搭配南瓜，兼具高蛋白與β-胡蘿蔔素，幫助增強免疫、保護眼睛與促進消化。豬肉先汆燙後清燉減少油脂負擔，適合平日養身、體力調理使用。',
//     },
//     {
//         picture:new URL('../assets/images/LunchBox/title1item3.png', import.meta.url).href,
//         name:'蕃茄牛肉燉蔬菜',
//         description:'此道料理富含鐵質與膠原蛋白，番茄中的茄紅素具抗氧化效果，能延緩細胞老化。牛肉提供補氣養血的營養來源，蔬菜燉煮入味、口感柔和，是銀髮族補鐵提神、強健身體的良方。',
//     },
//     {
//         picture:new URL('../assets/images/LunchBox/title1item4.png', import.meta.url).href,
//         name:'香煎鮭魚佐野菜',
//         description:'鮭魚富含Omega-3脂肪酸，有助心血管保護與腦部活化，搭配富含植化素的蔬菜一起料理，不僅營養完整且色香味俱全。適合日常維持記憶力與提升身心活力的銀髮族食用。',
//     }
// ]
// })
</script>

<style scoped lang="scss">
.wrap {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
}
.s1 {
  width: 100%;
}

.s1 h3 {
  width: 100%;
  font-size: $font_h3;
  // border: 1px solid blue;
  display: flex;
  margin: 0 auto;
  padding: 20px 20px 20px 20px;
}

.ss1 {
  // border: 1px solid red;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* gap: 20px; */
  margin: 0 auto;
  /* flex-wrap: wrap;    */
  overflow-x: hidden;
}

.ss1 img {
  width: 100%;
  height: auto;
  max-width: 400px;
  display: block;
  padding: 0px 20px 0px 20px;
}

.ss1 p {
  padding: 0px 20px 0px 20px;
  font-size: $font_h5;
}

.b {
  display: flex;
  // border: 1px solid red;
  flex-direction: column;
  // padding-right: 20px;
}

.b button {
  display: block;
  width: 100px;
  border-radius: 20px;
  border: none;
  padding: 10px;
  background-color: $primary_600;
  color: $neutral_white;
  margin-left: auto;
  cursor: pointer;
  margin-right: 20px;
}

.box {
  display: flex;
  padding: 20px 20px 20px 20px;
}

.box h5 {
  font-size: $font_h5;
}
.box > img {
  width: 200px;
  height: auto;
  padding-right: 20px;
  object-fit: contain;
}

.inf {
  line-height: 150%;
}

.toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.ingredients{
    display: flex;
    justify-content: center;
    align-items: center;
}
.bi {
  color: $primary_600;
  font-size: 25px;
}

// ===================RWD=====================
@media (max-width: 820px) {
  .s1 h3 {
    justify-content: center;
    font-size: $font_h3;
    padding: 20px 0 20px 0;
  }

  .ss1 {
    display: flex;
    flex-direction: column;
  }

  .box {
    display: flex;
    flex-direction: column;
  }
  .box > img {
    margin: 0 auto;
  }
}

@media (max-width: 545px) {
  .ss1 img {
    width: 80%;
  }
}

@media (max-width: 415px) {
  .b {
    padding-right: 0;
  }
}

@media (max-width: 375px) {
  .ss1 p {
    padding: 0px 10px 0px 20px;
  }
}
</style>
