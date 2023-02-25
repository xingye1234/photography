<template>
<div>
    <TopHeader></TopHeader>
    <el-scrollbar height="100vh">
        <div id="share">
        <!-- 左边区域 -->
        <div class="left_warp">
            <div class="content">
                <li v-for="(item, index) in articleStore.articleInfo" :key="index">
                    <!-- 头部区域 -->
                    <div class="user-top">
                        <div class="user-top-left" @click="toPersonalCenter(item.user_id)">
                            <img :src="item.avatar" alt="" v-if="item.avatar">
                            <img src="../assets/个人中心/head180.png" alt="" v-else/>
                            <span>{{ item.username }}</span>
                        </div>
                        <div class="user-top-right">
                            <div class="follow">
                                <div @click="followUser(item.user_id, item.username, item.avatar)">
                                    <template v-if="item.showFollow">
                                        <el-icon><Plus /></el-icon>
                                        <span>关注</span>
                                    </template>
                                    <template v-if="!item.showFollow">
                                        <span>已关注</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 内容区域 -->
                    <div class="article-wrap" @click="toDetail(item.article_id, item.user_id)">
                        <div class="img-wrap">
                            <img :src="item.img" alt=""/>
                        </div>
                        <div class="title">
                            {{ item.title }}
                        </div>
                        <div class="description">
                            {{ item.description }}
                        </div>
                        <div class="address" v-show="item.address">
                            {{ item.address }}<el-icon size="20px" @click="showMap"><Location /></el-icon>
                        </div>
                    </div>
                    <!-- 点赞区域 -->
                    <div class="opation-wrap">
                        <div class="left">
                            <div class="list-item">
                            <p><img src="../../assets/爱心.png" alt="" @click="likeBtn(item.article_id)"> <span>{{ item.good }}</span></p>
                            <p><el-icon size="25px" @click="toDetail(item.article_id, item.user_id)"><ChatDotRound /></el-icon></p>
                            <p><el-icon size="25px"><WarnTriangleFilled /></el-icon></p>
                        </div>
                    </div>
                    <div class="right">
                            <a @click="toDetail(item.article_id, item.user_id)">查看详情</a>
                        </div>
                    </div>
                </li>
            </div>
        </div>
        <!-- 右边区域 -->
        <div class="right_warp">
            <div class="user-avatar">
                <img :src="userStore.userInfo.avatar" alt="" v-if="userStore.userInfo.avatar">
                <img src="../assets/个人中心/head180.png" alt="" v-else/>
                <span>{{ userStore.userInfo.username }}</span>
            </div>
            <div class="user-detail">
                <li>关注
                    <span>{{userStore.userInfo.followee_count}}</span>
                </li>
                <li>粉丝
                    <span>{{ userStore.userInfo.follower_count }}</span>
                </li>
                <li @click="readProduct" class="production">作品
                    <span>{{ state.count }}</span>
                </li>
            </div>

            <div class="address" @click="addressBtn">
                <el-icon size="50px"><Location /></el-icon>
                <span>地点打卡</span>
            </div>

            <div class="chat" @click="chatBtn">
                <el-icon size="40px"><ChatDotRound /></el-icon>
                <span>聊天频道</span>
            </div>
        </div>
        
    </div>
    </el-scrollbar>

    <!-- 对话框 -->
  <el-dialog v-model="dialogFormVisible" title="发表帖子">
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="标题">
        <el-input
          v-model="form.title"
          autocomplete="off"
          placeholder="在此输入标题"
          disabled
        />
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          v-model:file-list="fileList"
          action="http://localhost:9527/article/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="form.desc"
          autocomplete="off"
          type="textarea"
          placeholder="在此输入内容"
        />
      </el-form-item>
      <el-form-item label="地址">
        <p>{{ state.address }}</p>
        <el-icon size="25px" @click="showMap"><Location /></el-icon>
      </el-form-item>
    </el-form>
    <!-- 取消或确认 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmContent"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
    <!-- 发表内容按钮 -->
    <Camera @get-articles="getArticle"></Camera>

    <!-- 地图组件 -->
    <Map v-if="state.showMap" @close-map="closeMap"></Map>

    <!-- 聊天频道 -->
    <Chat v-if="state.showChat" @close-chat="closeChat"></Chat>
