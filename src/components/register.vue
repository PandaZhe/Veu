<template>
  <section id="BOX">
    <br>
    <form id="form1" class="loginBox" @submit.prevent="register_in()">
      <h1>會員註冊</h1>
      <h6>**為必填欄位</h6>
      <label>
        <span>姓名</span>
        <input type="text" placeholder="**請輸入姓名" v-model="registerData.name" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.name">{{ MSG.name }}</span>

      <label>
        <span>帳號</span>
        <input type="text" placeholder="**請輸入註冊帳號(至少6碼)" v-model="registerData.Acc" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.Acc">{{ MSG.Acc }}</span>

      <label>
        <span>密碼</span>
        <input type="text" placeholder="**請輸入註冊密碼(至少6碼)" v-model="registerData.Pwd" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.Pwd">{{ MSG.Pwd }}</span>

      <label>
        <span>確認密碼</span>
        <input type="text" placeholder="**請確認註冊密碼" v-model="registerData.Pwd2" @input="ckPwd"
          @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.Pwd2">{{ MSG.Pwd2 }}</span>

      <label>
        <span>身分證</span>
        <input type="text" maxlength="10" placeholder="請輸入身分證" pattern="[A-Z][1-2][0-9]{8}" v-model="registerData.tssn"
          @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.tssn">{{ MSG.tssn }}</span>

      <label>
        <span>生日</span>
        <input type="date" minlength="5" v-model="registerData.birthday" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.birthday">{{ MSG.birthday }}</span>

      <label>
        <span>手機</span>
        <input type="text" pattern="09[0-9]{8}" placeholder="**請輸入手機號碼" inputmode="numeric" maxlength="10"
          v-model="registerData.phone" @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.phone">{{ MSG.phone }}</span>

      <label>
        <span>縣市</span>
        <select @change="showTown(registerData.city)" v-model="registerData.city" @keydown.enter.prevent="focusNext">
          <option value="" disabled selected>**請選擇縣市</option>
          <template v-for="row in city.city" :key="row.AutoNo">
            <option :value=row.AutoNo>{{ row.Name }}</option>
          </template>
        </select>
      </label>
      <span class="span_Red" v-if="MSG.city">{{ MSG.city }}</span>

      <label>
        <span>鄉鎮市</span>
        <select @change="showPost(registerData.town)" v-model="registerData.town" @keydown.enter.prevent="focusNext">
          <option value="" disabled selected>**請選擇鄉鎮市</option>
          <template v-for="row in city.town2" :key="row.townNo">
            <option :value="row.townNo">{{ row.Name }}</option>
          </template>
        </select>
      </label>
      <span class="span_Red" v-if="MSG.town">{{ MSG.town }}</span>

      <label>
        <span>地址</span>
        <input type="text" minlength="5" :placeholder="`**請輸入郵遞區號${post}後續地址`" v-model="registerData.address"
          @keydown.enter.prevent="focusNext">
      </label>
      <span class="span_Red" v-if="MSG.address">{{ MSG.address }}</span>

      <label>
        <input type="file" accept="image/*" @change="previewImage" @keydown.enter.prevent="focusNext">
      </label>
      <div v-if="imageUrl">
        <h2>預覽:</h2>
        <img :src="imageUrl" title="預覽圖片" style="max-width: 20%; max-height: 20%;">
      </div>

      <label>
        <span>驗證碼</span>
        <input type="text" placeholder="請輸入驗證碼" pattern="[A-Za-z0-9]+" v-model="registerData.Captcha">
        <img :src=captcha_img title="刷新驗證碼" @click="new_captcha()">
      </label>
      <span class="span_Red" v-if="MSG.Captcha">{{ MSG.Captcha }}</span>


      <div class="butBox">
        <button type="submit">
          註冊
        </button>
        <button type="reset" @click="resetForm()">
          清除
        </button>
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

const data = ref([]);
const city = ref([]);
let post = ref('');
const registerData = ref({
  name: '', Acc: '', Pwd: '', Pwd2: '', tssn: '', birthday: '', phone: '', city: '', town: '', address: '', Captcha: ''
});
const MSG = ref({
  name: '', Acc: '', Pwd: '', Pwd2: '', tssn: '', birthday: '', phone: '', city: '', town: '', address: '', Captcha: ''
});

const captcha_img_p = 'http://localhost/API/驗證碼/captcha_img.php';
const captcha_img = ref(`${captcha_img_p}`);
// 刷新驗證碼
const new_captcha = () => {
  captcha_img.value = `${captcha_img_p}?${Date.now()}`;
};

// 監聽 registerData 的變化，當某個欄位被修改時，清空對應的 MSG
watch(registerData, (newVal) => {
  for (let key in newVal) {
    if (newVal[key] !== '') {
      MSG.value[key] = ''; // 清空對應的錯誤訊息
    }
  }
}, { deep: true });

// 儲存預覽圖片的 URL
const imageUrl = ref(null);
// 圖片預覽
const previewImage = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    imageUrl.value = URL.createObjectURL(file);
  } else {
    imageUrl.value = null;
  }
};

