import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";
import { useMemberStore } from "@/stores/MemberStore.js"; //新增修改
import "normalize.css";
// import 'bootstrap';
// import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/sass/main.scss";
import Main from "@/Main.vue";
import "leaflet/dist/leaflet.css";

const pinia = createPinia();
// 以下為修正部分
const app = createApp(Main);

app.use(pinia);
app.use(router);

// 使用 Pinia store
const memberStore = useMemberStore();
// 從 sessionStorage 載入會員資料
memberStore.loadFromsessionStorage();

app.mount("#app");


