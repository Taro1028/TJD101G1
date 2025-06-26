<script setup>
import { ref, computed, onMounted } from 'vue';
import FrontLayout from '../layouts/FrontLayout.vue';
import Gotop from "../components/Gotop.vue"
import { useMemberStore } from '@/stores/MemberStore'
import { useMyCardsStore } from '@/stores/myCardsStore'
import { useRouter } from 'vue-router'

const showDefaultAvatar = computed(() => !memberStore.hasCustomAvatar);
const userAvatar = computed(() => memberStore.userAvatar);
const avatarInput = ref(null);
const memberStore = useMemberStore()
const myCardsStore = useMyCardsStore()
const router = useRouter()

// 點擊大頭照區域觸發檔案選擇
const handleAvatarClick = () => {
    // console.log('Avatar clicked!');
    // console.log('avatarInput.value:', avatarInput.value);
    
    if (avatarInput.value) {
        // console.log('Triggering file input click');
        avatarInput.value.click();
    } else {
        console.error('avatarInput ref is null');
    }
};

// 處理檔案上傳
const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // console.log('File selected:', file); // 調試用
    
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案');
        // console.log('Invalid file type:', file.type);
        return;
    }
    
    // 檢查檔案大小 (限制 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不能超過 5MB');
        console.log('File too large:', file.size);
        return;
    }
    
    // console.log('File validation passed, reading file...');
    
    // 使用 FileReader 讀取檔案
    const reader = new FileReader();
    
    reader.onload = (e) => {
        memberStore.updateAvatar(e.target.result);
    };
    
    reader.onerror = () => {
        console.error('File read error');
        alert('檔案讀取失敗，請重新選擇');
    };
    
    reader.readAsDataURL(file);
};

// 重置大頭照
const resetAvatar = () => {
    memberStore.resetAvatar();
    if (avatarInput.value) {
        avatarInput.value.value = '';
    }
};

// 燈箱狀態
const isLightboxOpen = ref(false);
const lightboxImageSrc = ref('');
const lightboxCardInfo = ref(null);

// 開啟燈箱
const openLightbox = (card) => {
    lightboxImageSrc.value = card.imageUrl || '';
    lightboxCardInfo.value = card;
    isLightboxOpen.value = true;
    document.body.classList.add("effect");
};

// 關閉燈箱
const closeLightbox = () => {
    isLightboxOpen.value = false;
    lightboxImageSrc.value = '';
    lightboxCardInfo.value = null;
    document.body.classList.remove("effect");
};

// 登出處理函數
const handleLogout = () => {
    // 確認是否要登出
    if (confirm('確定要登出嗎？')) {
        // 清除會員資料
        memberStore.logout()
        
        // 跳轉到首頁
        router.push('/Home')
        
        // 顯示登出成功訊息
        alert('登出成功！')
    }
}

// 分頁處理函數
const handlePageChange = async (page) => {
    try {
        // console.log('🔄 切換到頁面:', page)
        await myCardsStore.goToPage(page)
    } catch (error) {
        console.error('❌ 切換頁面失敗:', error)
        alert('載入頁面失敗，請重試')
    }
}

// 上一頁
const handlePreviousPage = async () => {
    if (myCardsStore.hasPreviousPage) {
        await handlePageChange(myCardsStore.currentPage - 1)
    }
}

// 下一頁
const handleNextPage = async () => {
    if (myCardsStore.hasNextPage) {
        await handlePageChange(myCardsStore.currentPage + 1)
    }
}

// 刷新小卡資料
const refreshCards = async () => {
    try {
        console.log('🔄 刷新小卡資料...')
        await myCardsStore.refreshCurrentPage()
    } catch (error) {
        console.error('❌ 刷新失敗:', error)
    }
}