const focusNext = (event) => {
  event.preventDefault(); // 防止預設 Enter 行為

  const inputs = Array.from(document.querySelectorAll("input, select, textarea"));
  const currentIndex = inputs.indexOf(event.target);

  if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
    inputs[currentIndex + 1].focus();
  }
};

// 確認密碼
const ckPwd = () => {
  if (registerData.value.Pwd2 != registerData.value.Pwd) { MSG.value.Pwd2 = '與註冊密碼不符'; }
  else if (registerData.value.Pwd2 == registerData.value.Pwd) { MSG.value.Pwd2 = ''; }
};
// 重製表單
const resetForm = () => {
  post.value = '';
  imageUrl.value = null;
  MSG.value = {
    name: '', Acc: '', Pwd: '', Pwd2: '', tssn: '', birthday: '', phone: '', city: '', town: '', address: '', Captcha: ''
  };
};

const register_in = async () => {
  let CK = true;

  // 驗證
  if (CK) {
    // 姓名
    if (registerData.value.name == '') { MSG.value.name = '請輸入姓名'; CK = false; }
    else { MSG.value.name = ''; }
    // 帳號
    if (registerData.value.Acc == '') { MSG.value.Acc = '請輸入註冊帳號'; CK = false; }
    else if (registerData.value.Acc.length < 6) { MSG.value.Acc = '註冊帳號太短，請至少6碼'; CK = false; }
    else {
      const CK_Acc_m = ref();
      const CK_Acc = await axios.post('http://localhost/API/register-CK_Acc.php', { Acc: registerData.value.Acc }, { withCredentials: true });
      CK_Acc_m.value = CK_Acc.data;
      console.log('Acc', CK_Acc_m.value);

      if (CK_Acc_m.value.m) {
        MSG.value.Acc = '';
      } else {
        MSG.value.Acc = CK_Acc_m.value.m1; CK = false;
      }
    }
    // 密碼
    if (registerData.value.Pwd == '') { MSG.value.Pwd = '請輸入註冊密碼'; CK = false; }
    else if (registerData.value.Pwd.length < 6) { MSG.value.Pwd = '註冊密碼太短，請至少6碼'; CK = false; }
    else { MSG.value.Pwd = ''; }
    // 生日
    if (registerData.value.birthday == '') { MSG.value.birthday = '請選擇生日'; CK = false; }
    else { MSG.value.birthday = ''; }
    // 手機
    if (registerData.value.phone == '') { MSG.value.phone = '請輸入手機'; CK = false; }
    else { MSG.value.phone = ''; }
    // 縣市
    if (registerData.value.city == '') { MSG.value.city = '請選擇地址縣市'; CK = false; }
    else { MSG.value.city = ''; }
    // 鄉鎮市
    if (registerData.value.town == '') { MSG.value.town = '請選擇地址鄉鎮市'; CK = false; }
    else { MSG.value.town = ''; }
    // 地址
    if (registerData.value.address == '') { MSG.value.address = '請輸入後續地址'; CK = false; }
    else { MSG.value.address = ''; }
    // 驗證碼
    if (registerData.value.Captcha == '') { MSG.value.Captcha = '請輸入驗證碼!!'; CK = false; }
    else {
      const CK_Captcha_m = ref();
      const CK_Captcha = await axios.post('http://localhost/API/CK_Captcha.php', { Captcha: registerData.value.Captcha }, { withCredentials: true });

      CK_Captcha_m.value = CK_Captcha.data;
      console.log('Captcha', CK_Captcha_m.value);

      if (CK_Captcha_m.value.m) {
        MSG.value.Captcha = '';
      } else {
        MSG.value.Captcha = CK_Captcha_m.value.m1;
        CK = false;
      }
    }
  }

  if (CK) {
    const formData = new FormData();
    // 檢查檔案
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      registerData.value.image = fileInput.files[0];
    }
    for (const key in registerData.value) {
      formData.append(key, registerData.value[key]);
    }

    try {
      const response = await axios.post('http://localhost/API/register.php', formData, { withCredentials: true });


      data.value = response.data;
      console.log('data', data.value);

      // 刷新
      const ckBox = await Swal.fire({
        // 禁止點擊外部關閉視窗
        allowOutsideClick: false,
        title: '註冊成功',
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
      router.push({ name: 'Login' });
    } catch (error) {
      console.error('請求錯誤:', error);
      // }
    }
  } else {
    new_captcha();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

};

// 縣市&鄉鎮市選單資料
const cityData = async () => {
  try {
    const response = await axios.get('http://localhost/API/register-city.php', registerData.value);

    // 設置返回的資料
    city.value = response.data;
    console.log('city', city.value);
  } catch (error) {
    console.error('請求錯誤:', error);
  }
}; onMounted(cityData);
// 鄉鎮市下拉選單
const showTown = (a) => {
  city.value.town2 = city.value.town.filter(town => town.AutoNo == a);
  console.log('town2', city.value.town2);
};
// 郵遞區號
const showPost = (a) => {
  const townData = city.value.town.find(town => town.townNo == a);
  post.value = townData ? townData.Post : '';
};


</script>


<style scoped>
@import url("../CSS/register.css");
</style>
