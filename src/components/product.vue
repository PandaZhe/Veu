<template>
  <section v-if="loading" class="loadingBox">
    <div class="spinner"></div> <!-- 轉圈圈 -->
  </section>

  <section v-else id="outBox">

    <!-- 麵包屑 -->
    <section class="path">
      <h1>
        <span class="span_a" @click="$router.push({ name: 'Home' })">
          首頁
        </span>
        <!-- 菜單 -->
        <template v-if="classID">
          <template v-for="(key, row) in data.path" :key="key.ID">
            <span> > </span>
            <span class="span_a" @click="$router.push({ name: 'Product', query: { class: key.ID } })"
              v-if="row !== data.path.length - 1">
              {{ key.name }}
            </span>
            <span v-else>{{ key.name }}</span>
          </template>
        </template>
        <!-- 查詢 -->
        <template v-else-if="find">
          <span> > 查詢:{{ find }}</span>

        </template>

        <span style="font-size: 15px;">
          ( {{ total }} 款商品)
        </span>
      </h1>
    </section>
    <template v-if="total == 0">
      <div class="total_0">
        <span>目前沒有相關產品</span>
      </div>
    </template>

    <!-- 產品外層 -->
    <section class="cardOut">
      <div class="cardBox"
        v-for="(row) in data.product?.slice((pageNow - 1) * pageShow, (pageNow - 1) * pageShow + pageShow)"
        :key=row.pID>
        <!-- 圖 -->
        <img :src="`${row.imgUrl}`">
        <!-- 名 -->
        <span class="span1">{{ row.pName }}</span>
        <!-- 價格 -->
        <template v-if="row.discount != ''">
          <!-- 原價 -->
          <span class="span2">
            <del>
              ${{ row.price }}
            </del>
          </span>
          <!-- 特價 -->
          <span class="span2_red">
            ${{ row.discount }}
          </span>
        </template>
        <template v-else>
          <span class="span2">
            ${{ row.price }}
          </span>
        </template>
        <div class="butBox">
          <button @click="$router.push(
            { name: 'Goods', query: { pID: row.pID } })">
            了解更多
          </button>
          <button @click="addCart(row.pID)">
            放購物車
          </button>
        </div>
      </div>

    </section>

    <section class="page" v-if="total > pageShow">
      <button @click="pageNow--" :disabled="pageNow == 1">
        上一頁
      </button>

      <form @submit.prevent="in_page">
        <label>
          <span>
            <input type="number" min="1" :max="`${pageAll}`" v-model.number="out_pageNow"> / {{ pageAll }}
          </span>
        </label>
      </form>

      <button @click="pageNow++" :disabled="pageNow == pageAll">
        下一頁
      </button>
    </section>

  </section>

</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { buyCart } from './buyCart';  // 引入購物車

// 定義變數
const { addCart, cart_data } = buyCart();

const route = useRoute();
const errorMessage = ref("");
const loading = ref(true);

const data = ref([]);
const classID = ref("");
const find = ref("");

const pageNow = ref(1);
const out_pageNow = ref(pageNow.value);
const pageAll = ref();
const pageShow = ref(8);
const total = ref();

const in_page = () => {
  pageNow.value = out_pageNow.value;
};

watch(out_pageNow, (newVal) => {
  if (newVal > pageAll.value) {
    out_pageNow.value = pageAll.value;
  } else if (newVal < 1) {
    out_pageNow.value = 1;
  }
});

// 定義 fetchData 函數
const fetchData = async () => {
  loading.value=true;
  errorMessage.value = ""; // 清空錯誤訊息
  data.value = { find: [], class: [] };

  classID.value = route.query.class || "";
  find.value = route.query.find || "";
  let response = null;

  try {
    if (classID.value) {
      response = await axios.get(`http://localhost/API/product.php?class=${classID.value}`);
    } else if (find.value) {
      response = await axios.get(`http://localhost/API/product.php?find=${find.value}`);
    }

    data.value = response.data;   // 獲取資料

    total.value = data.value.product.length;  //總比數
    pageAll.value = Math.ceil(total.value / pageShow.value); //總頁數
    pageNow.value = 1; //重製pageNow

    console.log("data", data.value);

  } catch (error) {
    console.error("請求錯誤:", error);

    // 設置錯誤訊息顯示給用戶
    if (error.response) {
      errorMessage.value = `伺服器錯誤：${error.response.status}`;
    } else if (error.request) {
      errorMessage.value = "無法連接到伺服器，請檢查網絡連接。";
    } else {
      errorMessage.value = "發生未知錯誤，請稍後再試。";
    }
  } finally {
    loading.value = false; // 資料加載結束
  }
}; onMounted(fetchData);

// 監聽 route.query 變化
watch(() => route.query, fetchData, { immediate: true });
</script>


<style scoped>
@import url('../CSS/product.css');
</style>
