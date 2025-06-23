<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import Gotop from "../components/Gotop.vue"

import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

import { useOrderStore } from '@/stores/orderStore'
import { usePlanCustomStore } from '@/stores/planCustomStore'
import { useCartStore } from '@/stores/cartStore'

import html2canvas from 'html2canvas'

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
const orderStore = useOrderStore()
const planCustomStore = usePlanCustomStore()
const cartStore = useCartStore()

// 響應式資料
const selectedColor = ref('')
const messageText = ref('')
const addedStickers = ref([])
const draggedSticker = ref(null)
const previewArea = ref(null)
const isDragging = ref(false)

// 手機裝置檢測和編輯模式
const isMobile = ref(false)
const selectedSticker = ref(null)
const showEditMenu = ref(false)
const editMenuPosition = ref({ x: 0, y: 0 })
const longPressTimer = ref(null)
const LONG_PRESS_DURATION = 800 // 長按時間(毫秒)

// 截圖功能
const isCapturing = ref(false)
const capturedImageUrl = ref('')


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
  { id: 2, value: '#FFD3A8', src: color2 },
  { id: 3, value: '#FFAFA3', src: color3 },
  { id: 4, value: '#D3BDFF', src: color4 },
  { id: 5, value: '#B3EFBD', src: color5 },
  { id: 6, value: '#A8DAFF', src: color6 }
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
  // 桌面版：阻止事件冒泡但不做其他處理
  if (!isMobile.value) {
    event.stopPropagation()
    return
  }
  
  // 手機版：由觸控事件處理，這裡不做處理
}

