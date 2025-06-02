<script setup>
const values = [
  { label: '溫暖', iconClass: 'bi bi-house-heart', color: '#cf6610' },
  { label: '關懷', iconClass: 'bi bi-clipboard-heart', color: '#f1b42e' },
  { label: '支持', iconClass: 'bi bi-person-hearts', color: '#421606' }
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
        <i :class="['icon', item.iconClass]" :style="{ color: item.color }"></i>
        <div class="label" :style="{ color: item.color }">{{ item.label }}</div>
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
  color: $primary_950;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 20px;
}

.circle-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.circle {
  width: 240px;
  height: 240px;
  border: 12px solid;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

.icon {
  font-size: 60px;
}

.label {
  margin-top: 8px;
  font-weight: 500;
  font-size: $font_h3;
  color: $primary_950;
}

/* RWD 手機版 */
@media (max-width: 820px) {
    .circle-container{
      gap: 20px;
    }

    .circle{
      margin-top: 20px;
    }
}

@media (max-width: 660px) {
  .title {
    font-size: $font_h5;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  .circle {
    width: 160px;
    height: 160px;
    border: 8px solid;
    margin-top: 20px;
  }

  .icon {
    font-size: 40px;
  }

  .label {
    font-size: $font_h4;
  }
}

@media (max-width: 430px) {
  .title {
    font-size: $font_h6;
  }

  .circle-container{
    gap: 10px;
  }

  .circle {
    width: 100px;
    height: 100px;
    border: 6px solid;
    margin-top: 10px;
  }

  .icon {
    font-size: 32px;
  }

  .label {
    font-size: $font_h5;
  }
}
</style>