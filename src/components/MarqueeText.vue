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
  gap: 0.5rem;
}

.marquee-text {
  white-space: nowrap;
  text-align: center;
  letter-spacing: 2cqb;
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


</style>