<template>
  <Dailog v-model:visible="show"> </Dailog>

  <section class="out">
    <div class="addbutton" @click="show = true">
      <button v-if="route.path === '/admin/web'">新增</button>
    </div>
    <section class="mid">
      <p>{{ formTitle }}</p>
      <div class="input">
        <input
          class="me-4 mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
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
              <tr v-for="(tableBody, index) in localBodys" :key="tableBody.id">
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
                    <button class="btn btn-sm memberbutton">加入黑名單</button>
                    <!-- <button class="btn btn-sm btn-danger">刪除</button> -->
                  </template>
                  <template v-else-if="header.key === 'actionsweb'">
                    <button class="btn btn-sm webbutton" @click="show = true">
                      修改
                    </button>
                    <!-- <button class="btn btn-sm btn-danger">刪除</button> -->
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
          <li class="page-item previous">
            <a class="page-link" href="#">Previous</a>
          </li>
          <li class="page-item num"><a class="page-link" href="#">1</a></li>
          <li class="page-item num"><a class="page-link" href="#">2</a></li>
          <li class="page-item num"><a class="page-link" href="#">3</a></li>
          <li class="page-item next"><a class="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Dailog from "./Dailog.vue";
import { useRoute } from "vue-router";

const env = import.meta.env.VITE_API_URL;

const route = useRoute();
const show = ref(false);
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

  cursor: pointer;
}
.mid .input {
  display: flex;
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
</style>
