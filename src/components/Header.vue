<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMemberStore } from "@/stores/memberStore"; // 根據你的檔案路徑調整

const router = useRouter();
const route = useRoute();
const memberStore = useMemberStore();

const showAboutDropdown = ref(false);
const showMemberDropdown = ref(false);
const isMobileMenuOpen = ref(false);
const isMounted = ref(false);
const isMobile = ref(false);
const aboutDropdownRef = ref(null);
const memberDropdownRef = ref(null);

// 使用 Pinia store 的資料
const isLoggedIn = computed(() => !!memberStore.id);

// ✨ 修改：使用 memberStore 的 getter 取得頭像
const userAvatar = computed(() => memberStore.userAvatar);

const userName = computed(() => memberStore.name || "會員");
// // 登出功能
// const logout = () => {
//   memberStore.clearUser(); // 使用 store 的清除方法
//   showMemberDropdown.value = false;
//   closeMobileMenu();
//   router.push('/Home');
// };

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

// 關於我們下拉選單
const toggleAboutDropdown = () => {
  showAboutDropdown.value = !showAboutDropdown.value;
  showMemberDropdown.value = false; // 關閉其他下拉選單
};

// 會員下拉選單
const toggleMemberDropdown = () => {
  showMemberDropdown.value = !showMemberDropdown.value;
  showAboutDropdown.value = false; // 關閉其他下拉選單
};

// 切換手機側邊選單
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (!isMobileMenuOpen.value) {
    showAboutDropdown.value = false;
    showMemberDropdown.value = false;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  showAboutDropdown.value = false;
  showMemberDropdown.value = false;
};

const handleClickOutside = (event) => {
  const clickedOutsideAboutDropdown =
    aboutDropdownRef.value &&
    !aboutDropdownRef.value.contains(event.target) &&
    !event.target.closest(".hamburger");

  const clickedOutsideMemberDropdown =
    memberDropdownRef.value &&
    !memberDropdownRef.value.contains(event.target) &&
    !event.target.closest(".hamburger");

  const clickedOutsideNav =
    isMobileMenuOpen.value &&
    !event.target.closest(".nav-wrapper") &&
    !event.target.closest(".hamburger");

  if (clickedOutsideAboutDropdown) {
    showAboutDropdown.value = false;
  }

  if (clickedOutsideMemberDropdown) {
    showMemberDropdown.value = false;
  }

  if (clickedOutsideNav) {
    closeMobileMenu();
  }
};

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 820;
};

