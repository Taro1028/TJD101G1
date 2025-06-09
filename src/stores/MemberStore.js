// src/stores/user.js
import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => ({
    id: null,
    name: "",
    sex: "",
    address: "",
    email: "",
    password: "",
    telephone: "",
    phone: "",
    contactsName: "",
    contactsPhone: "",
    birthday: "",
  }),
  actions: {
    // 設定會員資料
    setMember(member) {
      console.log("member", member);
      this.id = member.ID ?? null;
      this.name = member.M_NAME ?? "";
      this.sex = member.GENDER ?? "";
      this.address = member.ADDRESS ?? "";
      this.email = member.EMAIL ?? "";
      this.password = member.PASSWORD ?? "";
      this.telephone = member.TELEPHONE ?? "";
      this.phone = member.PHONE ?? "";
      this.contactsName = member.EMERGENCY_CONTACTS_NAME ?? "";
      this.contactsPhone = member.EMERGENCY_CONTACTS_PHONE ?? "";
      this.birthday = member.BIRTHDAY ?? "";

      // ✅ 存入 localStorage（讓資料刷新也還在）
      localStorage.setItem("member", JSON.stringify(this.$state));
    },

    // 清除會員資料（登出時使用）
    clearUser() {
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

      localStorage.removeItem("member");
    },

    // 從 localStorage 載入（頁面刷新時呼叫）
    loadFromLocalStorage() {
      const savedMember = localStorage.getItem("member");
      if (savedMember) {
        const parsed = JSON.parse(savedMember);//多一個r
        Object.assign(this, parsed);
      }
    },
  },
});
