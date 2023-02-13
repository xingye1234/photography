<template>
    <div id="search">
        <el-row :gutter="20">
        <el-col v-for="(item, index) in state.searchData" :key="item.article_id" :span="6" >
            <el-card :body-style="{ padding: '10px' }" shadow="hover"
            style="margin-bottom: 20px; cursor: pointer"
            @click="toDetail(item.article_id, item.user_id)" >
            <img :src="item.img" class="image" :title="item.title"/>
            </el-card>
        </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { onMounted,reactive } from "vue";
import {useRoute, useRouter} from "vue-router";
import requests from "@/network/request";

const route = useRoute()
const router = useRouter();

const state = reactive({
    searchData:[]
})

onMounted(()=>{
    getSearchData()
})

//获取查询数据
const getSearchData = async ()=> {
    try {
        const {data} = await requests(`/search/searchValue/${route.query.searchData}`)
        if(data.code === 200){
            // console.log(data.data);
            state.searchData = data.data;
        }
    } catch (error) {
        console.log(error);
    }
}

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
#search{
    width: 100%;
    height: 100vh;
    background: #e9e9e9;
}
</style>