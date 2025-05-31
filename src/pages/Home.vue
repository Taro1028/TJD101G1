<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import Carousel from '../components/Carousel.vue'
import Marquee from '../components/Marquee.vue'

</script>

<template>
  <FrontLayout>
    <article class="intro-section">
      <div class="intro-left">
        <div class="slogan">
          <h3>吃得下、吃得好，是我們的堅持。</h3>
          <div class="logo">
            <img src="../assets/images/Logo_L.svg" alt="tibaeat">
            <span>提膳家</span>
          </div>
          <h4>關心長者食用之營養，代替掛心的顧客送上每日健康膳食與貼心關懷，讓愛延續在每一餐之中。</h4>
        </div>
        <div>
          <img class="mainpic" src="../assets/images/Home/home_mainpic.svg" alt="mainpic">
        </div>
      </div>
      <div class="intro-right">
        <div class="bg-circle1"></div>
        <div class="bg-circle2"></div>
        <div class="bg-circle3"></div>
        <Carousel />
      </div>
    </article>

    <section class="sec-1">
      <div class="info-title">
        <h3>🚩 我們提供</h3>
        <h5>—從嚴選食材到傳遞你手中的溫度—</h5>
      </div>
      <div class="serve">
        <div class="s-card">
          <img src="../assets/images/Home/home_card_1.png" alt="home_card_1">
          <div class="s-txt">
            <h4>配合營養師設計餐盒</h4>
            <h6>專業營養師團隊，為您量身設計每一份健康餐盒。計算足夠的營養素，滿足健康目標，吃得美味又安心。</h6>
          </div>
        </div>
        <div class="s-card">
          <img src="../assets/images/Home/home_card_2.jpg" alt="home_card_2">
          <div class="s-txt">
            <h4>客製化餐盒</h4>
            <h6>我們的健康餐盒提供客製化選項，依照您的喜好、過敏原與飲食需求調整，打造專屬於您的美味健康餐。</h6>
          </div>
        </div>
        <div class="s-card">
          <img src="../assets/images/Home/home_card_3.png" alt="home_card_3">
          <div class="s-txt">
            <h4>配送服務</h4>
            <h6>我們的健康餐盒提供貼心外送服務，新鮮餐點直接送到您指定的收貨人手中。輕鬆享受健康美味，無後顧之憂。</h6>
          </div>
        </div>
      </div>
    </section>

    <section class="sec-2">
      <div class="info-title">
        <h3>🍱 餐點料理</h3>
        <h5>—每口都帶來味蕾的滿足感—</h5>
      </div>
      <Marquee />
      <!-- <div class="marquee">
        <div class="upper">
          <img src="" alt="">
        </div>
        <div class="lower">
          <img src="" alt="">
        </div>
      </div> -->
      <div class="sec2-linkblock">
        <a class="btn">瞭解更多</a>
      </div>
    </section>

    <section class="sec-3">
      <div class="info-title">
        <h3>💌 餐友們心得分享</h3>
        <h5>—最真實的回饋—</h5>
      </div>
      <div class="video">
        <a class="ytImg" href="https://www.youtube.com/@silvergate_delivery_for_elders" target="_blank"><img
            src="../assets/images/Home/ytImg.jpg" alt="ytImg"></a>
        <img class="adorn" src="../assets/images/Home/ricecooker.gif" alt="ricecooker">
      </div>
      <div class="feedback">
        <div class="fd-card">
          <h5>「送餐準時又衛生，對平常忙碌沒空煮的我們來說超方便！」</h5>
          <div class="mem-info">
            <img src="../assets/images/Home/feedback-avatar1.png" alt="feedback-avatar1">
            <div class="mem-data">
              <h6>Cathy Chang</h6>
              <p>2025-01-17</p>
            </div>
          </div>
        </div>
        <div class="fd-card">
          <h5>「不只是好吃，更是一種被照顧的感覺，真的很感動。」</h5>
          <div class="mem-info">
            <img src="../assets/images/Home/feedback-avatar2.svg" alt="feedback-avatar2">
            <div class="mem-data">
              <h6>Sam Lai</h6>
              <p>2025-03-29</p>
            </div>
          </div>
        </div>
        <div class="fd-card">
          <h5>「份量剛好，菜色有變化，而且不會太重口味，長輩超喜歡。」</h5>
          <div class="mem-info">
            <img src="../assets/images/Home/feedback-avatar3.png" alt="feedback-avatar3">
            <div class="mem-data">
              <h6>Amy Chen</h6>
              <p>2024-12-03</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec-4">
      <div class="info-title">
        <h3>📰 最新消息</h3>
        <h5>News</h5>
      </div>
      <div class="news-container">
        <div class="main-news">
          <a href="#">
            <div class="newstag">焦點</div>
            <img src="../assets/images/Home/news_1.png" alt="news_1">
            <div class="block-overlay"></div>
            <h4>緯藝基金會助力 攜手推動長者營養餐計畫</h4>
          </a>
        </div>
        <div class="news-list">
          <a href="#">
            <div class="news-item">
              <h4 class="title">緯藝基金會助力 攜手推動長者營養餐計畫</h4>
              <h6 class="contxt">
                在緯藝基金會的溫暖支持下，提膳家得以擴大「長者營養餐計畫」服務範圍，幫助更多需要照護的長輩每日獲得均衡飲食。基金會的資助不僅讓服務持續穩定，也強化了在地照護網絡的連結，將營養、愛與陪伴送進每一位長者的生活中。公益結合專業，為高齡社會注入可長可久的照顧力量。
              </h6>
              <p class="date">最後更新 2025.05.10</p>
            </div>
          </a>
          <a href="#">
            <div class="news-item">
              <h4 class="title">送餐到府服務 提膳家關懷長者健康飲食不打烊</h4>
              <h6 class="contxt">
                隨著高齡化社會來臨，長者的飲食照護成為家庭與社會的重要課題。提膳家推出長者到府送餐服務，結合營養師專業配餐，依個人健康狀況調整菜色，從每日三餐出發，守護長輩的健康與尊嚴。無論居住於都會或偏鄉地區，提膳家都致力讓每一份熱騰騰的飯菜，準時送達、安心入口。
              </h6>
              <p class="date">最後更新 2025.05.08</p>
            </div>
          </a>
          <a href="#">
            <div class="news-item">
              <h4 class="title">提膳家與在地小農協力將養生食材直送長者餐桌</h4>
              <h6 class="contxt">
                為了讓長者吃得更安心、也更支持本地農業，提膳家啟動「在地小農合作計畫」，選用當季新鮮蔬果與無毒作物入菜，打造兼顧美味與健康的送餐服務。這項合作不僅縮短食物里程、減少碳足跡，也創造農民與長者雙贏的關係。提膳家相信，一份好餐點的背後，是整個在地支持系統的溫柔串聯。
              </h6>
              <p class="date">最後更新 2025.05.03</p>
            </div>
          </a>
        </div>
      </div>
      <div class="linkblock">
        <router-link to="/About/News" class="btn">瞭解更多</router-link>
      </div>
    </section>
  </FrontLayout>
