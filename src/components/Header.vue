<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const showDropdown = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

</script>

<template>
  <header>
    <router-link to="/Home">
      <img src="../assets/images/Logo_S.svg" alt="logo_s" />
    </router-link>

        <ul class="header_nav">
            <li><router-link to="/LunchBox">餐盒介紹</router-link></li>
            <li><router-link to="/Order">預約訂餐</router-link></li>
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
            <li><router-link to="/Member">登入/註冊</router-link></li>
        </ul>
      
  </header>
</template>


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
</style>
