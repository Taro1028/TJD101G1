import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";
import "normalize.css";
// import 'bootstrap';
// import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/sass/main.scss";
import Main from "@/Main.vue";
import 'leaflet/dist/leaflet.css';
import { useMemberStore } from "@/stores/MemberStore";

const pinia = createPinia();

createApp(Main).use(router).use(pinia).mount("#app");

const memberStore = useMemberStore();
memberStore.loadFromLocalStorage();
