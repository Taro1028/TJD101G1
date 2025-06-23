<script setup>
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';
import { usePlanCustomStore } from '@/stores/planCustomStore';

const router = useRouter();
const orderStore = useOrderStore();
const planCustomStore = usePlanCustomStore();

// 定義 props 來接收當前是哪種方案
const props = defineProps({
  planType: {
    type: String,
    required: true,
    validator: (value) => ['為你搭配', '自由搭配'].includes(value)
  }
});

const emit = defineEmits(['close']);

// 當用戶選擇「不用，謝謝」時
async function goNext() {
  console.log(`點擊「不用，謝謝」：準備將 ${props.planType} 訂單資料加入購物車`);
  
  try {
    if (props.planType === '為你搭配') {
      
      await orderStore.addPlanForYouToCart(); 
    } else if (props.planType === '自由搭配') {
      
      await planCustomStore.addAllCustomMealsToCart(null); // 明確傳入 null
    }
    
    // 關閉彈窗
    emit('close');
    router.push('/Order/AddCart');
  } catch (error) {
    console.error('加入購物車失敗:', error);
    alert('加入購物車失敗，請稍後再試。');
  }
}

// 當用戶選擇「我要留言」時
function goMessage() {
  console.log(`點擊「我要留言」：導向留言卡頁面 (${props.planType})`);
  
  // 關閉彈窗
  emit('close');
  
  // 導向到留言小卡頁面，並傳遞方案類型
  router.push({
    path: '/Order/MessageCards',
    query: { planType: props.planType }
  });
}
</script>

<template>
<div class="overlay">
  <div class="messageCard">
    <img src="../assets/images/Order/card.svg" alt="">
    <h3>需要留言小卡嗎?</h3>
    <h5>會與配送餐點一併送達</h5>
    <div class="btnblock">
      <button class="btn-1" @click="goNext">不用，謝謝</button>
      <button class="btn-2" @click="goMessage">我要留言</button>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
}

.messageCard{
    width: 282px;
    margin: auto;
    padding: 24px;
    background-color: $neutral_white;
    border: 1px solid $neutral_700;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

h3{
    margin: 0;
    font-size: 2rem;
}

h5{
    margin: 0;
    font-size: $font_h5;
    font-weight: normal;
}

.btnblock{
    display: flex;
    gap: 40px;
}

.btn-1{
    background-color: $neutral_300;
    color: $neutral_700;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_300;
    transition: 0.3s ease;


    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_700;
    }
}

.btn-2{
    background-color: $neutral_black;
    color: $neutral_white;
    padding: 12px 20px;
    border-radius: 24px;
    border: 2px solid $neutral_black;
    transition: 0.3s ease;


    &:hover{
    background-color: transparent;
    transition: 0.3s ease;
    color: $neutral_black;
    }
}
</style>