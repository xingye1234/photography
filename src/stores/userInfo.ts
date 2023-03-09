import { defineStore } from 'pinia'
import { getItem, getId } from '@/utils/login'
import type {IUserInfo} from "@/types/type"
import requests from '@/network/request'

export const userInfo = defineStore('username', {
   state: ()=> ({
    name:'',
    user_id:'',
    userInfo:<IUserInfo>{},
   }),
   getters:{
    
   },

   actions:{
      getName(){
         this.name =  getItem('name') || ''
      },
      getId(){
         this.user_id = getId() || ''
      },
      async getUserInfo() {
         try {
           const { data } = await requests(
             `/user/userInfo/${getId()}`
           );
          //  console.log(data);
           if(data.code === 200){
             this.userInfo = data.result[0];
             sessionStorage.setItem("userInfo", JSON.stringify( data.result[0]))
           }
         } catch (error) {
           console.log(error);
         }
       }
   }
})
