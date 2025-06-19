// src/stores/MemberStore.js
import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => ({
    // 原有的會員資料
    id: null,
    lineid: "",   // LINE
    name: "",
    nickname: "",
    sex: "",
    address: "",
    email: "",
    password: "",
    telephone: "",
    phone: "",
    contactsName: "",
    contactsPhone: "",
    birthday: "",
    avatar: "",
    note: "",

    // ✨ 新增：登入狀態管理
    isLoggedIn: false,
    success: false,

    // ✨ 新增：響應式的會員頭像儲存 (解決響應式問題)
    memberAvatars: {},
  }),

  // ✨ 修正：Getters 用於檢查登入狀態
  getters: {
    // 檢查是否已登入
    isAuthenticated: (state) => state.isLoggedIn && state.id !== null,

    // 取得會員姓名
    memberName: (state) => state.name || "",

    // 取得會員 email
    memberEmail: (state) => state.email || "",

    // 取得會員 ID
    memberId: (state) => state.id,

    // 檢查會員資料是否完整
    isProfileComplete: (state) => {
      return state.name && state.email && state.phone && state.address;
    },

    // ✨ 修正：取得頭像，現在是完全響應式的
    userAvatar: (state) => {
      // 優先使用 state 中的響應式頭像儲存
      if (state.id && state.memberAvatars[state.id]) {
        return state.memberAvatars[state.id];
      }

      // 如果沒有儲存的頭像，使用 avatar 欄位
      if (state.avatar) {
        return state.avatar;
      }

      // 最後使用預設頭像
      return new URL("../assets/images/Member/person-fill.svg", import.meta.url)
        .href;
    },

    // ✨ 修正：檢查是否有自訂頭像，現在是完全響應式的
    hasCustomAvatar: (state) => {
      if (state.id && state.memberAvatars[state.id]) {
        return true;
      }
      return !!state.avatar;
    },
  },

  actions: {
    // 設定會員資料（登入時呼叫）
    setMember(member) {
      console.log("member", member);

      

      // 檢查登入是否成功
      if (member.success) {
        // 設定會員資料
        this.id = member.ID ?? null;
        this.lineid = member.LINE_ID ?? "";
        this.name = member.M_NAME ?? "";
        this.nickname = member.NICKNAME ?? "";
        this.sex = member.GENDER ?? "";
        this.address = member.ADDRESS ?? "";
        this.email = member.EMAIL ?? "";
        this.password = member.PASSWORD ?? "";
        this.telephone = member.TELEPHONE ?? "";
        this.phone = member.PHONE ?? "";
        this.contactsName = member.EMERGENCY_CONTACTS_NAME ?? "";
        this.contactsPhone = member.EMERGENCY_CONTACTS_PHONE ?? "";
        this.birthday = member.BIRTHDAY ?? "";
        this.avatar = member.AVATAR ?? "";
        this.note = member.NOTE ?? "";
        this.success = member.success;

        // ✨ 修正：載入會員頭像到響應式 state
        this.loadMemberAvatars();

        // 優先使用本地儲存的頭像，沒有才用伺服器的
        const savedAvatar = this.memberAvatars[this.id];
        this.avatar = savedAvatar || member.AVATAR || "";

        // 設定登入狀態
        this.isLoggedIn = true;
        this.success = true;

        // 儲存到 sessionStorage
        this.saveTosessionStorage();
        console.log("會員資料設定成功:", this.memberName);
      } else {
        console.error("登入失敗，未收到正確的會員資料");
      }
      console.log(
        `會員 ${this.name} 登入成功，頭像狀態:`,
        this.avatar ? "自訂頭像" : "預設頭像"
      );
    },

    // ✨ 修正：更新頭像方法（完全響應式）
    updateAvatar(avatarData) {
      if (!this.id) {
        console.error("無法更新頭像：會員未登入");
        return;
      }

      // ✨ 關鍵修正：同時更新 state 和 sessionStorage
      this.avatar = avatarData;

      // 更新響應式的會員頭像儲存
      this.memberAvatars[this.id] = avatarData;

      // 同步到 sessionStorage
      this.saveMemberAvatars();

      // 同步更新會員資料的 sessionStorage
      this.saveTosessionStorage();

      console.log(`會員 ${this.id} 的頭像已更新並永久儲存`);

      // ✨ 新增：設定登入狀態
      this.isLoggedIn = true;

      // ✅ 存入 sessionStorage（讓資料刷新也還在）
      this.saveTosessionStorage(); //改
    },

    // ✨ 新增：更新會員資料
    updateMember(updatedData) {
      Object.keys(updatedData).forEach((key) => {
        if (key in this && updatedData[key] !== undefined) {
          this[key] = updatedData[key];
        }
      });
      this.saveTosessionStorage(); //改
    },

    // ✨ 修正：重置頭像為預設（完全響應式）
    resetAvatar() {
      if (!this.id) {
        console.error("無法重置頭像：會員未登入");
        return;
      }

      // ✨ 關鍵修正：同時更新 state 和 sessionStorage
      this.avatar = "";

      // 從響應式的會員頭像儲存中移除
      delete this.memberAvatars[this.id];

      // 同步到 sessionStorage
      this.saveMemberAvatars();

      this.saveTosessionStorage();

      console.log(`會員 ${this.id} 的頭像已重置為預設`);

      // 這裡之後可以加入 API 呼叫，刪除伺服器上的頭像
      // 例如：await this.deleteAvatarFromServer();
    },

    // ✨ 新增：載入所有會員頭像到響應式 state
    loadMemberAvatars() {
      try {
        const saved = sessionStorage.getItem("memberAvatars");
        this.memberAvatars = saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error("載入會員頭像失敗:", error);
        this.memberAvatars = {};
      }
    },

    // ✨ 新增：儲存響應式會員頭像到 sessionStorage
    saveMemberAvatars() {
      try {
        sessionStorage.setItem(
          "memberAvatars",
          JSON.stringify(this.memberAvatars)
        );
      } catch (error) {
        console.error("儲存會員頭像失敗:", error);
      }
    },

    // ✨ 保留：為特定會員儲存頭像（向下相容）
    saveAvatarForMember(memberId, avatarData) {
      // 更新響應式 state
      this.memberAvatars[memberId] = avatarData;
      // 同步到 sessionStorage
      this.saveMemberAvatars();
    },

    // ✨ 保留：取得特定會員的儲存頭像（向下相容）
    getSavedAvatarForMember(memberId) {
      return this.memberAvatars[memberId] || null;
    },

    // ✨ 保留：清除特定會員的儲存頭像（向下相容）
    clearAvatarForMember(memberId) {
      delete this.memberAvatars[memberId];
      this.saveMemberAvatars();
    },

    // ✨ 保留：取得所有儲存的頭像資料（向下相容）
    getAllSavedAvatars() {
      return this.memberAvatars;
    },

    // ✅ 修正：登出方法（不清除頭像儲存）
    logout() {
      // 清除所有會員資料
      this.id = null;
      this.name = "";
      this.sex = "";
      this.address = "";
      this.email = "";
      this.password = "";
      this.telephone = "";
      this.phone = "";
      this.contactsName = "";
      this.contactsPhone = "";
      this.birthday = "";
      this.avatar = ""; // 清除當前頭像，但不清除儲存的頭像
      this.isLoggedIn = false;
      this.success = false;

      // ✨ 重要：不清除 memberAvatars，讓頭像儲存保持永久

      // 清除 sessionStorage 中的會員資料，但保留頭像儲存
      this.clearsessionStorage();

      console.log("會員已登出，頭像儲存保留");
    },

    // ✨ 修正：儲存到 sessionStorage
    saveTosessionStorage() {
      try {
        const memberData = {
          id: this.id,
          lineid: this.lineid,
          name: this.name,
          nickname: this.nickname,
          note: this.note,
          sex: this.sex,
          address: this.address,
          email: this.email,
          password: this.password,
          telephone: this.telephone,
          phone: this.phone,
          contactsName: this.contactsName,
          contactsPhone: this.contactsPhone,
          birthday: this.birthday,
          avatar: this.avatar,
          isLoggedIn: this.isLoggedIn,
          success: this.success,
          // ✨ 注意：不儲存 memberAvatars，因為它有專門的儲存方法
        };
        sessionStorage.setItem("memberData", JSON.stringify(memberData));
      } catch (error) {
        console.error("儲存會員資料到 sessionStorage 失敗:", error);
      }
    },

    // ✨ 修正：從 sessionStorage 載入
    loadFromsessionStorage() {
      try {
        const savedData = sessionStorage.getItem("memberData");
        if (savedData) {
          const memberData = JSON.parse(savedData);

          // 只有在有登入狀態時才載入資料
          if (memberData.isLoggedIn) {
            this.id = memberData.id;
            this.lineid = memberData.lineid;
            this.name = memberData.name;
            this.nickname = memberData.nickname ?? "";
            this.note = memberData.note ?? "";
            this.sex = memberData.sex;
            this.address = memberData.address;
            this.email = memberData.email;
            this.password = memberData.password;
            this.telephone = memberData.telephone;
            this.phone = memberData.phone;
            this.contactsName = memberData.contactsName;
            this.contactsPhone = memberData.contactsPhone;
            this.birthday = memberData.birthday;
            this.isLoggedIn = memberData.isLoggedIn;
            this.success = memberData.success;

            // ✨ 修正：載入會員頭像到響應式 state
            this.loadMemberAvatars();

            // 優先使用儲存的頭像
            const savedAvatar = this.memberAvatars[memberData.id];
            this.avatar = savedAvatar || memberData.avatar;

            console.log(`從 sessionStorage 恢復會員 ${this.name} 的資料`);
            return true;
          }
        }
      } catch (error) {
        console.error("從 sessionStorage 載入會員資料失敗:", error);
        this.clearsessionStorage();
      }
      return false;
    },

    // ✨ 修正：清除 sessionStorage（但保留頭像儲存）
    clearsessionStorage() {
      try {
        sessionStorage.removeItem("memberData");
        // 注意：不清除 'memberAvatars'，讓頭像儲存保持永久
      } catch (error) {
        console.error("清除 sessionStorage 失敗:", error);
      }
    },

    // ✨ 修正：完全清除所有資料（包含頭像，供測試或特殊需求使用）
    clearAllData() {
      try {
        sessionStorage.removeItem("memberData");
        sessionStorage.removeItem("memberAvatars");
        this.memberAvatars = {};
        console.log("所有會員資料已清除（包含頭像儲存）");
      } catch (error) {
        console.error("清除所有資料失敗:", error);
      }
    },
    // ✨ 新增：檢查登入狀態（用於應用程式啟動時）
    checkAuthStatus() {
      return this.loadFromsessionStorage();
    },
  },
});