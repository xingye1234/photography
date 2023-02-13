<template>
  <div id="greate_production">
    <p class="title">优秀作品</p>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in dataList" :key="item.article_id" :span="6" >
        <el-card :body-style="{ padding: '10px' }" shadow="hover"
          style="margin-bottom: 20px; cursor: pointer"
          @click="toDetail(item.article_id, item.user_id)" >
          <img v-lazy="item.img" class="image" />
        </el-card>
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
}
</style>