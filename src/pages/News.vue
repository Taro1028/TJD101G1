<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
</script>
<template>
    <FrontLayout>
        <div class="wrapper">
            <div class="pagetitle">
                <h3>📰 最新消息</h3>
                <h4>掌握我們的消息，關心每一份溫暖與變化</h4>
            </div>
            <div class="focusplan">
                <h3>焦點計畫</h3>
                <section class="sec-1">
                    <div class="main-news">
                        <router-link to="/About/News/Newsitem">
                            <div class="newstag">焦點</div>
                            <img src="../assets/images/Home/news_1.png" alt="news_1">
                            <div class="block-overlay"></div>
                            <h4>緯藝基金會助力 攜手推動長者營養餐計畫</h4>
                        </router-link>
                    </div>
                    <div class="sec1-list">
                        <router-link to="/About/News/Newsitem">
                            <div class="planitem">
                                <h4>緯藝基金會助力 攜手推動長者營養餐計畫</h4>
                                <h6>在緯藝基金會的溫暖支持下，提膳家得以擴大「長者營養餐計畫」服務範圍，幫助更多需要照護的長輩每日獲得均衡飲食。基金會的資助不僅讓服務持續穩定，也強化了在地照護網絡的連結，將營養、愛與陪伴送進每一位長者的生活中。公益結合專業，為高齡社會注入可長可久的照顧力量。
                                </h6>
                                <p>最後更新 2025.05.10</p>
                            </div>
                        </router-link>
                        <a href="#">
                            <div class="planitem">
                                <h4>送餐到府服務 提膳家關懷長者健康飲食不打烊</h4>
                                <h6>隨著高齡化社會來臨，長者的飲食照護成為家庭與社會的重要課題。提膳家推出長者到府送餐服務，結合營養師專業配餐，依個人健康狀況調整菜色，從每日三餐出發，守護長輩的健康與尊嚴。無論居住於都會或偏鄉地區，提膳家都致力讓每一份熱騰騰的飯菜，準時送達、安心入口。
                                </h6>
                                <p>最後更新 2025.05.08</p>
                            </div>
                        </a>
                        <a href="#">
                            <div class="planitem">
                                <h4>提膳家與在地小農協力將養生食材直送長者餐桌</h4>
                                <h6>為了讓長者吃得更安心、也更支持本地農業，提膳家啟動「在地小農合作計畫」，選用當季新鮮蔬果與無毒作物入菜，打造兼顧美味與健康的送餐服務。這項合作不僅縮短食物里程、減少碳足跡，也創造農民與長者雙贏的關係。提膳家相信，一份好餐點的背後，是整個在地支持系統的溫柔串聯。
                                </h6>
                                <p>最後更新 2025.05.03</p>
                            </div>
                        </a>
                    </div>
                </section>
                <div class="planlink">
                    <a href="#">
                        <h5>更多焦點計畫 ></h5>
                    </a>
                </div>
            </div>
            <div class="project">
                <h3>深度專題</h3>
                <section class="sec-2">
                    <a href="#">
                        <div class="projectitem">
                            <img src="../assets/images/News/news_4.jpg" alt="news_4">
                            <div class="itemtxt">
                                <h4>從剩菜到良食：提膳家如何用剩食打造銀髮餐桌新選項？</h4>
                                <h6>在北市某處社區廚房裡，提膳家的營養師林芷萱打開當日食材籃，一把外葉微黃的青江菜、幾顆略軟的番茄、一包即將過期的豆腐，這些都是今日「良食轉化計畫」的素材。這些看似被遺棄的食材，其實來自合作超市的「友善回收專區」，雖然不再適合商業販售，卻依舊保有營養價值。
                                </h6>
                                <p>最後更新 2025.04.24</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="projectitem">
                            <img src="../assets/images/News/news_5.png" alt="news_5">
                            <div class="itemtxt">
                                <h4>營養師的社區巡診日誌：從菜單設計到長者心聲</h4>
                                <h6>清晨七點半，營養師吳玟萱背著筆電與小秤，騎著機車出發前往新北市土城的某長照據點。這是她每週一次的社區巡診日，也是她與提膳家合作的例行任務之一。</h6>
                                <p>最後更新 2025.04.17</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="projectitem">
                            <img src="../assets/images/News/news_6.jpg" alt="news_6">
                            <div class="itemtxt">
                                <h4>與土地共煮的餐桌：提膳家與小農的雙向照顧</h4>
                                <h6>在新竹關西的田地裡，58歲的小農林淑惠一早就彎著腰，細心地採收有機茼蒿。這批蔬菜稍晚將被載往中央廚房，成為送進長者家中的午餐主菜之一。她說：「我們知道，這不是普通的買賣，而是一份會被長輩吃下肚的心意。」
                                </h6>
                                <p>最後更新 2025.04.15</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="projectitem">
                            <img src="../assets/images/News/news_7.jpg" alt="news_7">
                            <div class="itemtxt">
                                <h4>營養師的日常：設計長者三餐背後的堅持與細節</h4>
                                <h6>上午八點，提膳家的營養師蘇怡如已經坐在電腦前，開始審閱今日即將出餐的食譜。她翻開資料庫，一邊對照高血壓、糖尿病等特殊飲食需求的長者名單，一邊將已確認的菜色一一標註營養成分，精算每一道菜的鹽分、油脂與熱量。
                                </h6>
                                <p>最後更新 2025.04.11</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="projectitem">
                            <img src="../assets/images/News/news_8.png" alt="news_8">
                            <div class="itemtxt">
                                <h4>一份便當的距離：提膳家如何串起偏鄉長者的最後一哩路</h4>
                                <h6>上午九點，苗栗南庄的山區濛著薄霧，提膳家的送餐員王志明已經載著保溫箱出發。他今天的任務是將11份便當送達沿線的長者家中，最遠一戶住在半山腰的鐵皮屋裡，車子無法到達，還得步行15分鐘。王志明笑說：「這裡的長輩說，聽到我的機車聲就知道中午要到了。」
                                </h6>
                                <p>最後更新 2025.04.09</p>
                            </div>
                        </div>
                    </a>
                </section>
                <div class="planlink">
                    <a href="#">
                        <h5>更多深度專題 ></h5>
                    </a>
                </div>
            </div>
            <div class="guesswho">
                <h3>誰來午餐</h3>
                <section class="sec-3">
                    <a href="#">
                        <div class="newscard">
                            <img src="../assets/images/News/news_9.png" alt="news_9">
                            <div class="newsinfo">
                                <h4>一口家鄉味，讓她終於開口說話! 失語長者與營養師的一頓飯</h4>
                                <h6>72歲的張奶奶因中風失語，三個月來不曾開口說話。每天的生活除了復健，就是坐在輪椅上沉默地望著窗外。直到某天，她在提膳家的送餐點頭了一次，這是第一個改變的開始。</h6>
                                <p>最後更新 2025.05.09</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="newscard">
                            <img src="../assets/images/News/news_10.png" alt="news_10">
                            <div class="newsinfo">
                                <h4>她為什麼每天只吃白粥？一位營養師的追問，找回長者的食慾與自尊</h4>
                                <h6>86歲的劉奶奶每天都吃白粥，一吃就是三年。她住在台中某長照機構，機構人員一度以為她牙口不好、胃不好、不吃重口味</h6>
                                <p>最後更新 2025.05.02</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="newscard">
                            <img src="../assets/images/News/news_11.png" alt="news_11">
                            <div class="newsinfo">
                                <h4>餐桌上的一封信——營養師如何用便當為高齡夫妻重建溝通</h4>
                                <h6>提膳家的營養師洪偉庭，最近在台南接到一個特別的請求。她住在台中某長照機構，機構人員一度以為她牙口不好、胃不好、不吃重口味，</h6>
                                <p>最後更新 2025.4.25</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="newscard">
                            <img src="../assets/images/News/news_12.png" alt="news_12">
                            <div class="newsinfo">
                                <h4>每天送來的便當，如何成為小農返鄉的動力？</h4>
                                <h6>每天早上六點，嘉義民雄的林家兄妹便開始在田裡忙碌。32歲的林瑋翔與姐姐林惠如，三年前從台北返鄉務農。</h6>
                                <p>最後更新 2025.04.18</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="newscard">
                            <img src="../assets/images/News/news_13.jpg" alt="news_13">
                            <div class="newsinfo">
                                <h4>營養師的餐桌設計課：長者便當裡的地方記憶與用心科學</h4>
                                <h6>每天早上七點半，提膳家的營養師蔡侑珊便坐在電腦前，開始為下週的便當菜單做搭配。她一邊查詢當季蔬菜的供應情況</h6>
                                <p>最後更新 2025.04.11</p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div class="newscard">
                            <img src="../assets/images/News/news_14.jpg" alt="news_14">
                            <div class="newsinfo">
                                <h4>她每天按門鈴，送的不只是便當，是長輩的一聲「謝謝」</h4>
                                <h6>每天上午十一點半，47歲的陳秀玲背起提膳家的保溫袋，騎著電動機車在新北中和區的巷弄間穿梭。</h6>
                                <p>最後更新 2025.04.04</p>
                            </div>
                        </div>
                    </a>
                </section>
                <div class="planlink">
                    <a href="#">
                        <h5>更多誰來午餐 ></h5>
                    </a>
                </div>
            </div>
        </div>
    </FrontLayout>
