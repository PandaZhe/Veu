import { ref } from 'vue';
import Swal from "sweetalert2";
import axios from "axios";

// 这个函数会返回 addCart 和 cart
export const buyCart = () => {
  // cart 用来存储购物车内容
  const cart = ref([]);

  // addCart 用来将商品添加到购物车
  const addCart = async (pID, qty = 1) => {
    try {
      // 发送 POST 请求到后端
      const response = await axios.post('http://localhost/API/addCard.php', {
        'pID':pID,
        'qty':qty
      });

      // 假设返回的 response.data 是更新后的购物车数据
      cart.value = response.data;  // 更新购物车的内容
      Swal.fire({
        // 禁止點擊外部關閉視窗
        allowOutsideClick: false,
        title: cart.value.m,
        text: "",
        // success:V,error:X,warning:!,info:水藍i,question:?
        icon: "success",
        // 按鈕出現
        showConfirmButton: true,
        // 按鈕背景色
        confirmButtonColor: "#3085d6",
        // 按鈕文字
        confirmButtonText: "確定",
      });
      console.log('cart', cart.value);
    } catch (error) {
      console.error("添加到購物車失敗:", error);
      Swal.fire({
        // 禁止點擊外部關閉視窗
        allowOutsideClick: false,
        title: '添加商品到購物車失敗！',
        text: "",
        // success:V,error:X,warning:!,info:水藍i,question:?
        icon: "error",
        // 按鈕出現
        showConfirmButton: true,
        // 按鈕背景色
        confirmButtonColor: "#3085d6",
        // 按鈕文字
        confirmButtonText: "確定",
      });
    }
  };

  return { addCart, cart }; // 返回购物车和添加商品的函数
};
