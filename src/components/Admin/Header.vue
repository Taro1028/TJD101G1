<template>
  <div>
    <section>
      <img src="../../assets/images/Logo_S.svg" alt="" />
      <p class="word">後台中心</p>
      <section class="s2">
        <p class="sname">{{ `Hello: ${Adminmember.username}` }}</p>
        <button @click="logoutadmember">登出</button>
      </section>
      <!-- <img src="../../assets/images/Admin/userphoto.png" alt="" /> -->
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAdminMemberStore } from "../../stores/AdminMemberStore";
import { useRouter } from "vue-router";

const router = useRouter();
const Adminmember = useAdminMemberStore();

function logoutadmember() {
  Adminmember.logout();
  router.push("/adminLogin");
}

onMounted(() => {
  Adminmember.loadFromsessionStorage();
});
</script>

<style lang="scss" scoped>
section {
  display: flex;

  background-color: $primary_100;
  padding: 0px 10px 0px 30px;
}
// section img{
//   width: 10%;
// }
section .word {
  font-size: $font_h5;
  display: flex;
  align-items: center;
  margin: 0;
}
section img:nth-of-type(2) {
  width: 60px;
  border-radius: 50%;
  margin-left: auto;
  padding: 10px;
}
.s2 {
  // border: 1px solid red;
  width: 70%;
  display: flex;
  margin-left: 260px;
  justify-content: end;
  align-items: center;
  gap: 20px;
}
section .sname {
  // border: 1px solid blue;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: black;
  margin: 0;
}
</style>