</template>

<style scoped lang="scss">
body {
  background-color: $primary_50;
}

// --- 主視覺 start ---
.intro-section {
  width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 48px 80px;
  gap: 48px;
}

.intro-left {
  width: 100%;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.slogan {
  display: flex;
  flex-direction: column;
  gap: 48px;
  text-align: center;
}

h3 {
  font-size: $font_h3;
}

span {
  font-size: calc($font_h1 * 1.25);
  font-weight: bold;
  display: block;
}

h4 {
  font-size: $font_h4;
  font-weight: normal;
  color: $neutral_700;
  text-align: left;
}

.intro-right {
  position: relative;
  overflow: hidden;
  height: 100%;
  display: grid;
  justify-content: center;
  align-content: center;
}

.bg-circle1 {
  position: absolute;
  width: 500px;
  height: 500px;
  filter: blur(8px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, #f28a3a 20%, #8c8c8c0a 70%);
  animation: bg-circle 6s ease-in-out infinite;
  z-index: -1;
  pointer-events: none;
}

@keyframes bg-circle {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(.75);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.15);
  }

}

.bg-circle2 {
  position: absolute;
  width: 240px;
  height: 240px;
  filter: blur(30px);
  top: 30%;
  left: 30%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, #f2a23a 20%, #5c5c5c0a 70%);
  animation: bg-circle 6s ease-in-out infinite;
  animation-delay: 2s;
  z-index: -1;
  pointer-events: none;
}

.bg-circle3 {
  position: absolute;
  width: 300px;
  height: 180px;
  filter: blur(30px);
  bottom: 4%;
  right: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, #f4ca11 20%, #2626260a 70%);
  animation: bg-circle 4s ease-in-out infinite;
  animation-delay: 2.4s;
  z-index: -1;
  pointer-events: none;
}

// --- 主視覺 end ---

// --- 服務介紹 start ---
.sec-1,
.sec-3,
.sec-4 {
  width: 1200px;
  margin: 0 auto;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.info-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px dashed $primary_950;
}

h5 {
  font-size: $font_h5;
  font-weight: normal;
  color: $neutral_700;
}

.serve {
  display: flex;
  padding: 0 20px;
  gap: 48px;
  justify-content: space-between;
}

.s-card {
  width: 325px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  padding: 24px;
  border: .5px solid $neutral_300;
  border-radius: 8px;
}

.s-card img {
  display: block;
  width: 160px;
  height: 160px;
  border-radius: 4px;
}

