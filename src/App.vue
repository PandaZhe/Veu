<template>
  <section id="APP">
    <!-- 頁首 -->
    <Header></Header>

    <!-- Vue Router 渲染當前頁面 -->
    <router-view></router-view>

    <!-- 頁尾 -->
    <Footer></Footer>
  </section>
</template>



<script setup>

import Header from './components/header.vue';
import Footer from './components/footer.vue';
</script>




<style></style>
