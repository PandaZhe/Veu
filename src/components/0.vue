<template>
  <section v-if="loading" class="loadingBox">
    <div class="spinner"></div> <!-- 轉圈圈 -->
  </section>

  <section v-else>
    1234321
  </section>

</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
import Swal from "sweetalert2";
import axios from "axios";

const loading = ref(true);
const data = ref([]); // 儲存從後端獲取的資料

const Data = async () => {
  try {
    const response = await axios.get('http://localhost/API/000.php', { withCredentials: true });

    // 設置返回的資料
    data.value = response.data;
    console.log('data', data.value);
  } catch (error) {
    console.error('請求錯誤:', error);
  }
  finally {
    loading.value = false; // API 請求完成後，隱藏轉圈圈
  }
}; onMounted(Data);
</script>


<style scoped></style>
