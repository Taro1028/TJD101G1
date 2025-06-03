 <script setup>
    import { ref } from 'vue';
    import FrontLayout from '../layouts/FrontLayout.vue';
    import Gotop from "../components/Gotop.vue"

    const showDefaultAvatar = ref(true);
    const uploadedImageSrc = ref('');
    const avatarInput = ref(null);
    const cards = ref([
        {
            date: 'date',
            imageUrl: '/tjd101/g1/images/Member/card_1.jpg',
        },
             {
            date: 'date',
            imageUrl: '/tjd101/g1/images/Member/card_1.jpg',
        },     {
            date: 'date',
            imageUrl: '/tjd101/g1/images/Member/card_1.jpg',
        }
    ]);

    // 點擊大頭照區域觸發檔案選擇
    const handleAvatarClick = () => {
    console.log('Avatar clicked!');
    console.log('avatarInput.value:', avatarInput.value);
    
    if (avatarInput.value) {
        console.log('Triggering file input click');
        avatarInput.value.click();
    } else {
        console.error('avatarInput ref is null');
    }
    };

    // 處理檔案上傳
    const handleFileChange = (event) => {
    const file = event.target.files[0];
    
      console.log('File selected:', file); // 調試用
    
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案');
        console.log('Invalid file type:', file.type);
        return;
    }
    
    // 檢查檔案大小 (限制 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不能超過 5MB');
        console.log('File too large:', file.size);
        return;
    }
    
    console.log('File validation passed, reading file...');
    
    // 使用 FileReader 讀取檔案
    const reader = new FileReader();
    
    reader.onload = (e) => {
        console.log('File read successfully');
        uploadedImageSrc.value = e.target.result;
        showDefaultAvatar.value = false;
        console.log('State updated - showDefaultAvatar:', showDefaultAvatar.value);
    };
    
    reader.onerror = () => {
        console.error('File read error');
        alert('檔案讀取失敗，請重新選擇');
    };
    
    reader.readAsDataURL(file);
    };

    // 重置大頭照
    const resetAvatar = () => {
    showDefaultAvatar.value = true;
    uploadedImageSrc.value = '';
    
    if (avatarInput.value) {
        avatarInput.value.value = '';
    }
    };

    // 小卡燈箱功能
    let lightImg = document.querySelector(".light-img");
    let viewBtn = document.querySelectorAll(".view-btn");

    // 燈箱狀態
    const isLightboxOpen = ref(false);
    const lightboxImageSrc = ref('');

    // 開啟燈箱
    const openLightbox = (imageSrc) => {
    lightboxImageSrc.value = imageSrc;
    isLightboxOpen.value = true;
    document.body.classList.add("effect");
    };

    // 關閉燈箱
    const closeLightbox = () => {
    isLightboxOpen.value = false;
    document.body.classList.remove("effect");
    };


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
                        <div class="default-avatar" id="defaultAvatar">
                                <i class="bi bi-person-fill-gear"></i>
                        </div>
                            
                        <!-- 上傳後的圖片顯示區（初始隱藏） -->
                        <img id="uploadedAvatar" class="uploaded-avatar" alt="大頭照" style="display: none;" />
                            
                        <!-- 上傳按鈕覆蓋層 -->
                        <div class="upload-overlay" id="uploadOverlay">
                            <i class="bi bi-camera-fill"></i>
                            <!-- <span>更換照片</span> -->
                        </div>
                            
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
                                    :src="uploadedImageSrc"
                                />
                                
                                <!-- 上傳按鈕覆蓋層 -->
                                <div class="upload-overlay">
                                    <i class="bi bi-camera-fill"></i>
                                    <!-- <span>{{ showDefaultAvatar ? '上傳照片' : '更換照片' }}</span> -->
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

                            <p class="nickName">阿官</p>
                            <!-- 一開始隱藏的登出鈕 -->
                            <button class="logout btn">登出</button> 
                        </div>

                        <!-- 頁面導覽列 -->
                        <ul class="quck_link">
                            <li><RouterLink to="/MemberCenter">個人資料</RouterLink></li>
                            <li><RouterLink to="/MemberCenter/MyOrders">訂單總覽</RouterLink></li>
                            <li class="active"><RouterLink to="/MemberCenter/MyCards">我的小卡</RouterLink></li>
                            <li><RouterLink to="/MemberCenter/Recipients">收件者管理</RouterLink></li>
                            <li class="logout"><button class="btn">登出</button></li>
                        </ul>
                    </div>
                    
                    <!-- 右側詳細內容區 -->
                    <div class="user_content">
                        <h3>我的小卡</h3>
                        <!-- 小卡欄 -->
                              <div class="inner-wrapper">
                                <div class="card">
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                        <img src="/tjd101/g1/images/Member/card_1.jpg" alt="">
                                        </div>
                                        <div class="content">
                                        <h4>2025/03/25</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                        <button class="view-btn" @click="openLightbox('/tjd101/g1/images/Member/card_1.jpg')">View</button>
                                        </div>

                                        
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                        <img src="/src/assets/images/Member/card_2.jpg" alt="">
                                        </div>
                                        <div class="content">
                                        <h4>2025/03/25</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                        <button class="view-btn" @click="openLightbox('/tjd101/g1/images/Member/card_2.jpg')">View</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                        <img src="/src/assets/images/Member/card_3.jpg" alt="">
                                        </div>
                                        <div class="content">
                                        <h4>2025/03/25</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                         <button class="view-btn" @click="openLightbox('/tjd101/g1/images/Member/card_3.jpg')">View</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                        <img src="/src/assets/images/Member/card_4.jpg" alt="">
                                        </div>
                                        <div class="content">
                                        <h4>2025/03/25</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                        <button class="view-btn" @click="openLightbox('/tjd101/g1/images/Member/card_4.jpg')">View</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                        <img src="/src/assets/images/Member/card_5.jpg" alt="">
                                        </div>
                                        <div class="content">
                                        <h4>2025/03/25</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                        <button class="view-btn" @click="openLightbox('/tjd101/g1/images/Member/card_5.jpg')">View</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="inner-card">
                                        <div class="img-wrapper">
                                        <img src="/src/assets/images/Member/card_6.jpg" alt="">
                                        </div>
                                        <div class="content">
                                        <h4>2025/03/25</h4>
                                        </div>
                                        <div class="btn-wrapper">
                                        <button class="view-btn" @click="openLightbox('/tjd101/g1/images/Member/card_5.jpg')">View</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!-- 卡片欄結束 -->

                            <!-- 燈箱效果欄 -->
                             <div class="light-box" v-show="isLightboxOpen">
                                <div class="box-wrapper" @click="closeLightbox">
                                    <div class="box">
                                    <span class="close-btn" @click="closeLightbox">&times;</span>
                                    <img :src="lightboxImageSrc" alt="" class="light-img">
                                    </div>
                                </div>
                            </div>

                        <!-- 換頁按鈕 -->
                        <ul class="pagination">
                            <li><button class="prev-btn"><i class="bi bi-arrow-left"></i></button></li>
                            <li><button class="pages-btn">1</button></li>
                            <li><button class="pages-btn">2</button></li>
                            <li><button class="pages-btn">...</button></li>
                            <li><button class="pages-btn">5</button></li>
                            <li><button class="next-btn"><i class="bi bi-arrow-right"></i></button></li>
                        </ul>

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

