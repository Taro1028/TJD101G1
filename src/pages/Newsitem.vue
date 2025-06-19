<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FrontLayout from '@/layouts/FrontLayout.vue'
import { newsApi, newsUtils } from '@/services/newsApi'

const baseUrl = ref(import.meta.env.BASE_URL);

const route = useRoute()
const router = useRouter()

// 響應式資料
const newsDetail = ref(null)
const newsContents = ref([])
const loading = ref(true)
const error = ref(null)

// 計算屬性
const tagDisplayName = computed(() => {
  if (!newsDetail.value) return ''
  return newsUtils.getTagDisplayName(newsDetail.value.TAG)
})

const formattedDate = computed(() => {
  if (!newsDetail.value) return ''
  return newsUtils.formatDate(newsDetail.value.UPDATED_AT)
})

// 載入新聞詳情
const loadNewsDetail = async () => {
  try {
    loading.value = true
    error.value = null
    
    const newsId = route.params.id
    
    if (!newsId) {
      throw new Error('新聞ID不存在')
    }

    const response = await newsApi.getNewsDetail(newsId)
    
    if (!response.data) {
      throw new Error('找不到該新聞')
    }

    // 設定主要新聞資料
    newsDetail.value = response.data.news
    
    // 設定內容段落 (已按 SORT_ORDER 排序)
    newsContents.value = response.data.contents || []

    console.log('載入新聞詳情成功:', newsDetail.value.TITLE)

  } catch (err) {
    console.error('載入新聞詳情失敗:', err)
    error.value = newsUtils.getErrorMessage(err)
  } finally {
    loading.value = false
  }
}

// 返回新聞列表
const goBackToNews = () => {
  router.push('/About/News/')
}

// 組件掛載時載入資料
onMounted(() => {
  loadNewsDetail()
})

// 監聽路由變化 (如果從同一頁面跳轉到其他新聞)
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadNewsDetail()
  }
})
</script>

<template>
    <FrontLayout>
        <div class="wrapper">
            <!-- 載入狀態 -->
            <div v-if="loading" class="loading">
                <p>載入中...</p>
            </div>

            <!-- 錯誤狀態 -->
            <div v-else-if="error" class="error">
                <p>{{ error }}</p>
                <div class="error-actions">
                    <button @click="loadNewsDetail()" class="retry-btn">重新載入</button>
                    <button @click="goBackToNews()" class="back-btn">返回新聞列表</button>
                </div>
            </div>

            <!-- 正常內容 -->
            <template v-else-if="newsDetail">
                <div class="newsinfo">
                    <!-- 麵包屑導航 -->
                    <div class="link">
                        <span>
                            <router-link to="/About/News/">最新消息</router-link>
                        </span>
                        <span>&ensp;>&ensp;</span>
                        <span>{{ tagDisplayName }}</span>
                    </div>
                    
                    <!-- 新聞標籤 -->
                    <div class="newstag">{{ tagDisplayName }}</div>
                    
                    <!-- 新聞標題 -->
                    <h1>{{ newsDetail.TITLE }}</h1>
                    
                    <!-- 更新時間 -->
                    <h5>最後更新 {{ formattedDate }}</h5>
                    
                    <!-- 新聞封面圖 -->
                    <img v-if="newsDetail.IMG" :src="baseUrl+newsDetail.IMG" :alt="newsDetail.TITLE">
                </div>

                <div class="newscontent">
                    <!-- 摘要 -->
                    <div class="preface" v-if="newsDetail.SUMMARY">
                        <h4>{{ newsDetail.SUMMARY }}</h4>
                    </div>

                    <!-- 動態內容段落 -->
                    <div 
                        v-for="content in newsContents" 
                        :key="content.ID"
                        class="paragraph"
                    >
                        <!-- 副標題 -->
                        <h3 v-if="content.SUBTITLE">{{ content.SUBTITLE }}</h3>
                        
                        <!-- 段落內容 -->
                        <h4 v-if="content.PARAGRAPH" v-html="content.PARAGRAPH"></h4>
                    </div>

                    <!-- 如果沒有內容段落，顯示提示 -->
                    <div v-if="newsContents.length === 0" class="no-content">
                        <p>此新聞暫無詳細內容</p>
                    </div>
                </div>

                <!-- 返回按鈕 -->
                <div class="back-button">
                    <button @click="goBackToNews()" class="btn-back">
                        ← 返回最新消息
                    </button>
                </div>
            </template>
        </div>
    </FrontLayout>
