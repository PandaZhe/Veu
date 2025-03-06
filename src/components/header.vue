<template>
  <section id="header">
    <!-- logo -->
    <div class="logo" title="首頁">
      <router-link :to="{ name: 'Home' }">
        <i class="bi bi-bicycle"></i>
      </router-link>
    </div>

    <!-- 菜單 -->
    <div class="menu">
      <template v-for="(row_1) in Class_1" :key="row_1.classID">
        <!-- 1 -->
        <div class="m_main" v-if="row_1.level == 1">
          <router-link :to="{ name: 'Product', query: { class: row_1.classID } }">
            {{ row_1.className }}
          </router-link>

          <div class="m_toB">
            <!-- 2 -->
            <template v-for="(row_2) in Class_2" :key="row_2.classID">
              <div v-if="(row_2.level == 2) && (row_2.find_class == row_1.classID)">
                <router-link :to="{ name: 'Product', query: { class: row_2.classID } }">
                  {{ row_2.className }}
                </router-link>
              </div>
            </template>
          </div>

        </div>
      </template>
    </div>

    <!-- 查詢 -->
    <form @submit.prevent="search()">
      <input type="text" name="find" minlength="1" v-model="find">
      <button type="submit">搜尋</button>
    </form>

    <!-- 會員 -->
    <div class="member M_m" tabindex="0">
      <i class="bi bi-person-circle" title="會員" v-if="!member.imgSrc"></i>
      <img :src="`${member.imgSrc}`" title="會員" v-else>

      <section class="M_b">
        <div @click="$router.push({ name: 'Login' })">
          {{ userName }}
        </div>

        <div @click="$router.push({ name: 'Buylist' })">
          購物車
        </div>

        <div v-if="loginCK" @click="logOut()">
          登出
        </div>
      </section>

    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
import axios from "axios";
import Swal from "sweetalert2";

const find = ref(""); // 綁定搜尋框的值
const userName = ref("登入/註冊");
const loginCK = ref();
const member = ref([]);
const Class_1 = ref([]);
const Class_2 = ref([]);
// 搜尋
const search = () => {
  if (find.value.trim() != "") {
    router.push({ name: "Product", query: { find: find.value } });
  }
};
// 登出
const logOut = async () => {
  try {
    const response = await axios.get("http://localhost/API/logout.php", { withCredentials: true });

    await Swal.fire({
      // 禁止點擊外部關閉視窗
      allowOutsideClick: false,
      title: '登出成功',
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "確定",
    });
    router.go(0);
  } catch (error) {
    console.error("錯誤內容:", error);
  }
};

const headerDate = async () => {
  try {
    const response = await axios.get("http://localhost/API/header.php", { withCredentials: true });
    console.log("header", response.data);
    const classData = response.data.class;

    Class_1.value = classData.filter((item) => item.level == 1);
    Class_2.value = classData.filter((item) => item.level == 2);
    
    member.value = response.data.member;
    loginCK.value = member.value.login;

    // 登入?
    if (loginCK.value) {
      userName.value = `嗨!${member.value.name}`;
    }
  } catch (error) {
    console.error("錯誤內容:", error);
  }
};

// 監聽 route.query 變化
watch(() => route.query, headerDate, { immediate: true });
</script>


<style scoped>
@import url("../CSS/header.css");
</style>