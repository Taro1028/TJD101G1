<template>
  <h1>這是 Main 元件</h1>
  <ul>
    <li><RouterLink to="/">首頁(RouterLink)</RouterLink></li>
    <li><RouterLink to="/about">關於我們(RouterLink)</RouterLink></li>
    <li><RouterLink to="/admin">admin</RouterLink></li>
    <li><RouterLink to="/admin/users">admin users</RouterLink></li>
  </ul>
  
  <template v-if="$route.path.includes('admin')">
    <AdminLayout></AdminLayout>
  </template>
  <template v-else>
    <FrontLayout></FrontLayout>
  </template>


</template>

<!--
<script>
  import FrontLayout from "@/layouts/FrontLayout.vue";
  import AdminLayout from "@/layouts/AdminLayout.vue";
  export default {
    components: {FrontLayout, AdminLayout}
  }
</script>
-->

<script setup>
  import FrontLayout from "@/layouts/FrontLayout.vue";
  import AdminLayout from "@/layouts/AdminLayout.vue";
</script>

<style scoped>

</style>