</template>

<style scoped lang="scss">
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

// 焦點計畫
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

// 主要(封面)新聞
.main-news {
    position: relative;
}

.main-news img {
    display: block;
    border-radius: 8px;
    margin: auto;
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

// 焦點計畫列表
.sec1-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sec1-list a {
    text-decoration: none;
}

.planitem {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 28px;
    gap: 16px;

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
}

.sec1-list a:hover .planitem::before {
    background-color: $primary_400;
    transition: 0.3s ease;
}

.planitem h4,
.itemtxt h4 {
    font-size: $font_h4;
    color: $neutral_black;
    transition: 0.3s ease;
}

.sec1-list a:hover .planitem h4 {
    color: $primary_600;
    transition: 0.3s ease;
}

.planitem h6,
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

.planitem p,
.itemtxt p {
    color: $neutral_300;
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

.sec-2 a {
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

// 誰來午餐
.sec-3 {
    margin: 24px auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    justify-content: start;
}

.sec-3 a {
    text-decoration: none;
    transition: 0.3s ease;

    &:hover {
        opacity: .85;
        transition: 0.3s ease;
    }
}

.sec-3 a:hover .newsinfo h4 {
    color: $primary_600;
    transition: 0.3s ease;
}

.newscard{

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

    .main-news{
        width: 480px;
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

    .main-news,
    .main-news img{
        width: 320px;
        height: auto;
    }

    .newstag,
    .block-overlay,
    .main-news h4{
        display: none;
    }

    .planitem h4,
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