// 處理圖片載入錯誤
const handleImageError = (event, card) => {
    console.warn('⚠️ 圖片載入失敗:', card.image_path)
    
    // 設定預設圖片或隱藏圖片
    event.target.style.display = 'none'
    
    // 可以設定預設圖片
    // event.target.src = '/src/assets/images/default-card.jpg'
}

// 格式化日期顯示
const formatDisplayDate = (dateString) => {
    if (!dateString) return ''
    
    try {
        // 如果已經是 YYYY/MM/DD 格式，直接回傳
        if (dateString.includes('/')) {
            return dateString
        }
        
        // 如果是其他格式，轉換為 YYYY/MM/DD
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '/')
    } catch (error) {
        console.warn('日期格式化失敗:', dateString, error)
        return dateString
    }
}

// 計算屬性：分頁按鈕列表
const pageButtons = computed(() => {
    const buttons = []
    const current = myCardsStore.currentPage
    const total = myCardsStore.totalPages
    
    if (total <= 5) {
        // 總頁數不超過5頁，顯示所有頁數
        for (let i = 1; i <= total; i++) {
            buttons.push(i)
        }
    } else {
        // 總頁數超過5頁，智能顯示
        if (current <= 3) {
            // 當前頁在前3頁
            buttons.push(1, 2, 3, '...', total)
        } else if (current >= total - 2) {
            // 當前頁在後3頁
            buttons.push(1, '...', total - 2, total - 1, total)
        } else {
            // 當前頁在中間
            buttons.push(1, '...', current - 1, current, current + 1, '...', total)
        }
    }
    
    return buttons
})

// 初始化
onMounted(async () => {
    try {
        // console.log('🚀 MyCards 組件初始化...')
        await myCardsStore.initialize()
        // console.log('✅ 小卡載入完成:', myCardsStore.cards.length, '張')
    } catch (error) {
        console.error('❌ 小卡載入失敗:', error)
    }
})
</script>