// 觸控開始處理
function handleTouchStart(event, sticker) {
  if (!isMobile.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  // 如果貼紙已經處於拖曳模式，直接進行拖曳
  if (sticker.isDragging) {
    startMobileTouchDrag(event, sticker)
    return
  }
  
  // 記錄觸控開始的時間和位置
  const touch = event.touches[0]
  sticker.touchStartTime = Date.now()
  sticker.touchStartX = touch.clientX
  sticker.touchStartY = touch.clientY
  sticker.hasMoved = false
  
  // 長按計時器
  longPressTimer.value = setTimeout(() => {
    // 長按直接刪除
    removeMobileSticker(sticker)
    longPressTimer.value = null
  }, LONG_PRESS_DURATION)
}

// 觸控結束處理
function handleTouchEnd(event, sticker) {
  if (!isMobile.value) return
  
  event.preventDefault()
  
  // 清除長按計時器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  
  // 如果正在拖曳模式，結束拖曳
  if (sticker.isDragging) {
    sticker.isDragging = false
    isDragging.value = false
    delete sticker.offsetX
    delete sticker.offsetY
    return
  }
  
  // 如果沒有移動且時間短於長按時間，認為是點擊
  const touchDuration = Date.now() - sticker.touchStartTime
  if (!sticker.hasMoved && touchDuration < LONG_PRESS_DURATION) {
    showStickerEditMenu(sticker, event.changedTouches[0])
  }
  
  // 清理臨時屬性
  delete sticker.touchStartTime
  delete sticker.touchStartX
  delete sticker.touchStartY
  delete sticker.hasMoved
}


// 開始手機觸控拖曳
function startMobileTouchDrag(event, sticker) {
  const touch = event.touches[0]
  const rect = previewArea.value.getBoundingClientRect()
  
  // 計算觸控點相對於貼紙的偏移
  sticker.offsetX = touch.clientX - rect.left - sticker.x
  sticker.offsetY = touch.clientY - rect.top - sticker.y
}


// 觸控移動處理
function handleTouchMove(event, sticker) {
  if (!isMobile.value) return
  
  event.preventDefault()
  
  // 如果正在拖曳模式，進行拖曳
  if (sticker.isDragging) {
    const touch = event.touches[0]
    const rect = previewArea.value.getBoundingClientRect()
    
    const newX = touch.clientX - rect.left - sticker.offsetX
    const newY = touch.clientY - rect.top - sticker.offsetY
    
    const maxX = rect.width - 60
    const maxY = rect.height - 60
    
    sticker.x = Math.max(0, Math.min(newX, maxX))
    sticker.y = Math.max(0, Math.min(newY, maxY))
    return
  }
  
  // 檢查是否有移動（用於判斷是點擊還是拖曳）
  const touch = event.touches[0]
  const moveDistance = Math.sqrt(
    Math.pow(touch.clientX - sticker.touchStartX, 2) + 
    Math.pow(touch.clientY - sticker.touchStartY, 2)
  )
  
  if (moveDistance > 10) { // 移動超過10px認為是拖曳
    sticker.hasMoved = true
    
    // 清除長按計時器
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }
}

// 選擇顏色
function selectColor(color) {
  selectedColor.value = color.value
}

// 插入關心小語
function insertCareWord(word) {
  messageText.value = word
}

// 檢測是否為手機裝置
function checkIsMobile() {
  isMobile.value = window.innerWidth <= 767 || 'ontouchstart' in window
}

// 手機模式：顯示編輯選單
// 修正編輯選單位置計算
function showStickerEditMenu(sticker, touch) {
  selectedSticker.value = sticker
  const rect = previewArea.value.getBoundingClientRect()
  const menuWidth = 120
  const menuHeight = 100
  
  // 使用觸控點位置，如果是 touch 事件
  let clientX, clientY
  if (touch.clientX !== undefined) {
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    // 如果沒有觸控資訊，使用貼紙中心位置
    clientX = rect.left + sticker.x + 30 // 貼紙寬度的一半
    clientY = rect.top + sticker.y + 30
  }
  
  let x = clientX - rect.left
  let y = clientY - rect.top
  
  // 防止選單超出邊界
  if (x + menuWidth > rect.width) {
    x = rect.width - menuWidth - 10
  }
  if (y + menuHeight > rect.height) {
    y = rect.height - menuHeight - 10
  }
  
  editMenuPosition.value = { x, y }
  showEditMenu.value = true
}

// 手機模式：隱藏編輯選單
function hideEditMenu() {
  showEditMenu.value = false
  selectedSticker.value = null
}

// 手機模式：開始拖曳選中的貼紙
function startMobileDrag(sticker) {
  if (!isMobile.value) return
  hideEditMenu()
  sticker.isDragging = true
  isDragging.value = true
  
  // 自動觸發觸控拖曳模式
  nextTick(() => {
    // 貼紙進入拖曳狀態，等待用戶觸控移動
    console.log('貼紙進入拖曳模式，請觸控移動')
  })
}

// 手機模式：移除選中的貼紙
function removeMobileSticker(sticker) {
  const index = addedStickers.value.findIndex(s => s.id === sticker.id)
  if (index !== -1) {
    addedStickers.value.splice(index, 1)
  }
  hideEditMenu()
}

// 截圖功能函數
async function captureCard() {
  if (!previewArea.value) {
    console.error('預覽區域不存在')
    return null
  }

  try {
    isCapturing.value = true
    
    // 使用 html2canvas 截圖
    const canvas = await html2canvas(previewArea.value, {
      backgroundColor: null, // 保持透明背景
      scale: 2, // 提高解析度
      useCORS: true, // 允許跨域圖片
      allowTaint: true,
      width: previewArea.value.offsetWidth,
      height: previewArea.value.offsetHeight
    })
    
    // 將 canvas 轉為 blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png', 0.9)
    })
    
  } catch (error) {
    console.error('截圖失敗:', error)
    return null
  } finally {
    isCapturing.value = false
  }
}


