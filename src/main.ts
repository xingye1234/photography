import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导入element样式
import ElementPlus from 'element-plus'
//导入element-icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import locale from "element-plus/lib/locale/lang/zh-cn"; //汉化
import VueLazyload from 'vue-lazyload'
//导入animate样式
import 'animate.css';
import './assets/main.css'




const app = createApp(App)
//注册icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

// new URL('./assets/loading.gif', import.meta.url).href解决加载静态资源，相当于reqiure

//配置懒加载图片
app.use(VueLazyload, {
  preLoad: 1.3,
  loading: new URL('./assets/loading.gif', import.meta.url).href,
  attempt: 1
})

app.use(createPinia())
app.use(router)
// 安装element
app.use(ElementPlus,{locale})
app.mount('#app')
