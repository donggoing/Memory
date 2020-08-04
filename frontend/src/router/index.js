import Vue from 'vue';
import Router from 'vue-router';
import Love from '@/components/Love';
import Login from '@/components/Login';
import Album from '@/components/Album';
import NewImg from '@/components/NewImg';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Love',
      component: Love,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Album',
      name: 'Album',
      component: Album,
    },
    {
      path: '/NewImg',
      name: 'NewImg',
      component: NewImg,
    },
  ],
});

// 使用钩子函数对路由进行登录跳转
// router.beforeEach((to, from, next) => {
//   // document.title = `${to.meta.title} | CYD ❤ XLL`;
//   // const role = localStorage.getItem('usertype');
//   if (!localStorage.getItem('cx_secret_') && to.path !== '/login') {
//     next('/login');
//   } else next();
// });

export default router;
