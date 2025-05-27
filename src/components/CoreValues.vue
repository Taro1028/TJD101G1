<script setup>
const values = [
  { label: '溫暖', icon: '🏠', color: '#cf6610' },
  { label: '關懷', icon: '🤝', color: '#f1b42e' },
  { label: '支持', icon: '🛠️', color: '#421606' }
];
</script>

<template>
  <section class="core-values">
    <h3 class="title">TibaEAT 核心理念</h3>
    <div class="circle-container">
      <div
        v-for="(item, index) in values"
        :key="index"
        class="circle"
        :style="{ borderColor: item.color }"
      >
        <div class="icon">{{ item.icon }}</div>
        <div class="label">{{ item.label }}</div>
      </div>
    </div>
  </section>
</template>



<style scoped lang="scss">
.core-values {
    margin: 40px 0;
}

.title {
    font-size: $font_h3;
    margin-top: 80px;
    margin-bottom: 20px;
    color: $primary_950;
}

.circle-container {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

.circle {
    width: 320px;
    height: 320px;
    border: 20px solid;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
}

.icon {
    font-size: $font_h1;
}

.label {
    margin-top: 8px;
    font-weight: 500;
    font-size: $font_h3;
    color: $primary_950;
}
</style>