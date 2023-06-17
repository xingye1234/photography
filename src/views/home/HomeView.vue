<template>
  <div id="home">
    <HomeHeader></HomeHeader>

    <!-- 轮播图 -->
    <el-carousel
      height="525px"
      :autoplay="true"
      :interval="5000"
      v-if="bannerList.length > 0"
      @change="carouselChange"
      style="margin-bottom: 20px"
    >
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <img :src="item.img" alt="" />
      </el-carousel-item>
      <p class="logo-text">Headstream Photography</p>
    </el-carousel>

    <!-- 论坛精选 -->
    <ForumHig title="论坛精选"></ForumHig>

    <!-- 优秀作品 -->
    <GreateProdution :dataList="articleStore.articleInfo"></GreateProdution>

    <!-- 底部 -->
    <Footer ref="footer"></Footer>

    <!-- 回到顶部按钮 -->
    <TopBtn></TopBtn>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, h } from "vue";
import HomeHeader from "@/components/home/Header/HomeHeader.vue";
import ForumHig from "@/components/home/ForumHighlights.vue";
import Footer from "@/components/home/Footer.vue";
import TopBtn from "@/components/home/TopBtn.vue";
import GreateProdution from "@/components/home/GreateProduction.vue";
import { userInfo } from "@/stores/userInfo";
import { articleInfo } from "@/stores/article";

interface IBannerList {
  id: number;
  img: any;
}

interface IProduction {
  article_id: number;
  user_id: number;
  title: string;
  create_time: string;
  description: string;
  img: string;
}

const userStore = userInfo();
const articleStore = articleInfo();
const footer = ref<HTMLElement>();

let bannerList = reactive<IBannerList[]>([
  {
    id: 1,
    img: new URL('../../assets/banner/image/1.jpeg', import.meta.url).href,
  },
  {
    id: 2,
    img: new URL('../../assets/banner/image/2.jpeg', import.meta.url).href,
  },
  {
    id: 3,
    img: new URL('../../assets/banner/image/3.jpeg', import.meta.url).href,
  },
  {
    id: 4,
    img: new URL('../../assets/banner/image/4.jpeg', import.meta.url).href,
  },
]);

const greateProduction = reactive<IProduction[]>([]);
const homeSrcoll = ref(0);
const topBtnScroll = ref(0);

onMounted(() => {
  getGreateProduction();
  //获取用户信息
  userStore.getUserInfo();

  // console.log("----->footer", footer.value?.$parent);
  // const divs = h("div", { class: "wrap" }, "hello");
  // console.log(divs);
});

const currentIndex = ref(0);

//轮播图切换
const carouselChange = (current: number, pre: number) => {
  currentIndex.value = current;
};

//获取优秀作品
const getGreateProduction = () => {
  // 使用仓库存储数据
  articleStore.getArticleInfo();
};
</script>

<style scoped>
.el-carousel:deep(.el-carousel__arrow) {
  position: relative;
  z-index: 9999;
}
.el-carousel:deep(.el-carousel__arrow--right) {
  left: 94%;
}
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
img {
  height: 100%;
  width: 100%;
}
</style>

<style lang="less" scoped>
#home {
  position: relative;
}

.active {
  display: block;
}

.logo-text {
  width: 100%;
  height: 525px;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  font-family: "华文行楷";
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 80px;
}
</style>
