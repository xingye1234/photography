<template>
  <div id="top_btn" @click="goBackTop" v-show="showTopBtn">
    <img src="../../assets/向上按钮.jpg" alt="" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { throttle } from "lodash";
const goBackTop = () => {
  window.scrollTo(0, 0);
};

//回到顶部按钮
const showTopBtn = ref(false);
const getScrollHeight = ()=> {
  // console.log(scrollY);
  scrollY > 400 ? (showTopBtn.value = true) : (showTopBtn.value = false);
}

window.addEventListener("scroll", throttle(getScrollHeight, 1000));
</script>
<style lang='less' scoped>
#top_btn {
  width: 45px;
  height: 40px;
  position: fixed;
  z-index: 9999;
  right: 20px;
  top: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  img {
    width: 20px;
    height: 20px;
  }
}
</style>