.s-txt {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.s-txt h4 {
  color: $neutral_black;
  font-weight: bold;
}

h6 {
  font-size: $font_h6;
  font-weight: normal;
  color: $neutral_700;
}

// --- 服務介紹 end ---

.sec-2 .info-title,
.sec2-linkblock {
  width: 1200px;
  margin: 0 auto;
}

// --- 餐點料理跑馬 start ---
// .marquee {
//   overflow: hidden;
//   width: 100%;
//   position: relative;
//   margin: 48px 0;
// }


// .upper,
// .lower {
//   display: flex;
//   gap: 24px;
//   white-space: nowrap;
//   margin-bottom: 24px;
// }

// .upper img,
// .lower img {
//   width: 160px;
//   height: 160px;
//   border-radius: 8px;
//   object-fit: cover;
// }

// --- 餐點料理跑馬 end ---

// --- 餐友心得 start ---
.video {
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.ytImg {
  display: block;
}

.ytImg img {
  display: block;
  width: 760px;
  border-radius: 4px;
  transition: filter 0.3s ease;
}

.ytImg img:hover {
  filter: brightness(1.15);
  transition: filter 0.3s ease;
}

.adorn {
  width: 240px;
  height: 200px;
}

.feedback {
  display: flex;
  gap: 48px;
}

.fd-card {
  width: 336px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid $neutral_300;

  display: flex;
  flex-direction: column;
  gap: 24px;
}

.fd-card h5 {
  color: $neutral_black;
  font-weight: bold;
}

.mem-info {
  display: flex;
  gap: 12px;
}

.mem-info img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.mem-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mem-data h6 {
  margin: 0;
  font-size: $font_h6;
  color: $neutral_700;
}

p {
  margin: 0;
  font-size: $font_p;
  color: $neutral_300;
}

// --- 餐友心得 end ---

// --- 最新消息 start ---
.news-container {
  display: flex;
  align-items: center;
  gap: 48px;
}

.main-news {
  width: 480px;
  flex-shrink: 0;
  position: relative;
}

.main-news img {
  display: block;
  width: 100%;
  border-radius: 8px;
}

.block-overlay {
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6));
  transition: opacity 0.3s ease;
  z-index: 1;

  &:hover {
    opacity: 0;
  }
}

.newstag {
  padding: 4px 8px;
  background-color: $primary_100;
  color: $primary_950;
  border-radius: 4px;
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  font-size: $font_h6;
}

.main-news h4 {
  color: $neutral_white;
  position: absolute;
  bottom: 24px;
  left: 18px;
  z-index: 1;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.news-list a {
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 8px;
  transition: 0.3s ease;


  &:hover {
    border-bottom: 1px solid $neutral_300;
    transition: 0.3s ease;
  }
}

.news-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  color: $neutral_black;
  font-weight: bold;
  transition: 0.3s ease;
}

a:hover .title {
  color: $primary_600;
  transition: 0.3s ease;
}

.contxt {
  font-size: $font_h6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.linkblock,
.sec2-linkblock {
  display: flex;
  justify-content: end;
}

.btn {
  display: block;
  text-decoration: none;
  color: $neutral_white;
  background-color: $neutral_black;
  border: 2px solid $neutral_black;
  padding: 12px 24px;
  border-radius: 24px;
  transition: 0.3s ease;

  &:hover {
    color: $neutral_black;
    background-color: $neutral_white;
    transition: 0.3s ease;
  }
}

// --- 最新消息 end ---

// --- RWD ---

@media screen and (max-width: 1300px) {
  .intro-section {
    width: 90%;
    padding: 48px 60px;
  }

  .bg-circle1 {
    width: 400px;
    height: 480px;
  }

  .bg-circle2 {
    width: 140px;
    height: 180px;
    top: 26%;
    left: 40%;
  }

  .bg-circle3 {
    width: 200px;
    height: 180px;
  }

  .sec-1,
  .sec-3,
  .sec-4,
  .sec-2 .info-title,
  .sec2-linkblock {
    width: 90%;
  }

}

@media screen and (max-width: 1100px) {

  .serve {
    margin: 0 auto;
    display: block;
    padding: 0;
  }

  .bg-circle1 {
    width: 360px;
  }

  .s-card {
    max-width: 300px;
    margin-bottom: 24px;
  }

  .s-txt {
    max-width: 252px;
  }

  .video {
    flex-direction: column;
    align-items: center;
  }

  .ytImg img {
    width: 96%;
  }

  .adorn {
    width: 200px;
    height: auto;
    align-self: self-end;
  }

  .feedback {
    justify-content: space-between;
    gap: 24px;
  }

  .news-container,
  .news-list {
    gap: 24px;
  }

}

@media screen and (max-width: 1000px) {
  .intro-section {
    grid-template-columns: 1fr;
  }

  .intro-right {
    padding-top: 80px;
  }

  .bg-circle1 {
    width: 500px;
    height: 500px;
  }

  .bg-circle2 {
    width: 240px;
    height: 240px;
    top: 30%;
    left: 30%;
  }

  .bg-circle3 {
    width: 300px;
    height: 180px;
  }

  .news-container {
    flex-direction: column;
    gap: 48px;
  }

}

@media screen and (max-width: 900px) {
  .feedback {
    flex-direction: column;
    align-items: center;
  }

  .main-news {
  width: 58%;
}

}

@media screen and (max-width: 660px) {
.intro-section,
.sec-1,
.sec-3,
.sec-4 {
  padding: 48px 16px;
}

.s-card,
.fd-card{
  padding: 16px;
}

.fd-card{
  width: 300px;
}


.main-news {
  min-width: 320px;
}

.block-overlay {
  display: none;
}

.main-news h4{
  display: none;
}

}
</style>
