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
    <Footer></Footer>

    <!-- 回到顶部按钮 -->
    <TopBtn></TopBtn>

  </div>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import HomeHeader from "@/components/home/Header/HomeHeader.vue";
import ForumHig from "@/components/home/ForumHighlights.vue";
import Footer from "@/components/home/Footer.vue";
import TopBtn from "@/components/home/TopBtn.vue";
import GreateProdution from "@/components/home/GreateProduction.vue"
import requests from '@/network/request'
import {userInfo} from "@/stores/userInfo"
import {articleInfo} from "@/stores/article"
import { throttle } from "lodash";

interface IBannerList {
  id: number;
  img: string;
}

interface IProduction {
  article_id: number;
  user_id: number;
  title: string;
  create_time:string;
  description: string;
  img:string;
}

const userStore = userInfo();
const articleStore = articleInfo()

let bannerList = reactive<IBannerList[]>([{
  id: 1,
  img: "src/assets/banner/image/海岛风景.jpeg"
},
{
  id: 2,
  img:'src/assets/banner/image/荒岛宝藏.jpeg'
},
{
  id: 3,
  img: "src/assets/banner/image/静谧湖泊.jpeg"
},
{
  id: 4,
  img: "src/assets/banner/image/雪白唯美.jpeg"
}
]);


const greateProduction = reactive<IProduction[]>([])
const homeSrcoll = ref(0)
const topBtnScroll = ref(0)

onMounted(() => {
  getGreateProduction();
  //获取用户信息
  getUserInfo();
});

const currentIndex = ref(0);

//轮播图切换
const carouselChange = (current: number, pre: number) => {
  currentIndex.value = current;
};

//获取优秀作品
const getGreateProduction = ()=>{
  // try {
  //   const {data} = await requests('/article')
  //   // console.log(data);
  //   greateProduction.push(...data.data)
  // } catch (error) {
  //   console.log(error);
  // }
  
  // 使用仓库存储数据
  articleStore.getArticleInfo()

}

//获取用户信息
const getUserInfo = async () => {
  try {
    const { data } = await requests(
      `/user/userInfo/${localStorage.getItem("id")}`
    );
    // console.log(data.result[0]);
    if(data.code === 200){
      userStore.userInfo = data.result[0]
      sessionStorage.setItem("userInfo", JSON.stringify(userStore.userInfo))
      userStore.getUserInfo();
    }
  } catch (error) {
    console.log(error);
  }
};


</script>

<style scoped>
.el-carousel:deep(.el-carousel__arrow){
  position: relative;
  z-index:9999;
}
.el-carousel:deep(.el-carousel__arrow--right){
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

.logo-text{
  width: 100%;
  height: 525px;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  font-family: '华文行楷';
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 80px;
}


</style>