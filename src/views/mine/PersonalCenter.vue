<template>
  <div id="personal_center">
    <el-scrollbar height="100vh">
      <TopHeader></TopHeader>
      <img
        src="../../assets/banner/image/雪白唯美.jpeg"
        alt=""
        class="bg_img"
      />
      <div class="edit_info" v-if="isShowEdit">
        <el-icon style="vertical-align: -2px; margin-right: 3px"
          ><Edit /></el-icon
        ><RouterLink to="/editinfo">编辑信息</RouterLink>
      </div>
      <div class="avatar">
        <img :src="state.userInfo.avatar" alt="" v-if="state.userInfo.avatar" />
        <img src="../../assets/个人中心/head180.png" alt="" v-else />
        <div class="nick_name">{{ state.userInfo.username }}</div>
        <div class="bottom">
          <li class="attention" @click="readFollow">
            关注<a href="#">{{
              state.userInfo.followee_count ? state.userInfo.followee_count : 0
            }}</a>
          </li>
          <li class="attention">
            粉丝<a href="#">{{
              state.userInfo.follower_count ? state.userInfo.follower_count : 0
            }}</a>
          </li>
        </div>
      </div>

      <!-- 导航区 -->
      <div class="content">
        <div class="control">
          <Production :data-list="userProduct"></Production>
        </div>
      </div>
      <!-- 底部 -->
      <Footer></Footer>
    </el-scrollbar>
  </div>

  <Teleport to="#personal_center">
    <div
      v-show="state.isShowFollowList"
      class="scrallbar-follow"
      @click="closeFollowList"
    >
      <!--  -->
      <div class="follow-list" v-if="state.followList.length">
        <li
          v-for="(followItem, index) in state.followList"
          :key="followItem.id"
          @click="toPersonalCenter(followItem.to_id)"
        >
          <img :src="followItem.avatar" alt="" />
          <span>{{ followItem.username }}</span>
        </li>
      </div>
      <div v-else class="follow-list">暂无关注</div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import TopHeader from "@/components/home/Header/TopHeader.vue";
import Footer from "@/components/home/Footer.vue";
import { userInfo } from "@/stores/userInfo";
import { watch, reactive, onMounted, computed } from "vue";
import Production from "@/components/personalCenter/Production.vue";
import requests from "@/network/request";
import { useRoute, useRouter } from "vue-router";
import type { IUserInfo } from "@/types/type";
import { getId } from "@/utils/login";

interface IFollow {
  avatar: string;
  from_id: number;
  id: number;
  to_id: number;
  username: string;
}

const route = useRoute();
const router = useRouter();

onMounted(() => {
  //获取用户作品
  getUserProduct();
  //获取用户信息
  getUserInfo();
});

let userProduct = reactive<object[]>([]);

const state = reactive({
  follower_count: "",
  followee_count: "",
  imgUrl: "",
  userInfo: <IUserInfo>{},
  isShowFollowList: false,
  followList: <IFollow[]>[],
});

const isShowEdit = computed(() => {
  // console.log(userStore.user_id, "route:", route.query.id);
  return userStore.user_id === route?.query?.id;
});

//监听路由的变化
watch(
  () => route.query.id,
  (id) => {
    userProduct = [];
    //获取用户作品
    getUserProduct();
    //获取用户信息
    getUserInfo();
  }
);

//从状态库中取出用户名
const userStore = userInfo();
//调用pinia中的getName方法
userStore.getUserInfo();
userStore.getId();

//获取用户作品
const getUserProduct = async () => {
  const { id } = route.query;
  // console.log(id);
  try {
    if (!id) {
      // console.log(userStore.user_id);
      const { data } = await requests(`/user/production/${userStore.user_id}`);
      // console.log(data);
      userProduct.push(...data.data);
    } else {
      const { data } = await requests(`/user/production/${id}`);
      // console.log(data);
      userProduct.push(...data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async () => {
  const { id } = route.query;
  try {
    if (typeof id === "undefined") {
      // console.log(userStore.user_id);
      const { data } = await requests(`/user/userInfo/${userStore.user_id}`);
      // console.log(data);
      state.userInfo = data.result[0];
    } else {
      const { data } = await requests(`/user/userInfo/${id}`);
      state.userInfo = data.result[0];
    }
  } catch (error) {
    console.log(error);
  }
};

//查看关注
const readFollow = async () => {
  state.isShowFollowList = !state.isShowFollowList;

  const id = getId();
  const { data } = await requests(`/detail/readfollow/${id}`);
  // console.log(data);
  if (data.code === 200) {
    state.followList = data.data;
  }
};

//查看用户信息
const toPersonalCenter = (id: number) => {
  console.log(id);
  router.push({
    path: "/personalCenter",
    query: {
      id,
    },
  });
};

//关闭查看
const closeFollowList = () => {
  state.isShowFollowList = false;
};
</script>

<style lang="less" scoped>
#personal_center {
  background-color: #ffffff;
  overflow: hidden;
  .bg_img {
    width: 100%;
    height: 350px;
    display: block;
    margin-top: 50px;
  }
  .avatar {
    width: 120px;
    height: 120px;
    background-color: #f6f6f6;
    position: relative;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: block;
    }
    .nick_name {
      text-align: center;
      font-weight: bold;
      font-size: 30px;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      li {
        display: flex;
        line-height: 20px;
        a {
          margin-left: 5px;
          font-size: 14px;
        }
        a:hover {
          color: red;
        }
      }
    }
  }
  .edit_info {
    position: relative;
    right: -94%;
    bottom: -5px;
    color: rgb(226, 126, 126);
  }
  .edit_info:hover a {
    color: red;
  }
  .content {
    margin-top: 30px;
    width: 100%;
    .control {
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        padding: 5px 15px;
        box-sizing: border-box;
        font-size: 14px;
        margin: 0 15px;
      }
      a:hover {
        color: red;
      }
      .active {
        color: red;
        border-bottom: 3px solid red;
        font-weight: bold;
        font-size: 18px;
      }
    }
    .control_content {
      width: 100%;
      height: 350px;
      background-color: #f5f5f5;
    }
  }
}

.scrallbar-follow {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);

  .follow-list {
    width: 35%;
    height: 50vh;
    background-color: #eee;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 15px;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    span {
      font-size: 30px;
      vertical-align: top;
      margin-left: 15px;
    }
  }
}
</style>
