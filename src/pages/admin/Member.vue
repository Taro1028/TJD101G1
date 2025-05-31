<template>
  <div class="custom-font">
    <Header> </Header>
    <Sidebar>
      <div>111</div>
    </Sidebar>
  </div>
</template>

<script setup>
import Header from "@/components/Admin/Header.vue";
import Sidebar from "@/components/Admin/Sidebar.vue";
import DataForm from "@/components/Admin/DataForm.vue";
</script>

<style lang="scss" scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";

@font-face {
  font-family: "MyFont";
  src: url("/src/assets/font/jf-openhuninn-2.1.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

/* 讓父元件包起來就能套用到裡面的所有元素 */
.custom-font,
.custom-font * {
  font-family: "MyFont", sans-serif !important;
}

Sidebar {
  margin-top: 500px;
  background-color: beige;
}
</style>
