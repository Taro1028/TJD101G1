<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import Gotop from "../components/Gotop.vue"

import { ref, reactive, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 背景圖片
import backgroundImg from '@/assets/images/Order/background.svg'

// 貼紙圖片
import sticker1 from '@/assets/images/MessageCards/sticker_1.svg'
import sticker2 from '@/assets/images/MessageCards/sticker_2.svg'
import sticker3 from '@/assets/images/MessageCards/sticker_3.svg'
import sticker4 from '@/assets/images/MessageCards/sticker_4.svg'
import sticker5 from '@/assets/images/MessageCards/sticker_5.svg'
import sticker6 from '@/assets/images/MessageCards/sticker_6.svg'
import sticker7 from '@/assets/images/MessageCards/sticker_7.svg'
import sticker8 from '@/assets/images/MessageCards/sticker_8.svg'

import color1 from '@/assets/images/MessageCards/color_1.svg'
import color2 from '@/assets/images/MessageCards/color_2.svg'
import color3 from '@/assets/images/MessageCards/color_3.svg'
import color4 from '@/assets/images/MessageCards/color_4.svg'
import color5 from '@/assets/images/MessageCards/color_5.svg'
import color6 from '@/assets/images/MessageCards/color_6.svg'

const router = useRouter()

// 響應式資料
const selectedColor = ref('')
const messageText = ref('')
const addedStickers = ref([])
const draggedSticker = ref(null)
const previewArea = ref(null)
const isDragging = ref(false)

// 貼紙
const stickers = [
  { id: 1, src: sticker1, alt: 'sun' },
  { id: 2, src: sticker2, alt: 'snail' },
  { id: 3, src: sticker3, alt: 'tree' },
  { id: 4, src: sticker4, alt: 'house' },
  { id: 5, src: sticker5, alt: 'dog' },
  { id: 6, src: sticker6, alt: 'water-tear' },
  { id: 7, src: sticker7, alt: 'heart' },
  { id: 8, src: sticker8, alt: 'flower' }
]

// 顏色 
const colors = [
  { id: 1, value: '#FFE299', src: color1 },
  { id: 2, value: '#FFB3BA', src: color2 },
  { id: 3, value: '#BAFFC9', src: color3 },
  { id: 4, value: '#BAE1FF', src: color4 },
  { id: 5, value: '#FFFFBA', src: color5 },
  { id: 6, value: '#E1BAFF', src: color6 }
]

// 關心小語
const careWords = [
  '三餐好好吃，生活有力氣，我們陪您一起過日子',
  '天涼記得添衣，飯熱就開心吃，慢慢享用喔！',
  '祝您胃口好、精神好，每一天都過得舒心',
  '不管日子多忙，都別忘了照顧自己，要好好吃飯',
  '每一天都值得被好好對待，從這餐開始'
]

// 生成不重疊的位置
function generateRandomPosition() {
  const previewRect = previewArea.value.getBoundingClientRect()
  const stickerSize = 60
  const padding = 10
  
  let attempts = 0
  let position
  
  do {
    position = {
      x: Math.random() * (previewRect.width - stickerSize - padding * 2) + padding,
      y: Math.random() * (previewRect.height - stickerSize - padding * 2) + padding
    }
    attempts++
  } while (checkOverlap(position, stickerSize) && attempts < 50)
  
  return position
}

// 檢查重疊
function checkOverlap(newPosition, stickerSize) {
  return addedStickers.value.some(sticker => {
    const dx = Math.abs(newPosition.x - sticker.x)
    const dy = Math.abs(newPosition.y - sticker.y)
    return dx < stickerSize + 10 && dy < stickerSize + 10
  })
}

// 點擊貼紙添加到預覽區
function addSticker(sticker) {
  const existingIndex = addedStickers.value.findIndex(s => s.originalId === sticker.id)
  
  if (existingIndex !== -1) {
    addedStickers.value.splice(existingIndex, 1)
  } else {
    const position = generateRandomPosition()
    const newSticker = {
      id: Date.now(),
      originalId: sticker.id,
      src: sticker.src,
      alt: sticker.alt,
      x: position.x,
      y: position.y,
      isDragging: false
    }
    addedStickers.value.push(newSticker)
  }
}

// 開始拖曳
function startDrag(event, sticker) {
  event.preventDefault()
  event.stopPropagation()
  
  draggedSticker.value = sticker
  sticker.isDragging = true
  isDragging.value = true
  
  const rect = previewArea.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left - sticker.x
  const offsetY = event.clientY - rect.top - sticker.y
  
  function handleMouseMove(e) {
    if (draggedSticker.value) {
      const newX = e.clientX - rect.left - offsetX
      const newY = e.clientY - rect.top - offsetY
      
      const maxX = rect.width - 60
      const maxY = rect.height - 60
      
      draggedSticker.value.x = Math.max(0, Math.min(newX, maxX))
      draggedSticker.value.y = Math.max(0, Math.min(newY, maxY))
    }
  }
  
  function handleMouseUp() {
    if (draggedSticker.value) {
      draggedSticker.value.isDragging = false
      draggedSticker.value = null
    }
    
    setTimeout(() => {
      isDragging.value = false
    }, 150)
    
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 雙點擊移除貼紙
function handleStickerDoubleClick(sticker) {
  if (isDragging.value) return
  
  const index = addedStickers.value.findIndex(s => s.id === sticker.id)
  if (index !== -1) {
    addedStickers.value.splice(index, 1)
  }
}

// 單點擊處理
function handleStickerClick(event, sticker) {
  event.stopPropagation()
}

// 選擇顏色
function selectColor(color) {
  selectedColor.value = color.value
}

// 插入關心小語
function insertCareWord(word) {
  messageText.value = word
}

// 保存卡片狀態到後端
// async function saveCardState() {
//   const cardData = {
//     backgroundColor: selectedColor.value,
//     message: messageText.value,
//     stickers: addedStickers.value.map(sticker => ({
//       id: sticker.originalId,
//       x: sticker.x,
//       y: sticker.y,
//       src: sticker.src,
//       alt: sticker.alt
//     })),
//     timestamp: new Date().toISOString()
//   }
  
//   try {
//     // 呼叫後端 PHP API
//     const response = await fetch('http://localhost/tjd101/g1/php/save-message-card.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(cardData)
//     })
    
//     const result = await response.json()
    
//     if (result.success) {
//       console.log('卡片狀態已保存:', result)
//       return cardData
//     } else {
//       throw new Error(result.message || '保存失敗')
//     }
//   } catch (error) {
//     console.error('保存卡片狀態時發生錯誤:', error)
//     // 備用方案：儲存到 localStorage
//     localStorage.setItem('messageCardState', JSON.stringify(cardData))
//     return cardData
//   }
// }

function goNext() {
  saveCardState().then(() => {
    router.push('/Order/AddCart')  
  })
}

async function finishMessage() {
  if (messageText.value.trim() || addedStickers.value.length > 0) {
    await saveCardState()
  }
  router.push('/Order/AddCart') 
}
</script>

<template>
    <FrontLayout>
        <div class="wrapper" :style="{ backgroundImage: `url(${backgroundImg})` }">
            <h1>編輯留言小卡</h1>
            <div class="contenter">
                <!-- 左側編輯區 -->
                <div class="left-layout">
                    <div class="color_area">
                        <h4>顏色</h4>
                        <ul class="color_list">

                            <li v-for="color in colors" :key="color.id" 
                                @click="selectColor(color)"
                                :class="{ active: selectedColor === color.value }">
                                <img :src="color.src" :alt="`bg-color${color.id}`">
                            </li>
                        </ul>
                    </div>
                    <div class="stickers">
                        <h4>貼紙</h4>
                        <ul class="sticker_list">
                            
                            <li v-for="sticker in stickers" :key="sticker.id" 
                                @click="addSticker(sticker)"
                                :class="{ active: addedStickers.some(s => s.originalId === sticker.id) }">
                                <img :src="sticker.src" :alt="sticker.alt">
                            </li>
                        </ul>
                    </div>
                    <div class="care_words">
                        <h4>關心小語</h4>
                        <div class="statement">
                            
                            <p v-for="(word, index) in careWords" :key="index" 
                               @click="insertCareWord(word)">
                                {{ word }}
                            </p>
                        </div>
                    </div>
                </div>
                <!-- 右側編輯區 -->
                <div class="right-layout">
                    
                    <div class="preview" ref="previewArea" 
                         :style="{ backgroundColor: selectedColor || '#FFE299' }">
                        
                        <p v-if="!messageText && addedStickers.length === 0">寫點什麼...</p>
                        
                        <div v-if="messageText" class="message-text">{{ messageText }}</div>
                        
                        <div v-for="sticker in addedStickers" :key="sticker.id"
                             class="draggable-sticker"
                             :class="{ 'dragging': sticker.isDragging }"
                             :style="{ 
                               left: sticker.x + 'px', 
                               top: sticker.y + 'px',
                               opacity: sticker.isDragging ? 0.7 : 1
                             }"
                             @mousedown="startDrag($event, sticker)"
                             @click="handleStickerClick($event, sticker)"
                             @dblclick="handleStickerDoubleClick(sticker)"
                             title="雙擊可移除貼紙">
                            <img :src="sticker.src" :alt="sticker.alt">
                        </div>
                    </div>
                    
                    <div class="operation-tips">
                        <small>💡 提示：單擊貼紙出現，拖曳貼紙可調整位置，雙擊貼紙可移除</small>
                    </div>
                    
                    <div class="type_area">
                       
                        <textarea v-model="messageText" 
                                  name="text" id="text" cols="30" rows="10" 
                                  placeholder="請輸入卡片內容"></textarea>
                    </div>
                    <div class="button-area">
                        <button class="btn no_message" @click="goNext">不留言，繼續結帳</button>
                        
                        <button class="btn finish_message" @click="finishMessage">完成留言</button>
                    </div>
                </div>
            </div>
        </div>
        <Gotop></Gotop>
    </FrontLayout>
</template>

<style scoped lang="scss">
    .wrapper{
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 0; 
        background-color: $primary_50;
        background-repeat: repeat;
        overflow-x: hidden;
    }
    .contenter{
        max-width: 1200px;
        margin: 40px auto;
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    h1{
        font-size: 48px;
        text-align: start;
        margin-top: 40px; 
        margin-left: 20%;
        min-width: 1200px;
    }

    h4{
        text-align: start;
    }

    .left-layout{
        display: flex;
        flex-direction: column;
        width: 35%;
        gap: 20px;
        box-sizing: border-box;
        padding: 8px;
        
    }
    .left-layout h4{
        font-weight: normal;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
    .color_list{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .sticker_list{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .sticker_list img{
        width: calc(40px * 1.5);
    }

    .statement{
        margin-top: 16px;
    }

    .statement p{
        color: #4f4f4f;
        line-height: 2;
        cursor: pointer;
    }

    .right-layout{
        width: 45%;
        box-sizing: border-box;
        padding: 8px;
        gap: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .preview{
        width: 100%;
        height: 250px;
        padding: 1.5rem;
        background-color: #FFE299;
        border-radius: 8px;
        box-sizing: border-box;
    }
    .preview p{
        font-size: 1.2rem;
        color: #4f4f4f;
        border-radius: 8px;
    }

    .type_area{
        width: 100%;
        border: 2px solid #4f4f4f;
        border-radius: 8px;
        box-sizing: border-box;
    }

    textarea {
        background-color: transparent; 
        padding: 16px; 
        font-size: 1.2rem;
        resize: none;
        border: none;
        outline: none;
    }

    textarea::placeholder {
        color: #4f4f4f; 
        font-size: 1.2rem; 
    }

    .color_area, .stickers {
    text-align: center;
    }   

    .color_list, .sticker_list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start; 
    }

    .sticker_list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;
    }

    // 按鈕區

    .button-area {
        align-self: flex-end;
        display: flex;
        flex-direction: row;
        gap: 16px;
    }

    .btn {
        padding: 12px 30px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .no_message{
        color: black;
        background-color: #b0b0b0;
    }

    .finish_message{
        color: white;
        background-color: #4f4f4f;
    }

    .no_message:hover {
        background-color: #d0d0d0; 
    }

    .finish_message:hover {
        background-color: #6f6f6f; 
    }


    // 互動元件
.color_list li, .sticker_list li {
    cursor: pointer;
    transition: transform 0.2s ease;
    border-radius: 8px;
    padding: 4px;
    border: 2px solid transparent;
    }

.color_list li:hover, .sticker_list li:hover {
        transform: scale(1.1);
    }

.color_list li.active, .sticker_list li.active {
        border-color: #cf6610;
        background-color: rgba(207, 102, 16, 0.1);
    }

.preview {
    width: 100%;
    height: 250px;
    padding: 1.5rem;
    background-color: #FFE299;
    border-radius: 8px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s ease;
    
    // 新增：讓文字水平垂直置中
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview p {
    font-size: 1.2rem;
    color: #999;
    margin: 0;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 48px);
    z-index: 1;
}

// 訊息文字樣式
.message-text {
    font-size: 1.2rem;
    color: #4f4f4f;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
    text-align: center;
    margin: 0;
    padding: 20px;
    
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 48px);
    max-height: calc(100% - 48px);
    overflow-y: auto;
    z-index: 1;
}

// 貼紙樣式
.draggable-sticker {
    position: absolute;
    cursor: move;
    z-index: 10;
    transition: opacity 0.2s ease, transform 0.2s ease;
    border-radius: 8px;
    padding: 2px;
    user-select: none;
}

.draggable-sticker:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.draggable-sticker.dragging {
    z-index: 100;
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.draggable-sticker img {
    width: 60px;
    height: 60px;
    pointer-events: none;
    user-select: none;
    border-radius: 6px;
}

// 操作提示樣式
.operation-tips {
    text-align: center;
    color: #666;
    font-style: italic;
    margin-bottom: 10px;
}

.operation-tips small {
    display: inline-block;
    padding: 8px 12px;
    background-color: rgba(207, 102, 16, 0.1);
    border-radius: 20px;
    border: 1px solid rgba(207, 102, 16, 0.2);
}

.statement p:hover {
    background-color: rgba(207, 102, 16, 0.1);
    border-radius: 4px;
}

// 美化滾動條
.message-text::-webkit-scrollbar {
    width: 4px;
}

.message-text::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
    border-radius: 2px;
}

.message-text::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.3);
    border-radius: 2px;
}


// 1024px-1439px 桌機/大平板
@media (max-width: 1439px) {
    .contenter {
        max-width: 1000px;
        gap: 30px;
        margin: 30px auto;
    }
    
    h1 {
        margin-left: 10%;
    }
}

@media (min-width: 1500px) {
    h1 {
        margin-left: 25%;
    }
}


// 768px-1023px 平板直立
@media (max-width: 1023px) {
    .contenter {
        flex-direction: column;
        max-width: 700px;
        gap: 30px;
        margin: 20px auto;
        padding: 0 20px;
    }
    
    h1 {
        margin-left: 10%;
    }
    
    .left-layout, .right-layout {
        width: 100%;
    }
    
    .left-layout {
        order: 1;
    }
    
    .right-layout {
        order: 2;
    }
}

// 480px-767px 手機橫向
@media (max-width: 767px) {
    .wrapper {
        padding: 0 15px;
    }
    
    .contenter {
        margin: 15px auto;
        padding: 0 10px;
    }
    
    h1 {
        font-size: 28px;
        margin-left: 2%;
    }
    
    .left-layout h4 {
        font-size: 1.3rem;
        margin-bottom: 1rem;
    }
    
    .color_list, .sticker_list {
        gap: 8px;
    }
    
    .sticker_list img {
        width: calc(35px * 1.5);
    }
    
    .preview {
        height: 200px;
        padding: 1rem;
    }
    
    .preview p {
        font-size: 1rem;
    }
    
    textarea {
        font-size: 1rem;
        padding: 12px;
    }
    
    .button-area {
        gap: 12px;
    }
    
    .btn {
        padding: 12px;
    }
}

// 320px-479px 手機直立
@media (max-width: 479px) {
    h1 {
        font-size: 24px;
        margin-top: 15px;
    }
    
    .contenter {
        gap: 20px;
        margin: 10px auto;
    }
    
    .left-layout h4 {
        font-size: 1.2rem;
    }
    
    .color_list, .sticker_list {
        gap: 6px;
    }
    
    .sticker_list img {
        width: calc(30px * 1.5);
    }
    
    .statement p {
        font-size: 14px;
        line-height: 1.8;
    }
    
    .preview {
        height: 150px;
        padding: 0.8rem;
    }
    
    .preview p {
        font-size: 0.9rem;
    }
    
    textarea {
        font-size: 0.9rem;
        padding: 10px;
    }
}

</style>