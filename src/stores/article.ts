import { defineStore } from "pinia";
import requests from "@/network/request";

export const articleInfo = defineStore('articleStore', {
    state:()=>({
        articleInfo:[]
    }),
    getters:{},
    actions:{
       async getArticleInfo(){
        try {
            const {data} = await requests('/article')
            // console.log(data.data);
            this.articleInfo = data.data;
          } catch (error) {
            console.log(error);
          }
        }
    },
})