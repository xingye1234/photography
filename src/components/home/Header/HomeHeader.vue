<template>
    <div id="header" :style="{background:isWhite}">
      <h1 class="left" @click="router.replace('/home')">
        <span>H</span>  <!-- Headstream photography -->
        <span>p</span>
      </h1>
      <div class="content-list">
        <li v-for="(item, index) in navList" :key="index">
          <span @click="navgiatorTo(item.path)" :style="{color:isBlack}">{{ item.title }}</span>
        </li>
      </div>
  
      <!-- 搜索栏 -->
      <div class="input-wrap">
        <el-input
          v-model="input"
          placeholder="请输入搜索内容"
          clearable
          :prefix-icon="Search"
          @focus="isShowPanel = true"
          maxlength="128"
          size="small"
          @keydown.enter="searchBtn"
        />
        <el-button style="color:white" color="#18C5A3" @click="searchBtn" size="small">搜索</el-button>
        <!-- 搜索版块信息 -->
        <div
          class="search-panel"
          v-show="isShowPanel"
          :class="{ active: isShowPanel }"
        >
          <p @click="closePanel">X</p>
          <template v-if="search.searchArr.length">
            <el-tag
              v-for="(item, index) in search.searchArr"
              :key="index"
              style="margin: 0 10px 10px 0; font-size: 12px;"
              closable
              size="small"
              @close="handleCloseTag(item)"
              >{{ item }}</el-tag
            >
          </template>
          <span v-else>暂无搜索历史</span>
        </div>
      </div>
      <div class="user" style="margin-left:15px" v-if="userStore.name">
        <el-dropdown :hide-on-click="false" trigger="click">
          <div>
            <img :src="userStore.userInfo.avatar" alt="" v-if="userStore.userInfo.avatar" class="avatar"/>
            <img class="avatar" src="../../../assets/个人中心/head180.png" alt="" v-else/>
            <span class="text">{{ userStore.name }}  </span>
            <el-icon class="el-icon--right" color="#18C5A3"><arrow-down /></el-icon>
          </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item >
            <el-upload
              class="upload-demo"
              action="http://localhost:9527/user/avatar"
              :data="{id:getId()}"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
            上传头像
          </el-upload>
          </el-dropdown-item>
          <el-dropdown-item @click="personalCenter">个人中心</el-dropdown-item>
          <el-dropdown-item @click="dialogVisible = true">退出登录</el-dropdown-item>
          
        </el-dropdown-menu>
      </template>
      </el-dropdown>
      </div>
      <div v-else class="isshow">
        <li @click="router.push('/login')" class="login" :style={color:isBlack}>登录</li>
        <li @click="registerBtn" class="register">注册</li>
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
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { ElMessage,ElMessageBox } from "element-plus";
  import { Search } from "@element-plus/icons-vue";
  import { searchLog } from "@/stores/searchLog";
  import { useRouter } from "vue-router";
  import { userInfo } from "@/stores/userInfo";
  import { ArrowDown } from '@element-plus/icons-vue'
  import { getId, removeItem } from "@/utils/login";
  import { throttle } from "lodash";
  import type { UploadProps, UploadUserFile } from 'element-plus'
  
  const router = useRouter();
  
  //searchLog仓库
  const search = searchLog();
  const imageUrl = ref('');
  //从状态库中取出用户名
  const userStore = userInfo();

  onMounted(()=>{
    userStore.getName();
  })

  const dialogVisible = ref(false);

  const navList = [
    { path: "/map", title: "摄影师" },
    { path: "/rank", title: "排行榜" },
    { path: "/share", title: "摄影分享区" },
    { path: "/imgLibrary", title: "图库" },
  ];
  
  //导航栏跳转
  const navgiatorTo = (path: string) => {
    // console.log(path);
    router.push(path);
  };


  
  //搜索框
  const input = ref("");
  
  //点击搜索框时的操作
  const searchBtn = async () => {
    if (input.value.trim() !== "") {
      search.addSearchLog(input.value);
      // console.log(search.searchArr);
      router.push({
        path:'/search',
        query:{
          searchData:input.value
        }
      });
    } else {
      return ElMessage({
        type: "error",
        message: "搜索内容不能为空！",
      });
    }
  };
  
  //关闭search tag 标签
  const handleCloseTag = (value: string) => {
    search.delSearchLog(value);
  };
  
  const isShowPanel = ref(false);
  
  //关闭搜索面板
  const closePanel = () => {
    isShowPanel.value = false;
  };

  const isShowChatImg = ref(false);
  const isShowQQImg = ref(false);

  //跳转到个人中心
  function personalCenter() {
    userStore.getId()
    router.push({
      path: "/personalCenter",
      query:{
        id:userStore.user_id,
      }
    })
  }

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
    userStore.getName();
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


  //将导航栏颜色改为白色

  const isWhite = ref('')
  const isBlack = ref('')
  const handleSrcol = () => {
    // console.log(scrollY);
    if(parseInt(" " + scrollY) >= 452){
      isWhite.value = 'white';
      isBlack.value = 'black';
    }else{
      isWhite.value = 'none';
      isBlack.value = 'white';
    }
  };

  //监听滚动事件
  window.addEventListener('scroll', throttle(handleSrcol, 300))


  //处理头像上传
  const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    // console.log(rawFile);
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//成功处理头像上传
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  userStore.userInfo.avatar = response.img;
  // console.log(response);
  return ElMessage({
    message:response.msg,
    type:"success"
  })
}


