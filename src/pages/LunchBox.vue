<template>
  <FrontLayout>
    <img src="../assets/images/LunchBox/Frame1.png" alt="" />

    <div class="allbutton">
      <button
        v-for="(item, index) in buttonContent"
        :key="index"
        class="fbutton"
      >
        {{ item }}
      </button>
    </div>
    <div class="outwrap">
      <LunchBoxItem
        v-for="(item, index) in totalProduct"
        :key="index"
        :content="item"
        :text="btext"
      >
      </LunchBoxItem>
    </div>
    <Gotop></Gotop>
  </FrontLayout>
</template>

<script setup>
import { ref } from "vue";
import FrontLayout from "../layouts/FrontLayout.vue";
import LunchBoxItem from "../components/LunchBoxItem.vue";
import Gotop from "../components/Gotop.vue";

const buttonContent = ref([
  "樂活元氣餐",
  "舒心控醣餐",
  "柔食樂活餐",
  "蔬食養生餐",
]);
const btext = ref("前往訂餐");

const totalProduct = ref([
  {
    title: "樂活元氣餐",
    picture: new URL(
      "../assets/images/LunchBox/boxitemtitle1.png",
      import.meta.url
    ).href,

    description:
      "隨著年齡增長，長輩的基礎代謝率逐漸下降，營養吸收效率也會變差，若攝取不足，很容易造成體力下滑、免疫力降低，甚至增加慢性病風險。樂活元氣餐專為健康長輩打造，以「高纖、優質蛋白、原型食材」為核心，調整適合銀髮族的營養比例，幫助補充能量、維持肌力、強化骨質與腸胃功能。每日一餐，讓長者吃得健康又開心，是延緩老化、活力樂齡的最佳選擇。",

    item: [
      {
        picture: new URL(
          "../assets/images/LunchBox/title1item1.png",
          import.meta.url
        ).href,
        name: "紅棗枸杞燉雞",
        description:
          "紅棗枸杞燉雞富含補氣養血功效，土雞腿提供優質蛋白，有助維持肌肉量與增強體力。黃耆與枸杞能提升免疫力、促進血液循環，薑片驅寒暖胃。整體湯品溫潤養身，是日常補元氣、增強抵抗力的首選。",
        ingredients: " 食材：雞胸肉、香菇、糙米、洋蔥、紅蘿蔔",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title1item2.png",
          import.meta.url
        ).href,
        name: "南瓜豬肉燉豆腐",
        description:
          "使用低脂豬里肌與滑嫩豆腐搭配南瓜，兼具高蛋白與β-胡蘿蔔素，幫助增強免疫、保護眼睛與促進消化。豬肉先汆燙後清燉減少油脂負擔，適合平日養身、體力調理使用。",
        ingredients:
          " 食材：南瓜、豬里肌肉、嫩豆腐、洋蔥、蒜頭、薑片、米酒、鹽、白胡椒、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title1item3.png",
          import.meta.url
        ).href,
        name: "蕃茄牛肉燉蔬菜",
        description:
          "此道料理富含鐵質與膠原蛋白，番茄中的茄紅素具抗氧化效果，能延緩細胞老化。牛肉提供補氣養血的營養來源，蔬菜燉煮入味、口感柔和，是銀髮族補鐵提神、強健身體的良方。",
        ingredients:
          " 食材：牛腱肉、番茄、紅蘿蔔、馬鈴薯、洋蔥、西洋芹、蒜頭、薑片、月桂葉、黑胡椒、鹽、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title1item4.png",
          import.meta.url
        ).href,
        name: "香煎鮭魚佐野菜",
        description:
          "鮭魚富含Omega-3脂肪酸，有助心血管保護與腦部活化，搭配富含植化素的蔬菜一起料理，不僅營養完整且色香味俱全。適合日常維持記憶力與提升身心活力的銀髮族食用。",
        ingredients:
          " 食材：鮭魚排、花椰菜、甜椒、櫛瓜、洋蔥、橄欖油、檸檬汁、黑胡椒、鹽。",
      },
    ],
  },
  {
    title: "舒心控醣餐",
    picture: new URL(
      "../assets/images/LunchBox/boxitemtitle2.png",
      import.meta.url
    ).href,

    description:
      "高血糖、高血壓、高血脂是許多中老年人常見的慢性疾病，飲食控制不當容易導致併發症。舒心控醣餐以「慢性病調理」為核心，採用低GI、高纖、高鉀的天然食材，並以清蒸、燉煮等健康烹調方式製作，嚴格控制鹽分、糖分與脂肪攝取。 此餐有助於穩定血糖、改善血脂、降低心血管風險，讓長輩安心享食，減輕家屬照顧負擔。 一份好餐，是銀髮族慢性病管理最溫柔的起點。",

    item: [
      {
        picture: new URL(
          "../assets/images/LunchBox/title2item1.png",
          import.meta.url
        ).href,
        name: "洋蔥香蒸雞胸肉",
        description:
          "雞胸肉脂肪低、蛋白質高，是控醣飲食的理想蛋白來源。洋蔥具抗氧化與降血壓功效，搭配少量橄欖油清蒸，減少油鹽攝取，同時保留香氣與口感，有助血糖穩定與增強免疫。",
        ingredients:
          " 食材：雞胸肉、洋蔥、蒜頭、橄欖油、米酒、鹽、白胡椒、薑片。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title2item2.png",
          import.meta.url
        ).href,
        name: "高麗菜燉瘦豬肉",
        description:
          "瘦豬肉經汆燙後低脂清爽，高麗菜富含膳食纖維與植化素，有助腸胃蠕動與膽固醇控制。整體燉煮方式保留食材天然甜味，是慢性病患者可安心享用的舒壓滋味。",
        ingredients:
          " 食材：瘦豬肉、高麗菜、紅蘿蔔、洋蔥、蒜頭、薑片、米酒、鹽、白胡椒、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title2item3.png",
          import.meta.url
        ).href,
        name: "蕃茄牛肉藜麥炒飯",
        description:
          "藜麥屬於低GI穀類，搭配瘦牛肉與番茄料理，有助於血糖控制與提升鐵質吸收。高纖高蛋白的組合能延緩飢餓感，穩定能量來源，適合糖尿病或體重控制者作為正餐選擇。",
        ingredients:
          " 食材：藜麥、瘦牛絞肉、番茄、洋蔥、青豆、蒜末、橄欖油、黑胡椒、鹽。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title2item4.png",
          import.meta.url
        ).href,
        name: "蒸鱈魚佐菠菜",
        description:
          "鱈魚肉質細緻、低脂高蛋白，搭配菠菜含鐵豐富，可預防貧血與增強體力。蒸煮方式保留食材原味與營養，適合血壓、血糖異常者調養身體時食用。",
        ingredients:
          " 食材：鱈魚排、菠菜、蒜末、薑片、米酒、橄欖油、黑胡椒、鹽。",
      },
    ],
  },
  {
    title: "柔食樂活餐",
    picture: new URL(
      "../assets/images/LunchBox/boxitemtitle3.png",
      import.meta.url
    ).href,

    description:
      "牙口變差、吞嚥困難，是許多長輩面對的日常困擾，也常導致他們吃得少、營養不均，進一步造成體重下降與抵抗力變差。柔食樂活餐以「軟質、細緻、營養不打折」為設計原則，精選天然食材經慢火燉煮至滑嫩入味，無須用力咀嚼即可輕鬆吞嚥。 此類餐點可有效改善咀嚼障礙帶來的食慾不振問題，確保長輩仍能攝取完整營養，延緩身體衰退。無論牙齒鬆動、缺牙或口腔不適，都能自在享用、品嚐幸福。",

    item: [
      {
        picture: new URL(
          "../assets/images/LunchBox/title3item1.png",
          import.meta.url
        ).href,
        name: "薑汁雞絲滑蛋粥",
        description:
          "雞絲與蛋花熬煮成滑順米粥，適合牙口不佳、吞嚥困難者輕鬆攝取營養。薑汁促進循環、驅寒暖胃，有助於提升體力與消化功能，是口感溫潤、滋養又好吸收的日常輕食。",
        ingredients: " 食材：雞胸肉、雞蛋、白米、老薑、蔥花、香油、鹽、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title3item2.png",
          import.meta.url
        ).href,
        name: "蕃薯豬肉泥",
        description:
          "豬絞肉燉煮軟爛後打成泥狀，搭配細緻綿密的番薯與豆腐，整體口感滑順易入口。此道料理能補充蛋白與碳水，同時兼顧膳食纖維與腸胃負擔，適合牙口弱或術後調養者食用。",
        ingredients:
          " 食材：番薯、豬絞肉、嫩豆腐、洋蔥、蒜末、橄欖油、鹽、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title3item3.png",
          import.meta.url
        ).href,
        name: "紅燒牛肉糜燴豆腐",
        description:
          "牛肉提供鐵質與蛋白質，搭配嫩豆腐與蔬菜細碎燉煮，柔軟滑順不費咀嚼。適合貧血、氣虛或咀嚼困難的長者，幫助補血補氣、增強體力，是兼顧營養與口感的細膩設計。",
        ingredients:
          " 食材：牛絞肉、嫩豆腐、紅蘿蔔、洋蔥、蒜末、醬油、米酒、香油、黑胡椒、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title3item4.png",
          import.meta.url
        ).href,
        name: "鮭魚山藥蒸泥",
        description:
          "鮭魚含Omega-3脂肪酸，山藥具有健脾補氣、助消化功效，兩者搗成泥狀後口感柔滑，容易吞嚥吸收，適合缺牙或吞嚥困難者補充脂質與蛋白質，是強健體力與滋養腸胃的理想料理。",
        ingredients: " 食材：鮭魚、山藥、牛奶（或高湯）、橄欖油、薑汁、鹽。",
      },
    ],
  },
  {
    title: "蔬食養生餐",
    picture: new URL(
      "../assets/images/LunchBox/boxitemtitle4.png",
      import.meta.url
    ).href,

    description:
      "蔬食養生餐是專為長者設計的營養飲食方案，選用天然蔬果、全穀類及高纖低脂的食材，避免過多油鹽與重口味調味，幫助維持腸道健康、穩定血糖與血壓。此餐點特別注重食材的易咀嚼性與消化性，適合牙口不佳或消化功能較弱的長者食用，同時兼顧美味與健康，提升長者的食慾與生活品質。",

    item: [
      {
        picture: new URL(
          "../assets/images/LunchBox/title4item1.png",
          import.meta.url
        ).href,
        name: "香菇燉豆腐",
        description:
          "豆腐富含植物性蛋白，香菇具免疫調節功能，搭配枸杞與薑絲，有助促進食慾、提升氣血循環，適合牙口較弱的長者食用。燉煮口感柔軟，營養易吸收，有助於修復體力與增強抵抗力。",
        ingredients:
          " 食材：嫩豆腐、香菇、枸杞、薑絲、高湯（或水）、橄欖油、鹽、白胡椒。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title4item2.png",
          import.meta.url
        ).href,
        name: "南瓜糙米炊飯",
        description:
          "高纖維穀物幫助腸道蠕動，南瓜含有豐富β-胡蘿蔔素與維生素A，有助保護視力與免疫力，柔軟米飯便於吞嚥消化。紅藜麥與芝麻提供完整胺基酸與鈣質，強化骨骼與肌力，降低跌倒風險。",
        ingredients: " 食材：糙米、南瓜、紅藜麥、洋蔥、芝麻、橄欖油、鹽、水。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title4item3.png",
          import.meta.url
        ).href,
        name: "山藥炒木耳時蔬",
        description:
          "山藥健脾補氣、木耳潤腸通便，搭配當季時蔬，清爽少油，促進腸道健康與身體代謝，營養又不易脹氣。山藥的黏液蛋白能保護胃黏膜，幫助消化吸收，適合消化功能較弱的長者。",
        ingredients: " 食材：山藥、黑木耳、紅蘿蔔、青江菜、蒜末、橄欖油、鹽。",
      },
      {
        picture: new URL(
          "../assets/images/LunchBox/title4item4.png",
          import.meta.url
        ).href,
        name: "鮮蔬紫菜豆皮湯",
        description:
          "湯品溫潤易入口，補充水分又含多種微量元素，豆皮提供蛋白質，紫菜富含礦物質，有助長者維持營養平衡。搭配海帶與蔬菜的清湯能促進代謝、幫助排毒，適合日常保養身體。",
        ingredients:
          " 食材：紫菜、豆皮、海帶、紅蘿蔔、青江菜、薑絲、鹽、香油、水。",
      },
    ],
  },
]);
</script>

<style scoped lang="scss">

.outwrap{
  margin-bottom: 80px;
}
img {
  width: 100%;
}

.allbutton {
  // border: 1px solid red;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.fbutton {
  display: block;
  width: 150px;
  height: 50px;
  border-radius: 10px;
  border: none;
  padding: 10px;
  background-color: $primary_600;
  color: $neutral_white;

  margin: 0 auto;

  cursor: pointer;
}
// ===================RWD=====================
@media (max-width: 650px) {
  .allbutton {
    display: flex;
    flex-direction: column;
  }

  .fbutton {
    display: block;
    width: 100%;
    margin-top: 20px;
  }
}
</style>
