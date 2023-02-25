<script setup lang="ts">
import {ref, onMounted} from "vue"
import {RouterView, useRoute } from "vue-router";
const route = useRoute()
const showSkeleton = ref(true)

onMounted(()=>{
  showSkeleton.value = false;
})
</script>

<template>
  <el-skeleton :rows="19" animated v-if="showSkeleton"/>
  <router-view v-slot="{ Component }">
    <!-- Transition 包裹keep-alive会报错 -->
    <!-- 需要缓存 -->
        <keep-alive>
          <Transition name="slide-fade">
            
              <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
            
          </Transition>
        </keep-alive>
        
        <!-- 不需要缓存 -->
        <Transition name="slide-fade">
          
            <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
          
        </Transition>
  </router-view>

   
</template>

<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>