import { defineStore } from 'pinia'
import { getItem, getId } from '@/utils/login'

export const userInfo = defineStore('username', {
   state: ()=> ({
    name:'',
    user_id:'',
    userInfo:{},
   }),
   getters:{
    
   },

   actions:{
      getName(){
         this.name =  getItem('name') || ''
      },
      getId(){
         this.user_id = getId('id') || ''
      },
      getUserInfo(){
         this.userInfo = JSON.parse((sessionStorage.getItem('userInfo') as any)) || {}
      }
   }
})
