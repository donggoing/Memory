import Vue from 'vue';
import Router from 'vue-router';

const Login = () => import('@/components/Login');
const Album = () => import('@/components/Album');
const NewImg = () => import('@/components/NewImg');
const Love = () => import('@/components/Love');
const Diary = () => import('@/components/Diary');
const Detail = () => import('@/components/detail');
const Edit = () => import('@/components/edit');
// const Create = () => import('@/components/edit');
const Category = () => import('@/components/category');


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/category',
      name: 'category',
      component: Category,
    },
    {
      path: '/create',
      name: 'creatediary',
      component: Edit,
    },
    {
      path: '/edit',
      name: 'diarydedit',
      component: Edit,
    },
    {
      path: '/detail',
      name: 'diarydetail',
      component: Detail,
      props: true,
    },
    {
      path: '/Diary',
      name: 'Love',
      component: Diary,
    },
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
