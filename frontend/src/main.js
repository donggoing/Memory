// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import ELEMENT, {
  Row,
  Col,
  Select,
  Option,
  Slider,
  Switch,
  Message,
  DatePicker,
  Upload,
} from 'element-ui';
import axios from 'axios';
import Vue from 'vue';
import App from './App';
import router from './router';
import VueProgressBar from 'vue-progressbar';
// import APlayer from '@moefe/vue-aplayer';
import store from './stores';
const config = require('../server.json');


// 引入组件
Vue.use(Row);
Vue.use(Col);
Vue.use(Select);
Vue.use(Option);
Vue.use(Slider);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Message);

Vue.use(VueProgressBar, {
  color: '#bffaf3',
  failedColor: '#874b4b',
  thickness: '15px',
  // transition: {
  //   speed: '0.2s',
  //   opacity: '0.6s',
  //   termination: 300,
  // },
  autoRevert: true,
  location: 'top',
  inverse: false,
});


Vue.config.productionTip = false;
// Vue.config.devtools = true;
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
    if (response.status === 200 || !res.outOfDate) {
      return response; // 该处将结果返回，下一步可用于前端页面渲染用
    }
    // alert('登录过期，请重新登录~');
    ELEMENT.Message({ message: '登录过期，请重新登录~', type: 'error' });
    // localStorage.removeItem('cx_secret_');
    return router.push('/login');
    // alert('该处异常');
    // return Promise.reject('error')
  },
  (error) => {
    // console.log(error);
    if (error.response.status === 403) {
      ELEMENT.Message({ message: '登录过期，请重新登录~', type: 'error' });
      router.push('/login');
    } else ELEMENT.Message({ message: '服务器开小差了~请联系你男朋友哦~', type: 'error' });
    return Promise.reject(error);
  },
);

const server = config.server;

axios.defaults.baseURL = server;
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;
Vue.prototype.image_prefix = server;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
