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
            <transition name="slide-fade">
                <p v-if="currentText" :key="currentIndex" class="marquee-text">
                    {{ currentText }}
                </p>
            </transition>
        </div>
</template>

<style scoped lang="scss">
.marquee-wrapper {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: $font_h1;
  color: $primary_600;
  font-weight: bold;
  position: relative;
  margin-top: 80px;
}

.marquee-text {
  white-space: nowrap;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s ease, opacity 0.6s ease;
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>