<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

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
    image9, image10
]

const lowerImages = [
    image11, image12, image13, image14,
    image15, image16, image17, image18
]

const upperRow = ref(null)
const lowerRow = ref(null)

onMounted(() => {
    gsap.to(upperRow.value, {
        xPercent: -50,
        duration: 25,
        repeat: -1,
        ease: 'linear'
    })

    gsap.to(lowerRow.value, {
        xPercent: 50,
        duration: 30,
        repeat: -1,
        ease: 'linear'
    })
})
</script>

<template>
    <div class="marquee">

        <div class="row upper" ref="upperRow">
            <template v-for="(img, index) in [...upperImages, ...upperImages]" :key="'upper-' + index">
                <img :src="img" :alt="'upperimg' + index" />
            </template>
        </div>


        <div class="row lower" ref="lowerRow">
            <template v-for="(img, index) in [...lowerImages, ...lowerImages]" :key="'lower-' + index">
                <img :src="img" :alt="'lowerimg' + index" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.marquee {
    width: 100%;
    margin: 48px 0;
    overflow: hidden;
    position: relative;
}

.row {
    display: flex;
    gap: 16px;
    white-space: nowrap;
    will-change: transform;
    padding-block: 12px;
}

img {
    display: block;
    width: 160px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

@media screen and (max-width: 800px){
    img {
    width: 80px;
}
}

</style>
