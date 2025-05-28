<script setup>

</script>

<template>
    <footer>
        <div class="infoContainer">
            <div class="info">
                <div class="link">
                    <router-link to="/front/Home">
                        <img src="../assets/images/Logo_S.svg" alt="logo_s">
                    </router-link>
                    <ul class="brandlink">
                        <li><a href="#">F</a></li>
                        <li><a href="#">L</a></li>
                        <li><a href="#">I</a></li>
                        <li><a href="#">X</a></li>
                    </ul>
                </div>
                <div>
                    <ul class="infotxt">
                        <li>部門營業時間 : 09:30 - 20:30</li>
                        <li>聯絡電話 : 0800-987-123</li>
                        <li>總部地址 : 104 臺北市中山區南京東路三段 219 號 4F </li>
                        <li>   
                            <ul class="txtlink">
                                <li><a href="#">服務條款</a></li>
                                <li><a href="#">隱私權政策</a></li>
                                <li><a href="#">門市據點</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <span>本網站為緯育TibaMe前端設計工程師班第 95 期學員專題成果作品，本平台僅供學習、展示之用。<br>
                    若有侵權疑慮，您可以私訊 TibaMe - 前端設計工程師養成班，後續會由專人協助處理。</span>
            </div>
        </div>
    </footer>

</template>

<style scoped lang="scss">

footer{
    max-width: 1440px;
    padding: 32px 48px 16px;
    background-color: $primary_100;
}

.infoContainer{
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info{
 display: flex;
 align-items: center;
 gap: 20px;
}

.link{
    display: flex;
    flex-direction: column;
    justify-content: start;
}

.brandlink{
    display: flex;
    gap: 20px;
    padding: 0;
}

.brandlink li,
.infotxt li,
.txtlink li{
    list-style: none;
}

.txtlink a{
    display: block;
    color: $neutral_black;
    text-decoration: none;
}

.brandlink a{
    width: 24px;
    display: block;
    color: $primary_950;
    text-decoration: none;
}

.brandlink a:hover,
.txtlink a:hover{
    color: $primary_600;
}

.infotxt{
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
}

.txtlink{
    display: flex;
    gap: 12px;
    padding: 0;
}


.copyright span{
    display: block;
    text-align: center;
    font-size: 10px;
}

</style>