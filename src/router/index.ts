import { createRouter, createWebHistory } from 'vue-router'
import { getItem } from '@/utils/login'

let userRoutes = [
  {
    path:'/',
    redirect:'/home'
  },
  {
    path: '/home',
    name: 'home',
    component: ()=> import('../views/home/HomeView.vue'),
    meta:{keepAlive: true}  //配置需要缓存
  },
  {
    path: '/map',
    name: 'map',
    component: ()=> import('../views/dataView/dataViewPlus.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/login/RegisterView.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/detail/Detail.vue'),
    meta:{keepAlive: false} //配置不需要缓存
  },
  {
    path: '/imgLibrary',
    name: 'imgLibrary',
    component: () => import('../views/ImgLibrary/ImgLibrary.vue')
  },
  {path:'/share', name:'share',component:()=>import('../views/share/Share.vue'),  meta:{keepAlive: false}},
  {path:'/editinfo', name:'editinfo', component:()=> import('../components/personalCenter/EditInfo.vue')},
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/Search.vue')
  },
  //个人中心
  {
    path: '/personalCenter',
    name: 'personalCenter',
    component: () => import('../views/mine/PersonalCenter.vue'),
    
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    if(to.path === "/detail" && from.path!== "/detail") {
      return {top:0 }
    }else{
      return { top: savedPosition?.top }
    }
  },
  routes: userRoutes
})

let forbidPath = ['/personalCenter', '/share']

router.beforeEach((to, from, next)=>{
  if(forbidPath.includes(to.path) && !getItem('name')){
      next('/login')
  }else{
      next()
  }
})


export default router