<template>
    <FrontLayout>
        <section class="memberCenter">
            <div class="wrapper">
                <h2>會員中心</h2>
                <!-- 會員管理區 -->
                <div class="memberArea">
                    <!-- 左側導覽列 -->
                    <div class="user_nav">
                        <div class="head-area">
                            <!-- 隱藏的檔案輸入 -->
                            <div class="avatar-container" @click="handleAvatarClick">
                                <!-- 預設圖標顯示區 -->
                                <div 
                                    class="default-avatar" 
                                    v-show="showDefaultAvatar"
                                >
                                    <i class="bi bi-person-fill-gear"></i>
                                </div>
                                
                                <!-- 上傳後的圖片顯示區（初始隱藏） -->
                                <img 
                                    class="uploaded-avatar" 
                                    alt="大頭照" 
                                    v-show="!showDefaultAvatar"
                                    :src="userAvatar"
                                />
                                
                                <!-- 上傳按鈕覆蓋層 -->
                                <div class="upload-overlay">
                                    <i class="bi bi-camera-fill"></i>
                                </div>
                    
                                <!-- 隱藏的檔案輸入 -->
                                <input 
                                    ref="avatarInput"
                                    type="file" 
                                    accept="image/*" 
                                    style="display: none;" 
                                    @change="handleFileChange"
                                />
                            </div>

                            <p class="nickName">{{ memberStore.nickname }}</p>
                            <!-- 一開始隱藏的登出鈕 -->
                            <button class="logout btn" @click="handleLogout">登出</button> 
                        </div>

                        <!-- 頁面導覽列 -->
                        <ul class="quck_link">
                            <li><RouterLink to="/MemberCenter">個人資料</RouterLink></li>
                            <li><RouterLink to="/MemberCenter/MyOrders">訂單總覽</RouterLink></li>
                            <li class="active"><RouterLink to="/MemberCenter/MyCards">我的小卡</RouterLink></li>
                            <li><RouterLink to="/MemberCenter/Recipients">收件者管理</RouterLink></li>
                            <li class="logout">
                                <button class="btn" @click="handleLogout">登出</button>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- 右側詳細內容區 -->
                    <div class="user_content">
                        <div class="header-section">
                            <h3>我的小卡</h3>
                            <button 
                                v-if="myCardsStore.hasCards" 
                                class="refresh-btn"
                                @click="refreshCards"
                                :disabled="myCardsStore.loading"
                            >
                                <i class="bi bi-arrow-clockwise"></i>
                                刷新
                            </button>
                        </div>

                        <!-- 載入狀態 -->
                        <div v-if="myCardsStore.loading" class="loading-state">
                            <div class="loading-spinner">
                                <i class="bi bi-arrow-repeat"></i>
                            </div>
                            <p>載入中...</p>
                        </div>

                        <!-- 錯誤狀態 -->
                        <div v-else-if="myCardsStore.error" class="error-state">
                            <div class="error-icon">
                                <i class="bi bi-exclamation-triangle"></i>
                            </div>
                            <p>{{ myCardsStore.error }}</p>
                            <button class="retry-btn" @click="refreshCards">
                                重試
                            </button>
                        </div>

                        <!-- 空狀態 -->
                        <div v-else-if="myCardsStore.isEmpty" class="empty-state">
                            <div class="empty-icon">
                                <i class="bi bi-inbox"></i>
                            </div>
                            <h4>還沒有小卡</h4>
                            <p>您目前還沒有任何留言小卡<br>完成訂餐並選擇留言小卡服務後，小卡就會出現在這裡</p>
                        </div>

                        <!-- 小卡列表 -->
                        <div v-else-if="myCardsStore.hasCards" class="cards-section">
                            <div class="inner-wrapper">
                                <div 
                                    v-for="card in myCardsStore.cards" 
                                    :key="card.card_id"
                                    class="card"
                                >
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                            <img 
                                                :src="card.imageUrl" 
                                                :alt="`小卡 ${card.display_date}`"
                                                @error="handleImageError($event, card)"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div class="content">
                                            <h4>{{ formatDisplayDate(card.display_date) }}</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                            <button 
                                                class="view-btn" 
                                                @click="openLightbox(card)"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 燈箱效果 -->
                            <div class="light-box" v-show="isLightboxOpen">
                                <div class="box-wrapper" @click="closeLightbox">
                                    <div class="box" @click.stop>
                                        <span class="close-btn" @click="closeLightbox">&times;</span>
                                        <div class="lightbox-content">
                                            <img 
                                                :src="lightboxImageSrc" 
                                                alt="小卡大圖" 
                                                class="light-img"
                                            />
                                            <div v-if="lightboxCardInfo" class="card-info">
                                                <h5>{{ formatDisplayDate(lightboxCardInfo.display_date) }}</h5>
                                                <p v-if="lightboxCardInfo.order_number">
                                                    訂單編號：{{ lightboxCardInfo.order_number }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 分頁按鈕 -->
                            <ul v-if="myCardsStore.totalPages > 1" class="pagination">
                                <!-- 上一頁按鈕 -->
                                <li>
                                    <button 
                                        class="prev-btn"
                                        @click="handlePreviousPage"
                                        :disabled="!myCardsStore.hasPreviousPage"
                                    >
                                        <i class="bi bi-arrow-left"></i>
                                    </button>
                                </li>

                                <!-- 頁碼按鈕 -->
                                <li v-for="page in pageButtons" :key="page">
                                    <button 
                                        v-if="page !== '...'"
                                        class="pages-btn"
                                        :class="{ active: page === myCardsStore.currentPage }"
                                        @click="handlePageChange(page)"
                                    >
                                        {{ page }}
                                    </button>
                                    <span v-else class="pages-ellipsis">...</span>
                                </li>

                                <!-- 下一頁按鈕 -->
                                <li>
                                    <button 
                                        class="next-btn"
                                        @click="handleNextPage"
                                        :disabled="!myCardsStore.hasNextPage"
                                    >
                                        <i class="bi bi-arrow-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Gotop></Gotop>
    </FrontLayout>
</template>

<style scoped lang="scss">

img {
    display: block;
}

.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing_6;
    box-sizing: border-box;
}

