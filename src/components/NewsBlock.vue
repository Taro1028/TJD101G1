<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { newsUtils } from '@/services/newsApi'

const router = useRouter()

// Props 定義
const props = defineProps({
  // 新聞資料
  newsList: {
    type: Array,
    required: true,
    default: () => []
  },
  // 顯示模式：'focus' 焦點計畫模式, 'home' 首頁模式
  mode: {
    type: String,
    default: 'focus',
    validator: (value) => ['focus', 'home'].includes(value)
  },
  // 封面新聞（首頁模式使用）
  coverNews: {
    type: Object,
    default: null
  },
  // 是否顯示載入狀態
  loading: {
    type: Boolean,
    default: false
  },
  // 錯誤訊息
  error: {
    type: String,
    default: null
  }
})

// Emits 定義
const emit = defineEmits(['retry'])

// 計算屬性
const displayNews = computed(() => {
  if (props.mode === 'home') {
    return props.newsList.slice(0, 3) // 首頁只顯示3篇
  }
  return props.newsList.slice(0, 3) // 焦點計畫也是3篇列表
})

const mainNews = computed(() => {
  if (props.mode === 'home') {
    return props.coverNews // 首頁使用傳入的封面新聞
  }
  return props.newsList[0] // 焦點計畫使用第一篇
})

// 圖片路徑處理
const getImageUrl = (imagePath) => {
  const baseUrl = import.meta.env.BASE_URL
  return imagePath ? baseUrl + imagePath : ''
}

// 導航到新聞詳情頁
const goToNewsDetail = (newsId) => {
  router.push(`/About/News/Newsitem/${newsId}`)
}

// 格式化日期
const formatDate = newsUtils.formatDate

// 重試函數
const handleRetry = () => {
  emit('retry')
}
</script>

<template>
  <div class="news-block" :class="[`news-block--${mode}`]">
    <!-- 載入狀態 -->
    <div v-if="loading" class="news-loading">
      <p>載入中...</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="news-error">
      <p>{{ error }}</p>
      <button @click="handleRetry" class="retry-btn">重新載入</button>
    </div>

    <!-- 新聞內容 -->
    <template v-else-if="mainNews || displayNews.length > 0">
      <div class="news-container">
        <!-- 主要新聞（封面） -->
        <div 
          v-if="mainNews" 
          class="main-news" 
          @click="goToNewsDetail(mainNews.ID)"
        >
          <div class="newstag">{{ mode === 'home' ? '焦點' : '焦點' }}</div>
          <img :src="getImageUrl(mainNews.IMG)" :alt="mainNews.TITLE">
          <div class="block-overlay"></div>
          <h4>{{ mainNews.TITLE }}</h4>
        </div>

        <!-- 新聞列表 -->
        <div class="news-list">
          <div 
            v-for="news in displayNews" 
            :key="news.ID"
            @click="goToNewsDetail(news.ID)"
            class="news-list-item"
          >
            <div class="news-item">
              <h4 class="title">{{ news.TITLE }}</h4>
              <h6 class="content">{{ news.SUMMARY }}</h6>
              <p class="date">最後更新 {{ formatDate(news.UPDATED_AT) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 沒有新聞資料 -->
    <div v-else class="no-news">
      <p>目前沒有新聞資料</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 基本樣式
.news-block {
  width: 100%;
}

// 載入和錯誤狀態樣式
.news-loading, .news-error, .no-news {
  text-align: center;
  padding: 40px 20px;
  
  p {
    font-size: $font_h5;
    color: $neutral_700;
    margin-bottom: 16px;
  }
}

.retry-btn {
  padding: 8px 16px;
  background-color: $primary_600;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s ease;
  
  &:hover {
    background-color: $primary_400;
  }
}

// 新聞容器
.news-container {
  display: flex;
  align-items: center;
  gap: 48px;
}

// 主要新聞樣式
.main-news {
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}

.main-news img {
  display: block;
  border-radius: 8px;
  object-fit: cover;
}

.block-overlay {
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6));
  transition: opacity 0.3s ease;
  z-index: 1;

  &:hover {
    opacity: 0;
  }
}

.newstag {
  padding: 4px 8px;
  background-color: $primary_100;
  color: $primary_950;
  border-radius: 4px;
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  font-size: $font_h6;
}

.main-news h4 {
  font-size: $font_h4;
  font-weight: normal;
  color: $neutral_white;
  position: absolute;
  bottom: 24px;
  left: 18px;
  z-index: 1;
}

// 新聞列表樣式
.news-list {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.news-list-item {
  cursor: pointer;
  position: relative;
  transition: 0.3s ease;
}

.news-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: $font_h4;
  color: $neutral_black;
  font-weight: bold;
  transition: 0.3s ease;
}

.content {
  font-weight: normal;
  font-size: $font_h6;
  color: $neutral_700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  margin: 0;
  font-size: $font_p;
  color: $neutral_300;
}

// 首頁模式特定樣式
.news-block--home {
  .main-news {
    width: 480px;
    
    img {
      width: 100%;
      max-height: 390px;
    }
  }
  
  .news-list-item {
    border-bottom: 1px solid transparent;
    padding-bottom: 8px;
    
    &:hover {
      border-bottom: 1px solid $neutral_300;
      
      .title {
        color: $primary_600;
      }
    }
  }
}

// 焦點計畫模式特定樣式
.news-block--focus {
  .main-news {
    img {
      margin: auto;
    }
  }
  
  .news-list-item {
    padding-left: 28px;
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 8px;
      height: 64px;
      background-color: $primary_600;
      transition: 0.3s ease;
    }
    
    &:hover {
      &::before {
        background-color: $primary_400;
      }
      
      .title {
        color: $primary_600;
      }
    }
  }
  
  .news-item {
    gap: 16px;
  }
}

// RWD 響應式
@media screen and (max-width: 1100px) {
  .news-container {
    gap: 24px;
  }
}

@media screen and (max-width: 1000px) {
  .news-block--home .news-container {
    flex-direction: column;
    gap: 48px;
  }
}

@media screen and (max-width: 900px) {
  .news-block--home .main-news {
    width: 58%;
  }
}

@media screen and (max-width: 850px) {
  .news-block--focus {
    .news-container {
      flex-direction: column;
      align-self: center;
    }
    
    .main-news,
    .main-news img {
      width: 320px;
      height: auto;
    }
    
    .newstag,
    .block-overlay,
    .main-news h4 {
      display: none;
    }
    
    .title {
      font-size: $font_h5;
    }
  }
}

@media screen and (max-width: 660px) {
  .news-block--home {
    .main-news {
      min-width: 320px;
    }
    
    .block-overlay,
    .main-news h4 {
      display: none;
    }
  }
}
</style>