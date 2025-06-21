// src/stores/MemberStore.js
import { defineStore } from "pinia";

export const useAdminMemberStore = defineStore("adminMember", {
  state: () => ({
    // 原有的會員資料
    id: null,
    username: "",
    password: "",
  }),
 getters: {
    isAuthenticated: (state) => !!state.id,
  },
  actions: {
    // 設定會員資料（登入時呼叫）
    setAdminMember(member) {
      console.log("PAdminmember", member);

      // 檢查登入是否成功
      if (member) {
        // 設定會員資料
        this.id = member.ID ?? null;
        this.username = member.A_NAME ?? "";
        this.password = member.A_PASSWORD ?? "";
        // 儲存到 sessionStorage

        this.saveTosessionStorage();
        console.log("會員資料設定成功:", this.member);
      } else {
        console.error("登入失敗，未收到正確的會員資料");
      }
      console.log(
        `會員 ${this.name} 登入成功，頭像狀態:`,
        this.avatar ? "自訂頭像" : "預設頭像"
      );
    },

    loadFromsessionStorage() {
      try {
        const savedData = sessionStorage.getItem("adminMemberData");
        if (savedData) {
          const memberData = JSON.parse(atob(savedData));

          // 只有在有登入狀態時才載入資料
          if (memberData) {
            this.id = memberData.id ?? null;
            this.username = memberData.username ?? "";
            this.password = memberData.password ?? "";

            console.log(`從 sessionStorage 恢復會員 ${this.id} 的資料`);
            return true;
          }
        }
      } catch (error) {
        console.error("從 sessionStorage 載入會員資料失敗:", error);
        this.clearsessionStorage();
      }
      return false;
    },

    // ✅ 修正：登出方法（不清除頭像儲存）
    logout() {
      // 清除所有會員資料
      this.id = null;
      this.username = "";
      this.password = "";

      console.log("後台會員已登出");
    },

    //清除 sessionStorage
    clearsessionStorage() {
      try {
        sessionStorage.removeItem("adminMemberData");
      } catch (error) {
        console.error("清除 sessionStorage 失敗:", error);
      }
    },
    // ✨ 新增：檢查登入狀態（用於應用程式啟動時）
    checkAuthStatus() {
      return this.loadFromsessionStorage();
    },
    saveTosessionStorage() {
      try {
        const adminMemberData = {
          id: this.id,
          username: this.username,
          password: this.password,
        };
        sessionStorage.setItem(
          "adminMemberData",
          btoa(JSON.stringify(adminMemberData))
        );
      } catch (error) {
        console.error("儲存後台會員資料到 sessionStorage 失敗:", error);
      }
    },
  },
});
