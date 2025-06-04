<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import Gotop from "../components/Gotop.vue"

// import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function goNext() {
//   if (!canProceed.value) return

//   // 把資料存在 localStorage（或改用 pinia）
//   localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes.value))

  // 導向下一頁
  router.push('/Order/AddCart')
}


</script>

<template>
    <FrontLayout>
        <div class="wrapper">
            <h1>編輯留言小卡</h1>
            <div class="contenter">
                <!-- 右側編輯區 -->
                <div class="left-layout">
                    <div class="color_area">
                        <h4>顏色</h4>
                        <ul class="color_list">
                            <li><img src="../assets/images/MessageCards/color_1.svg" alt="bg-color1"></li>
                            <li><img src="../assets/images/MessageCards/color_2.svg" alt="bg-color2"></li>
                            <li><img src="../assets/images/MessageCards/color_3.svg" alt="bg-color3"></li>
                            <li><img src="../assets/images/MessageCards/color_4.svg" alt="bg-color4"></li>
                            <li><img src="../assets/images/MessageCards/color_5.svg" alt="bg-color5"></li>
                            <li><img src="../assets/images/MessageCards/color_6.svg" alt="bg-color6"></li>
                        </ul>
                    </div>
                    <div class="stickers">
                        <h4>貼紙</h4>
                        <ul class="sticker_list">
                            <li><img src="../assets/images/MessageCards/sticker_1.svg" alt="sun"></li>
                            <li><img src="../assets/images/MessageCards/sticker_2.svg" alt="snail"></li>
                            <li><img src="../assets/images/MessageCards/sticker_3.svg" alt="tree"></li>
                            <li><img src="../assets/images/MessageCards/sticker_4.svg" alt="house"></li>
                            <li><img src="../assets/images/MessageCards/sticker_5.svg" alt="dog"></li>
                            <li><img src="../assets/images/MessageCards/sticker_6.svg" alt="water-tear"></li>
                            <li><img src="../assets/images/MessageCards/sticker_7.svg" alt="heart"></li>
                            <li><img src="../assets/images/MessageCards/sticker_8.svg" alt="flower"></li>
                        </ul>
                    </div>
                    <div class="care_words">
                        <h4>關心小語</h4>
                        <div class="statement">
                            <p>三餐好好吃，生活有力氣，我們陪您一起過日子</p>
                            <p>天涼記得添衣，飯熱就開心吃，慢慢享用喔！</p>
                            <p>祝您胃口好、精神好，每一天都過得舒心</p>
                            <p>不管日子多忙，都別忘了照顧自己，要好好吃飯</p>
                            <p>每一天都值得被好好對待，從這餐開始</p>
                        </div>
                    </div>
                </div>
                <!-- 左側編輯區 -->
                <div class="right-layout">
                    <div class="preview">
                        <p>寫點什麼...</p>
                    </div>
                    <div class="type_area">
                        <label for="text" type="text"></label>
                        <textarea name="text" id="text" cols="30" rows="10" placeholder="請輸入卡片內容"></textarea>
                    </div>
                    <div class="button-area">
                        <button class="btn no_message" @click="goNext">不留言，繼續結帳</button>
                        <button class="btn finish_message" @click="goNext">完成留言</button>
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
        background-image: url('../assets/images/Order/background.svg');
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
        margin: 0;
        margin-left: 10%;
        margin-top: 40px; 
        max-width: 1200px;
        width: 100%;
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


// 1024px-1439px 桌機/大平板
@media (max-width: 1439px) {
    .contenter {
        max-width: 1000px;
        gap: 30px;
        margin: 30px auto;
    }
    
    h1 {
        font-size: 42px;
        margin-left: 8%;
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
        font-size: 36px;
        margin-left: 0;
        text-align: center;
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
    
    .color_list, .sticker_list {
        justify-content: center;
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
        margin-left: 0;
        margin-top: 20px;
        text-align: center;
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
        flex-direction: column;
        align-self: stretch;
        gap: 12px;
    }
    
    .btn {
        padding: 14px 20px;
        width: 100%;
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