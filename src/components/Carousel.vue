<!-- Carousel.vue -->
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import image1 from '@/assets/images/Home/farmer_1.png'
import image2 from '@/assets/images/Home/farmer_2.png'
import image3 from '@/assets/images/About/hualian.jpeg'

const slides = [
    {
        text: '取自最天然食材<br>嚴選超過10年的有機栽種農地',
        image: image1,
    },
    {
        text: '友善土地耕作 支持在地小農<br>吃出健康與永續',
        image: image2,
    },
    {
        text: '每一口，都是自然的饋贈<br>回歸初心的味道',
        image: image3,
    },
]
</script>

<template>
    <div class="inner">
        <Swiper 
            :modules="[Autoplay, Pagination, Navigation]" 
            :autoplay="{ delay: 5000 }" 
            :loop="true" 
            pagination
            navigation 
            class="carousel">
            <SwiperSlide v-for="(item, index) in slides" :key="index">
                <div class="carousel-content">
                    <h4 v-html="item.text"></h4>
                    <img :src="item.image" alt="images" />
                </div>
            </SwiperSlide>

            <div class="custom-nav prev" @click="$el.querySelector('.swiper-button-prev').click()">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" stroke="#262626" stroke-width="2" fill="none" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <div class="custom-nav next" @click="$el.querySelector('.swiper-button-next').click()">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M9 6l6 6-6 6" stroke="#262626" stroke-width="2" fill="none" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
        </Swiper>
    </div>
</template>

<style scoped lang="scss">
.inner {
    position: relative;
    overflow: hidden;
}

.carousel {
    width: 100%;
    position: relative;
}

.carousel-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

.carousel-content h4 {
    font-size: $font_h4;
    font-weight: normal;
    color: $neutral_700;
    margin-bottom: 20px;
    line-height: 1.4;
}

.carousel-content img {
    display: block;
    width: 300px;
    height: 300px;
    border-radius: 8px;
    margin-bottom: 60px;
}


::v-deep(.swiper-button-next),
::v-deep(.swiper-button-prev) {
    display: none;
}

.custom-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

::v-deep(.swiper-pagination-bullet) {
  background: #ccc;
  opacity: 1;              
  width: 10px;
  height: 10px;
  margin: 0 6px;
  transition: background 0.3s;
  border-radius: 50%;
}

::v-deep(.swiper-pagination-bullet-active) {
  background: $primary_600;    
}

/* RWD */
@media (max-width: 768px) {
  .custom-nav {
    display: none;
  }

  .carousel-content img {
    width: 240px;
    height: auto;
  }

  .carousel-content h4 {
    font-size: 1.1rem;
  }
}

</style>
