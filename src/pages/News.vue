<script setup>
import { ref, onMounted } from 'vue'
import FrontLayout from '@/layouts/FrontLayout.vue'
import Gotop from "../components/Gotop.vue"
import NewsBlock from '../components/NewsBlock.vue'
import { newsApi, newsUtils } from '@/services/newsApi'

// 響應式資料
const focusNews = ref([])
const depthNews = ref([])
const lunchNews = ref([])
const loading = ref(true)
const error = ref(null)
const baseUrl = ref(import.meta.env.BASE_URL);

// 載入各類別新聞
const loadNewsByCategory = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 並行載入三個分類的資料
    const [focusResponse, depthResponse, lunchResponse] = await Promise.all([
      newsApi.getNewsByTag('焦點計畫', 4),  // 焦點計畫載入4篇
      newsApi.getNewsByTag('深度專題', 5),  // 深度專題載入5篇
      newsApi.getNewsByTag('誰來午餐', 6)   // 誰來午餐載入6篇
    ])

    // 處理各分類資料
    focusNews.value = focusResponse.data
    depthNews.value = depthResponse.data
    lunchNews.value = lunchResponse.data

    // console.log('載入成功:', {
    //   focus: focusResponse.data.length,
    //   depth: depthResponse.data.length,
    //   lunch: lunchResponse.data.length
    // })

  } catch (err) {
    console.error('載入新聞失敗:', err)
    error.value = newsUtils.getErrorMessage(err)
  } finally {
    loading.value = false
  }
}

