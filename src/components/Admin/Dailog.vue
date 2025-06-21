<template>
  <div v-if="visible" class="dialog-overlay" @click.self="close">
    <div class="dialog-box">
      <!-- <slot /> -->
      <!-- Modal or Dialog 外層視窗 -->
      <!-- Modal or Dialog 外層視窗 -->
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">{{ !modify ? "新增" : "修改" }}</h5>
          </div>

          <div class="modal-body">
            <form>
              <!-- 主標題、摘要 -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="title" class="form-label">主標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入主標題"
                    v-model="formData.title"
                  />
                </div>
                <div class="col-md-6">
                  <label for="summary" class="form-label">摘要</label>
                  <textarea
                    class="form-control"
                    id="summary"
                    rows="3"
                    placeholder="請輸入摘要"
                    v-model="formData.summary"
                  ></textarea>
                </div>
              </div>

              <!-- 標籤 -->
              <div class="mb-3">
                <label for="tag" class="form-label">標籤</label>
                <select
                  class="form-select"
                  id="tag"
                  name="tag"
                  v-model="formData.tag"
                >
                  <option disabled selected>— 請選擇標籤 —</option>
                  <option value="焦點計畫">焦點計畫</option>
                  <option value="深度專題">深度專題</option>
                  <option value="誰來午餐">誰來午餐</option>
                </select>
              </div>

              <!-- 是否精選 / 圖片 -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="featured" class="form-label">是否精選</label>
                  <select
                    class="form-select"
                    id="featured"
                    v-model="formData.featured"
                  >
                    <option value="1">是</option>
                    <option value="0">否</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="image" class="form-label">圖片</label>
                  <input
                    type="file"
                    class="form-control"
                    id="image"
                    @change="handleImage"
                  />
                </div>
              </div>

              <!-- 上下架狀態 -->
              <div class="mb-3">
                <label for="status" class="form-label">消息上下架狀態</label>
                <select
                  class="form-select"
                  id="status"
                  v-model="formData.status"
                >
                  <option value="1">上架</option>
                  <option value="0">下架</option>
                </select>
              </div>
              <div
                v-for="(c, idx) in formData.contents"
                :key="idx"
                class="row mb-3 border rounded p-2"
              >
                <h6 class="fw-bold mb-2">段落 {{ idx + 1 }}</h6>

                <div class="col-md-6">
                  <label class="form-label">副標題</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="c.subtitle"
                    :placeholder="`請輸入副標題 #${idx + 1}`"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">段落內容</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="c.paragraph"
                    :placeholder="`請輸入段落內容 #${idx + 1}`"
                  ></textarea>
                </div>

                <div class="col-12 mt-2">
                  <label class="form-label">排序</label>
                  <select class="form-select w-auto" v-model="c.sortOrder">
                    <option :value="idx + 1">{{ idx + 1 }}</option>
                  </select>
                </div>
              </div>

              <!-- 按鈕 -->
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-warning"
                  @click="submitNews()"
                >
                  {{ !modify ? "新增儲存" : "修改儲存" }}
                </button>
                <button type="button" class="btn btn-secondary" @click="close">
                  關閉
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  modify: Boolean,
  item: Object,
  content: Object,
});
const emit = defineEmits(["update:visible"]);

// const formData = reactive({
//   title: "",
//   summary: "",
//   tag: "",
//   featured: null,
//   status: null,
//   subtitle: "",
//   paragraph: "",
//   sortOrder: null,
//   imageFile: null,
// });

const title = ref("");
const summary = ref("");
const tag = ref("");
const featured = ref();
const imageFile = ref(null);
const status = ref();
const subtitle = ref("");
const paragraph = ref("");
const sortOrder = ref();

const env = import.meta.env.VITE_API_URL;
// const env = "";

function handleImage(event) {
  const file = event.target.files[0];
  formData.imageFile = file;
  console.log("選擇的檔案：", file);
}

const close = () => {
  emit("update:visible", false);
};

const formData = reactive({
  id: null, // 有值代表「修改」，null 代表「新增」
  title: "",
  summary: "",
  tag: "",
  featured: 0,
  status: 1,
  // ⭐ 內文陣列，預設三段（你也可以先空陣列，點「新增段落」再 push）
  contents: [
    { subtitle: "", paragraph: "", sortOrder: 1 },
    { subtitle: "", paragraph: "", sortOrder: 2 },
    { subtitle: "", paragraph: "", sortOrder: 3 },
  ],
  imageFile: null,
});

