<template>
  <section id="BOX">
    <br>
    <form class="loginBox" @submit.prevent="subLogin()">
      <h1>會員登入</h1>
      <label>
        <span>帳號</span>
        <input type="text" v-model="loginData.Acc" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.Acc">{{ MSG.Acc }}</span>

      <label>
        <span>密碼</span>
        <input type="text" v-model="loginData.Pwd" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.Pwd">{{ MSG.Pwd }}</span>

      <label>
        <span>驗證碼</span>
        <input type="text" pattern="[A-Za-z0-9]+" v-model="loginData.Captcha" @keydown.enter.prevent="focusNext">
        <img :src=captcha_img title="刷新驗證碼" @click="new_captcha()">
      </label>
      <span class="span_Red" v-if="MSG.Captcha">{{ MSG.Captcha }}</span>

      <div class="butBox">
        <button type="submit">
          登入
        </button>
        <button type="reset" @click="resetForm()">
          清除
        </button>
      </div>

      <div class="register">
        <span @click="$router.push({ name: 'Register' })">
          註冊
        </span>
      </div>

    </form>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
import Swal from "sweetalert2";
import axios from "axios";

const captcha_img_p = 'http://localhost/API/驗證碼/captcha_img.php';
const captcha_img = ref(`${captcha_img_p}`);
// 刷新驗證碼
const new_captcha = () => {
  captcha_img.value = `${captcha_img_p}?${Date.now()}`;
};

const data = ref([]);
const loginData = ref({ Acc: '', Pwd: '', Captcha: '' });
const MSG = ref({ Acc: '', Pwd: '', Captcha: '' });

const focusNext = (event) => {
  event.preventDefault(); // 防止預設 Enter 行為

  const inputs = Array.from(document.querySelectorAll("input, select, textarea"));
  const currentIndex = inputs.indexOf(event.target);

  if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
    inputs[currentIndex + 1].focus();
  }
};
watch(loginData, (newVal) => {
  for (let key in newVal) {
    if (newVal[key] !== '') {
      MSG.value[key] = ''; // 清空對應的錯誤訊息
    }
  }
}, { deep: true });
// 重製表單
const resetForm = () => {
  MSG.value = { Acc: '', Pwd: '', Captcha: '' };
};

// 提交表單
const subLogin = async () => {
  let CK = true;
  // 帳號
  if (loginData.value.Acc == "") {
    MSG.value.Acc = "請輸入帳號!";
    CK = false;
  }
  // 密碼
  if (loginData.value.Pwd == "") {
    MSG.value.Pwd = "請輸入密碼!";
    CK = false;
  }
  // 驗證碼
  if (loginData.value.Captcha == "") {
    MSG.value.Captcha = "請輸入驗證碼!";
    CK = false;
  }
  else {
    const CK_Captcha_m = ref();
    const CK_Captcha = await axios.post('http://localhost/API/CK_Captcha.php', { Captcha: loginData.value.Captcha }, { withCredentials: true });

    CK_Captcha_m.value = CK_Captcha.data;
    console.log('Captcha', CK_Captcha_m.value);

    if (CK_Captcha_m.value.m) {
      MSG.value.Captcha = '';
    } else {
      MSG.value.Captcha = CK_Captcha_m.value.m1;
      CK = false;
    }
  }


  if (CK) {
    try {
      loginData.value.action = 'post';
      const response = await axios.post('http://localhost/API/login.php', loginData.value, { withCredentials: true });

      // 設置返回的資料
      data.value = response.data;
      // 有錯誤
      if (data.value.err) {
        const ckBox = await Swal.fire({
          // 禁止點擊外部關閉視窗
          allowOutsideClick: false,
          title: '登入錯誤',
          text: data.value.m,
          // success:V,error:X,warning:!,info:水藍i,question:?
          icon: "error",
          // 按鈕出現
          showConfirmButton: true,
          // 按鈕背景色
          confirmButtonColor: "#3085d6",
          // 按鈕文字
          confirmButtonText: "確定",
        });
      }else{
        const ckBox = await Swal.fire({
          // 禁止點擊外部關閉視窗
          allowOutsideClick: false,
          title: '登入成功',
          text: data.value.m,
          // success:V,error:X,warning:!,info:水藍i,question:?
          icon: "success",
          // 按鈕出現
          showConfirmButton: true,
          // 按鈕背景色
          confirmButtonColor: "#3085d6",
          // 按鈕文字
          confirmButtonText: "確定",
        });
        router.push({ name: 'Home' });
      }
      console.log('data', data.value);
    } catch (error) {
      console.error('請求錯誤:', error);
    }

  } else {
    new_captcha();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

};
// onMounted(DATA);
</script>


<style scoped>
@import url("../CSS/login.css");
</style>
