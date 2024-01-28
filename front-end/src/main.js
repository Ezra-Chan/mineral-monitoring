import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import './assets/js/iconfont.js';
import 'virtual:uno.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

createApp(App).use(store).use(router).mount('#app');
