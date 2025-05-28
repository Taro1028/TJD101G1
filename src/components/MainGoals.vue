<script setup>
const goals = [
  '解決失能長輩的飲食困境',
  '彌補遠方子女無法親身照料的缺憾',
  '在後疫情時代提供安全且具人情味的餐盒服務',
  '建立一個對企業、使用者、照顧者都有益的永續模式'
];
</script>

<template>
  <section class="main-goals">
    <h3 class="title">TibaEAT 主要目標</h3>
    <ul class="goal-list">
      <li v-for="(goal, index) in goals" :key="index" class="goal-item">
        <div class="goal-number">{{ index + 1 }}</div>
        <div class="goal-text">{{ goal }}</div>
      </li>
    </ul>
  </section>
</template>



<style scoped lang="scss">
.main-goals {
    margin: 40px 0;
}
.title {
    font-size: $font_h3;
    margin-top: 80px;
    margin-bottom: 40px;

}
.goal-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0;
    list-style: none;
}
.goal-item {
    width: 1000px;
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: $primary_600;
    color: white;
    padding: 20px;
    margin: 20px auto;
    border-radius: 8px;
}
.goal-number {
    font-size: $font_h4;
    background-color: $primary_100;
    color: $primary_950;
    font-weight: bold;
    padding: 6px 12px;
    border-radius: 50%;
    text-align: center;
}
.goal-text {
    flex: 1;
    font-size: $font_h3;
    text-align: center;
}
</style>