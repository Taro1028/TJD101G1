<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from 'vue-router';

const showDropdown = ref(false);
const isMobileMenuOpen = ref(false);
const isMounted = ref(false);
const isMobile = ref(false);
const dropdownRef = ref(null);

// 切換關於我們下拉選單
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 切換手機側邊選單
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (!isMobileMenuOpen.value) {
    showDropdown.value = false;
  }
};

// 點擊遮罩或外部時收合選單
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  showDropdown.value = false;
};

// 偵測點擊外部關閉 dropdown & 側邊選單
const handleClickOutside = (event) => {
  const clickedOutsideDropdown =
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target) &&
    !event.target.closest(".hamburger");

  const clickedOutsideNav =
    isMobileMenuOpen.value &&
    !event.target.closest(".nav-wrapper") &&
    !event.target.closest(".hamburger");

  if (clickedOutsideDropdown) {
    showDropdown.value = false;
  }

  if (clickedOutsideNav) {
    closeMobileMenu();
  }
};

// 偵測是否為手機寬度
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 820;
};

onMounted(() => {
  isMounted.value = true;
  checkIsMobile();
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
      <img src="../assets/images/Logo_S.svg" alt="logo_s" />
    </router-link>

      <button class="hamburger" :class="{ active: isMobileMenuOpen }" @click="toggleMobileMenu">
        <span></span><span></span><span></span>
      </button>

      <div
        v-if="isMobileMenuOpen"
        class="mobile-backdrop"
        @click="closeMobileMenu"
      ></div>

      <nav class="nav-wrapper" :class="{ open: isMobileMenuOpen }" v-show="!isMobile || isMobileMenuOpen">
        <ul class="header_nav">
            <li><router-link to="/LunchBox">餐盒介紹</router-link></li>
            <li><router-link to="/Order/Select">預約訂餐</router-link></li>
            <li 
                class="dropdown"
                ref="dropdownRef">
                <div>
                <a href="javascript:void(0)"
                    @click.stop="toggleDropdown">
                    關於我們
                </a>
                <ul v-if="showDropdown" class="dropdown-menu">
                    <li><router-link to="/About">理念及目標</router-link></li>
                    <li><router-link to="/About/SmallFarmer">配合小農</router-link></li>
                    <li><router-link to="/About/Cooperation">合作夥伴</router-link></li>
                    <li><router-link to="/About/News">最新消息</router-link></li>
                </ul>
                </div>
            </li>
            <li><router-link to="/Login">登入/註冊</router-link></li>
        </ul>
      </nav>
      
  </header>
</template>


<style>
html, body{
  overflow-x: hidden;
}

</style>

<style scoped lang="scss">
header {
  max-width: 100%;
  height: 60px;
  display: flex;
  padding: 0;
  padding-left: 48px;
  padding-right: 48px;
  justify-content: space-between;
  align-items: center;
  background-color: $primary_100;
  position: relative;
  z-index: 1000;
}

header a {
  display: block;
}

header a .img {
  display: block;
  height: 48px;
}

.header_nav {
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  list-style-type: none;
  gap: 8px;
  position: relative;
}

.header_nav li {
  padding: 8px;
  position: relative;
}

.header_nav li a {
  display: block;
  color: $neutral_black;
  text-decoration: none;
  line-height: 36px;

  &:hover {
    color: $primary_600;
  }
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  left: 0;
  background-color: $primary_100;
  border-radius: 6px;
  padding: 0.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 999;

  li {
    white-space: nowrap;

    a {
      display: block;
      padding: 5px 10px;
      color: $neutral_black;

      &:hover {
        background-color: $primary_50;
        color: $primary_600;
      }
    }
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

.nav-wrapper {
  display: flex;
  z-index: 1000;

  &.open {
    display: block;
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
  }

  .nav-wrapper {
    position: fixed;
    top: 60px;
    right: 0;
    width: 260px;
    height: calc(100vh - 60px);
    padding: 10px;
    background-color: $primary_100;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;

    transform: translateX(100%);
    opacity: 0;
    visibility: hidden;
    z-index: 1000;

    transition: 
      transform 0.4s ease-in-out,
      opacity 0.4s ease-in-out,
      visibility 0.4s ease-in-out;

    &.open {
      transform: translateX(0);
      opacity: 1;
      visibility: visible;
    }
  }

  .header_nav {
    flex-direction: column;

    .dropdown-menu {
      position: static;
      box-shadow: none;
      padding-left: 10px;
    }
  }

  .mobile-backdrop {
    z-index: 999; 
  }
}

</style>
