<template>
  <div id="camera" @click="pubContent">
    <el-icon size="35px" color="#18c5a3"><CameraFilled /></el-icon>
    <span>发帖</span>
  </div>

  <!-- 对话框 -->
  <el-dialog v-model="dialogFormVisible" title="发表帖子">
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="标题">
        <el-input
          v-model="form.title"
          autocomplete="off"
          placeholder="在此输入标题"
        />
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          v-model:file-list="fileList"
          action="http://localhost:9527/article/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :multiple="true"
          :drag="true"
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
    </el-form>
    <!-- 取消或确认 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmContent"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import type { UploadProps, UploadUserFile,UploadRawFile, UploadFile, UploadFiles} from "element-plus";
import { ElMessage } from "element-plus";
import { userInfo } from "@/stores/userInfo";
import { useRouter } from "vue-router";
import requests from '@/network/request'

const router = useRouter();
const user = userInfo();
user.getName();

const dialogFormVisible = ref(false);

const emit = defineEmits<{
  (e:'getArticles'):void
}>()


const form = reactive({
  title: "",
  desc: "",
});

const pubContent = () => {
  
  if (user.name === "") {
    ElMessage({
      message: "您还没有登录, 3秒后自动跳转",
    });
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }else{
    dialogFormVisible.value = true;
  }
};

// 需要上传的照片
const fileList = ref<UploadUserFile[]>([]);

const dialogVisible = ref(false);
const dialogImageUrl = ref("");

const user_id = localStorage.getItem('id')

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};


//确认发表按钮
const confirmContent = async () => {
  if (form.title.trim().length === 0 && form.desc.trim().length === 0) {
    return ElMessage({
      type: "error",
      message: "标题或描述内容不能为空",
    });
  }
   let {username, avatar} = JSON.parse((sessionStorage.getItem('userInfo') as any));
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
      avatar
    }
   })

    // console.log(data);
  if(data.code === 200){
      ElMessage({
        message:data.msg,
        type: "success",
      })

      emit("getArticles")
    }
   } catch (error) {
   }

  dialogFormVisible.value = false;

  // 关闭对话框后清除内容
  form.title = "";
  form.desc = "";
  fileList.value.splice(0, fileList.value.length);
};
</script>

<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
<style lang='less' scoped>
#camera {
  width: 45px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  right: 20px;
  top: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>