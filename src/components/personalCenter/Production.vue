<template>
  <div id="production">
    <h3>作品</h3>
    <div class="production-wrap">
      <el-row :gutter="10">
      <el-col v-for="(item, index) in dataList" :key="item.article_id" :span="6" >
        <el-card :body-style="{ padding: '10px' }" shadow="hover"
          style="margin-bottom: 20px; cursor: pointer"
          @click="toDetail(item.article_id, item.user_id)" >
          <img :src="item.img" class="image" />
        </el-card>
      </el-col>
    </el-row>
    </div>
  </div>

  
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{
  dataList?: Array<object>;
}>();

const router = useRouter()

//查看详情
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
#production{
  width: 100%;
  padding: 10px 10px 0;
  box-sizing: border-box;
  h3{
    text-align: center;
    color: red;
  }
}
.production-wrap{
  padding: 10px;
  box-sizing: border-box;
  background-color: #eee;
}
.time {
  font-size: 12px;
  color: #999;
}
// .button {
//   padding: 0;
//   min-height: auto;
// }

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