</div>
</template>
<script setup lang="ts">
import { articleInfo } from '@/stores/article';
import { userInfo } from '@/stores/userInfo';
import { onMounted, reactive, ref } from 'vue';
import TopHeader from '../../components/home/Header/TopHeader.vue';
import Camera from '../../components/Camera.vue';
import { useRouter } from 'vue-router';
import { ElMessage,ElMessageBox } from 'element-plus';
import requests from "@/network/request";
import Map from '@/components/map/Map.vue'
import type { UploadProps, UploadUserFile,UploadRawFile, UploadFile, UploadFiles} from "element-plus";
import Chat from '@/views/chat/Chat.vue';

import type { IArticle } from '@/stores/articleType';

const articleStore = articleInfo();
const userStore = userInfo()
const router = useRouter();

//获取用户数据
userStore.getUserInfo();



onMounted(()=>{
    //获取文章
    getArticle()
    //获取用户关注
    getUserFollow()
    //获取用户作品
    getUserProduct()
})

const dialogFormVisible = ref(false);
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const form = reactive({
  title: "地点打卡",
  desc: "",
});

// 需要上传的照片
const fileList = ref<UploadUserFile[]>([]);
const state = reactive({
    showFollow:false,
    count:0,
    showMap:false,
    dialogVisible:false,
    inputContent:'',
    address:'',
    showChat:false,
})


//获取文章数据
const getArticle = ()=>{
    articleStore.getArticleInfo()
}

//请求用户关注
const getUserFollow = async ()=> {
   try {
    const {data} = await requests(`/detail/user_follow/${userStore.userInfo.user_id}`);
    // console.log(data);
    if(data.code === 200){
       articleStore.articleInfo.forEach(articleItem => {
           data.data.forEach(followItem => {
               if(articleItem.user_id === followItem.to_id){
                articleItem.showFollow = false;
               }else{
                 articleItem.showFollow = true;
               }
           });
        //    console.log(articleItem.showFollow);
       })
    }
   } catch (error) {
    console.log(error);
   }
}

//请求用户作品
const getUserProduct = async ()=>{
    // console.log(userStore.userInfo.user_id);
    try {
        const {data} = await requests(`/detail/userProduct/${userStore.userInfo.user_id}`);
        // console.log(data);
        if(data.code === 200){
            state.count = data.data;
        }
    } catch (error) {
        console.log(error);
    }
}

//进入详情页
const toDetail = (article_id:number, user_id:number)=>{
    // console.log(articleStore.articleInfo);
    router.push({
    path: "detail",
    query: {
     article_id,
     user_id,
    }
  });
}


//点赞
const likeBtn = async (id:number)=>{
    try {
    const {data} = await requests(`/detail/userLike/${id}`)
    articleStore.getArticleInfo()
    if(data.code === 200){
      return ElMessage({
        message:data.msg,
        type:'success',
      })
    }
  } catch (error) {
    console.log(error);
  }
}

//关注按钮
const followUser = async(user_id:number, username:string, avatar:string)=> {
    try {
      const {data} = await requests({
      url:'detail/follow',
      method: 'POST',
      data:{
        to:user_id, //被关注者id
        from:userStore.userInfo.user_id, // 关注者id
        username, //被关注者用户名
        avatar//被关注者头像
      }
    })

    if(data.code === 200){
      
      state.showFollow = data.isFollow;
      return ElMessage({
        message:data.msg,
        type:"success",
      })
    }
    } catch (error) {
      console.log(error);
    }
}

//查看作品
const readProduct = ()=>{
    router.push('/personalCenter')
}

//查看用户信息
const toPersonalCenter = (id:number)=>{
    console.log(id);
    router.push({
        path:'/personalCenter', 
        query:{
            id
        }
    })
}

//点击发布地点打卡
const addressBtn = ()=>{
    // state.showMap = true;
    dialogFormVisible.value = true
}

