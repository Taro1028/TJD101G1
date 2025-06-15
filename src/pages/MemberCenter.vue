<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import FrontLayout from "../layouts/FrontLayout.vue";
import Gotop from "../components/Gotop.vue";
import { useMemberStore } from "@/stores/MemberStore";
import { useRouter } from "vue-router";

const env = import.meta.env.VITE_API_URL;
const showDefaultAvatar = computed(() => !memberStore.hasCustomAvatar);
const userAvatar = computed(() => memberStore.userAvatar);
const avatarInput = ref(null);
const memberStore = useMemberStore();
const router = useRouter();
const ifo = reactive({
  id: "",
  name: "",
  nickname: "",
  gender: "",
  birthday: "",
  address: "",
  email: "",
  password: "",
  telephone: "",
  phone: "",
  emergency_contacts_name: "",
  emergency_contacts_phone: "",
  note: "",
  avatar: "",
});
// 點擊大頭照區域觸發檔案選擇
const handleAvatarClick = () => {
  console.log("Avatar clicked!");
  console.log("avatarInput.value:", avatarInput.value);

  if (avatarInput.value) {
    console.log("Triggering file input click");
    avatarInput.value.click();
  } else {
    console.error("avatarInput ref is null");
  }
};

// ✨ 修改：處理檔案上傳，直接更新到 memberStore
const handleFileChange = (event) => {
  const file = event.target.files[0];

  console.log("File selected:", file); // 調試用

  if (!file) {
    console.log("No file selected");
    return;
  }

  // 檢查檔案類型
  if (!file.type.startsWith("image/")) {
    alert("請選擇圖片檔案");
    console.log("Invalid file type:", file.type);
    return;
  }

  // 檢查檔案大小 (限制 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("檔案大小不能超過 5MB");
    console.log("File too large:", file.size);
    return;
  }

  console.log("File validation passed, reading file...");

  // 使用 FileReader 讀取檔案
  const reader = new FileReader();

  reader.onload = (e) => {
    console.log("File read successfully");
    // ✨ 直接更新到 memberStore，不再使用本地狀態
    memberStore.updateAvatar(e.target.result);
    console.log("Avatar updated to memberStore");
  };

  reader.onerror = () => {
    console.error("File read error");
    alert("檔案讀取失敗，請重新選擇");
  };

  reader.readAsDataURL(file);
};

// ✨ 修改：重置大頭照，使用 memberStore 方法
const resetAvatar = () => {
  memberStore.resetAvatar();

  if (avatarInput.value) {
    avatarInput.value.value = "";
  }
};

// 登出處理函數
const handleLogout = () => {
  // 確認是否要登出
  if (confirm("確定要登出嗎？")) {
    // 清除會員資料
    memberStore.logout();

    // 跳轉到首頁
    router.push("/Home");

    // 顯示登出成功訊息
    alert("登出成功！");
  }
};
async function update() {
  const response = await fetch(env + "/tjd101/g1/php/MemberCenter.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: ifo.id,
      gender: ifo.gender,
      nickname: ifo.nickname,
      password: ifo.password,
      address: ifo.address,
      email: ifo.email,
      phone: ifo.phone,
      telephone: ifo.telephone,
      emergency_contacts_name: ifo.emergency_contacts_name,
      emergency_contacts_phone: ifo.emergency_contacts_phone,
      note: ifo.note,
      avatar: ifo.avatar,
    }),
  });
  console.log("response", response);
  if (response.ok) {
    const result = await response.json();
    console.log("更新成功:", result);
    memberStore.setMember(result.member);
  }
}

