<template>
  <div id="chat">
    <!-- 消息列表 -->
    <ul class="content-wrap">
      <el-scrollbar>
        <li
          :class="{
            content_list_right: item.user_id == id,
            content_list: item.user_id != id,
          }"
          v-for="(item, index) in contentList"
          :key="item.user_id"
        >
          <div class="avatar" @click="toPersonalCenter(item.user_id)">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="text">{{ item.text }}</div>
          <div class="time">{{ item.time }}</div>
        </li>
      </el-scrollbar>
    </ul>
    <span class="close" @click="closeChat"
      ><el-icon size="25px" color="white"><Close /></el-icon
    ></span>
    <div class="user">
      <el-icon><User /></el-icon><span>{{ personCount }}</span>
    </div>
    <div class="input-content">
      <el-input
        v-model="message"
        placeholder="请输入信息"
        :type="inputType"
        @keydown.enter="sendMsg"
        v-focus
      ></el-input>
      <el-button type="primary" color="#18c5a3" @click="sendMsg"
        ><span style="color: white">发送</span></el-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { io } from "socket.io-client";
import { reactive, ref, watch } from "vue";
import { userInfo } from "@/stores/userInfo";
import router from "@/router";
import { vFocus } from "@/directives/v-focus";

interface IContentList {
  text: string;
  user_id: string;
  name: string;
  avatar: string;
  time: string;
}

const userStore = userInfo();
userStore.getUserInfo();
userStore.getId();
const id = userStore.user_id;
//连接io
const socket = io("ws://localhost:9527");

const message = ref("");
const inputType = ref("text");
const contentList = reactive<IContentList[]>([]);
const personCount = ref(0);

//监听信息输入框的内容长度
watch(message, () => {
  // console.log(message.value.trim().length);
  if (message.value.trim().length >= 50) {
    inputType.value = "textarea";
  } else {
    inputType.value = "text";
  }
});

const emit = defineEmits<{
  (e: "closeChat"): void;
}>();

const closeChat = () => {
  socket.close();
  //发送关闭事件
  emit("closeChat");
};

// 连接成功
socket.on("connect", () => {
  //   console.log(socket.id,);
  // alert('连接成功');
  personCount.value++;
});
// 断开连接
socket.on("disconnect", () => {
  personCount.value--;
});

//发送消息
const sendMsg = () => {
  if (message.value.trim().length === 0) {
    return ElMessage({
      message: "消息不能为空",
      type: "error",
    });
  }
  socket.emit("message", {
    text: message.value.trim(),
    user_id: userStore.userInfo.user_id,
    name: userStore.userInfo.username,
    avatar: userStore.userInfo.avatar,
    time: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
  });

  message.value = "";
};

//接收消息
socket.on("messageResponse", (message) => {
  // console.log(message);
  contentList.push(message);
});

//跳转个人详情页
const toPersonalCenter = (id: string) => {
  router.push({
    path: "/personalCenter",
    query: {
      id,
    },
  });
};
</script>
<style lang="less" scoped>
#chat {
  width: 70%;
  height: 80vh;
  background: #e9e9e9;
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  padding: 20px 25px 5px 5px;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -52%);
  .content-wrap {
    width: 100%;
    padding: 0 0 35px 0;
    overflow-y: auto;
    height: 70vh;
    .content_list {
      margin: 5px 0;
      display: flex;
      position: relative;
      padding: 15px 3px;
      .avatar {
        margin-right: 5px;
        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }
      }
      .text {
        font-weight: bold;
        font-size: 16px;
        margin-left: 8px;
      }
      .time {
        font-size: 12px;
        vertical-align: bottom;
        position: absolute;
        right: 12px;
        bottom: -3px;
      }
    }
    .content_list_right {
      width: 100%;
      float: right;
      margin: 5px 0;
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      padding: 15px 30px 15px 3px;
      .avatar {
        margin-left: 5px;
        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }
      }
      .text {
        font-weight: bold;
        font-size: 16px;
        margin-right: 8px;
      }
      .time {
        font-size: 12px;
        position: absolute;
        right: 30px;
        bottom: 0;
      }
    }
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
  }
  .user {
    position: absolute;
    right: 30px;
    top: 0;
    span {
      vertical-align: 3px;
    }
  }
  .input-content {
    width: 98%;
    display: flex;
    position: absolute;
    bottom: 5px;
    .el-input {
      flex: 1;
    }
  }
}
</style>
