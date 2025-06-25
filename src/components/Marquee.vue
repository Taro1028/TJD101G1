<script setup>
import image1 from '@/assets/images/LunchBox/title1item1.png'
import image2 from '@/assets/images/LunchBox/title1item2.png'
import image3 from '@/assets/images/LunchBox/title1item3.png'
import image4 from '@/assets/images/LunchBox/title1item4.png'
import image5 from '@/assets/images/LunchBox/title2item1.png'
import image6 from '@/assets/images/LunchBox/title2item2.png'
import image7 from '@/assets/images/LunchBox/title2item3.png'
import image8 from '@/assets/images/LunchBox/title2item4.png'
import image9 from '@/assets/images/Home/item17.png'
import image10 from '@/assets/images/LunchBox/title3item1.png'
import image11 from '@/assets/images/LunchBox/title3item2.png'
import image12 from '@/assets/images/LunchBox/title3item3.png'
import image13 from '@/assets/images/LunchBox/title3item4.png'
import image14 from '@/assets/images/LunchBox/title4item1.png'
import image15 from '@/assets/images/LunchBox/title4item2.png'
import image16 from '@/assets/images/LunchBox/title4item3.png'
import image17 from '@/assets/images/LunchBox/title4item4.png'
import image18 from '@/assets/images/Home/item18.png'

const upperImages = [
  image1, image2, image3, image4,
  image5, image6, image7, image8,
  image9
]

const lowerImages = [
  image10, image11, image12, image13,
  image14, image15, image16, image17,
  image18
]
</script>

<template>
  <div class="marquee">
    <!-- 上排：向左滾動 -->
    <div class="marquee-row marquee-left">
      <div class="marquee-track">
        <div class="marquee-slide" v-for="(img, i) in upperImages.concat(upperImages)" :key="'up-' + i">
          <img :src="img" :alt="'upper' + i" />
        </div>
      </div>
    </div>

    <!-- 下排：向右滾動 -->
    <div class="marquee-row marquee-right">
      <div class="marquee-track">
        <div class="marquee-slide" v-for="(img, i) in lowerImages.concat(lowerImages)" :key="'low-' + i">
          <img :src="img" :alt="'lower' + i" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  width: 100%;
  overflow: hidden;
  margin: 48px 0;
  display: flex;
  flex-direction: column;
  /* gap: 16px; */
}

.marquee-row {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.marquee-track {
  display: flex;
  /* gap: 16px; */
  width: fit-content;
  animation: scroll-left 20s linear infinite;

  @media screen and (max-width: 800px) {
    animation: scroll-left-mobile 20s linear infinite;

  }
}

.marquee-right .marquee-track {
  animation: scroll-right 20s linear infinite;

  @media screen and (max-width: 800px) {
    animation: scroll-right-mobile 20s linear infinite;

  }
}

.marquee-slide {
  /* width: 160px; */
  width: 11.1111111%;
  padding: 8px;
  box-sizing: border-box;

  /* margin-right: 16px; */
  flex-shrink: 0;

  @media screen and (max-width: 800px) {
    width: 33.33333%;
    padding: 2px;
  }
}



img {
  width: 100%;
  /* height: 160px; */
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  box-sizing: border-box;




}

@keyframes scroll-left {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-100%);
  }
}

@keyframes scroll-right {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0%);
  }
}

@keyframes scroll-left-mobile {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-300%);
  }
}

@keyframes scroll-right-mobile {
  0% {
    transform: translateX(-300%);
  }

  100% {
    transform: translateX(0%);
  }
}
</style>