//确认发表按钮
const confirmContent = async () => {
  if (form.title.trim().length === 0 && form.desc.trim().length === 0) {
    return ElMessage({
      type: "error",
      message: "标题或描述内容不能为空",
    });
  }
   let {username, avatar, user_id} = JSON.parse((sessionStorage.getItem('userInfo') as any));
  //  console.log(username, avatar);
   try {
    const {data} = await requests({
    url:'/article/pubcontent',
    method:'post',
    data:{
      user_id,
      title:form.title,
      desc:form.desc,
      username,
      avatar,
      address:state.address
    }
   })

    // console.log(data);
  if(data.code === 200){
      ElMessage({
        message:data.msg,
        type: "success",
      })
      getArticle() //发表成功后再次请求文章详情
    }
   } catch (error) {
   }

  dialogFormVisible.value = false;

  // 关闭对话框后清除内容
  form.title = "";
  form.desc = "";
  fileList.value.splice(0, fileList.value.length);
};

const closeMap =(value:string)=>{
    state.showMap = false;
    state.address = value;
}

const showMap = ()=>{
    state.showMap = true;
}

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
//   console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

//进入聊天频道
const chatBtn = ()=>{
   state.showChat = true;
}

const closeChat = ()=>{
    state.showChat = false;
}

</script>
<style lang='less' scoped>
#share{
    width: 70%;
    margin: 0 auto;
    box-sizing: border-box;
    margin-top: 50px;
    background: #f5f5f5;
    position: relative;
    overflow: hidden;
    .left_warp{
        width: 70%;
        margin-top: 10px;
        .content{
            li{
                background: white;
                margin-bottom: 25px;
                padding: 15px 15px 0;
                box-sizing: border-box;
                border: 1px solid #e9e9e9;
                border-radius: 3px;
            .user-top{
                height: 80px;
                
                display: flex;
                justify-content: space-between;
                align-items: center;
                .user-top-left{
                    img{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    }
                    span{
                        vertical-align: 20px;
                        font-size: 16px;
                        margin-left: 5px;
                    }
                }
                .user-top-right{
                    .follow{
                        border:1px solid #18c5A3;
                        border-radius: 25px;
                        padding: 5px 20px;
                        box-sizing: border-box;
                        font-size: 12px;
                        span{
                        vertical-align: 1px;
                        }
                }
                }
            }

            .article-wrap{
                .img-wrap{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .title{
                    margin-top: 10px;
                    font-size: 24px;
                    font-weight: bold;
                }
                .description{
                    color:#525558;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #e9e9e9;
                }

                .address{
                    font-size: 12px;
                    margin-left: 5px;
                    display: flex;
                    flex-direction: row-reverse;
                    padding-top: 5px;
                    .el-icon{
                        vertical-align: bottom;
                    }
                }
            }

           .opation-wrap{
            display: flex;
            justify-content: space-between;
            .list-item{
                height: 60px;
                display: flex;
                align-items: center;
                span{
                    vertical-align: top;
                }
                p{
                    margin-right: 25px;
                }
                img{
                width: 25px;
                height: 25px;
                }
            }
            .right{
                line-height: 60px;
                margin-right: 5px;
                a:hover{
                    color: #18c5A3;
                    text-decoration: underline;
                }
            }
           }
        }
        }
    }
    .box-padding{
        padding: 0 20px 10px;
        box-sizing: border-box;
    }
    .right_warp{
        width: 20%;
        height: 92vh;
        background: white;
        position: fixed;
        right: 15%;
        top: 60px;
        z-index: 99;
        padding-top: 15px;
        box-sizing: border-box;
        border: 1px solid #e9e9e9;
        border-radius: 3px;
        .user-avatar{
            .box-padding();
            border-bottom: 1px solid #e9e9e9;
            img{
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            span{
                vertical-align: 20px;
                margin-left: 5px;
                font-size: 20px;
            }
        }
        .user-detail{
            display: flex;
            border-bottom: 1px solid #e9e9e9;
            li{
                border-right: 1px solid #e9e9e9;
                line-height: 50px;
                flex: 1;
                text-align: center;
            }
            .production:hover{
                color: #18c5A3;
                cursor: pointer;
            }
        }
        .address{
            padding: 25px;
            height: 150px;
            border-bottom: 1px solid #e9e9e9;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .chat{
            .address();
            font-size: 16px;
            span{
                margin-left: 5px;
            }
        }
    }
}
</style>