.wrapper h2 {
    text-align: center;
    margin-bottom: $spacing_8;
    font-size: $font_h2;
    font-weight: bold;
}

.memberArea {
    display: flex;
    gap: 0;
    align-items: stretch;
}

// 大頭照區
.avatar-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
    cursor: pointer;
}

.default-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: $neutral_700;
    position: absolute;
}

.uploaded-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid black;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}

.upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.avatar-container:hover .upload-overlay {
    opacity: 1;
    pointer-events: auto;
}

.upload-overlay i {
    font-size: 50px;
    margin-bottom: 4px;
}

/* 左側導覽列 */
.user_nav {
    width: 240px;
    padding: 30px 20px 12px 20px;
    margin-right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: $primary_100;
}

// 大頭照及匿名區
.head-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
}

.head-area img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 15px;
    border: 1px solid black;
}

.nickName {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
}

/* 快速連結選單 */
.quck_link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing_4;
    height: 100%;
}

.quck_link li {
    text-align: center;
}

.quck_link a {
    display: block;
    color: $neutral_black;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    padding: $spacing_3 $spacing_10;
    font-weight: bold;
}

.quck_link .active a {
    background-color: $primary_400;
    color: white;
}

.quck_link a:hover {
    background-color: $primary_600;
    color: white;
}

.logout .btn:hover {
    background-color: $primary_950;
}

// 登出鈕
.quck_link li.logout {
    margin-top: auto;
}

.logout .btn {
    background-color: $primary_600;
    color: white;
}

.logout.btn{
    background-color: $primary_600;
    color: white;
}

/* 右側內容區域 */
.user_content {
    flex: 1;
    padding: 30px;
    margin-left: 1rem;
    border-radius: 8px;
    background-color: $primary_100;
}

// 標題區域
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.header-section h3 {
    font-size: 32px;
    font-weight: bold;
    margin: 0;
}

.refresh-btn {
    background-color: $primary_400;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
    background-color: $primary_600;
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

// 狀態樣式
.loading-state, .error-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.loading-spinner i {
    font-size: 48px;
    color: $primary_400;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.error-icon i, .empty-icon i {
    font-size: 48px;
    color: $neutral_300;
    margin-bottom: 16px;
}

.error-state {
    color: $neutral_700;
}

.retry-btn {
    background-color: $primary_400;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 16px;
}

.empty-state h4 {
    color: $neutral_700;
    margin: 16px 0 8px 0;
    font-size: 24px;
}

.empty-state p {
    color: $neutral_300;
    line-height: 1.6;
    max-width: 300px;
}

// 卡片樣式
.cards-section h4 {
    text-align: center;
    margin: 20px 0;
    color: #363636;
    font-size: 40px;
}

.inner-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 0 auto;
    justify-content: start;
    gap: $spacing_4;
}

.card {
    flex-basis: 47%;
}

.inner-card {
    background-color: $neutral_white;
    padding: 15px;
    border-radius: $spacing_2;
    box-shadow: 0 1px 2px rgba(0,0,0,.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.inner-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
}

.img-wrapper {
    width: 100%;
    height: 250px;
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
}

.img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain; // 改為 contain 以顯示完整小卡
    object-position: center;
    transition: transform 0.3s ease;
}

.inner-card:hover .img-wrapper img {
    transform: scale(1.02);
}

.content {
    margin-bottom: 20px;
}

.content h4 {
    font-weight: 900;
    font-size: 16px;
    margin-bottom: 10px;
    color: $neutral_700;
}

.btn-wrapper {
    display: block;
    text-align: center;
}

.view-btn {
    width: 70%;
    height: 40px;
    border: none;
    background-color: $primary_400;
    color: $neutral_white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-btn:hover {
    background-color: $primary_600;
    box-shadow: 0 3px 6px rgba(0,0,0,.4);
}

// 燈箱樣式
.light-box {
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.6);
    width: 100%;
    height: 100vh;
    z-index: 99;
    opacity: 0;
    visibility: hidden;
    transition: all 200ms ease-out;
}

.box {
    width: 80%;
    max-width: 800px;
    max-height: 90vh;
    background-color: #fff;
    transform: scale(0);
    transition: all 200ms ease-in-out;
    padding: 20px;
    box-shadow: 0 3px 9px rgba(0,0,0,.1);
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}

.box-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 15px;
}