async function saveCardState() {
  // 檢查是否有內容需要儲存
  if (!messageText.value.trim() && addedStickers.value.length === 0) {
    console.log('沒有內容需要儲存')
    alert('請先輸入留言或添加貼紙')
    return null
  }

  try {
    console.log('開始儲存卡片...')
    
    // 截圖
    const imageBlob = await captureCard()
    
    if (!imageBlob) {
      throw new Error('截圖失敗')
    }
    
    console.log('截圖成功，檔案大小:', imageBlob.size, 'bytes')

    // 準備要送到後端的資料
    const formData = new FormData()
    
    // 添加卡片資料
    const cardData = {
      messageText: messageText.value,
      selectedColor: selectedColor.value,
      stickers: addedStickers.value.map(sticker => ({
        id: sticker.originalId,
        x: sticker.x,
        y: sticker.y
      }))
    }
    
    console.log('卡片資料:', cardData)
    
    formData.append('cardData', JSON.stringify(cardData))
    formData.append('cardImage', imageBlob, `card_${Date.now()}.png`)

    // 發送到後端 API
    console.log('發送請求到 PHP...')
    const env = import.meta.env.VITE_API_URL || 'http://localhost'
    const response = await fetch(env+'/tjd101/g1/php/save-message-card.php', {
      method: 'POST',
      body: formData
    })

    console.log('回應狀態:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HTTP錯誤回應:', errorText)
      throw new Error(`HTTP錯誤: ${response.status}`)
    }

    const result = await response.json()
    console.log('後端回應:', result)
    
    if (!result.success) {
      throw new Error(result.error || '儲存失敗')
    }

    // 成功處理
    console.log('卡片儲存成功:', result)
    return result.cardId // 回傳卡片ID

    // 儲存回傳的資料到 localStorage（可選）
    localStorage.setItem('savedCardImagePath', result.imagePath)
    localStorage.setItem('savedCardId', result.cardId)
    

    // 回傳成功狀態，讓 finishMessage 知道可以跳轉
    // return true

  } catch (error) {
    console.error('儲存卡片失敗:', error)
    alert(`儲存失敗：${error.message}`)
    return null
  }
}

// function goNext() {
//   saveCardState().then(() => {
//     router.push('/Order/AddCart')  
//   })
// }

// async function finishMessage() {
//   if (messageText.value.trim() || addedStickers.value.length > 0) {
//     await saveCardState()
//   }
//   router.push('/Order/AddCart') 
// }

// 【新】完成留言的邏輯：先加入購物車，再關聯留言小卡
async function finishMessage() {
  try {
    // Step 1: 儲存留言小卡
    console.log('Step 1: 儲存留言小卡...')
    const cardId = await saveCardState()
    
    if (!cardId) {
      alert('儲存留言小卡失敗，請重試')
      return
    }

    // Step 2: 根據 query 參數決定調用哪個 store 加入購物車
    const planType = router.currentRoute.value.query.planType
    console.log('Step 2: 準備加入購物車，方案類型:', planType)
    
    let cartResult = null
    
    if (planType === '為你搭配') {
      cartResult = await orderStore.addPlanForYouToCart(cardId)
    } else if (planType === '自由搭配') {
      cartResult = await planCustomStore.addAllCustomMealsToCart(cardId)
    } else {
      throw new Error('未知的方案類型: ' + planType)
    }

    if (!cartResult || !cartResult.cart_id) {
      throw new Error('加入購物車失敗，未獲得購物車ID')
    }

    // Step 3: 成功完成，導向購物車頁面
    console.log('✅ 所有步驟完成，導向購物車頁面')
    alert('留言小卡已成功加入訂單！')
    router.push('/Order/AddCart')

  } catch (error) {
    console.error('完成留言失敗:', error)
    alert('操作失敗：' + error.message)
  }
}

// 不留言，直接加入購物車
async function goNext() {
  try {
    const planType = router.currentRoute.value.query.planType
    console.log('不留言，直接加入購物車，方案類型:', planType)
    
    if (planType === '為你搭配') {
      await orderStore.addPlanForYouToCart()
    } else if (planType === '自由搭配') {
      await planCustomStore.addAllCustomMealsToCart()
    } else {
      throw new Error('未知的方案類型: ' + planType)
    }

    router.push('/Order/AddCart')
  } catch (error) {
    console.error('加入購物車失敗:', error)
    alert('加入購物車失敗：' + error.message)
  }
}

