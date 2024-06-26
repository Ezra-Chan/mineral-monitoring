import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import store from './store';
import router from './router';
import directives from './directives';
import * as Icons from '@element-plus/icons-vue';
import './assets/js/iconfont.js';
import 'virtual:uno.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/dist/index.css';

const app = createApp(App);

Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key]);
});

app.use(ElementPlus).use(store).use(router).use(directives).mount('#app');
