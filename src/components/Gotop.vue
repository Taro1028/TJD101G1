<template>
  <i
    class="bi bi-arrow-up-circle-fill gotop-icon"
    v-if="show"
    @click="scrollToTop"
  ></i>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(false);

const handleScroll = () => {
  show.value = window.scrollY > 200;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.gotop-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 48px;
  color: $primary_600;
  cursor: pointer;
  z-index: 999;
  transition: opacity 0.3s ease;
}
</style>
