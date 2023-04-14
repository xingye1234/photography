<template>
  <div id="detail">
    <TopHeader></TopHeader>
    <div class="common-layout">
      <el-container>
        <el-container>
          <!-- 基本信息 -->
          <el-main>
            <!-- 左区域 -->
            <div class="content-left">
              <div class="img">
                <img :src="state.dataInfo.img" alt="" />
              </div>
            </div>
            <!-- 右区域 -->
            <div class="content-right">
              <el-scrollbar height="76vh">
                <!-- 头像区域 -->
                <div class="avatar" style="border-bottom: 1px solid #e9e9e9">
                  <img
                    :src="state.userInfo.avatar"
                    alt=""
                    class="avatar_img"
                    @click="toPersonalCenter(state.userInfo.user_id)"
                    v-if="state.userInfo.avatar"
                  />
                  <img
                    src="../../assets/个人中心/head180.png"
                    alt=""
                    class="avatar_img"
                    v-else
                  />
                  <div class="nick_name">{{ state.userInfo.username }}</div>
                  <div class="follow" v-if="isShowFollow">
                    <div v-if="!state.showFollow" @click="followUser">
                      <el-icon><Plus /></el-icon>
                      <span>关注</span>
                    </div>
                    <!-- <div  > @click="cancelFollow" -->
                    <span v-else>已关注</span>
                    <!-- </div> -->
                  </div>
                  <div class="bottom">
                    <li class="attention">
                      关注<a href="#">{{ state.userInfo.followee_count }}</a>
                    </li>
                    <li class="attention">
                      粉丝<a href="#">{{ state.userInfo.follower_count }}</a>
                    </li>
                    <li class="attention">
                      作品<a href="#">{{ state.productCount }}</a>
                    </li>
                  </div>
                </div>
                <!-- 点赞、评论、举报 -->
                <div class="list-item">
                  <li @click="giveLike(state.dataInfo.article_id)">
                    <img src="../../assets/爱心.png" alt="" />
                    <span>{{ state.dataInfo.good }}</span>
                  </li>
                  <li @click="toCommot">
                    <el-icon size="25px"><ChatDotRound /></el-icon>
                  </li>
                  <li @click="state.dialogVisible = true">
                    <el-icon size="25px"><WarnTriangleFilled /></el-icon>
                  </li>
                </div>
                <div class="title">
                  {{ state.dataInfo.title }}
                </div>
                <!-- 评分 -->
                <div class="rate">
                  <span style="vertical-align: 3px">你的评价是：</span>
                  <el-rate
                    v-model="value"
                    :texts="['很差', '一般', '普通', '优秀', '非常好']"
                    show-text
                  />
                </div>
                <!-- 评论 -->
                <div class="input">
                  <div class="comment-tag">
                    <el-tag
                      type="success"
                      v-for="(item, index) in commentValue"
                      :key="index"
                      @click="addComment(item)"
                      >{{ item }}</el-tag
                    >
                  </div>
                  <div class="input-comment">
                    <el-input
                      v-model="state.input"
                      placeholder="发表您的见解"
                      clearable
                    />
                    <el-button color="#18C5A3" @click="sendComment"
                      >发送</el-button
                    >
                  </div>
                </div>
                <div class="content">
                  <span v-if="state.comment.length">
                    <li v-for="(item, index) in state.comment" :key="item.id">
                      <div class="user" @click="toPersonalCenter(item.user_id)">
                        <img :src="item.avatar" alt="" />
                        <span>{{ item.username }}:&nbsp;</span>
                      </div>
                      <div class="comment-wrap">
                        {{ item.content }}
                      </div>
                    </li>
                  </span>
                  <span v-else> 当前暂无评论 </span>
                </div>
              </el-scrollbar>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 举报对话框 -->
    <el-dialog
      v-model="state.dialogVisible"
      title="举报"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="state.form">
        <el-form-item label="举报类型">
          <el-select
            v-model="state.form.region"
            placeholder="请选择您的举报类型"
          >
            <el-option label="标题" value="标题" />
            <el-option label="评论" value="评论" />
            <el-option label="图片" value="图片" />
          </el-select>
        </el-form-item>
        <el-form-item label="举报内容">
          <el-input
            v-model="state.form.desc"
            type="textarea"
            placeholder="添加的您的文字描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="closeDialog">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 底部 -->
    <Footer></Footer>
  </div>
</template>
<script setup lang="ts">
import TopHeader from "@/components/home/Header/TopHeader.vue";
import Footer from "@/components/home/Footer.vue";
import { useRoute, useRouter } from "vue-router";
import requests from "@/network/request";
import { onMounted, ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox, inputEmits } from "element-plus";
import { getId, getItem } from "@/utils/login";
import { userInfo } from "@/stores/userInfo";
import type { IArticleInfo, IUserInfo } from "@/types/type";

