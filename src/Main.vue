<template>
  <template v-if="$route.path.includes('admin')">
    <AdminLayout></AdminLayout>
  </template>
  <template v-else-if="$route.path === '/'">
    index
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
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.path)
</script>

<style scoped></style>