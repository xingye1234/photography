<template>
  <div>
    <Top></Top>
    <!-- <el-scrollbar height="100vh" @scroll="handlerScroll"> -->
    <div id="img_library">
      <el-row :gutter="10">
        <el-col
          v-for="(o, index) in imgList"
          :key="o"
          :span="6"
          :offset="index > 0 ? 2 : 0"
        >
          <div
            class="card-content"
            @click="readDetail(`https://picsum.photos/360/460?random=${index}`)"
          >
            <img
              v-lazy="`https://picsum.photos/360/460?random=${index}`"
              class="image"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <Footer></Footer>
    <!-- </el-scrollbar> -->

    <!-- 将图片查看版块放到body层级下 -->
    <Teleport to="body">
      <div v-if="open" class="wrap" @click="open = false">
        <div class="container">
          <img :src="url" alt="" />
          <!-- <span @click="open = false"><el-icon><Close /></el-icon></span> -->
        </div>
      </div>
    </Teleport>

    <BackTop></BackTop>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onBeforeMount, onMounted } from "vue";
import Top from "@/components/home/Header/TopHeader.vue";
import Footer from "@/components/home/Footer.vue";
import { Teleport } from "vue";
import { throttle } from "@/utils/throttle";
import BackTop from "@/components/home/TopBtn.vue";

onBeforeMount(() => {
  productData();
});

onMounted(() => {
  let scrollHeight = ref(1700);
  window.addEventListener("scroll", function () {
    // console.log(parseInt(" " + window.scrollY));
    if (parseInt(" " + window.scrollY) >= scrollHeight.value) {
      //1.调用函数（加个节流）  2.scrollHeight + 1700

      throttle(productData2, 5000)();
      scrollHeight.value += 1700;
    }
  });
});

const open = ref(false);
const url = ref("");

let imgList = reactive<number[]>([]);

const readDetail = (imgUrl: string) => {
  open.value = true;
  url.value = imgUrl;
};

// const handlerScroll = (event:object) => {
//   // console.log(parseInt(event.scrollTop));
//   let scrollHeight = ref(1700)
//   if(parseInt(event.scrollTop) >= scrollHeight.value){
//   //1.调用函数（加个节流）  2.scrollHeight + 1700
//     throttle(productData2, 5000)()
//     scrollHeight.value += 1700;
//   }
// }

//初始化生产函数
const productData = () => {
  for (let i = 1; i <= 32; i++) {
    imgList.push(i);
  }
};

// 下拉刷新函数
const productData2 = () => {
  const arr = [];
  //在原数组中追加32
  for (let i = imgList.length; i <= imgList.length + 32; i++) {
    arr.push(i);
  }
  // 合并数组
  imgList.push(...arr);
};
</script>

<style>
.image {
  display: block;
  width: 100%;
}
.el-row {
  justify-content: space-between;
}
.el-row a {
  display: block;
}
.el-col-offset-2 {
  margin: 0;
}
</style>
<style lang="less" scoped>
#img_library {
  padding: 0 95px;
  margin-top: 50px;
  box-sizing: border-box;
}

.card-content {
  margin-bottom: 20px;
  cursor: pointer;
  overflow: hidden;
  margin: 15px 0 15px;
  img {
    border-radius: 15px;
  }
}
.card-content:hover img {
  transform: scale(1.3);
  transition: all 0.5s;
}
.wrap {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  .container {
    width: 460px;
    height: 80vh;
    position: relative;
    background: #fff;
    top: 15%;
    left: 35%;
    display: flex;

    img {
      object-fit: cover;
      border-radius: 5px;
      padding: 5px;
      box-sizing: border-box;
    }
  }
}
</style>