onMounted(() => {
  ifo.id = memberStore.id;
  ifo.name = memberStore.name;
  ifo.nickname = memberStore.nickname;
  ifo.gender = memberStore.sex;
  ifo.birthday = memberStore.birthday;
  ifo.address = memberStore.address;
  ifo.email = memberStore.email;
  ifo.password = memberStore.password;
  ifo.telephone = memberStore.telephone;
  ifo.phone = memberStore.phone;
  ifo.emergency_contacts_name = memberStore.contactsName;
  ifo.emergency_contacts_phone = memberStore.contactsPhone;
  ifo.note = memberStore.note;
  ifo.avatar = memberStore.avatar;
  console.log(ifo);
});
</script>
<template>
  <FrontLayout>
    <section class="memberCenter">
      <div class="wrapper">
        <h2>會員中心</h2>
        <!-- 會員管理區 -->
        <div class="memberArea">
          <!-- 左側導覽列 -->
          <div class="user_nav">
            <div class="head-area">
              <div class="avatar-container" @click="handleAvatarClick">
                <!-- 預設圖標顯示區 -->
                <div class="default-avatar" v-show="showDefaultAvatar">
                  <i class="bi bi-person-fill-gear"></i>
                </div>

                <!-- 上傳後的圖片顯示區 -->
                <img
                  class="uploaded-avatar"
                  alt="大頭照"
                  v-show="!showDefaultAvatar"
                  :src="userAvatar"
                />

                <!-- 上傳按鈕覆蓋層 -->
                <div class="upload-overlay">
                  <i class="bi bi-camera-fill"></i>
                </div>

                <!-- 隱藏的檔案輸入 -->
                <input
                  type="file"
                  ref="avatarInput"
                  @change="handleFileChange"
                  accept="image/*"
                  style="display: none"
                />
              </div>

              <p class="nickName">{{ ifo.nickname }}</p>

              <!-- 一開始隱藏的登出鈕 -->
              <button class="logout btn" @click="handleLogout">登出</button>
            </div>

            <ul class="quck_link">
              <li class="active">
                <RouterLink to="/MemberCenter">個人資料</RouterLink>
              </li>
              <li>
                <RouterLink to="/MemberCenter/MyOrders">訂單總覽</RouterLink>
              </li>
              <li>
                <RouterLink to="/MemberCenter/MyCards">我的小卡</RouterLink>
              </li>
              <li>
                <RouterLink to="/MemberCenter/Recipients"
                  >收件者管理</RouterLink
                >
              </li>
              <li class="logout">
                <button class="btn" @click="handleLogout">登出</button>
              </li>
            </ul>
          </div>

          <!-- 右側詳細內容區 -->
          <div class="user_content">
            <h3>個人資料</h3>

            <div class="member-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">姓名</label>
                  <span class="form-text">{{ ifo.name }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">生理性別</label>
                  <div class="radio-group">
                    <label
                      ><input
                        type="radio"
                        name="gender"
                        value="女"
                        v-model="ifo.gender"
                      />
                      女</label
                    >
                    <label
                      ><input
                        type="radio"
                        name="gender"
                        value="男"
                        v-model="ifo.gender"
                      />
                      男</label
                    >
                    <label
                      ><input
                        type="radio"
                        name="gender"
                        value="其他"
                        v-model="ifo.gender"
                      />
                      其他</label
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">生日</label>
                  <span class="form-text">{{ ifo.birthday }}</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">暱稱</label>
                <input
                  type="text"
                  class="form-input"
                  value=""
                  v-model="ifo.nickname"
                />
              </div>

              <div class="form-group">
                <label class="form-label">密碼</label>
                <div class="password-input-container">
                  <input
                    type="password"
                    class="form-input"
                    value=""
                    placeholder="請輸入密碼"
                    v-model="ifo.password"
                  />
                  <span class="password-toggle">
                    <i class="bi bi-eye-slash-fill"></i>
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">新密碼</label>
                <div class="password-input-container">
                  <input
                    type="password"
                    class="form-input"
                    placeholder="至少8-16個英數組成"
                  />
                  <span class="password-toggle">
                    <i class="bi bi-eye-slash-fill"></i>
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">確認新密碼</label>
                <div class="password-input-container">
                  <input
                    type="password"
                    class="form-input"
                    placeholder="至少8-16個英數組成"
                  />
                  <span class="password-toggle">
                    <i class="bi bi-eye-slash-fill"></i>
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">聯絡地址</label>
                <input
                  type="text"
                  class="form-input"
                  value="臺北市中山區南京東路三段"
                  v-model="ifo.address"
                />
              </div>

              <div class="form-group">
                <label class="form-label">電子信箱</label>
                <input
                  type="email"
                  class="form-input"
                  value="AKuan@Tibame.com"
                  v-model="ifo.email"
                />
              </div>

              <div class="form-group">
                <label class="form-label">市內電話</label>
                <input
                  type="tel"
                  class="form-input"
                  value=""
                  v-model="ifo.telephone"
                />
              </div>

              <div class="form-group">
                <label class="form-label">行動電話</label>
                <input
                  type="tel"
                  class="form-input"
                  value=""
                  v-model="ifo.phone"
                />
              </div>

              <div class="form-group">
                <label class="form-label">備用聯絡人-姓名</label>
                <input
                  type="text"
                  class="form-input"
                  value="林榮傑"
                  v-model="ifo.emergency_contacts_name"
                />
              </div>

              <div class="form-group">
                <label class="form-label">備用聯絡人-電話</label>
                <input
                  type="tel"
                  class="form-input"
                  value=""
                  v-model="ifo.emergency_contacts_phone"
                />
              </div>

              <div class="form-group">
                <label class="form-label">備註</label>
                <textarea class="form-textarea" v-model="ifo.note">
罹有糖尿病、三高、重聽、牙口尚可、茹素、喜清淡</textarea
                >
              </div>

              <div class="btn-group">
                <button type="button" class="btn cancel">取消</button>
                <button type="button" class="btn save" @click="update">
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Gotop></Gotop>
  </FrontLayout>
</template>

<style scoped lang="scss">
img {
  display: block;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing_6;
  box-sizing: border-box;
}

.wrapper h2 {
  text-align: center;
  margin-bottom: $spacing_8;
  font-size: $font_h2;
  font-weight: bold;
}

.memberArea {
  display: flex;
  gap: 0;
  align-items: stretch;
}
// 大頭照區

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  cursor: pointer;
}

