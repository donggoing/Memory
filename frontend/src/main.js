// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'bootstrap';
import axios from 'axios';
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.use(ElementUI, {
  size: 'small',
});

Vue.config.productionTip = false;

// axios.interceptors.request.use((config) => {
//   // Do something before request is sent
//   // window.localStorage.getItem("accessToken") 获取token的value
//   const token = localStorage.getItem('cx_secret_');
//   if (token) {
//     // 将token放到请求头发送给服务器,将tokenkey放在请求头中
//     config.headers.token = token;
//     // config.headers.common.token = token;
//     // 也可以这种写法
//     // config.headers['accessToken'] = Token;
//     return config;
//   }
// }, error =>
//   // Do something with request error
//   Promise.reject(error),
// );

axios.interceptors.response.use(
  (response) => { // 该处为后端返回整个内容
    const res = response.data; // 该处可将后端数据取出，提前做一个处理
    if (!res.outOfDate) {
      return response; // 该处将结果返回，下一步可用于前端页面渲染用
    }
    // alert('登录过期，请重新登录~');
    this.$message('登录过期，请重新登录~');
    // localStorage.removeItem('cx_secret_');
    router.push('/login');
    // alert('该处异常');
    // return Promise.reject('error')
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

const server = 'http://localhost:3000';

axios.defaults.baseURL = server;
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;
Vue.prototype.image_prefix = server;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
