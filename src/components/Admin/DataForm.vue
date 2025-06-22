<template>
  <Dailog v-model:visible="show" :modify="modify" :item="item"> </Dailog>

  <section class="out">
    <div class="addbutton" @click="add()">
      <button v-if="route.path === '/admin/web'">新增</button>
    </div>
    <section class="mid">
      <p>{{ formTitle }}</p>
      <div class="input">
        <input
          class="me-4 mr-sm-2"
          type="search"
          placeholder="請輸入編號"
          aria-label="Search"
          v-model="searchId"
          @keyup.enter="filterById"
        />
        <i class="bi bi-search position-absolute searchi"></i>
      </div>

      <div class="in">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th
                  v-for="(header, index) in tableHeaders"
                  :key="index"
                  scope="col"
                >
                  {{ header.label }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(tableBody, index) in paginatedData"
                :key="tableBody.id"
              >
                <td v-for="(header, hIndex) in tableHeaders" :key="hIndex">
                  <!-- 特殊欄位處理 -->
                  <template v-if="header.key === 'AVATAR'">
                    <img
                      :src="tableBody[header.key]"
                      alt="頭像"
                      style="width: 50px; height: 50px; object-fit: cover"
                    />
                  </template>
                  <template v-else-if="header.key === 'actionsmember'">
                    <button
                      class="btn btn-sm memberbutton"
                      :class="tableBody.BLACKLISTED ? 'danger' : 'normal'"
                      @click="toggleBlacklist(tableBody)"
                    >
                      {{
                        Number(tableBody.BLACKLISTED) === 1
                          ? "取消黑名單"
                          : "加入黑名單"
                      }}
                    </button>
                    <!-- <button class="btn btn-sm btn-danger">刪除</button> -->
                  </template>
                  <template v-else-if="header.key === 'actionsweb'">
                    <button
                      class="btn btn-sm webbutton"
                      @click="reviseItem(tableBody)"
                    >
                      修改
                    </button>
                    <!-- <button class="btn btn-sm webbutton" @click="reviseContent(tableBody)">
                      修改內文
                    </button> -->
                    <!-- <button class="btn btn-sm btn-danger">刪除</button> -->
                  </template>
                  <template v-else-if="header.key === 'CONTENTS'">
                    <div
                      v-for="(content, contentIndex) in tableBody.CONTENTS"
                      :key="contentIndex"
                      class="content-block"
                    >
                      <p>
                        <strong>新聞ID：</strong>{{ content.NEWS_ITEMS_ID }}
                      </p>
                      <p><strong>副標題：</strong>{{ content.SUBTITLE }}</p>
                      <p><strong>段落：</strong>{{ content.PARAGRAPH }}</p>
                      <hr />
                    </div>
                  </template>

                  <template v-else-if="header.key === 'MEAL_ITEMS'">
                    <div
                      class="meal-info"
                      v-for="(meal, mealIndex) in tableBody[header.key]"
                      :key="mealIndex"
                    >
                      <p>名稱：{{ meal.name }}</p>
                      <p>價格：{{ meal.price }}</p>
                      <p>數量：{{ meal.quantity }}</p>
                      <hr />
                    </div>
                  </template>
                  <template v-else-if="header.key === 'ORDERS_STATUS'">
                    <select
                      v-model="tableBody[header.key]"
                      @change="
                        handleStatusChange(
                          tableBody.order_id,
                          tableBody.ORDERS_STATUS
                        )
                      "
                      class="form-select"
                    >
                      <option value="PENDING">等待付款</option>
                      <option value="CONFIRMED">確認</option>
                      <option value="PACKING">包裝</option>
                      <option value="DELIVERING">運送</option>
                      <option value="FINISHED">完成</option>
                    </select>
                  </template>
                  <template v-else>
                    {{ tableBody[header.key] }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end me-4">
          <li
            class="page-item previous"
            :class="{ disabled: currentPage === 1 }"
          >
            <button class="page-link" @click="currentPage--">上一頁</button>
          </li>
          <li class="page-item disabled">
            <span class="page-link page-info"
              >{{ currentPage }} / {{ totalPages }}</span
            >
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="currentPage++">下一頁</button>
          </li>
        </ul>
      </nav>
    </section>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import Dailog from "./Dailog.vue";
import { useRoute } from "vue-router";

const env = import.meta.env.VITE_API_URL;

const perPage = 10; // 每頁幾筆
const currentPage = ref(1); // 當前頁碼

const item = reactive({});
const searchId = ref("");
const route = useRoute();
const show = ref(false);
const modify = ref(false);
const props = defineProps([
  "tableBodys",
  "tableHeaders",
  "formTitle",
  "userData",
]);

const localBodys = ref([]);
localBodys.value = [...props.tableBodys];

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    console.log("路徑變了！從", oldPath, "變成", newPath);
    // 在這裡執行你每次切換路由都要做的事情
    if (newPath === "/admin/member") {
      //  console.log(newPath)
      getdata();
    }
    if (newPath === "/admin/product") {
      //  console.log(newPath)
      Products();
    }
    if (newPath === "/admin/order") {
      //  console.log(newPath)

      order();
    }
    // fetchDataByPath(newPath);
    if (newPath === "/admin/consignees") {
      //  console.log(newPath)

      consigness();
    }
    if (newPath === "/admin/web") {
      //  console.log(newPath)

      websitedata();
    }
  }
);

