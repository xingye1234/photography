<template>
    <div id="search">
        <div class="not-found" v-if="!state.searchData.length">
                <img src="../../assets/error/notFound.jpg" alt="">
        </div>
        <el-row :gutter="20">
        <el-col v-for="(item, index) in state.searchData" :key="item.article_id" :span="6" >
            <el-card :body-style="{ padding: '3px', }" shadow="hover" class="card-wrap"
            @click="toDetail(item.article_id, item.user_id)" >
            <img :src="item.img" class="image" :title="item.title" style="display: block;"/>
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
    background: white;
    .not-found{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img{
            width: 569px;
            height: 355px;
        }
    }

    .card-wrap:hover{
        transform: translateY(-5px);
        transition: all 0.5s;
    }

    .card-wrap{
        margin-top: 5px;
        cursor: pointer; 
        box-sizing: border-box;
    }
}
</style>