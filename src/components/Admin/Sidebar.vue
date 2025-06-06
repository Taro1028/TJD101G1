<template>
  <section>
    <div>
      <RouterLink to="/admin/member" class="adimnbtn"> 會員資料 </RouterLink>
      <RouterLink to="/admin/product" class="adimnbtn"> 商品資料 </RouterLink>
      <RouterLink to="/admin/order" class="adimnbtn"> 訂單資料 </RouterLink>
      <RouterLink to="/admin/consignees" class="adimnbtn">
        收貨人資料
      </RouterLink>
      <RouterLink to="/admin/web" class="adimnbtn"> 網站資料 </RouterLink>
    </div>

    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        :form-title="formTitle"
        :table-bodys="tableBodys"
        :table-headers="tableHeaders"
      />
    </RouterView>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userData = ref(""); 
const formTitle = ref("");
const tableHeaders = ref([]);//下面watch
const memberHeaders = [
  { key: "id", label: "會員編號" },
  { key: "name", label: "會員名稱" },
  { key: "gender", label: "會員性別" },
  { key: "birthday", label: "會員生日" },
  { key: "address", label: "會員地址" },
  { key: "email", label: "會員信箱" },
  { key: "tel", label: "會員市內電話" },
  { key: "mobile", label: "會員手機" },
  { key: "emergencyContact", label: "備用聯絡人姓名" },
  { key: "emergencyPhone", label: "備用聯絡人手機" },
  { key: "note", label: "會員備註" },
  { key: "avatar", label: "會員頭貼" },
  { key: "actionsmember", label: "操作" },
];
const productHeaders = [
  { key: "id", label: "商品編號" },
  { key: "name", label: "商品名稱" },
  { key: "price", label: "商品價格" },
  { key: "status", label: "商品上下架狀態" },
  { key: "createdAt", label: "商品建立日期" },
//   { key: "actions", label: "操作" },
];
const orderHeaders = [
  { key: "orderId", label: "訂單編號" },
  { key: "memberId", label: "會員編號" },
  { key: "productId", label: "商品編號" },
  { key: "orderDate", label: "訂購日期" },
  { key: "mealDetails", label: "餐點明細" },
  { key: "mealQuantity", label: "餐點數量" },
  { key: "totalAmount", label: "訂單金額" },
  { key: "productStatus", label: "商品上下架狀態" },
  { key: "orderStatus", label: "訂單狀態" },
//   { key: "actions", label: "操作" },
];
const consigneesHeaders = [
  { key: "recipientId", label: "收貨人編號" },
  { key: "memberId", label: "會員編號" },
  { key: "recipientName", label: "收貨人姓名" },
  { key: "recipientAddress", label: "收貨人地址" },
  { key: "recipientTel", label: "收貨人市內電話" },
  { key: "recipientMobile", label: "收貨人手機" },
  { key: "safetyContactName", label: "送餐安全聯絡人姓名" },
  { key: "safetyContactPhone", label: "送餐安全聯絡人手機" },
  { key: "note", label: "備註" },
//   { key: "actions", label: "操作" },
];
const webHeaders = [
  { key: "dataId", label: "網站資料編號" },
  { key: "title", label: "標題" },
  { key: "content", label: "內文" },
  { key: "image", label: "圖片" },
  { key: "page", label: "網站頁面" },
  { key: "city", label: "城市" },
  { key: "status", label: "消息上下架狀態" },
  { key: "actionsweb", label: "操作" },
];
const tableBodys = ref([]);
const member = [
  {
    id: "001",
    name: "王小明",
    gender: "男",
    birthday: "1990-01-01",
    address: "台北市大安區...",
    email: "example@mail.com",
    tel: "02-12345678",
    mobile: "0912345678",
    emergencyContact: "王媽媽",
    emergencyPhone: "0987654321",
    note: "VIP",
    avatar: "https://via.placeholder.com/50",
  },

  // 更多會員...
];
const product = [
  {
    id: "P001",
    name: "樂活元氣餐",
    price: 190,
    status: "上架",
    createdAt: "2024-05-01",
  },
];
const order = [
  {
    orderId: "O202405001",
    memberId: "M001",
    productId: "P1001",
    orderDate: "2024-05-20",
    mealDetails: "樂活元氣餐（雞腿飯）",
    mealQuantity: 2,
    totalAmount: 380,
    productStatus: "上架",
    orderStatus: "已完成",
  },
];
const consignees = [
  {
    recipientId: "R001",
    memberId: "M001",
    recipientName: "林大明",
    recipientAddress: "台北市中山區民生東路100號",
    recipientTel: "02-22334455",
    recipientMobile: "0911222333",
    safetyContactName: "林太太",
    safetyContactPhone: "0922111222",
    note: "需爬三樓，無電梯",
  },
];
const web = [
  {
    dataId: "D001",
    title: "網站全新改版",
    content: "我們的網站煥然一新，提供更好的使用體驗！",
    image: "https://via.placeholder.com/100x60",
    page: "首頁",
    city: "台北市",
    status: "上架",
  },
];
watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case "/admin/member":
        formTitle.value = "會員資料";
        tableHeaders.value = memberHeaders;
        tableBodys.value = member;
        break;
      case "/admin/product":
        formTitle.value = "商品資料";
        tableHeaders.value = productHeaders;
        tableBodys.value = product;
        break;
      case "/admin/order":
        formTitle.value = "訂單資料";
        tableHeaders.value = orderHeaders;
        tableBodys.value = order;
        break;
      case "/admin/consignees":
        formTitle.value = "收貨人資料";
        tableHeaders.value = consigneesHeaders;
        tableBodys.value = consignees;
        break;
      case "/admin/web":
        formTitle.value = "網站資料";
        tableHeaders.value = webHeaders;
        tableBodys.value = web;
        break;
      default:
        formTitle.value = "";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
section {
  display: flex;
  width: 100%;
  height: 100vh;

  overflow: hidden;
}
div {
  // width: 16.5%;
  background-color: $primary_100;
}
.adimnbtn {
  display: block;
  width: 150px;
  height: 50px;
  background-color: $primary_600;
  border-radius: 4px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
  line-height: 50px;
  text-decoration: none;
  color: white;
}

.adimnbtn:hover{
  background-color:$primary_400;
}
</style>