function add() {
  show.value = true;
  modify.value = false;
}
function reviseItem(row) {
  show.value = true;
  modify.value = true;
  console.log("主題", row);
  Object.assign(item, row);
}

function reviseContent(row) {
  show.value = true;
  modify.value = true;
  console.log("內文", row);
}

//==================以下fetch==========================================================
async function getdata() {
  try {
    console.log("dddd");
    const response = await fetch(env + "/tjd101/g1/php/AdminMemberSelect.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    console.log(response);
    if (response.ok) {
      const result = await response.json();
      console.log("載入成功:", result);
      localBodys.value = result.members;
      // localBodys.value = result.members.map((row) => ({
      //   ...row,
      //   AVATAR: `data:image/png;base64,${row.AVATAR}`, // ← 加 MIME 類型
      // }));
    }
  } catch (error) {
    console.error("錯誤發生:", error);
  }
}

async function Products() {
  try {
    const response = await fetch(
      env + "/tjd101/g1/php/AdminProductSelect.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("商品列表載入成功:", result);

      // 類似會員資料那樣處理表格內容
      localBodys.value = result.members;
    } else {
      console.error("載入商品失敗");
    }
  } catch (error) {
    console.error("錯誤發生:", error);
  }
}

async function order() {
  try {
    const response = await fetch(env + "/tjd101/g1/php/AdminOrderSelect.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("訂單列表載入成功:", result);

      // 類似會員資料那樣處理表格內容
      localBodys.value = result.members;
    } else {
      console.error("載入訂單失敗");
    }
  } catch (error) {
    console.error("錯誤發生:", error);
  }
}

async function consigness() {
  try {
    const response = await fetch(env + "/tjd101/g1/php/AdminConsignees.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("收貨人資料載入成功:", result);

      // 類似會員資料那樣處理表格內容
      localBodys.value = result.members;
    } else {
      console.error("載入收貨人資料失敗");
    }
  } catch (error) {
    console.error("錯誤發生:", error);
  }
}

async function websitedata() {
  try {
    const response = await fetch(env + "/tjd101/g1/php/AdminWebsiteData.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("網站資料載入成功:", result);

      // 類似會員資料那樣處理表格內容
      localBodys.value = result.members;
    } else {
      console.error("載入網站資料失敗");
    }
  } catch (error) {
    console.error("錯誤發生:", error);
  }
}
//order訂單狀態的API
async function handleStatusChange(orderId, newStatus) {
  console.log(`訂單 ${orderId} 狀態變更為 ${newStatus}`);
  try {
    const response = await fetch(env + "/tjd101/g1/php/AdminOrderUpdate.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: orderId,
        status: newStatus,
      }),
    });
    console.log(response);
    if (response.ok) {
      //.ok回傳200
      const result = await response.json();
      console.log("訂單資料載入成功:", result);
    } else {
      console.error("載入訂單狀態資料失敗");
    }
  } catch (error) {
    console.error("錯誤發生:", error);
  }
}

