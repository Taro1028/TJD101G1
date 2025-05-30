<script setup>
import FrontLayout from "../layouts/FrontLayout.vue";
import { ref, computed } from 'vue';
import PartnerCard from '@/components/PartnerCard.vue';

const doctors = [
  {
    title: '林怡君 台北市立聯醫營養師',
    description: '怡君是一位具有豐富臨床經驗的營養師，特別擅長與年長者或慢性病患者溝通，她能針對長輩健康、疾病狀況給予最專業與合適的飲食建議，讓我們的餐盒能更符合長輩的身體健康。',
    image: new URL('../assets/images/About/nutritionist1.jpeg', import.meta.url).href
  },
  {
    title: '張雅婷 自由營養師',
    description: '芷涵原先在診所擔任營養師，後來轉型成自由營養顧問，並成為多家健康平台的專欄作家。她經常受邀參加Podcast與YouTube節目，用簡單的語言解釋營養迷思。',
    image: new URL('../assets/images/About/nutritionist2.jpeg', import.meta.url).href
  },
  {
    title: '陳彥廷 社福中心營養顧問',
    description: '彥廷現任社福中心營養顧問，致力於提升弱勢族群與高齡者的飲食健康。他結合營養學與實務經驗，規劃出簡單的均衡餐點，幫助社區民眾「用最小的資源，吃出最大的健康」。',
    image: new URL('../assets/images/About/nutritionist3.png', import.meta.url).href
  }
]

const currentIndex = ref(0)
const currentDoctor = computed(() => doctors[currentIndex.value])

function next() {
  currentIndex.value = (currentIndex.value + 1) % doctors.length
}
function prev() {
  currentIndex.value = (currentIndex.value - 1 + doctors.length) % doctors.length
}

const activeIndex = ref(null)

const handleFlip = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

const closeAll = () => {
  activeIndex.value = null
}

const partners = [
  {
    logo: new URL('../assets/images/About/cooperation_1.jpeg', import.meta.url).href,
    title: '營養慧策團隊',
    description: '提供個人化的營養諮詢，他們相信透過專業知識與熱忱服務，能幫助每個人建立正確的飲食習慣，達成理想的健康目標，享受更美好的生活。'
  },
  {
    logo: new URL('../assets/images/About/cooperation_2.jpeg', import.meta.url).href,
    title: '扶助之手',
    description: '提供及時且適切的協助，支持個人與家庭克服困境。他們相信透過愛與專業，能促進社會的公平與福祉，共同建構溫暖互助的社會。'
  },
  {
    logo: new URL('../assets/images/About/cooperation_3.jpeg', import.meta.url).href,
    title: '樂齡家園',
    description: '他們以愛心與專業，打造溫馨如家的環境，提供長者關懷、健康促進及多元活動。'
  },
  {
    logo: new URL('../assets/images/About/cooperation_4.jpeg', import.meta.url).href,
    title: '耘心協會',
    description: '以溫暖的心，串聯社會資源，為需要幫助的人提供支持與陪伴。致力於點亮希望，讓每一顆心都能感受到關愛，共同編織充滿希望的未來。'
  },
  {
    logo: new URL('../assets/images/About/cooperation_5.png', import.meta.url).href,
    title: '米之味協會',
    description: '推廣台灣優質米食為宗旨，致力於提升稻米品質與價值。我們攜手農民，推廣友善耕作，傳承稻米產業的永續發展。'
  },
  {
    logo: new URL('../assets/images/About/cooperation_6.png', import.meta.url).href,
    title: '田園好味',
    description: '他們與在地小農合作，提供新鮮、當季的田園蔬菜。讓大家能品嚐到最新鮮、最天然的好味道。'
  },
]

// const logoModules = import.meta.glob('../assets/images/About/cooperation_*.{jpeg,png}', { eager: true });

// const logos = Object.values(logoModules).map(module => module.default);

</script>

