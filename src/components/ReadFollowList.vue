<template>
 <Teleport to="body">
        <div v-show="isShowFollowList" class="scrallbar-follow" @click="closeFollowList">
            <!--  -->
            <div class="follow-list" v-if="state.followList.length" >
                <li v-for="(followItem, index) in state.followList" :key="followItem.id" >
                    <img :src="followItem.avatar" alt="">
                    <span>{{ followItem.username }}</span>
                </li>
            </div>
            <div v-else class="follow-list">
                暂无关注
            </div>
        </div>
  </Teleport>
</template>
<script setup lang='ts'>
import {ref} from "vue"

const isShowFollowList = ref(false)

//关闭查看
const closeFollowList =  () => {
   isShowFollowList.value = false;
};
</script>

<style lang='less' scoped>
</style>