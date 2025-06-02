<script setup>
import FrontLayout from '@/layouts/FrontLayout.vue'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('custom-bg')
})

onUnmounted(() => {
  document.body.classList.remove('custom-bg')
})
</script>
<template>
    <FrontLayout>
    <div class="selectBox">
        <h3>想選哪一種方案呢？</h3>
    
        <div class="plans">
            <router-link to="/Order/PlanForyou" class="link">
                <div class="plan_foryou">
                    <h3>為你搭配</h3>
                    <h5>由專業營養師<br>調配的餐食</h5>
                </div>
            </router-link>
            <router-link to="/Order/Select1_PlanFree" class="link">
                <div class="plan_free">
                    <h3>自由搭配</h3>
                    <h5>自己挑選菜色<br>組合餐盒</h5>
                </div>
            </router-link>
        </div>

        <div class="notice">
            <span><i class="bi bi-info-circle-fill"></i></span><h5>為確保配送效率與長輩用餐方便，目前我們提供午間配送服務，如需安排晚餐，我們會在中午一併送達。餐點均以保鮮與加熱便利為考量，讓長輩午晚餐都能安心享用。</h5>
        </div>

        <div class="linkblock">
            <a href="#" class="btn">上一步</a>
        </div>
    </div>
    </FrontLayout>

</template>
<style>
.custom-bg{
background-image: url(../assets/images/Order/background.svg);
}
</style>
<style scoped lang="scss">

.selectBox{
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    gap: 60px;
    text-align: center;
}

h3{
    margin: 0;
    font-size: $font_h3;
}

.link{
    text-decoration: none;
}

h5{
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.plans{
    display: flex;
    gap: 128px;
    justify-content: center;
}

.plan_foryou{
    width: 240px;
    height: 240px;
    background-color: $primary_400;
    border: 4px solid $primary_400;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    transition: 0.3s ease;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    }
}

.plan_foryou:hover h3,
.plan_foryou:hover h5{
    color: $primary_400;
    transition: 0.3s ease;
}

.plan_foryou h3,
.plan_foryou h5{
    margin: 0;
    color: $neutral_black;
    transition: 0.3s ease;

}

.plan_free{
    width: 240px;
    height: 240px;
    background-color: $primary_600;
    border: 4px solid $primary_600;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    transition: 0.3s ease;

    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    }
}

.plan_free:hover h3,
.plan_free:hover h5{
    color: $primary_600;
    transition: 0.3s ease;
}

.plan_free h3,
.plan_free h5{
    margin: 0;
    color: $neutral_white;
    transition: 0.3s ease;
}

.notice{
    margin: 0 auto;
    width: 560px;
    text-align: left;
    display: flex;
    gap: 8px;
}

.notice span{
    padding-top: 4px;
}

.linkblock{
  display: flex;
  justify-content: center;
}

.btn{
  display: block;
  text-decoration: none;
  color: $neutral_700;
  background-color: $neutral_300;
  border: 2px solid $neutral_300;
  padding: 12px 24px;
  border-radius: 24px;
  transition: 0.3s ease;


  &:hover{
  background-color: $neutral_white;
  transition: 0.3s ease;

  }
}

// --- RWD ---

@media screen and (max-width: 700px) {
    .plans{
        gap: 64px;
    }

    .plan_foryou,
    .plan_free{
        width:200px;
        height: 200px;
    }

    .notice{
        width: 360px;
    }

    h5{
        font-size: $font_h6;
    }
}

@media screen and (max-width: 500px) {
    .selectBox{
        gap: 40px;
    }

    .plans{
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    .notice{
        width: 320px;
    }

    h5{
        font-size: $font_h6;
    }
}

</style>
