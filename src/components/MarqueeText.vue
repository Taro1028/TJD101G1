<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const texts = [
    '愛，從一份熱騰騰的便當開始',
    '關懷不缺席，溫暖準時送達',
    '傳遞的不只是營養，還有思念與安心',
];

const currentIndex = ref(0);
const currentText = ref(texts[currentIndex.value]);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % texts.length
    currentText.value = texts[currentIndex.value]
  }, 5000)
});

onBeforeUnmount(() => {
  clearInterval(intervalId)
});
</script>

<template>
  <div class="marquee-wrapper">
    <transition name="slide-fade" mode="out-in">
      <div class="marquee-content" :key="currentIndex">
        <i class="bi bi-egg-fried"></i>
        <p class="marquee-text">{{ currentText }}</p>
        <i class="bi bi-egg-fried"></i>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.marquee-wrapper {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: $font_h1;
  color: $primary_600;
  font-weight: bold;
  position: relative;
}

.marquee-content {
  position: absolute;
  display: flex;
  align-items: center;
}

.marquee-text {
  white-space: nowrap;
  letter-spacing: 4px;
  text-shadow: 4px 4px 5px $neutral_300;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 1s ease;
  position: absolute;
  width: 100%;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
}

/* RWD 手機版 */
@media (max-width: 940px) {
  .marquee-wrapper{
    font-size: $font_h2;
  }
}

@media (max-width: 800px) {
  .marquee-wrapper{
    font-size: $font_h3;
  }

  .marquee-text {
  letter-spacing: 0;
}
}

@media (max-width: 660px) {
  .marquee-wrapper{
    height: 120px;
    font-size: $font_h4;
  }
}

@media (max-width: 430px) {
  .marquee-wrapper{
    font-size: $font_h5;
  }
}
</style>