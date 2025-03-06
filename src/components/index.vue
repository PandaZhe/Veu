<template>
  <section v-if="loading" class="loadingBox">
    <div class="spinner"></div> <!-- 轉圈圈 -->
  </section>

  <section id="content" v-else>
    <template v-for="(row_c) in Class" :key="row_c.classID">
      <div class="m_main">
        <div class="bigImgBox" @click="show(row_c.classID)">
          <img :src="`${row_c.imgName}`" :title="`${row_c.className}熱銷產品`">
          <div class="div_text">
            <h1>{{ row_c.text_h }}</h1>
            <p>
              {{ row_c.text_p }}
            </p>
          </div>
        </div>

        <div class="m_toB" :style="{ maxHeight: showDetails[row_c.classID] ? '5000px' : '' }">
          <div class="hot_text">
            熱銷商品
          </div>

          <template v-for="(row_h) in Hot" :key="row_h.pID">
            <div class='card1' v-if="(row_h.findClass == row_c.classID)">
              <img :src="`${row_h.imgName}`">
              <span class="span1">
                {{ row_h.pName }}
              </span>

              <template v-if="row_h.discount != 0">
                <!-- 原價 -->
                <span class="span2">
                  <del>
                    ${{ row_h.price }}
                  </del>
                </span>
                <!-- 特價 -->
                <span class="span2_red">
                  ${{ row_h.discount }}
                </span>
              </template>
              <template v-else>
                <span class="span2">
                  ${{ row_h.price }}
                </span>
              </template>

              <div class="butBox">
                <button @click="$router.push({ name: 'Goods', query: { pID: row_h.pID } })">
                  了解更多
                </button>
              </div>
            </div>
          </template>

        </div>


      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// 存資料
const loading = ref(true);
const Class = ref([]); // 用來儲存從後端獲取的用戶資料
const Hot = ref([]);
const showDetails = ref({}); // 控制每個 class 的 m_toB 顯示狀態

// 顯示或隱藏 m_toB
const show = (classID) => {
  showDetails.value[classID] = !showDetails.value[classID];
};

// 當組件載入後，向後端請求用戶資料

const indexDate = async () => {
  try {
    const response = await axios.get("http://localhost/API/index-1.php", { withCredentials: true });

    // 設置 class 為回應的數據
    Class.value = response.data.class;
    Hot.value = response.data.hot;

    Class.value.forEach((row) => {
      showDetails.value[row.classID] = false;
    });

    console.log("response", response.data);
  } catch (error) {
    console.error("錯誤內容:", error);
  } finally {
    loading.value = false; // API 請求完成後，隱藏轉圈圈
  }
};onMounted(indexDate);
</script>





<style scoped>
@import url('../CSS/index.css');

</style>
