import { defineStore } from 'pinia'

import {reactive} from 'vue'


//定义空字符串数组
const search = reactive<string[]>([])

export const searchLog = defineStore('searchLog', {
    state:()=>{
        return {
             searchArr:search
        }
    },
    actions:{
        addSearchLog(value:string){
            if(!this.searchArr.includes(value)){
                this.searchArr.unshift(value);
            }else{
                return;
            }
        },
        delSearchLog(value:string){
            this.searchArr = this.searchArr.filter(item => item !== value)
        }
    }
})