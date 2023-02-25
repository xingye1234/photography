<template>
  <div id="top_header">
    <div class="left">
      <li><RouterLink to="/home">网站首页</RouterLink></li>
      <li
        @mouseenter="isShowChatImg = true"
        @mouseleave="isShowChatImg = false"
      >
        <a href="#">官方微信</a>
        <img src="@/assets/微信.jpg" class="chat_img" v-show="isShowChatImg" />
      </li>
      <li @mouseenter="isShowQQImg = true" @mouseleave="isShowQQImg = false">
        <a href="#">官方QQ</a>
        <img src="@/assets/QQ.jpg" class="qq_img" v-show="isShowQQImg" />
      </li>
    </div>
    <div class="right">
      <div v-if="user.name" class="isshow">
        <li>
          欢迎登录<span style="color: skyblue; margin-left: 5px">{{
            user.name
          }}</span>
        </li>
        <li @click="personalCenter">个人中心</li>
        <li @click="dialogVisible = true">退出登录</li>
      </div>
      <div v-else class="isshow">
        <li @click="router.push('/login')">登录</li>
        <li @click="registerBtn">注册</li>
      </div>
    </div>

    <!-- 退出登录对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定要退出登录吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="logOut"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { ref, h } from "vue";
import { userInfo } from "@/stores/userInfo";
import { removeItem } from "@/utils/login";
import { ElMessageBox, ElMessage } from "element-plus";

const dialogVisible = ref(false);

const router = useRouter();

const input = ref("");

const isShowChatImg = ref(false);
const isShowQQImg = ref(false);

//从状态库中取出用户名
const user = userInfo();
//调用pinia中的getName方法
user.getName();

//跳转到个人中心
function personalCenter() {
  router.push("/personalCenter");
}

const direction = ref("rtl");

//退出登录
function logOut() {
  dialogVisible.value = false;
  // 删除localStorage中的name
  removeItem("name");
  ElMessage({
    message: "退出成功",
    type: "success",
  });
  //退出后重新获取store中的name
  user.getName();
}

const registerBtn = () => {
  router.push("/register");
};

//处理关闭对话框
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("要关闭这个对话框吗?")
    .then(() => {
      done();
    })
    .catch(() => {});
};
</script>
<style lang='less' scoped>
#top_header {
  height: 50px;
  width: 100%;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 0 25px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(235, 235, 235);

  a {
    color: black;
    font-size: 12px;
    font-weight: bold;
  }
  li {
    display: inline-block;
    box-sizing: border-box;
    margin-right: 25px;
    position: relative;
  }
  img {
    width: 100px;
    height: 100px;
    position: absolute;
    left: -25px;
    top: 37px;
    z-index: 9999;
  }

  .right {
    .isshow {
      display: flex;
      justify-content: space-between;
      text-align: center;
      li {
        padding: 5px 15px;
        box-sizing: border-box;
        cursor: pointer;
        color: black;
        font-size: 12px;
        margin: 0;
        font-weight: bold;
      }
      li:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>