// 生命週期函數
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  // 手機模式：點擊預覽區域隱藏編輯選單
  if (previewArea.value) {
    previewArea.value.addEventListener('click', (event) => {
      if (isMobile.value && event.target === previewArea.value) {
        hideEditMenu()
      }
    })
  }
})

// 清理事件監聽器
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
  }
})

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
                          :class="{ 'dragging': sticker.isDragging, 'selected': selectedSticker?.id === sticker.id }"
                          :style="{ 
                            left: sticker.x + 'px', 
                            top: sticker.y + 'px',
                            opacity: sticker.isDragging ? 0.7 : 1
                          }"
                          @mousedown="!isMobile ? startDrag($event, sticker) : null"
                          @click="handleStickerClick($event, sticker)"
                          @dblclick="!isMobile ? handleStickerDoubleClick(sticker) : null"
                          @touchstart="handleTouchStart($event, sticker)"
                          @touchmove="handleTouchMove($event, sticker)"
                          @touchend="handleTouchEnd($event, sticker)"
                          :title="isMobile ? '點擊編輯，長按刪除' : '雙擊可移除貼紙'">
                          <img :src="sticker.src" :alt="sticker.alt">
                        </div>

                      <!-- 手機編輯選單 -->
                      <div v-if="showEditMenu && isMobile" 
                          class="mobile-edit-menu"
                          :style="{
                            left: editMenuPosition.x + 'px',
                            top: editMenuPosition.y + 'px'
                          }">
                          <button @click="startMobileDrag(selectedSticker)" class="menu-btn move-btn">
                              📱 移動
                          </button>
                          <button @click="removeMobileSticker(selectedSticker)" class="menu-btn delete-btn">
                              🗑️ 刪除
                          </button>
                      </div>
                    </div>
                    
                    <div class="operation-tips">
                      <small v-if="isMobile">
                          💡 提示：點擊貼紙編輯，長按直接刪除
                      </small>
                      <small v-else>
                          💡 提示：單擊貼紙出現，拖曳貼紙可調整位置，雙擊貼紙可移除
                      </small>
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
        max-width: 1200px;
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

// 手機編輯選單樣式
.mobile-edit-menu {
    position: absolute;
    background: white;
    border: 2px solid $primary_400;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 200;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.menu-btn {
    padding: 12px 16px;
    border: none;
    background: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
    white-space: nowrap;
}

.menu-btn:hover {
    background-color: #f5f5f5;
}

.move-btn:hover {
    background-color: rgba(207, 102, 16, 0.1);
}

.delete-btn:hover {
    background-color: rgba(220, 53, 69, 0.1);
}

// 選中狀態樣式
.draggable-sticker.selected {
    border: 2px solid $primary_400;
    box-shadow: 0 0 10px rgba(207, 102, 16, 0.3);
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

// 手機裝置樣式 (767px以下)
@media (max-width: 767px) {
   
    .operation-tips small {
        padding: 6px 10px;
        font-size: 12px;
    }
    
    // 編輯選單在手機上更大更好點擊
    .mobile-edit-menu {
        min-width: 120px;
    }
    
    .menu-btn {
        padding: 16px 20px;
        font-size: 16px;
    }

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

    .draggable-sticker {
      cursor: pointer;
      touch-action: none; // 防止默認觸控行為
      -webkit-touch-callout: none; // 防止長按選單
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }

  .draggable-sticker.dragging {
      z-index: 100;
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      cursor: grabbing;
      opacity: 0.8 !important;
  }

  .preview {
      touch-action: none; // 防止預覽區域的觸控滾動
      overflow: hidden;
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