.user_content h3 {
    font-size: 32px;
    font-weight: bold;
    margin: 0 0 25px 0;
}

// 卡片樣式

h4 {
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
.inner-card  {
  background-color: $neutral_white;
  padding: 15px;
  border-radius: $spacing_2;
  box-shadow: 0 1px 2px rgba(0,0,0,.1)
}
.img-wrapper {
  width: 100%;
  height: 250px;
  margin-bottom: 10px;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
}
.view-btn:hover {
  box-shadow: 0 3px 6px rgba(0,0,0,.4);
}

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
  width: 600px;
  height: 400px;
  background-color: #fff;
  transform: scale(0);
  transition: all 200ms ease-in-out;
  padding: 10px;
  box-shadow: 0 3px 9px rgba(0,0,0,.1);
  position: relative;
}
.box-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: 15px;
}
.box .light-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.box .close-btn {
  position: absolute;
  z-index: 100;
  font-size: 30px;
  color: #ccc;
  left: 100%;
  top: 0;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 35px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 200ms linear;
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
// 換頁按鈕

.pagination{
    display: flex;
    justify-content: center;
    margin-top: $spacing_10;
}

.pagination li{
    margin: 0 5px;
}

.pagination button{
    background-color: $primary_600;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
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
}

/* 650px 以下 - 隱藏 view-btn */
@media (max-width: 650px) {
    .view-btn {
        display: none;
    }
    
    .btn-wrapper {
        display: none;
    }
}

/* 480px 以下 - 導覽橫排不換行 */
@media (max-width: 480px) {
    .quck_link {
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        justify-content: flex-start;
        padding: $spacing_2 0;
        gap: $spacing_2;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: $primary_400 $primary_100;
    }
    
    .quck_link::-webkit-scrollbar {
        height: 6px;
    }
    
    .quck_link::-webkit-scrollbar-track {
        background: $primary_100;
        border-radius: 3px;
    }
    
    .quck_link::-webkit-scrollbar-thumb {
        background: $primary_400;
        border-radius: 3px;
    }
    
    .quck_link::-webkit-scrollbar-thumb:hover {
        background: $primary_600;
    }
    
    .quck_link li {
        flex-shrink: 0;
    }
    
    .quck_link a {
        white-space: nowrap;
        min-width: max-content;
    }
}

/* 400px 以下 - 手機螢幕 */
@media (max-width: 400px) {
    .wrapper {
        padding: $spacing_4;
    }
    
    .wrapper h2 {
        font-size: 1.8rem;
        margin-bottom: $spacing_4;
    }
    
    .user_nav {
        padding: $spacing_4;
    }
    
    .head-area {
        gap: $spacing_8;
    }
    
    .avatar-container {
        width: 60px;
        height: 60px;
    }
    
    .default-avatar,
    .uploaded-avatar {
        width: 60px;
        height: 60px;
        font-size: 30px;
    }
    
    .nickName {
        font-size: 1.4rem;
    }
    
    .quck_link {
        gap: $spacing_1;
    }
    
    .quck_link a {
        padding: 10px $spacing_2;
        font-size: 0.8rem;
    }
    
    .user_content {
        padding: $spacing_3;
    }
    
    .user_content h3 {
        font-size: 1.8rem;
        margin-bottom: $spacing_3;
    }
    
    .img-wrapper {
        height: 200px;
    }
    
    .inner-card {
        padding: $spacing_2;
    }
    
    /* 燈箱在小螢幕調整 */
    .box {
        width: 90%;
        height: 70%;
        max-width: 350px;
    }
}


</style>