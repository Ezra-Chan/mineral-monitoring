import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import * as Icons from '@element-plus/icons-vue';
import './assets/js/iconfont.js';
import 'virtual:uno.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

const app = createApp(App);

Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key]);
});

app.use(store).use(router).mount('#app');
