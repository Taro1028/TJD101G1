<template>
  <div class="packages">
    <svg viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg" @click="handleSvgClick">
      <defs>
        <mask id="progress">
          <rect height="100%" width="100%" fill="#000" />
          <rect 
            class="maskRect" 
            x="0" 
            y="0" 
            :width="progress" 
            height="10" 
            fill="#fff" 
          />
        </mask>
      </defs>   
      
      <!-- 背景線條 -->
      <path d="M 5 5 h 90" stroke="#e7e7e7" stroke-width="1.5" />
      
      <!-- 背景圓點 -->
      <circle cx="5" cy="5" r="3.3" fill="#e7e7e7" />
      <circle cx="35" cy="5" r="3.3" fill="#e7e7e7" />
      <circle cx="64" cy="5" r="3.3" fill="#e7e7e7" />
      <circle cx="95" cy="5" r="3.3" fill="#e7e7e7" />
      
      <!-- 進度效果 -->
      <g mask="url(#progress)">
        <path d="M 5 5 h 90" stroke="#421606" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="5" cy="5" r="3.3" fill="#421606" />
        <circle cx="35" cy="5" r="3.3" fill="#421606" />
        <circle cx="64" cy="5" r="3.3" fill="#421606" />
        <circle cx="95" cy="5" r="3.3" fill="#421606" />
      </g>
    </svg>
    
    <!-- Bootstrap Icons -->
    <div class="icon-container">
      <!-- 訂單確認圖示 -->
      <div class="icon" :class="{ active: progress >= 9 }" style="left: 5%;">
        <i class="bi bi-clipboard-check"></i>
      </div>
      
      <!-- 商品包裝圖示 -->
      <div class="icon" :class="{ active: progress >= 39 }" style="left: 35%;">
        <i class="bi bi-box-seam"></i>
      </div>
      
      <!-- 運送中圖示 -->
      <div class="icon" :class="{ active: progress >= 68 }" style="left: 64%;">
        <i class="bi bi-truck-front"></i>
      </div>
      
      <!-- 已送達圖示 -->
      <div class="icon" :class="{ active: progress >= 100 }" style="left: 95%;">
        <i class="bi bi-house-heart"></i>
      </div>
    </div>
    
    <!-- <div class="container">
      <button @click="setProgress(9)">訂單確認</button>
      <button @click="setProgress(39)">商品包裝</button>
      <button @click="setProgress(68)">運送中</button>
      <button @click="setProgress(100)">已送達</button>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(50)

const setProgress = (num) => {
  progress.value = num
}

const handleSvgClick = (evt) => {
  const svg = evt.currentTarget
  const pt = new DOMPoint()
  pt.x = evt.clientX
  pt.y = evt.clientY
  const loc = pt.matrixTransform(svg.getScreenCTM().inverse())
  setProgress(loc.x)
}
</script>

<style scoped>
.packages {
  width: calc(100% - 20px);
  max-width: 600px;
  min-width: 315px;
  position: relative;
  margin: 0 auto;
}

.maskRect {
  transition: width 310ms;
}

svg {
  width: 100%;
  height: 60px;
  cursor: pointer;
}

.icon-container {
  position: absolute;
  top: 30px; 
  left: 0;
  right: 0;
  height: 0;  
  pointer-events: none;
}

.icon {
  position: absolute;
  width: 24px;  
  height: 24px;
  transform: translate(-50%, -50%);  
  color: #ccc;
  transition: color 300ms;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; 
}

.icon.active {
  color: #fff;
}

.container {
  display: flex;
  margin-top: 20px;
}

.container > button {
  flex: 1;
  margin: 5px;
  padding: 10px 5px;
  cursor: pointer;
  border: 1px solid #1196ab;
  background: #fff;
  color: #1196ab;
  border-radius: 4px;
  transition: all 200ms;
}

.container > button:hover {
  background: #1196ab;
  color: #fff;
}
</style>