interface ICommentInfo {
  id: number;
  article_id: number;
  user_id: number;
  avatar: string;
  username: string;
  content: string;
  create_time: string;
}

const userStore = userInfo();
userStore.getUserInfo();

const route = useRoute();
const router = useRouter();

//数据收集
const state = reactive({
  userInfo: <IUserInfo>{},
  dataInfo: <IArticleInfo>{},
  input: "", //收集评论
  dialogVisible: false, //展示对话框
  comment: <ICommentInfo[]>[], //文章评论
  form: {
    region: "",
    desc: "",
  }, //举报表单
  showFollow: false, //控制显示关注按钮
  productCount: 0,
});

const isShowFollow = computed(() => {
  userStore.getId();
  // console.log(state.userInfo.user_id, "userStore:", +userStore.user_id);
  return state.userInfo.user_id !== +userStore.user_id;
});

//快捷评论
const commentValue = reactive<string[]>([
  "真棒！",
  "楼主真腻害！",
  "楼主的技术真是惊为天人！",
  "阁下佩服",
  "请收下我的膝盖",
  "不明觉厉",
  "6",
  "腻害",
]);

//评论敏感词
const errorComent = reactive<string[]>([
  "逼",
  "我操",
  "b",
  "B",
  "傻逼",
  "妈",
  "操你妈",
  "垃圾",
]);

const value = ref();

//dom挂载完成之后请求数据
onMounted(() => {
  //获取文章详情信息
  getItemDetailInfo();
  //获取文章评论
  getCommentInfo();
  //获取用户数据
  getUserInfo();
  //获取用户关注
  getUserFollow();
  //获取用户作品数量
  getArticleCount();
});

//请求文章详情数据
const getItemDetailInfo = async () => {
  // console.log(route.query.article_id);
  try {
    const { data } = await requests(
      `/detail/itemDetail/${route.query.article_id}`
    );
    // console.log(data);
    if (data.code === 200) {
      state.dataInfo = data.data[0];
    }
  } catch (error) {
    console.log(error);
  }
};

//请求用户数据
const getUserInfo = async () => {
  try {
    const { data } = await requests(`/detail/userInfo/${route.query.user_id}`);
    // console.log(data);
    if (data.code === 200) {
      // console.log(data.data[0]);
      state.userInfo = data.data[0];
    }
  } catch (error) {
    console.log(error);
  }
};

