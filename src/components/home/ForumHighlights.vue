<template>
<div id="forum_highlights">
    <p class="title">{{ title }}</p>
    <el-row :gutter="20">
      <el-col v-for="(o, index) in dataList"
        :key="index" :span="6" :offset="index > 0 ? 2 : 0">
        <el-card shadow="hover"   @click="toDetail()" :body-style="{ padding: '10px' }"
          style="margin-bottom: 20px; cursor: pointer">
            <img :src="o" alt="" class="image">
          <div style="padding: 10px">
            <span>Beauty Girl</span>
            <div class="bottom">
              <time class="time">{{ currentDate }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps,reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const date = new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString()
const currentDate = ref(date);

const dataList = reactive<string[]>(['src/assets/论坛精选/63202441eaf77.jpg',
'src/assets/论坛精选/6356446a7fbee.jpg',
'src/assets/论坛精选/63202441eaf77.jpg',
'src/assets/论坛精选/6356446a7fbee.jpg'
])

defineProps<{
  title?: string;
}>();

const toDetail = () => {
  router.push({
    name: "detail",
    query: {
      id: "3",
    },
  });
};
</script>
<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
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
#forum_highlights {
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
  .image {
    width: 305px;
    height: 204px;
  }
  
}


</style>