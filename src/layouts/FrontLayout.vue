<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div class="page-container">
  <Header></Header>
  <main class="main-content">
    <slot />
  </main>
  <Footer> </Footer>
  </div>
</template>

<style scoped lang="scss">

</style>