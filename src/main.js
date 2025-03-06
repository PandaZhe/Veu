import { createApp } from 'vue'     // Vue 3 的方式
import App from './App.vue'
import router from './index.js';  // 引入路由



const app = createApp(App); // 這裡先定義 app



app.use(router).mount('#Main')
