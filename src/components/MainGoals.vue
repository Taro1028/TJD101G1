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
  margin-top: 160px;
}
.title {
  font-size: $font_h3;
  color: $primary_950;
  text-align: center;
  margin-bottom: 20px;
}
.goal-list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 20px;
  list-style: none;
}
.goal-item {
  width: 740px;
  display: flex;
  align-items: center;
  background-color: $primary_600;
  color: $neutral_white;
  padding: 20px;
  margin: 20px auto;
  border-radius: 20px;
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
  font-size: $font_h4;
  text-align: center;
  letter-spacing: 4px;
}

/* RWD 手機版 */
@media (max-width: 820px) {
  .title{
    margin-bottom: 0;
  }

  .goal-item{
    width: 600px;
  }

  .goal-number{
    font-weight: lighter;
  }
}

@media (max-width: 660px) {
  .main-goals {
    margin-top: 100px;
  }

  .title{
    font-size: $font_h5;
  }

  .goal-item {
    width: 400px;
    padding: 10px;
    margin: 10px auto;
  }
  .goal-number {
    font-size: $font_h5;
    padding: 4px 10px;
  }
  .goal-text {
    font-size: $font_h6;
    letter-spacing: 2px;
  }
}

@media (max-width: 430px) {
  .title {
    font-size: $font_h6;
  }
  
  .goal-item {
    width: 320px;
    padding: 10px;
    margin: 10px auto;
  }
  .goal-number {
    font-size: $font_h6;
    padding: 2px 8px;
  }
  .goal-text {
    font-size: $font_p;
    letter-spacing: 2px;
  }
}
</style>