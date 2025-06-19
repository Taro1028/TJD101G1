<template>
  <div class="progress-container">
    <!-- 狀態1: 完成付款 -->
    <div class="circle" :style="getCircleStyle(1)">
      <i class="bi bi-credit-card" :style="getIconStyle(1)"></i>
    </div>

    <div class="line" :style="getLineStyle(1)"></div>

    <!-- 狀態2: 確認 -->
    <div class="circle" :style="getCircleStyle(2)">
      <i class="bi bi-clipboard-check" :style="getIconStyle(2)"></i>
    </div>

    <div class="line" :style="getLineStyle(2)"></div>

    <!-- 狀態3: 包裝 -->
    <div class="circle" :style="getCircleStyle(3)">
      <i class="bi bi-box-seam" :style="getIconStyle(3)"></i>
    </div>

    <div class="line" :style="getLineStyle(3)"></div>

    <!-- 狀態4: 運送 -->
    <div class="circle" :style="getCircleStyle(4)">
      <i class="bi bi-truck" :style="getIconStyle(4)"></i>
    </div>

    <div class="line" :style="getLineStyle(4)"></div>

    <!-- 狀態5: 完成 -->
    <div class="circle" :style="getCircleStyle(5)">
      <i class="bi bi-house-heart" :style="getIconStyle(5)"></i>
    </div>
  </div>   
</template>

<script setup>
  import { computed } from 'vue'

  // 接收父元件傳入的狀態 (1-5)
  const props = defineProps({
    status: {
      type: Number,
      default: 1,
      validator: (value) => value >= 1 && value <= 5 // 🔥 更新為1-5
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
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    gap: 0.25rem; 
  }

  .circle {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0; 
  }

  .line {
    flex: 1; 
    height: 8px;
    background-color: #ccc;
    min-width: 1rem; 
  }
  
  .circle .bi {
    font-size: 1.5rem;
  }

  
  @media (min-width: 768px) {
    .line {
      min-width: 2rem;
    }
    
    .circle .bi {
      font-size: 1.8rem;
    }
  }

  
  @media (max-width: 767px) and (min-width: 580px) {
    .circle {
      width: 2.5rem;
      height: 2.5rem;
    }
    
    .circle .bi {
      font-size: 1.3rem;
    }
    
    .line {
      min-width: 0.8rem;
    }
  }

  
  @media (max-width: 579px) {
    .circle {
      width: 2rem;
      height: 2rem;
    }
    
    .circle .bi {
      font-size: 1rem;
    }
    
    .line {
      min-width: 0.5rem;
      height: 0.3rem;
    }
  }

  
  @media (max-width: 440px) {
    .circle {
      width: 1.8rem;
      height: 1.8rem;
    }
    
    .circle .bi {
      font-size: 0.9rem;
    }
    
    .line {
      min-width: 0.3rem;
      height: 0.25rem;
    }
    
    .progress-container {
      gap: 0.1rem;
    }
  }
</style>