<template>
  <section id="BOX">
    <section id="path">
      <div>購物車</div>
    </section>

    <section id="cart">
      <template v-if="data.list != ''">
        <div class="butBox">
          <button class="bgc1" @click="$router.push({ name: 'Home' })">
            繼續購物
          </button>
          <button class="bgc2" @click="goBack">
            回上一頁
          </button>
          <button class="bgc3" @click="CartPutDel('put', data.list)">
            全部購買
          </button>
          <button class="bgc4" @click="CartPutDel('del', data.list)">
            全部取消
          </button>
        </div>

        <table class="table1">
          <thead>
            <tr>
              <th style="width: 5%;">編號</th>
              <th style="width: 15%;">圖片</th>
              <th style="width: 15%;">名稱</th>
              <th style="width: 10%;">價格</th>
              <th style="width: 10%;">數量</th>
              <th style="width: 10%;">小計</th>
              <th style="width: 15%;">下次再買</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, num) in data.list" :key="row.buyID">
              <tr>
                <!-- 1 -->
                <td>{{ num + 1 }}</td>
                <!-- 2 -->
                <td><img :src="`${row.imgUrl}`"></td>
                <!-- 3 -->
                <td>{{ row.pName }}</td>
                <!-- 4 -->
                <td>
                  <template v-if="row.discount == ''">
                    <span class="span1">
                      ${{ row.price }}
                    </span>
                  </template>
                  <template v-else>
                    <del>
                      ${{ row.price }}
                    </del>
                    <br>
                    <span class="span1">
                      ${{ row.discount }}
                    </span>
                  </template>
                </td>
                <!-- 5 -->
                <td>
                  <form>
                    <input type="number" min="1" max="50" v-model="row.buy_qty">
                  </form>
                </td>
                <!-- 6 -->
                <td>
                  <template v-if="row.discount == ''">
                    <span class="span1">
                      ${{ row.price * row.buy_qty }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="span1">
                      ${{ row.discount * row.buy_qty }}
                    </span>
                  </template>
                </td>
                <!-- 7 -->
                <td>
                  <button @click="CartPutDel('del', data.list[num])"> 取消</button>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td :colspan="7">
                累計:{{ totalPrice }}
              </td>
            </tr>
            <tr>
              <td :colspan="7">
                運費:{{ fare }}
              </td>
            </tr>
            <tr>
              <td :colspan="7">
                累計:{{ fare + totalPrice }}
              </td>
            </tr>
          </tfoot>
        </table>
      </template>
      <template v-else>
        <div id="totle_0">
          目前購物車沒有商品
        </div>
      </template>
    </section>


  </section>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

const route = useRoute();
const router = useRouter();

Swal.fire({
  // 禁止點擊外部關閉視窗
  allowOutsideClick: false,
  title: "提醒",
  text: "單筆項目購買數量不得超過50",
  // success:V,error:X,warning:!,info:水藍i,question:?
  icon: "warning",
  // 按鈕出現
  showConfirmButton: true,
  // showDenyButton: true,
  // showCancelButton: true,
  // 按鈕背景色
  confirmButtonColor: "#3085d6",
  denyButtonColor: "#999",
  cancelButtonColor: "#d33",
  // 按鈕文字
  confirmButtonText: "確定",
  // denyButtonText: "不保存",
  cancelButtonText: "取消",
});

// 定義狀態變數
// const data = ref({list: []});;
const data = ref([]);
const fare = ref(1000);
const putdel = ref([]);
data.value.class = [];

// 購物車資料
const BuyListData = async () => {
  try {
    const response = await axios.get(`http://localhost/API/buylist.php`);

    data.value = response.data;
    console.log('data', data.value);
    console.log('data.list', data.value.list);
  } catch (error) {
    console.error('請求錯誤:', error);
  }
};
onMounted(BuyListData);

const goBack = () => {
  router.go(-1);
}
// 購物車操作
const CartPutDel = async (PutDel, list) => {
  let text_1 = '';

  if (PutDel == 'del') {
    text_1 = '確定要刪除此資料?';
  }
  else if ((PutDel == 'put')) {
    text_1 = '確定要購買?';
  }

  const btn = await Swal.fire({
    // 禁止點擊外部關閉視窗
    allowOutsideClick: false,
    title: "提醒",
    text: text_1,
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
    try {
      const response = await axios.put(`http://localhost/API/list_PutDel.php`, { 'PutDel': PutDel, 'list': list });

      putdel.value = response.data;
      console.log('putdel', putdel.value);

      Swal.fire({
        toast: true,
        timer: 1000,
        timerProgressBar: true,
        // 禁止點擊外部關閉視窗
        allowOutsideClick: true,
        title: putdel.value.m,
        text: "",
        // success:V,error:X,warning:!,info:水藍i,question:?
        icon: "info",
        // 按鈕出現
        showConfirmButton: false,
        // 按鈕背景色
        confirmButtonColor: "#3085d6",
        // 按鈕文字
        confirmButtonText: "確定",
      });
      BuyListData();
    } catch (error) {
      console.error('請求錯誤:', error);
    }
  } else {
    Swal.fire({
      toast: true,
      timer: 1000,
      timerProgressBar: true,
      // 禁止點擊外部關閉視窗
      allowOutsideClick: true,
      title: "已取消操作",
      text: "",
      // success:V,error:X,warning:!,info:水藍i,question:?
      icon: "info",
      // 按鈕出現
      showConfirmButton: false,
      // 按鈕背景色
      confirmButtonColor: "#3085d6",
      // 按鈕文字
      confirmButtonText: "確定",

    });
  }


}

// 算累計
const totalPrice = computed(() => {
  if (data.value.list) {
    return data.value.list.reduce((total, row) => {
      const price = row.discount ? row.discount : row.price;
      return total + (price * row.buy_qty);
    }, 0);  // 初始值為 0
  }
});

watch(() => data.value.list, (newList) => {
  newList.forEach(row => {
    if (row.buy_qty > 50) {
      row.buy_qty = 50;
    } else if (row.buy_qty < 1) {
      row.buy_qty = 1;
    }
  });
}, { deep: true });

</script>


<style scoped>
@import url('../CSS/buylist.css');
</style>