.default-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: $neutral_700;
  position: absolute;
}

.uploaded-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid black;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.avatar-container:hover .upload-overlay {
  opacity: 1;
  pointer-events: auto;
}

.upload-overlay i {
  font-size: 50px;
  margin-bottom: 4px;
}

/* 左側導覽列 */
.user_nav {
  width: 240px;
  padding: 30px 20px 12px 20px;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: $primary_100;
}

// 大頭照及匿名區
.head-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.head-area img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 1px solid black;
}

.nickName {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

/* 快速連結選單 */
.quck_link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing_4;
  height: 100%;
}

.quck_link li {
  text-align: center;
}

.quck_link a {
  display: block;
  color: $neutral_black;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: $spacing_3 $spacing_10;
  font-weight: bold;
}

.quck_link .active a {
  background-color: $primary_400;
  color: white;
}

.quck_link a:hover {
  background-color: $primary_600;
  color: white;
}

.logout .btn:hover {
  background-color: $primary_950;
}

// 登出鈕

.quck_link li.logout {
  margin-top: auto;
}

.logout .btn {
  background-color: $primary_600;
  color: white;
}

.logout.btn {
  background-color: $primary_600;
  color: white;
}

/* 右側內容區域 */
.user_content {
  flex: 1;
  padding: 30px;
  margin-left: 1rem;
  border-radius: 8px;

  background-color: $primary_100;
}

.user_content h3 {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 25px 0;
}

/* 表單版面配置 */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: $spacing_5;
  box-sizing: border-box;
  padding-top: $spacing_6;
  padding-left: $spacing_8;
  border-radius: 8px;
  background-color: #f6f4ef;
}

.form-row .form-group {
  flex: 1;
}

/* 表單群組 */
.form-group {
  margin-bottom: 20px;
}