</script>
  
<style scoped>
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
/* .el-dropdown{
  width: 120px;
  background: black;
} */

</style>
<style lang='less' scoped>
#header {
  height: 70px;
  width: 100%;
  padding: 0 95px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  position: fixed;
  left: 0;
  z-index: 999;
  h1 {
    flex: 0.1;
    font-style: italic;
    font-family: "华文行楷";
    color: #62a9fd;
    font-size: 50px;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2), 2px 2px 2px rgba(0, 0, 0, 0.2),
      2px 2px 2px rgba(0, 0, 0, 0.2);
    letter-spacing: 5px;
    span {
      animation: myAnimation 0.4s ease-in-out infinite alternate;
    }
    span:nth-child(1) {
      animation-delay: 0.6s;
    }
    span:nth-child(2) {
      animation-delay: 0.8s;
    }

    @keyframes myAnimation {
      from {
        color: #62a9fd;
      }
      to {
        color: #9e80f3;
      }
    }
  }

  .content-list {
    flex: 1;
    display: flex;
    li {
      padding: 10px 20px;
      box-sizing: border-box;
      color: white;
      cursor: pointer;
      span {
        font-weight: bold;
        padding: 5px 15px;
        transition: all 0.3s;
        position: relative;
      }
      span:hover{
        background-color: rgba(0, 0, 0, 0.1) !important;
        color: #18C5A3 !important;
        border-radius: 5px;
      }
      
    }
  }

  .input-wrap {
    flex: 0.2;
    display: flex;
  }
  .search-panel {
    float: right;
    width: 200px;
    border-radius: 5px;
    position: absolute;
    top: 40px;
    left: 0;
    z-index: 999;
    background-color: white;
    padding: 20px;
    box-sizing: border-box;
    font-size: 16px;
    span {
      font-size: 14px;
    }
    p {
      position: absolute;
      right: 10px;
      top: 0;
      color: gray;
    }
  }
  .userbtn{
    color:white;
    width: 80px;
    font-size: 20px;
  }

  .avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  vertical-align: bottom;
}
.text{
  color:#18C5A3;
  vertical-align: 5px;
  margin-left: 5px;
}

  .isshow{
    display: flex;
    color: white;
    margin-left: 25px;
    li{
      padding: 0 15px;
      box-sizing: border-box;
      border: 1px solid #18C5A3;
      margin: 0 5px;
      position: relative;
      cursor: pointer;
    }

    
    .login:hover{
      background: #18C5A3;
    }
    .register{
      background: #18C5A3;
    }
  }
}

.dialog-footer button:first-child {
  margin-right: 10px;
}


</style>