onMounted(() => {
  isMounted.value = true;
  checkIsMobile();
  memberStore.loadFromLocalStorage();
  window.addEventListener("resize", checkIsMobile);
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header>
    <router-link to="/Home">
      <img src="../assets/images/Logo_S.svg" alt="logo_s" class="logo" />
    </router-link>

    <button
      class="hamburger"
      :class="{ active: isMobileMenuOpen }"
      @click="toggleMobileMenu"
    >
      <span></span><span></span><span></span>
    </button>

    <div
      v-if="isMobileMenuOpen"
      class="mobile-backdrop"
      @click="closeMobileMenu"
    ></div>

    <nav
      class="nav-wrapper"
      :class="{ open: isMobileMenuOpen }"
      v-show="!isMobile || isMobileMenuOpen"
    >
      <ul class="header_nav">
        <!-- 主要導航項目 -->
        <li class="nav-item">
          <router-link
            to="/LunchBox"
            :class="{ active: route.path === '/LunchBox' }"
          >
            餐盒介紹
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/Order/Select"
            :class="{ active: route.path === '/Order/Select' }"
          >
            預約訂餐
          </router-link>
        </li>
        <li class="nav-item dropdown" ref="aboutDropdownRef">
          <div>
            <a
              href="javascript:void(0)"
              @click.stop="toggleAboutDropdown"
              :class="{ active: route.path.startsWith('/About') }"
            >
              關於我們
            </a>
            <ul v-if="showAboutDropdown" class="dropdown-menu">
              <li>
                <router-link
                  to="/About"
                  :class="{ active: route.path === '/About' }"
                  >理念及目標</router-link
                >
              </li>
              <li>
                <router-link
                  to="/About/SmallFarmer"
                  :class="{ active: route.path === '/About/SmallFarmer' }"
                  >配合小農</router-link
                >
              </li>
              <li>
                <router-link
                  to="/About/Cooperation"
                  :class="{ active: route.path === '/About/Cooperation' }"
                  >合作夥伴</router-link
                >
              </li>
              <li>
                <router-link
                  to="/About/News"
                  :class="{ active: route.path === '/About/News' }"
                  >最新消息</router-link
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <ul class="header_nav_right">
        <li v-if="!isLoggedIn" class="nav-item">
          <router-link to="/Login" :class="{ active: route.path === '/Login' }"
            >登入/註冊</router-link
          >
        </li>
        <template v-else>
          <li class="nav-item dropdown member-dropdown" ref="memberDropdownRef">
            <div>
              <a href="javascript:void(0)" @click.stop="toggleMemberDropdown">
                <img :src="userAvatar" alt="會員頭像" class="avatar" />
              </a>
              <ul v-if="showMemberDropdown" class="dropdown-menu member-menu">
                <li>
                  <router-link
                    to="/MemberCenter"
                    :class="{ active: route.path === '/MemberCenter' }"
                    >會員中心</router-link
                  >
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    @click="handleLogout"
                    class="logout-btn"
                    >登出</a
                  >
                </li>
              </ul>
            </div>
          </li>
          <li class="nav-item cart-item">
            <router-link to="/Cart">
              <i class="bi bi-cart3"></i>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  max-width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $primary_100;
  position: relative;
  z-index: 1000;
}

header a {
  display: block;
}

header a img {
  display: block;
  height: 48px;
}

.logo {
  margin-left: 40px;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  z-index: 1000;

  &.open {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
}

.header_nav,
.header_nav_right {
  padding: 0;
  margin: 0;
  display: flex;
  list-style-type: none;
  position: relative;
}

.header_nav_right {
  margin-left: auto;
}

.nav-item {
  padding-left: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;

  a {
    display: block;
    color: $neutral_black;
    text-decoration: none;
    line-height: 60px;

    &:hover {
      color: $primary_600;
    }

    &.active {
      color: $primary_600;
    }
  }

  i {
    font-size: $font_h4;
    margin-right: 20px;
    cursor: pointer;

    &:hover {
      color: $primary_600;
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  left: 0;
  background-color: $primary_100;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 999;
  min-width: 120px;

  li {
    white-space: nowrap;

    a {
      display: block;
      text-align: center;
      color: $neutral_black;

      &:hover {
        background-color: $primary_50;
        color: $primary_600;
      }

      &.active {
        color: $primary_600;
      }
    }
  }
}

.member-dropdown {
  .dropdown-menu {
    right: 0;
  }
}

.member-menu {
  .logout-btn {
    color: #dc3545;

    &:hover {
      background-color: $primary_50;
      color: #dc3545;
    }
  }
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid $neutral_black;
  object-fit: cover;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: $primary_600;
  }
}

.hamburger {
  width: 40px;
  height: 24px;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;

  span {
    display: block;
    width: 100%;
    height: 4px;
    background: $neutral_black;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-9px, 3px);
  }
  &.active span:nth-child(2) {
    opacity: 0;
  }
  &.active span:nth-child(3) {
    transform: rotate(45deg) translate(-9px, -4px);
  }
}

.mobile-backdrop {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

@media (max-width: 820px) {
  .hamburger {
    display: flex;
    margin-right: 20px;
  }

  .nav-wrapper {
    position: fixed;
    top: 60px;
    right: 0;
    width: 280px;
    height: calc(100vh - 60px);
    padding: 20px;
    background-color: $primary_100;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;

    transform: translateX(100%);
    opacity: 0;
    visibility: hidden;
    z-index: 1000;

    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out,
      visibility 0.4s ease-in-out;

    &.open {
      transform: translateX(0);
      opacity: 1;
      visibility: visible;
    }
  }

  .header_nav {
    flex-direction: column;
    width: 100%;
    gap: 0;
    text-align: center;
  }

  .header_nav_right {
    order: -1;
    border-bottom: 1px solid $neutral_300;
    flex-direction: column;
    width: 100%;
    gap: 0;
  }

  .nav-item {
    padding: 12px 8px;
    margin-right: 0;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    background-color: $primary_50;
    width: 300px;
    border-radius: 0;
    margin-top: 8px;

    li {
      white-space: nowrap;

      a {
        display: block;
        text-align: center;
        color: $neutral_black;

        &:hover {
          background-color: $primary_50;
          color: $primary_600;
        }

        &.active {
          color: $primary_600;
        }
      }
    }
  }

  .member-dropdown .dropdown-menu {
    right: auto;
    left: 0;
  }

  .avatar {
    margin: 0 auto;
  }

  .nav-item .dropdown li a {
    margin: 0 auto;
  }
  .cart-item i {
    margin-right: 0px;
  }
}
</style>
