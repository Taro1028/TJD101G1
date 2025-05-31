import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";
import 'normalize.css';
// import 'bootstrap';
// import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/sass/main.scss'
import Main from "@/Main.vue";


const pinia = createPinia();

createApp(Main).use(router).use(pinia).mount("#app");