<template>
    <FrontLayout>
        <div class="wrapper">
            <section class="hero-banner">
                <div class="text-overlay">
                    <h3 class="top_title">三餐用心配，讓照顧更有溫度<br>專業營養團隊，守護家人健康每一口</h3>
                </div>
            </section>
            <section class="doctor-carousel">
                <h2><i class="bi bi-flask" style="color: #e54343;"></i>營養慧策團隊</h2>
                <div class="carousel-container">
                    <button class="btn-left" @click="prev"><i class="bi bi-chevron-left"></i></button>
                    <div class="doctor-info" v-if="currentDoctor">
                        <div class="text-box">
                            <h3>{{ currentDoctor.title }}</h3>
                            <p>{{ currentDoctor.description }}</p>
                        </div>
                        <div class="image-box">
                            <img :src="currentDoctor.image" alt="醫師照片" />
                        </div>
                    </div>
                    <button class="btn-right" @click="next"><i class="bi bi-chevron-right"></i></button>
                </div>
            </section>
            <h2><i class="bi bi-flag" style="color: #e54343;"></i>合作機構</h2>
            <!-- <section class="partner-logos">
                <div class="logo" v-for="(logo, i) in logos" :key="i">
                    <img :src="logo" alt="partner logo" />
                </div>
            </section> -->
            <div class="partner-wrapper" @click="closeAll">
                <div class="partner-grid">
                    <PartnerCard
                        v-for="(item, index) in partners"
                        :key="index"
                        :logo="item.logo"
                        :title="item.title"
                        :description="item.description"
                        :isFlipped="activeIndex === index"
                        @flip="handleFlip(index)"
                    />
                </div>
            </div>
        </div>
    </FrontLayout>
</template>

<style scoped lang="scss">
.wrapper{
    width: 100%;
    background-color: $primary_50;
}

.hero-banner {
    background-image: url('../assets/images/About/topbgi.jpg');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 600px;
    position: relative;
}

.text-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 200px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    align-content: center;
}

.top_title{
    color: $primary_950;
    font-size: $font_h3;
    text-align: center;
}

.doctor-carousel {
    padding: 20px 10px;
}

h2{
    color: $primary_950;
    font-size: $font_h2;
    text-align: center;
    margin-top: 100px;
    margin-bottom: 80px;
}

.carousel-container {
    max-width: 940px;
    margin: 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.doctor-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background-color: $neutral_white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.text-box {
    flex: 1;
    text-align: center;
}

.text-box h3 {
    color: $primary_600;
    font-size: $font_h3;
}

.text-box p {
    color: $primary_950;
    line-height: 1.6;
    font-size: $font_h4;
}

.image-box {
    flex-shrink: 0;
}

.image-box img {
    width: 280px;
    height: 400px;
    object-fit: cover;
    border-radius: 20px;
}

button {
    top: 50%;
    transform: translateY(-50%);
    background-color: $primary_100;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    font-size: $font_h5;
    color: $primary_600;
}

.btn-left {
    margin-right: 10px;
}

.btn-right {
    margin-left: 10px;
}

.partner-grid {
    max-width: 1000px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 60px auto;
    gap: 80px;
}

// .partner-logos {
//     max-width: 1000px;
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: center;
//     margin: 60px auto;
//     gap: 60px;
// }

// .logo img {
//     width: 240px;
//     height: 240px;
//     object-fit: contain;
//     border-radius: 20px;
// }

/* RWD 手機版 */
@media (max-width: 820px) {
    .hero-banner{
        height: 480px;
    }

    h2{
        margin-top: 80px;
    }

    .doctor-info {
        flex-direction: column;
        text-align: center;
    }
    
    .text-box {
        text-align: center;
    }

    .image-box img {
        width: 240px;
        height: 320px;
    }
}

@media (max-width: 620px) {
    h2{
        font-size: $font_h3;
    }

    .text-overlay{
        width: 400px;
        height: 140px;
    }

    .top_title{
        font-size: $font_h4;
    }

    .text-box h3 {
        font-size: $font_h4;
    }

    .text-box p {
        font-size: $font_h5;
    }
    
    .image-box img {
        width: 200px;
        height: 240px;
    }
}

@media (max-width: 420px) {
    .hero-banner{
        height: 400px;
    }

    h2{
        font-size: $font_h4;
        margin-top: 60px;
        margin-bottom: 40px;
    }

    .text-overlay{
        width: 320px;
        height: 100px;
    }

    .top_title{
        font-size: $font_h5;
    }

    .text-box h3 {
        font-size: $font_h4;
    }

    .text-box p {
        font-size: $font_h5;
    }
    
    .image-box img {
        width: 200px;
        height: 240px;
    }

    .btn-left {
        margin-right: 5px;
    }

    .btn-right {
        margin-left: 5px;
    }
}

</style>