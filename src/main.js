import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'




Vue.prototype.$http = axios
axios.defaults.baseURL="http://localhost:9000"
axios.defaults.timeout=5000

axios.interceptors.request.use(
  config => {
    const userRole = localStorage.getItem('role');
    if (userRole) {
      config.headers['X-User-Role'] = encodeURIComponent(userRole);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
