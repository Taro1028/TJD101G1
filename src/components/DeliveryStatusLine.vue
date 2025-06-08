<template>
  <div class="progress-container">
    <div class="circle" :style="getCircleStyle(1)">
      <i class="bi bi-clipboard-check" :style="getIconStyle(1)"></i>
    </div>

    <div class="line" :style="getLineStyle(1)"></div>

    <div class="circle" :style="getCircleStyle(2)">
      <i class="bi bi-box-seam" :style="getIconStyle(2)"></i>
    </div>

    <div class="line" :style="getLineStyle(2)"></div>

    <div class="circle" :style="getCircleStyle(3)">
      <i class="bi bi-truck" :style="getIconStyle(3)"></i>
    </div>

    <div class="line" :style="getLineStyle(3)"></div>

    <div class="circle" :style="getCircleStyle(4)">
      <i class="bi bi-house-heart" :style="getIconStyle(4)"></i>
    </div>
  </div>   
</template>

<script setup>
  import { computed } from 'vue'

  // 接收父元件傳入的狀態
  const props = defineProps({
    status: {
      type: Number,
      default: 1,
      validator: (value) => value >= 1 && value <= 4
    }
  })

  // 計算每個元素是否應該填滿顏色
  const isCircleActive = computed(() => (index) => {
    return props.status >= index
  })

  const isLineActive = computed(() => (index) => {
    return props.status > index
  })

  // 獲取circle的樣式
  const getCircleStyle = computed(() => (index) => {
    return {
      backgroundColor: isCircleActive.value(index) ? '#8CBB4A' : '#ccc'
    }
  })

  // 獲取line的樣式
  const getLineStyle = computed(() => (index) => {
    return {
      backgroundColor: isLineActive.value(index) ? '#8CBB4A' : '#ccc'
    }
  })

  // 獲取icon的樣式
  const getIconStyle = computed(() => (index) => {
    return {
      color: isCircleActive.value(index) ? '#F6F4EF' : '#666'
    }
  })
</script>

<style scoped>
  .progress-container {
    display: flex;
    align-items: center;
    margin-top: 0.25rem ;
    margin-bottom: 0.25rem;
    gap: 0.25rem; 
  }

  .circle{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .line{
    width: 6rem;
    height: 8px;
    background-color: #ccc;
  }
  
  .circle .bi{
    font-size: 2rem;
  }

  @media (max-width: 579px){
    .line{
      width: 3rem;
    }
  }

  @media (max-width: 480px){
    .line{
      width: 2rem;
      height: 0.3rem;
    }
  }

  @media (max-width: 440px){
    .circle{
      width: 2rem;
      height: 2rem;
    }
    .circle .bi{
      font-size: 1rem;
    }
  }
</style>