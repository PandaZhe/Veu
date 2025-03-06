import { createRouter, createWebHistory } from 'vue-router';  // Vue 3 中的寫法

import Index from './components/index.vue'
import Product from './components/product.vue'
import Goods from './components/goods.vue'
import Buylist from './components/buylist.vue'


const routes = [
  {
    path: '/',         // 網址
    name: 'Home',     // 給這個路由設定名稱
    component: Index,
    // component: ()=>import ('./components/index.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
    // component: ()=>import ('./components/product.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: Goods
  },
  {
    path: '/buylist',
    name: 'Buylist',
    component: Buylist
  },
  {
    path: '/login',
    name: 'Login',
    component: ()=>import ('./components/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: ()=>import ('./components/register.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),  // 使用 HTML5 的歷史模式
  routes,
});

export default router;