async function saveNews() {
  const formData = new FormData();
  formData.append("title", formData.title);
  formData.append("summary", formData.summary);
  formData.append("tag", formData.tag);
  formData.append("featured", formData.featured);
  formData.append("status", formData.status);
  formData.append("subtitle", formData.subtitle);
  formData.append("paragraph", formData.paragraph);
  formData.append("sortOrder", formData.sortOrder);
  formData.append("image", formData.imageFile);
  try {
    const res = await fetch(env + "/tjd101/g1/php/AdminNewsSave.php", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("伺服器回應錯誤");

    const result = await res.json(); // ✅ 正確
    console.log("新增成功:", result);

    if (result.success) {
      alert("新增成功！");
      close();
    } else {
      alert("新增失敗：" + result.message);
    }
  } catch (error) {
    console.error("網路或伺服器錯誤:", error);
    alert("錯誤：" + (error.message || "無法解析回應"));
  }
}

async function updateNews() {
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("summary", summary.value);
  formData.append("tag", tag.value);
  formData.append("featured", featured.value);
  formData.append("status", status.value);
  formData.append("subtitle", subtitle.value);
  formData.append("paragraph", paragraph.value);
  formData.append("sortOrder", sortOrder.value);
  formData.append("image", imageFile.value);
  try {
    const res = await fetch(env + "/tjd101/g1/php/AdminNewsSave.php", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("伺服器回應錯誤");

    const result = await res.json(); // ✅ 正確
    console.log("新增成功:", result);

    if (result.success) {
      alert("新增成功！");
      close();
    } else {
      alert("新增失敗：" + result.message);
    }
  } catch (error) {
    console.error("網路或伺服器錯誤:", error);
    alert("錯誤：" + (error.message || "無法解析回應"));
  }
}

async function submitNews() {
  const fd = new FormData();
  // 如果有 id 就視為「修改」
  if (formData.id) fd.append("newsId", formData.id);

  fd.append("title", formData.title);
  fd.append("summary", formData.summary);
  fd.append("tag", formData.tag);
  fd.append("featured", formData.featured);
  fd.append("status", formData.status);

  // ⭐ 將三段內容拆成陣列欄位
  formData.contents.forEach((c, i) => {
    fd.append(`subtitle[${i}]`, c.subtitle);
    fd.append(`paragraph[${i}]`, c.paragraph);
    fd.append(`sortOrder[${i}]`, c.sortOrder);
  });

  if (formData.imageFile) fd.append("image", formData.imageFile);

  const res = await fetch(env + "/tjd101/g1/php/AdminNewsUpdate.php", {
    method: "POST",
    body: fd,
  });
  const result = await res.json();
  if (result.success) {
    alert(formData.id ? "修改成功！" : "新增成功！");
    close();
  } else {
    alert("失敗：" + result.message);
  }
}

watch(
  () => props.item,
  (newItem) => {
    if (props.modify && newItem) {
      formData.title = newItem.TITLE || "";
      summary.value = newItem.SUMMARY || "";
    } else {
      title.value = "";
      summary.value = "";
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      resetForm(); // 清空欄位
      if (props.modify && props.item) {
        fillFormWithItem(props.item); // 填入 item 資料
      }
    }
  }
);

function resetForm() {
  formData.title = "";
  formData.summary = "";
  formData.tag = "";
  formData.featured = 0;
  formData.status = 1;
  formData.imageFile = null;

  // ⭐ 重設三段空資料（你要幾段就設幾個）
  formData.contents = [
    { subtitle: "", paragraph: "", sortOrder: 1 },
    { subtitle: "", paragraph: "", sortOrder: 2 },
    { subtitle: "", paragraph: "", sortOrder: 3 },
  ];
}

function fillFormWithItem(item) {
  formData.id = item.ID ?? null;
  formData.title = item.TITLE ?? "";
  formData.summary = item.SUMMARY ?? "";
  formData.tag = item.TAG ?? "";
  formData.featured = item.FEATURED ?? 0;
  formData.status = item.STATUS === "上架" ? 1 : 0;
  
  // ⭐ 假設你後端有回傳 item.contents 是陣列
  if (item.CONTENTS && Array.isArray(item.CONTENTS)) {
    
    formData.contents = item.CONTENTS.map((c, index) => ({
      subtitle: c.SUBTITLE ?? "",
      paragraph: c.PARAGRAPH ?? "",
      sortOrder: c.SORT_ORDER ?? index + 1,
    }));
  } else {
    // 沒有內容資料時初始化空的三段
    formData.contents = [
      { subtitle: "", paragraph: "", sortOrder: 1 },
      { subtitle: "", paragraph: "", sortOrder: 2 },
      { subtitle: "", paragraph: "", sortOrder: 3 },
    ];
  }
}

</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

// .dialog-box {
//   background: #fff; // Bootstrap 標準底色
//   border-radius: 0.5rem;
//   max-width: 600px;
//   width: 90%;
//   box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
//   overflow: hidden;
// }
.dialog-box {
  background: #fff;
  border-radius: 0.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh; // 重點：整體彈窗別超出視窗
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

// .modal-body {
//   padding: 1.5rem;
// }
.modal-body {
  max-height: 70vh; // 根據你頁面大小可調整（如 60vh～80vh）
  overflow-y: auto;
  padding: 1.5rem;
  scroll-behavior: smooth;
  margin: 0;
}
.modal-dialog {
  margin: 0;
}

.modal-footer {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-top: 1px solid #dee2e6;
}

.btn {
  min-width: 100px;
  font-weight: 500;
}

.form-button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

// 如需微調表單行距或欄位寬度可加上以下樣式：
.mb-3 {
  margin-bottom: 1.25rem !important;
}
</style>
