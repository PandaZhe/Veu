<template>
  <section id="content" v-if="data.product">
    <section id="outBox">

      <!-- 麵包屑 -->
      <section id="path">
        <h1>
          <span class="span_a" @click="$router.push({ name: 'Home' })">
            首頁
          </span>
          <template v-for="(row) in data.path" :key="row.ID">
            <span> > </span>
            <span class="span_a" @click="$router.push({ name: 'Product', query: { class: row.ID } })">
              {{ row.name }}
            </span>
          </template>
          <span> > {{ data.product.pName }}</span>

        </h1>
      </section>


      <!-- 產品 -->
      <section class="productBox">
        <div class="cardBox">
          <!-- 左 -->
          <div class="imgBox w_4">
            <div class="big">
              <img :src="img_bigSrc" id="img_big">
            </div>
            <div class="small">
              <template v-for="row in data.img" :key="row.piID">
                <img :src="`${row.imgUrl}`" @click="img_bigSrc = `${row.imgUrl}`">
              </template>
            </div>
          </div>
          <!-- 右 -->
          <div class="textBox w_8">
            <span class="span1">
              {{ data.product.pName }}
            </span>
            <template v-if="data.product.discount == ''">
              <span class="span2">原價:{{ data.product.price }}</span>
            </template>
            <template v-else>
              <span class="span2">
                <del>
                  原價:{{ data.product.price }}
                </del>
              </span>
              <span class="span2_red">
                特價:{{ data.product.discount }}
              </span>
            </template>


            <form name="car" @submit.prevent="submitCart(data.product.pID, qty)">
              <label>
                <span>數量</span>
                <input type="number" min=1 max=50 v-model.number="qty">
              </label>

              <button type="submit"> 加入購物車</button>
            </form>

          </div>
        </div>

      </section>



    </section>

  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import { buyCart } from './buyCart';  // 引入購物車

// 定義變數
const { addCart, cart_data } = buyCart();
const qty = ref(1);

const route = useRoute();

const data = ref([]);
const img_bigSrc = ref('');

const submitCart = async (pID, qty) => {

  const btn = await Swal.fire({
    // 禁止點擊外部關閉視窗
    allowOutsideClick: false,
    title: '加入購物車',
    text: `確定要把此商品加入購物車?(${qty}個)`,
    // success:V,error:X,warning:!,info:水藍i,question:?
    icon: "question",
    // 按鈕出現
    showConfirmButton: true,
    showCancelButton: true,
    // 按鈕背景色
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    // 按鈕文字
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  });

  if (btn.isConfirmed) {
    addCart(pID, qty)
  } else {
    Swal.fire({
    // 禁止點擊外部關閉視窗
    allowOutsideClick: false,
    title: '取消加入購物車',
    // text: '',
    // success:V,error:X,warning:!,info:水藍i,question:?
    icon: "info",
    // 按鈕出現
    showConfirmButton: true,
    // 按鈕背景色
    confirmButtonColor: "#3085d6",
    // 按鈕文字
    confirmButtonText: "確定",
  });
  }

}

const findGoods = async () => {
  try {
    // 找pID查詢參數
    const goods_pID = route.query.pID || "1";

    const response = await axios.get(`http://localhost/API/goods.php?pID=${goods_pID}`);

    data.value = response.data;
    img_bigSrc.value = `${data.value.img[0].imgUrl}`;
    // alert(data.value);
    console.log('data', data.value);
  } catch (error) {
    console.error("錯誤!:", error);
    alert('錯誤！', error);
  }
};

// 監聽 route.query 變化
watch(() => route.query, findGoods, { immediate: true });
// 組件載入時執行
// onMounted(findGoods);
</script>


<style scoped>
@import url('../CSS/goods.css');
</style>