//请求评论
const getCommentInfo = async () => {
  try {
    const article_id = route.query.article_id;
    const { data } = await requests(`/detail/comments/${article_id}`);
    //  console.log(data);
    if (data.code === 200) {
      state.comment = data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

//请求用户关注
const getUserFollow = async () => {
  try {
    const { data } = await requests(`/detail/user_follow/${getId()}`);
    // console.log(data.data);
    if (data.code === 200) {
      if (data.data.length === 0) {
        return (state.showFollow = false);
      }
      //对比被关注者id，如果相等则为true
      let flag = data.data.some((item: any) => {
        return item.to_id == state.userInfo.user_id;
      });
      state.showFollow = flag;
    }
  } catch (error) {
    console.log(error);
  }
};

//请求用户作品数量
const getArticleCount = async () => {
  try {
    const { data } = await requests(`/user/production/${route.query.user_id}`);
    // console.log(data);
    state.productCount = data.data.length;
  } catch (error) {
    console.log(error);
  }
};

//点击喜欢按钮
const giveLike = async (id: number) => {
  // console.log(id);
  try {
    const { data } = await requests(`/detail/userLike/${id}`);

    if (data.code === 200) {
      getItemDetailInfo();
      ElMessage({
        message: data.msg,
        type: "success",
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

//点击评论按钮
const toCommot = () => {};

//处理关闭对话框
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("你确定要关闭对话框吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

//关闭对话框,提交举报信喜,清空表单数据
const closeDialog = async () => {
  if (state.form.region === "") {
    ElMessage({
      message: "类型不能为空！",
      type: "error",
    });
    return;
  }

  // 提交举报信息
  try {
    const { data } = await requests({
      url: "/detail/report",
      method: "POST",
      data: {
        reportable_id: route.query.user_id,
        article_id: state.dataInfo.article_id,
        username: state.userInfo.username,
        article_name:state.dataInfo.title,
        type: state.form.region,
        description: state.form.desc,
      },
    });

    if (data.code === 200) {
      state.dialogVisible = false;
      state.form.desc = "";
      state.form.region = "";
      return ElMessage({
        message: data.msg,
        type: "success",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//点击添加评论
const addComment = (value: string) => {
  state.input = value;
};

//点击发送评论
const sendComment = async () => {
  if (state.input.trim().length === 0) {
    ElMessage({
      message: "请填写内容！",
      type: "error",
    });
    return;
  }
  if (errorComent.includes(state.input.trim())) {
    ElMessage({
      message: "你的评论包含敏感词汇！",
      type: "error",
    });
    return;
  }

  //从路由中获取文章ID
  const article_id = route.query.article_id;
  const user_id = getId();
  const user_name = getItem("name");
  if (!user_name) {
    router.push("/login");
    ElMessage({
      message: "请前往登录页面登录",
    });
    return;
  }
  //发送请求
  try {
    const { data } = await requests({
      url: "/detail/pluscomment",
      method: "POST",
      data: {
        article_id,
        user_id,
        avatar: state.userInfo.avatar,
        username: userStore.name,
        content: state.input.trim(),
      },
    });
    // console.log(data);
    if (data.code === 200) {
      //清空用户输入的数据
      state.input = "";
      //再次发送评论请求，更新评论
      getCommentInfo();
      ElMessage({
        message: data.msg,
        type: "success",
      });
      return;
    }
  } catch (error) {}
};

//用户点击关注按钮
const followUser = async () => {
  try {
    const { data } = await requests({
      url: "detail/follow",
      method: "POST",
      data: {
        to: state.userInfo.user_id, //被关注者id
        from: getId(), // 关注者id
        username: state.userInfo.username, //被关注者用户名
        avatar: state.userInfo.avatar, //被关注者头像
      },
    });

    if (data.code === 200) {
      state.showFollow = data.isFollow;
      getUserInfo();
      return ElMessage({
        message: data.msg,
        type: "success",
      });
    }
  } catch (error) {
    throw error;
  }
};

//点击用户头像进入个人中心
const toPersonalCenter = (id: number) => {
  router.push({
    path: "/personalCenter",
    query: {
      id,
    },
  });
};
</script>
<style lang="less" scoped>
#detail {
  .radius {
    border-radius: 5px;
    background-color: white;
  }
  .box-sizing {
    padding: 20px;
    box-sizing: border-box;
  }
  .el-aside {
    // background-color: skyblue;
    margin-right: 25px;
    border-radius: 3px;
    .radius();
  }
  .el-header {
    line-height: 60px;
    .radius();
  }
  .el-main {
    .radius();
    padding: 10px 20px;
    margin-top: 10px;
    .content-left {
      width: 75%;
      height: 76vh;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .content-right {
      float: right;
      width: 25%;
      height: 76vh;
      // overflow-y: scroll;
      border-left: 1px solid #e9e9e9;
      .list-item {
        display: flex;
        justify-content: space-between;
        .box-sizing();
        border-bottom: 1px solid #e9e9e9;
        li {
          flex: 1;
          text-align: center;
          span {
            vertical-align: top;
          }
        }
        img {
          width: 25px;
          height: 25px;
        }
      }
      .follow {
        border: 1px solid #18c5a3;
        border-radius: 25px;
        padding: 5px 10px;
        box-sizing: border-box;
        font-size: 12px;
        span {
          vertical-align: 1px;
        }
      }
      .title {
        .box-sizing();
        font-size: 25px;
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #e9e9e9;
      }
      .rate {
        padding: 10px 20px;
        box-sizing: border-box;
        text-align: center;
        border-bottom: 1px solid #e9e9e9;
      }
      .input {
        margin-top: 5px;
        .comment-tag {
          display: inline-block;
          .el-tag {
            margin: 0 5px 5px;
          }
        }
        .box-sizing();
        .input-comment {
          display: flex;
        }
        .el-button {
          color: white;
        }
      }
      .content {
        .box-sizing();
        li {
          margin-bottom: 15px;
          display: flex;
        }
        .user {
          img {
            width: 25px;
            height: 25px;
            border-radius: 50%;
          }
          span {
            vertical-align: top;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .common-layout {
    margin-top: 50px;
    padding: 20px 75px 0;
    .avatar {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: white;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: block;
      }
      .nick_name {
        text-align: center;
        font-weight: bold;
        font-size: 20px;
      }
      .bottom {
        width: 100%;
        display: flex;
        margin-top: 25px;
        border-top: 1px solid #e9e9e9;
        li {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 20px;
          padding: 15px;
          box-sizing: border-box;
          border-right: 1px solid #e9e9e9;
          a {
            margin-left: 5px;
            display: block;
            font-size: 12px;
          }
          a:hover {
            color: red;
          }
        }
        li:last-child {
          border-right: none;
        }
      }
    }
    .demo-ruleForm {
      padding: 30px 0 0;
    }
  }
}
</style>
