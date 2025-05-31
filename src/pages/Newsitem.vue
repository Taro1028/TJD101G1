<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
</script>
<template>
    <FrontLayout>
        <div class="wrapper">
            <div class="newsinfo">
                <div class="link">
                    <span><a href="#">最新消息</a></span>
                    <span>&ensp;>&ensp;</span>
                    <span><a href="#">焦點計畫</a></span>
                </div>
                <div class="newstag">焦點計畫</div>
                <h1>緯藝基金會助力 攜手推動長者營養餐計畫</h1>
                <h5>最後更新 2025.05.10</h5>
                <img src="../assets/images/Home/news_1.png" alt="news_1">
            </div>
            <div class="newscontent">
                <div class="preface">
                    <h4>在緯藝基金會的溫暖支持下，提膳家得以擴大「長者營養餐計畫」的服務版圖，讓更多獨居、行動不便或經濟弱勢的長者，能在每日生活中獲得最基本也最重要的營養支持。這項計畫不僅提供熱騰騰的飯菜，更透過每日送餐過程，傳遞關懷與安全感，成為高齡者生活中不可或缺的支持系統。
                    </h4>
                </div>
                <div class="paragraph">
                    <h3>公私協力推動，打造溫飽又溫暖的銀髮餐桌。</h3>
                    <h4>緯藝基金會長期關注台灣高齡化社會的照護議題，這次與提膳家的合作，正是其實踐在地行動的具體成果。基金會表示，營養是長者健康的基礎，而穩定的送餐服務不只是餐點遞送，更是一條連結長者與社會的情感橋梁。「我們希望讓每一位銀髮族不僅吃得飽、吃得好，也能感受到社會的關心與陪伴，」緯藝基金會執行長如是說。
                        <br>
                        提膳家團隊指出，長者的飲食需求與一般人不同，從食材挑選、營養配比、口感調整到衛生把關，每個環節都需謹慎處理。「我們每天都為長輩準備少油、少鹽、高纖、易咀嚼的餐食，並依據個別狀況調整內容，力求兼顧營養與食慾。」團隊更表示，有些長者罹患慢性疾病或吞嚥困難，他們會與營養師合作設計特製菜單，確保飲食安全與健康。
                        <br>
                        隨著服務人數日增，資源調度與配送路線的規劃變得更為複雜。此時，緯藝基金會的資助發揮了關鍵作用，不僅補足人力與食材成本，更讓計畫得以導入更有效率的配送系統與數位管理機制，提升整體服務品質與穩定度。
                    </h4>
                </div>
                <div class="paragraph">
                    <h3>每一份餐點，都是對長輩健康的用心守護。</h3>
                    <h4>除了提供物質上的援助，緯藝基金會也積極推動「以人為本」的關懷模式，協助提膳家導入定期追蹤機制與心理支持計畫，讓送餐人員在與長者互動過程中，能及時掌握他們的身心狀況，並在需要時通報社福單位介入協助。「有些長輩其實不太表達，但只要每天見到熟悉的送餐員，就像孩子看到家人一樣，安心又放鬆，」一位送餐志工分享她的感動。
                        <br>
                        透過這樣的日常接觸，社區中的隱形需求逐漸浮現，也促使整體照護網絡更為緊密。「我們希望成為那個最早發現異狀的角色，」提膳家說道，「不管是獨居長者久未應門，或是精神狀態異常，我們都會通報相關單位處理，讓服務不只停留在『送飯』而是『送安心』。」
                        <br>
                        目前，這項計畫已服務超過數百位長者，每日出餐數穩定成長，服務地區也持續拓展中。透過與地方政府、社福機構、志工團體的合作，長者營養餐不再只是「一餐飯」，而是整體高齡照護體系中的重要一環。
                    </h4>
                </div>
                <div class="paragraph">
                    <h3>深耕在地服務，為高齡照護注入永續能量。</h3>
                    <h4>緯藝基金會相信，唯有公私協力，才能打造具備永續性的長照支持系統。此次與提膳家的攜手正是最佳實踐，將公益理念轉化為具體行動，落實到每一位長者的生活中。基金會也呼籲社會各界一同關注高齡者的日常需求，用行動為台灣邁向超高齡社會鋪設更穩固的照護基礎。
                        <br>
                        隨著台灣高齡化程度逐年升高，未來面臨的挑戰只會更多。緯藝基金會與提膳家都期盼，這項計畫能持續發展，吸引更多志同道合的夥伴加入，一起為長者打造有尊嚴、有營養、有溫度的晚年生活。
                    </h4>
                </div>
            </div>
        </div>
    </FrontLayout>
</template>

<style scoped lang="scss">
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
    height: auto;
    object-fit: cover;
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
    width: 97px;
    font-size: $font_h4;
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
    width: 64px;
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
    }

    .newscontent h4{
        font-size: $font_h6;
    }
}
</style>