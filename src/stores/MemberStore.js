// src/stores/MemberStore.js
import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => ({
    // 原有的會員資料
    id: null,
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
  }),

  // ✨ 新增：Getters 用於檢查登入狀態
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
  },

  actions: {
    // ✅ 修改：設定會員資料（保持原有邏輯，加入登入狀態）
    setMember(member) {
      console.log("member", member);

      // 檢查登入是否成功
      if (member.success) {
        // 設定會員資料
        this.id = member.ID ?? null;
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

        // ✨ 新增：設定登入狀態
        this.isLoggedIn = true;

        // ✅ 存入 localStorage（讓資料刷新也還在）
        this.saveToStorage();

        console.log("會員資料設定成功:", this.memberName);
      } else {
        console.error("登入失敗，未收到正確的會員資料");
      }
    },

    // ✨ 新增：更新會員資料
    updateMember(updatedData) {
      Object.keys(updatedData).forEach((key) => {
        if (key in this && updatedData[key] !== undefined) {
          this[key] = updatedData[key];
        }
      });
      this.saveToStorage();
    },

    // ✅ 修改：清除會員資料（登出時使用）- 改名為 logout 更直觀
    logout() {
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

      // ✨ 新增：清除登入狀態
      this.isLoggedIn = false;
      this.success = false;

      this.clearStorage();
      console.log("會員已登出");
    },

    // ✅ 保持原有方法名稱，但內部呼叫 logout
    clearUser() {
      this.logout();
    },

    // ✨ 新增：儲存到 localStorage
    saveToStorage() {
      try {
        sessionStorage.setItem("member", JSON.stringify(this.$state));
      } catch (error) {
        console.error("儲存會員資料到 sessionStorage 失敗:", error);
      }
    },

    // ✅ 修改：從 localStorage 載入（修正原有的 typo：savedMemberr）
    loadFromLocalStorage() {
      try {
        const savedMember = sessionStorage.getItem("member");
        if (savedMember) {
          const parsed = JSON.parse(savedMember); // 修正：savedMemberr -> savedMember
          Object.assign(this, parsed);
          console.log("從 sessionStorage 恢復會員資料:", this.memberName);
          return true;
        }
      } catch (error) {
        console.error("從 sessionStorage 載入會員資料失敗:", error);
        this.clearStorage();
      }
      return false;
    },

    // ✨ 新增：清除 sessionStorage
    clearStorage() {
      try {
        sessionStorage.removeItem("member");
      } catch (error) {
        console.error("清除 sessionStorage 失敗:", error);
      }
    },

    // ✨ 新增：檢查登入狀態（用於應用程式啟動時）
    checkAuthStatus() {
      return this.loadFromLocalStorage();
    },
  },
});