/* 表單標籤 */
.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* 表單輸入框 */
.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid $primary_400;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border: 1px solid $primary_600;
  }
}

/* 表單文字顯示 */
.form-text {
  display: block;
  width: 100%;
  padding-top: 12px;
  font-size: 14px;
  box-sizing: border-box;
  min-height: $spacing_6;
}

/* 文字區域 */
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid $primary_400;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border: 1px solid $primary_600;
  }
}

/* 不可改基本資料組 */
.radio-group {
  display: flex;
  gap: $spacing_4;
  margin-top: $spacing_5;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

/* 密碼輸入框容器 */
.password-input-container {
  position: relative;
}

/* 密碼顯示切換按鈕 */
.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

/* 底部按鈕群組 */
.btn-group {
  display: flex;
  gap: $spacing_4;
  margin-top: 30px;
}

/* 按鈕基本樣式 */
.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.cancel {
  color: $neutral_300;
}

.btn.save {
  color: $neutral_white;
  background-color: $primary_400;
}

// 響應式設定

@media (min-width: 800px) {
  .logout.btn {
    display: none;
  }
}

@media (max-width: 800px) {
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing_4;
  }

  .memberArea {
    flex-direction: column;
    gap: $spacing_4;
  }

  .user_nav {
    width: 90%;
    margin-right: 0;
    margin-bottom: $spacing_4;
  }

  /* head-area 橫向排列 */
  .head-area {
    flex-direction: row;
    align-items: center;
    gap: $spacing_10;
    margin-bottom: $spacing_4;
  }

  .avatar-container {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .nickName {
    font-size: 1.6rem;
    margin-left: auto;
  }

  .quck_link {
    flex-direction: row;
    flex-wrap: wrap;
    gap: $spacing_2;
    justify-content: center;
  }

  .quck_link a {
    padding: $spacing_2 $spacing_4;
    font-size: 0.9rem;
  }

  .user_content {
    margin-left: 0;
    padding: $spacing_4;
  }

  .logout .btn {
    display: none;
  }
}

/* 650px 以下 - 隱藏 view-btn */
@media (max-width: 650px) {
  .view-btn {
    display: none;
  }

  .btn-wrapper {
    display: none;
  }
}

/* 480px 以下 - 導覽橫排不換行 */
@media (max-width: 480px) {
  .quck_link {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    justify-content: flex-start;
    padding: $spacing_2 0;
    gap: $spacing_2;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: $primary_400 $primary_100;
  }

  .quck_link::-webkit-scrollbar {
    height: 6px;
  }

  .quck_link::-webkit-scrollbar-track {
    background: $primary_100;
    border-radius: 3px;
  }

  .quck_link::-webkit-scrollbar-thumb {
    background: $primary_400;
    border-radius: 3px;
  }

  .quck_link::-webkit-scrollbar-thumb:hover {
    background: $primary_600;
  }

  .quck_link li {
    flex-shrink: 0;
  }

  .quck_link a {
    white-space: nowrap;
    min-width: max-content;
  }

  .form-row {
    padding-left: 8px;
    padding-right: 8px;
  }
}

/* 400px 以下 - 手機螢幕 */
@media (max-width: 400px) {
  .wrapper {
    padding: $spacing_4;
  }

  .wrapper h2 {
    font-size: 1.8rem;
    margin-bottom: $spacing_4;
  }

  .user_nav {
    padding: $spacing_4;
  }

  .head-area {
    gap: $spacing_8;
  }

  .avatar-container {
    width: 60px;
    height: 60px;
  }

  .default-avatar,
  .uploaded-avatar {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .nickName {
    font-size: 1.4rem;
  }

  .quck_link {
    gap: $spacing_1;
  }

  .quck_link a {
    padding: 10px $spacing_2;
    font-size: 0.8rem;
  }

  .user_content {
    padding: $spacing_3;
  }

  .user_content h3 {
    font-size: 1.8rem;
    margin-bottom: $spacing_3;
  }
}
</style>
