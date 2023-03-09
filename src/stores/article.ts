import { defineStore } from "pinia";
import requests from "@/network/request";
import type {IArticleInfo} from '@/types/type'


export const articleInfo = defineStore('articleStore', {
    state:()=>({
        articleInfo: <IArticleInfo[] | object>[]
    }),
    getters:{},
    actions:{
       async getArticleInfo(){
        try {
            const {data} = await requests('/article')
            // console.log(data.data);
            this.articleInfo = data.data.map(item =>{
              return {
                ...item,
                isFollow:false
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
    },
})