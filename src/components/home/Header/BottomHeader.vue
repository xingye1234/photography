<template>
  <div id="header">
    <h1 class="left">
      <span>H</span>  <!-- Headstream photography -->
      <span>p</span>
    </h1>
    <div class="content-list">
      <li v-for="(item, index) in navList" :key="index">
        <span @click="navgiatorTo(item.path)">{{ item.title }}</span>
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
      />
      <el-button type="primary" @click="searchBtn" size="small">
        <el-icon style="margin-right: 3px"><Search /></el-icon>搜索
      </el-button>

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
            style="margin: 0 10px 10px 0"
            closable
            @close="handleCloseTag(item)"
            >{{ item }}</el-tag
          >
        </template>
        <span v-else>暂无搜索历史</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { searchLog } from "@/stores/searchLog";
import { useRouter } from "vue-router";

//searchLog仓库
const search = searchLog();

const router = useRouter();

const navList = [
  { path: "/map", title: "摄影大神" },
  { path: "/rank", title: "排行榜" },
  { path: "/share", title: "摄影分享区" },
  { path: "/jinghua", title: "精华" },
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
const searchBtn = () => {
  if (input.value.trim() !== "") {
    search.addSearchLog(input.value);
    // console.log(search.searchArr);
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
</script>

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
  position: relative;
  top: 50px;
  left: 0;
  z-index: 9;
  background-color: white;
  h1 {
    flex: 0.1;
    font-style: italic;
    font-family: "华文行楷";
    color: #62a9fd;
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
      cursor: pointer;
      span {
        font-weight: bold;
        padding: 5px 15px;
        transition: all 0.3s;
      }
      span:hover {
        background-color: rgba(0, 0, 0, 0.4);
        color: white;
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
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.avatr_img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>