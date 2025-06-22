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
          <button @click="goToOrder">{{ text }}</button>
        </div>
      </article>
    </section>

    <section class="box-wrap">
      <article
        v-for="(item, index) in content.item"
        :key="index"
        class="box"
        @click="showLightbox(index)"
      >
        <img :src="item.picture" alt="" />
        <section class="test">
          <article>
            <h5>{{ item.name }}</h5>
            <!-- <p>功效：</p> -->
            <p class="inf">{{ item.description }}</p>

            <!-- <article class="toggle" @click="toggleAccordion(index)">
              <i
                class="bi"
                :class="
                  openIndex === index
                    ? 'bi-caret-up-fill'
                    : 'bi-caret-down-fill'
                "
              ></i>
            </article>
            <p class="ingredients" :class="{ open: openIndex === index }">
              {{ item.ingredients }}
            </p> -->
          </article>
        </section>
      </article>
      <!-- vue-easy-lightbox 元件 -->
      <VueEasyLightbox
        :visible="visible"
        :imgs="imageList"
        :index="previewIndex"
        @hide="visible = false"
      />
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
import { ref, onMounted } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { useRouter } from "vue-router";
const router = useRouter();
const { content, text } = defineProps(["content", "text"]);

const openIndex = ref(null);
function toggleAccordion(index) {
  openIndex.value = openIndex.value === index ? null : index;
}

const visible = ref(false); // 控制是否顯示 lightbox
const previewIndex = ref(0); // 點到哪張
const imageList = ref([]); // 所有圖片的 URL

function goToOrder() {
  router.push("/Order/Select");
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

// 點圖片開啟 lightbox
const showLightbox = (index) => {
  previewIndex.value = index;
  visible.value = true;
};

// 頁面載入時整理圖片清單
onMounted(() => {
  if (content?.item?.length) {
    imageList.value = content.item.map((item) => item.picture);
  }
});
</script>

<style scoped lang="scss">
.wrap {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  // margin-bottom: 80px;
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
  padding: 20px 0px;
  margin-top: 50px;
}

.box-wrap {
  // border: 1px solid red;
  display: flex;
  flex-wrap: wrap;
  // gap: 160px;
  justify-content: space-between;
  margin: 40px 0px;
}
.box {
  //[data-v-5aae0fb5]
  width: 45%;
  margin-bottom: 30px;
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
  // padding: 0px 20px 0px 20px;
  margin-bottom: 20px;
}

.ss1 p {
  padding: 0px 20px 0px 20px;
  font-size: $font_h5;
  margin-bottom: 10px;
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

.b button:hover {
  background-color: $primary_400;
}

//
.ingredients {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease;
}

.ingredients.open {
  max-height: 100px;
  opacity: 1;
}

.box {
  // border: 1px solid blue;
  width: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.box h5 {
  font-size: $font_h5;
  margin: 20px 0px 20px 0px;
  text-align: center;
}
.box > a > img {
  width: 200px;
  height: auto;
  margin-right: 50px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
}
.box > img {
  width: 200px;
  height: auto;
  margin-right: 50px;
  // margin-right: 20px;

  object-fit: contain;
  border-radius: 8px;
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
.ingredients {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bi {
  color: $primary_600;
  font-size: 25px;
}

.test {
  display: flex;
}
// ===================RWD=====================
@media (max-width: 1220px) {
  .s1 {
    padding: 0px 30px;
  }
  .b {
    padding: 0px 30px;
  }

  .box {
    padding: 0px 30px;
  }
}
@media (max-width: 1200px) {
  .s1 {
    padding: 0px 30px;
  }
  .b {
    padding: 0px 30px;
  }

  .box {
    //[data-v-5aae0fb5][data-v-5aae0fb5]
    display: flex;
    width: 42%;
    margin-bottom: 30px;
  }
}

@media (max-width: 1100px) {
  .s1 {
    padding: 0;
  }
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
    // flex-direction: column;
    width: 43%;
    margin-bottom: 30px;
  }
  .box > img {
    margin: 0 auto;
    margin-bottom: 20px;
    margin-right: 30px;
  }
}

// @media (max-width: 933px) {
//   .box-wrap {
//     // flex-direction: column;
//     align-items: center;
//   }

//   .box{//[data-v-5aae0fb5][data-v-5aae0fb5]
//     width: 43%;
//     margin-bottom: 30px;
//   }

//   .box > img {
//     margin-right: 20px;
//   }

//   .box h5{//[data-v-5aae0fb5]
//     font-size: 1.25rem;
//     margin: 10px 0px 20px 0px;
//     text-align: center;
//   }
// }

@media (max-width: 860px) {
  .box {
    //[data-v-5aae0fb5][data-v-5aae0fb5]
    width: 42%;
    margin-bottom: 30px;
  }
  // .inf {
  //   width: 100%;
  // }
  .ss1 img {
    width: 80%;
  }

  .ss1 p[data-v-5aae0fb5] {
    padding: 0px 20px 0px 20px;
  }
}
@media (max-width: 857px) {
  .box > img {
    width: 40%;
  }
}
@media (max-width: 810px) {
  .box {
    flex-direction: column;
  }
  .box > img {
    margin: 0;
  }
}

@media (max-width: 750px) {
  .box {
    width: 90%;
    margin: 0 auto 20px;
    flex-direction: column;
  }
}

// @media (max-width: 500px) {
//   .box {
//     width: 90%;
//     margin: 0 auto 20px;
//     flex-direction: column;
//   }
// }

@media (max-width: 415px) {
  .box {
    width: 70%;
    margin-bottom: 30px;
  }
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