//搜尋bar=========================================================================
async function filterById() {
  currentPage.value = 1;
  const keyword = searchId.value.trim();
  localBodys.value = []; // 先清空畫面

  const type = route.fullPath.split("/admin/")[1];
  const endpointMap = {
    member: "AdminMemberSelect.php",
    product: "AdminProductSelect.php",
    order: "AdminOrderSelect.php",
    consignees: "AdminConsignees.php",
    web: "AdminWebsiteData.php",
  };

  const endpoint = endpointMap[type];
  if (!endpoint) {
    console.error("未知的 type", type);
    return;
  }

  try {
    const response = await fetch(`${env}/tjd101/g1/php/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchId: keyword }),
    });

    const result = await response.json();

    if (result.success) {
      localBodys.value = result.members;
    } else {
      console.warn("搜尋成功但無資料");
    }
  } catch (error) {
    console.error("搜尋錯誤:", error);
  }
}

//黑名單=====================
async function toggleBlacklist(member) {
  const raw = { ...member };
  const flagToSet = Number(raw.BLACKLISTED) === 1 ? 0 : 1;

  console.log("切換會員 ID", raw.ID, "設為：", flagToSet);

  try {
    const res = await fetch(env + "/tjd101/g1/php/AdminToggleBlacklist.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: raw.ID,
        flag: flagToSet,
      }),
    });

    const result = await res.json();
    console.log("回傳結果：", result);

    if (result.success) {
      const memberName = raw.M_NAME || `ID: ${raw.ID}`;
      alert(`會員 ${memberName} 已${flagToSet ? "加入" : "取消"}黑名單`);
      setTimeout(() => {
        getdata();
      }, 200);
    } else {
      alert("切換失敗：" + result.message);
    }
  } catch (err) {
    console.error("黑名單切換錯誤", err);
    alert("無法切換黑名單狀態，請稍後再試");
  }
}
//分頁
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return localBodys.value.slice(start, start + perPage);
});

const totalPages = computed(() => {
  return Math.ceil(localBodys.value.length / perPage);
});

onMounted(() => {
  const newPath = route.fullPath;
  console.log("目前路徑:", newPath);
  console.log("xxxxxxxxxxx");
  if (newPath === "/admin/member") {
    //  console.log(newPath)
    getdata();
  }
  if (newPath === "/admin/product") {
    //  console.log(newPath)
    Products();
  }
  if (newPath === "/admin/order") {
    //  console.log(newPath)

    order();
  }
  // fetchDataByPath(newPath);
  if (newPath === "/admin/consignees") {
    //  console.log(newPath)

    consigness();
  }
  if (newPath === "/admin/web") {
    //  console.log(newPath)

    websitedata();
  }
  console.log("tableBodys:", props.tableBodys);
});
</script>

<style lang="scss" scoped>
.out {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  // margin: 0 auto;
  width: 100vw;
  overflow-x: hidden;
}
.mid {
  width: 90%;
  margin: 0 auto;
  background-color: $primary_100;
  margin-top: 50px;
}
.mid .searchi {
  font-size: $font_h5;
  position: absolute;
  cursor: pointer;
}
.mid .input {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;
  gap: 8px;
}
.mid p {
  height: 50px;
  line-height: 50px;
  background-color: $primary_400;
  padding-left: 20px;
  margin-top: 0;
}

.meal-info {
  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1.4;
    background-color: #fff;
    height: 20px;
  }

  hr {
    margin: 4px 0;
    border: none;
  }
}
.content-block {
  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1.4;
    background-color: #fff;
    height: 20px;
  }

  hr {
    margin: 4px 0;
    border: none;
  }
}

.in {
  margin: 0 auto;
  margin-top: 70px;
  width: 95%;
  background-color: $primary_50;
}
.table-responsive {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
.memberbutton,
.webbutton {
  background: $primary_600;
  color: white;
}
.addbutton {
  display: flex;
  // justify-content: end;
  align-items: end;
  flex-direction: column;
  width: 96%;
  padding-top: 30px;
}
.out button {
  width: 100px;
  height: 30px;
  border: none;
  background-color: $primary_600;
  border-radius: 4px;
  margin: 10px;
  color: #fff;
  cursor: pointer;
}

.out button:hover {
  background-color: $primary_400;
}
.page-item.previous .page-link {
  background-color: $primary_600;
  color: white;
}

.page-item.next .page-link {
  background-color: $primary_600;
  color: white;
}
.page-item.num .page-link {
  background-color: $primary_400;
  color: black;
  border: 1px solid black;
  z-index: 999;
}

.form-select {
  width: 150px;
}

.pagination .page-link {
  /* 讓元素本身變成 flex 容器 */
  display: flex;
  align-items: center;   // 垂直置中
  justify-content: center; // 水平置中

  /* 建議順手把高度定死，或讓 line-height 一致，避免不同瀏覽器差異 */
  height: 30px;   // 與 .out button 相同高度
  padding: 0 12px; // 保留左右內距
}

/* 保留你原本針對上一頁 / 下一頁的配色設定 */
.page-item.previous .page-link {
  background-color: $primary_600;
  color: #fff;
}
.page-item.next .page-link {
  background-color: $primary_600;
  color: #fff;
}
page-item disabled{
  
}
</style>