// 組件掛載時載入資料
onMounted(() => {
  loadNewsByCategory()
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
                <button @click="loadNewsByCategory()" class="retry-btn">重新載入</button>
            </div>

            <!-- 正常內容 -->
            <template v-else>
                <div class="pagetitle">
                    <h3>📰 最新消息</h3>
                    <h4>掌握我們的消息，關心每一份溫暖與變化</h4>
                </div>

                <!-- 焦點計畫區塊 -->
                <div class="focusplan">
                    <h3>焦點計畫</h3>
                    <section class="sec-1">
                        <!-- 使用 NewsBlock 組件 -->
                        <NewsBlock 
                            mode="focus"
                            :news-list="focusNews"
                            :loading="false"
                            :error="null"
                        />
                    </section>
                    <div class="planlink">
                        <a href="#" @click.prevent>
                            <h5>更多焦點計畫 ></h5>
                        </a>
                    </div>
                </div>

                <!-- 深度專題區塊 -->
                <div class="project">
                    <h3>深度專題</h3>
                    <section class="sec-2">
                        <div 
                            v-for="news in depthNews" 
                            :key="news.ID"
                            @click="$router.push(`/About/News/Newsitem/${news.ID}`)"
                            style="cursor: pointer;"
                        >
                            <div class="projectitem">
                                <img :src="baseUrl + news.IMG" :alt="news.TITLE">
                                <div class="itemtxt">
                                    <h4>{{ news.TITLE }}</h4>
                                    <h6>{{ news.SUMMARY }}</h6>
                                    <p>最後更新 {{ newsUtils.formatDate(news.UPDATED_AT) }}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="planlink">
                        <a href="#" @click.prevent>
                            <h5>更多深度專題 ></h5>
                        </a>
                    </div>
                </div>

                <!-- 誰來午餐區塊 -->
                <div class="guesswho">
                    <h3>誰來午餐</h3>
                    <section class="sec-3">
                        <div 
                            v-for="news in lunchNews" 
                            :key="news.ID"
                            @click="$router.push(`/About/News/Newsitem/${news.ID}`)"
                            style="cursor: pointer;"
                        >
                            <div class="newscard">
                                <img :src="baseUrl + news.IMG" :alt="news.TITLE">
                                <div class="newsinfo">
                                    <h4>{{ news.TITLE }}</h4>
                                    <h6>{{ news.SUMMARY }}</h6>
                                    <p>最後更新 {{ newsUtils.formatDate(news.UPDATED_AT) }}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="planlink">
                        <a href="#" @click.prevent>
                            <h5>更多誰來午餐 ></h5>
                        </a>
                    </div>
                </div>
            </template>
        </div>
        <Gotop />
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

.wrapper {
    margin: 40px auto 64px;
    width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
}

.pagetitle {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pagetitle h3 {
    font-size: $font_h3;
    padding: 0;
    border-bottom: none;
}

.pagetitle h4 {
    font-size: $font_h4;
    font-weight: normal;
    padding-top: 16px;
}

// 各區塊
.focusplan,
.project {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.focusplan h3,
.project h3,
.guesswho h3 {
    font-size: $font_h3;
    padding-bottom: 16px;
    border-bottom: 1px solid $neutral_300;
}

.sec-1 {
    display: flex;
    gap: 24px;
    align-items: center;
}

.planlink a {
    text-decoration: none;
    display: block;
    text-align: right;
    transition: 0.3s ease;

    &:hover {
        color: $primary_600;
        transition: 0.3s ease;
    }
}

.planlink h5 {
    font-size: $font_h5;
    font-weight: normal;
    color: $primary_950;
    transition: 0.3s ease;

    &:hover {
        color: $primary_600;
        transition: 0.3s ease;
    }
}

// 深度專題
.sec-2 {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.sec-2 > div {
    text-decoration: none;
    display: block;
}

.projectitem {
    display: flex;
    gap: 24px;
    transition: 0.3s ease;

    &:hover {
        opacity: .85;
    }
}

.projectitem:hover .itemtxt h4 {
    color: $primary_600;
    transition: 0.3s ease;
}

.projectitem img {
    width: 280px;
    flex-shrink: 0;
    height: 160px;
    border-radius: 8px;
    object-fit: cover;
    object-position: 30% 20%;
}

.itemtxt {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 0;
}

.itemtxt h4 {
    font-size: $font_h4;
    color: $neutral_black;
    transition: 0.3s ease;
}

.itemtxt h6 {
    font-weight: normal;
    font-size: $font_h6;
    color: $neutral_700;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.itemtxt p {
    color: $neutral_300;
}

// 誰來午餐
.sec-3 {
    margin: 24px auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    justify-content: start;
}

.sec-3 > div {
    text-decoration: none;
    transition: 0.3s ease;

    &:hover {
        opacity: .85;
        transition: 0.3s ease;
    }
}

.sec-3 > div:hover .newsinfo h4 {
    color: $primary_600;
    transition: 0.3s ease;
}

.newscard img {
    display: block;
    margin-bottom: 16px;
    width: 320px;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
}

.newsinfo {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.newsinfo h4 {
    font-size: $font_h4;
    color: $neutral_black;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: 0.3s ease;
}

.newsinfo h6 {
    font-size: $font_h6;
    color: $neutral_700;
    font-weight: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.newsinfo p {
    font-size: $font_p;
    color: $neutral_300;
}

// --- RWD ---
@media screen and (max-width: 1050px) {
    .wrapper{
        width: 95%;
    }

    .focusplan,
    .project,
    .guesswho{
        width: 800px;
    }

    .sec-1{
        width: 700px;
        flex-direction: column;
        align-self: center;
    }

    .sec-2{
        width: 700px;
        align-self: center;
    }

    .sec-3{
        width: 700px;
    }

    .itemtxt{
        padding: 0;
    }
}

@media screen and (max-width: 850px) {
    .focusplan,
    .project,
    .guesswho{
        width: 500px;
    }

    .sec-1,
    .sec-2,
    .sec-3{
        width: 460px;
    }

    .itemtxt h4,
    .newsinfo h4{
        font-size: $font_h5;
    }

    .projectitem img{
        width: 160px;
        height: 90px;
    }

    .newscard img{
        width: 280px;
        height: 175px;
        margin: 0 auto 16px;
    }
}

@media screen and (max-width: 550px) {
    .pagetitle h4{
        font-size: $font_h6;
    }

    .pagetitle h3,
    .focusplan h3,
    .project h3,
    .guesswho h3{
        font-size: $font_h4;
    }

    .focusplan,
    .project,
    .guesswho{
        width: 343px;
    }

    .sec-1,
    .sec-2,
    .sec-3{
        width: 340px;
    }

    .itemtxt h4{
        padding-bottom: 4px;
    }

    .itemtxt h6{
        display: none;
    }
    
    .projectitem img{
        width: 120px;
        height: 70px;
    }

    .planlink h5{
        font-size: $font_h6;
    }
}
</style>