</template>

<style scoped lang="scss">
// 載入和錯誤狀態樣式
.loading, .error {
    text-align: center;
    padding: 60px 20px;
    
    p {
        font-size: $font_h4;
        color: $neutral_700;
        margin-bottom: 20px;
    }
}

.error-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    
    .retry-btn {
        padding: 8px 16px;
        background-color: $primary_600;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.3s ease;
        
        &:hover {
            background-color: $primary_600;
        }
    }
    
    .back-btn {
        padding: 8px 16px;
        background-color: $neutral_300;
        color: $neutral_700;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.3s ease;
        
        &:hover {
            background-color: $neutral_300;
        }
    }
}

.no-content {
    text-align: center;
    padding: 40px 20px;
    color: $neutral_700;
    font-style: italic;
}

// 返回按鈕樣式
.back-button {
    margin-top: 48px;
    text-align: center;
    
    .btn-back {
        padding: 12px 24px;
        background-color: $primary_600;
        color: white;
        border: 2px solid $primary_600;
        border-radius: 6px;
        font-size: $font_h5;
        cursor: pointer;
        transition: 0.3s ease;
        
        &:hover {
            color: $primary_600;
            background-color: transparent;
            transform: translateY(-1px);
        }
    }
}

// 原有樣式保持不變
.wrapper {
    width: 900px;
    margin: 40px auto 84px;
    display: flex;
    flex-direction: column;
    gap: 48px;
}

.newsinfo {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.newsinfo img {
    display: block;
    margin: auto;
    width: 780px;
    height: 560px;
    object-fit: cover;
    object-position: 50% 25%;
    border-radius: 8px;
}

.link {
    display: flex;
    font-size: $font_h5;
    color: $neutral_700;
}

.link span {
    display: block;
    transition: 0.3s ease;
}

.link a {
    display: block;
    text-decoration: none;
    color: $neutral_700;
    transition: 0.3s ease;

    &:hover {
        text-decoration: underline;
        transition: 0.3s ease;
        color: $primary_600;
    }
}

.newstag {
    display: inline-block;
    width: fit-content;
    font-size: $font_h5;
    font-weight: normal;
    color: $primary_950;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: $primary_100;
}

h1 {
    font-size: $font_h1;
    color: $neutral_black;
}

h5 {
    font-size: $font_h5;
    font-weight: normal;
    color: $neutral_700;
}

.newscontent {
    display: flex;
    flex-direction: column;
    gap: 48px;
}

.newscontent h4 {
    font-size: $font_h4;
    font-weight: normal;
    line-height: 1.6;
    color: $neutral_black;
}

.newscontent h3 {
    font-size: $font_h3;
    color: $neutral_black;
    margin-bottom: 32px;
}

// --- RWD ---
@media screen and (max-width: 950px) {
    .wrapper{
        width: 600px;
        gap: 36px;
    }

    h1{
        font-size: $font_h2;
    }

    .newsinfo img{
        width: 560px;
        height: auto;
    }
}

@media screen and (max-width: 650px) {
    .wrapper{
        width: 343px;
        gap: 24px;
    }

    .link{
        font-size: $font_h6;
    }

    h1{
        font-size: $font_h4;
    }

    h5{
        font-size: $font_h6;
    }    

    .newstag{
        font-size: $font_h6;
    }

    .newsinfo img{
        width: 340px;
        height: auto;
    }

    .newscontent{
        gap: 24px;
    }

    .newscontent h3{
        font-size: $font_h5;
        margin-bottom: 16px;
    }

    .newscontent h4{
        font-size: $font_h6;
    }
    
    .btn-back {
        font-size: $font_h6 !important;
        padding: 10px 20px !important;
    }
}
</style>