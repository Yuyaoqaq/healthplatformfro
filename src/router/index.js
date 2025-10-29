import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Authority from '@/components/Authority.vue'  
import Welcome from '@/components/Welcome.vue'
import UserList from '@/components/admin/UserList.vue'



Vue.use(VueRouter)

const whiteList = ['/login', '/authority'];
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    meta:{role:["超级管理员","普通用户"]},
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/user',component:UserList,meta:{role:["超级管理员"]}}
    ]
  },
  {
    path: '/authority',
    component: Authority
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是登录页或权限页，直接放行
  if (whiteList.includes(to.path)) {
    return next(); //next有参数就会重定向
  }
  // 从本地存储中获取token
  const token = localStorage.getItem('token');
  let userRole = (localStorage.getItem('role') || '').trim() // 去首尾空格
    .replace(/["']/g, '') // 去除所有单/双引号
    .replace(/\s+/g, ''); // 去除所有中间空格、换行等
  // 如果token不存在，跳转到登录页
  if (!token) {
    return next({path: '/login'});
  }
  const requiredRole = to.meta.role;
  // console.log(requiredRole);
  // console.log("============");
  // console.log(userRole);
  if (requiredRole && !requiredRole.includes(userRole)) {
    return next('/authority');
  }
  // 否则放行
  next();
});


export default router

