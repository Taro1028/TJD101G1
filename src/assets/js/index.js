// import { createApp } from "vue";
// import { createPinia } from "pinia";
// import router from "@/router/index.js";
// import 'normalize.css';
// import Main from "@/Main.vue";


// const pinia = createPinia();

// createApp(Main).use(router).use(pinia).mount("#app");
// src/assets/js/index.js
// src/assets/js/index.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";
import { useMemberStore } from "@/stores/MemberStore";

import Main from "@/Main.vue";

const pinia = createPinia();
const app = createApp(Main);

// 使用 pinia 和 router
app.use(pinia);
app.use(router);

// 應用程式啟動時檢查登入狀態
router.isReady().then(() => {
  const memberStore = useMemberStore();
  
  // 嘗試從 localStorage 恢復登入狀態
  const hasStoredAuth = memberStore.checkAuthStatus();
  
  if (hasStoredAuth) {
    console.log('自動登入成功，會員:', memberStore.memberName);
  } else {
    console.log('無儲存的登入資訊');
  }
  
  // 掛載應用程式
  app.mount("#app");
});