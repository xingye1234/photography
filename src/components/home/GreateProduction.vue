<template>
  <div id="greate_production">
    <p class="title">优秀作品</p>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in dataList" :key="item.article_id" :span="6" >
        <div class="card-content"
          @click="toDetail(item.article_id, item.user_id)" >
          <img v-lazy="item.img" class="image" />
          <div class="mark">
            <span class="article_title">{{ item .title}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface IProduction {
  article_id: number;
  user_id: number;
  title: string;
  create_time:string;
  description: string;
  img:string;
  username:string;
}


const router = useRouter();
const currentDate = ref(new Date())

defineProps<{
  dataList?: Array<IProduction>;
}>();


const toDetail = (article_id:number, user_id:number) => {
  router.push({
    path: "/detail",
    query: {
     article_id,
     user_id,
    }
  });
};
</script>
<style lang='less' scoped>
.time {
  font-size: 12px;
  color: #999;
}
.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
  object-fit: contain;
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

<style lang='less' scoped>
#greate_production {
  width: 100%;
  //   margin-top: 30px;
  padding: 10px 75px 0;
  box-sizing: border-box;
  .title {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
    font-size: 25px;
    position: relative;
  }
  .title::before {
    content: "";
    width: 20px;
    height: 2px;
    position: absolute;
    background-color: skyblue;
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
  }

  .card-content{
    margin-bottom: 20px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    img{
      border-radius: 15px;
    }
    .mark{
      width: 327px;
      height: 0px;
      background-color: rgb(29, 28, 28);
      opacity: 0.3;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .article_title{
        display: none;
        color: white;
        font-size: 40px;
        font-weight: bold;
        font-family: '华文行楷';
      }
    }
  }
  .card-content:hover .mark{
    height: 419px;
    transition: all 0.3s;
    border-radius: 15px;
  }
  .card-content:hover .article_title{
    display: block;
  }
  .card-content:hover img{
    transform: scale(1.1);
    transition: all 0.5s;
  }

  
}
</style>