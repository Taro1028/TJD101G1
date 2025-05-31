<template>
  <Dailog v-model:visible="show"> </Dailog>
  

  <section class="out">
    <div class="addbutton" @click="show = true">
      <button>新增</button>
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
              <tr v-for="(tableBody, index) in tableBodys" :key="tableBody.id">
                <td v-for="(header, hIndex) in tableHeaders" :key="hIndex">
                  <!-- 特殊欄位處理 -->
                  <template v-if="header.key === 'avatar'">
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
                    <button class="btn btn-sm webbutton" @click="show = true">修改</button>
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
import { ref } from "vue";
import Dailog from "./Dailog.vue";
const show = ref(false);
const props = defineProps([
  "tableBodys",
  "tableHeaders",
  "formTitle",
  "userData",
]);
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
.out {
 
}

</style>