.lightbox-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.box .light-img {
    width: 100%;
    height: auto;
    max-height: calc(90vh - 120px);
    object-fit: contain;
    object-position: center;
    border-radius: 4px;
}

.card-info {
    margin-top: 15px;
    text-align: center;
    padding: 10px;
    background-color: $primary_50;
    border-radius: 4px;
}

.card-info h5 {
    margin: 0 0 5px 0;
    font-size: 18px;
    color: $neutral_700;
}

.card-info p {
    margin: 0;
    font-size: 14px;
    color: $neutral_300;
}

.box .close-btn {
    position: absolute;
    z-index: 100;
    font-size: 30px;
    color: #ccc;
    right: 15px;
    top: 15px;
    border: 2px solid #ccc;
    border-radius: 50%;
    display: block;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 35px;
    cursor: pointer;
    transition: all 200ms linear;
    background-color: white;
}

.box .close-btn:hover {
    color: #999;
    border-color: #999;
}

/* Effect */
.effect .light-box {
    opacity: 1;
    visibility: visible;
}

.effect .light-box .box {
    transform: scale(1);
}

/* 按鈕基本樣式 */
.btn {
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

// 分頁按鈕
.pagination {
    display: flex;
    justify-content: center;
    margin-top: $spacing_10;
    gap: 5px;
}

.pagination button {
    background-color: $primary_600;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    min-width: 40px;
    transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
    background-color: $primary_950;
}

.pagination button:disabled {
    background-color: $neutral_300;
    cursor: not-allowed;
}

.pagination button.active {
    background-color: $primary_950;
    font-weight: bold;
}

.pages-ellipsis {
    display: flex;
    align-items: center;
    padding: 8px;
    color: $neutral_300;
}

// 響應式設定
@media (max-width: 1000px) {
    .img-wrapper img{
        object-fit: contain;
    }
}

@media (max-width: 900px) {
    .img-wrapper {
        height: 200px;
    }
}

@media (min-width: 800px) {
    .logout.btn {
        display: none;
    }
}

@media (max-width: 800px) {
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: $spacing_4;
    }
    
    .memberArea {
        flex-direction: column;
        gap: $spacing_4;
    }
    
    .user_nav {
        width: 90%;
        margin-right: 0;
        margin-bottom: $spacing_4;
    }
    
    /* head-area 橫向排列 */
    .head-area {
        flex-direction: row;
        align-items: center;
        gap: $spacing_10;
        margin-bottom: $spacing_4;
    }
    
    .avatar-container {
        margin-bottom: 0;
        flex-shrink: 0;
    }
    
    .nickName {
        font-size: 1.6rem;
        margin-left: auto;
    }
    
    .quck_link {
        flex-direction: row;
        flex-wrap: wrap;
        gap: $spacing_2;
        justify-content: center;
    }
    
    .quck_link a {
        padding: $spacing_2 $spacing_4;
        font-size: 0.9rem;
    }
    
    .user_content {
        margin-left: 0;
        padding: $spacing_4;
    }
    
    .logout .btn {
        display: none;
    }

    /* 卡片調整為 1 欄 */
    .card {
        flex-basis: 100%;
    }
    
    .inner-wrapper {
        width: 100%;
    }

    .header-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .header-section h3 {
        font-size: 24px;
    }
}

</style>