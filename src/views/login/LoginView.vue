<template>
<div>
  <TopHeader></TopHeader>
  <div class="login_container">
    <!-- 登录 -->
    <div class="login">
      <h3><span>Login</span></h3>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
        class="demo-ruleForm" :size="'default'" status-icon  >
        <el-form-item  prop="name" style="width:80%" >
          <el-input v-model.trim="ruleForm.name" :prefix-icon="User" />
        </el-form-item>
        <el-form-item  prop="password" style="width:80%">
          <el-input v-model.trim="ruleForm.password" type="password" :prefix-icon="Lock" />
        </el-form-item>
        <el-button type="primary" size="large" color="#18c5a3" @click="loginBtn" style="width:80%" >
          <span style="color:white">Login</span>
        </el-button>
        <div class="bottom" @click="restPassword">Forget The Password?</div>
      </el-form>
    </div>
  </div>
</div>
</template>
<script setup lang="ts">
import TopHeader from "@/components/home/Header/TopHeader.vue";
import { reactive, ref, onMounted, h } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElNotification, ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import requests from "@/network/request";
import { User,Lock } from "@element-plus/icons-vue";


const router = useRouter();
const route = useRoute();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  password: "",
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入你的账户名", trigger: "blur" },
    { min: 3, max: 18, message: "用户名长度为3~18", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入你的密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度为6~18", trigger: "blur" },
  ],
  address: [{ required: true, message: "请输入你所在的城市", trigger: "blur" }],
});

//登录按钮
const loginBtn = async () => {
  if (ruleForm.name !== "" && ruleForm.password !== "") {
    const { data } = await requests({
      url: "user/login",
      method: "POST",
      data: {
        name: ruleForm.name,
        password: ruleForm.password,
      },
    });
    // 判断是否成功拿到数据
    if (data.code === 200) {
      // console.log(data.result);
      //成功登录后获取用户名
      localStorage.setItem("name", data.result[0].username);
      localStorage.setItem("id", data.result[0].user_id);
      router.replace("/home");
      ElNotification.success({
        title: "登录成功",
        message: "欢迎加入Headstream Photography",
        offset: 100,
        showClose: false,
      });
    }else {
      ElMessage({
        message: data.msg,
        type: "error",
      });

      ElMessageBox.confirm("是否需要跳转到注册页面?", "Info", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          // 确认后跳转注册界面
          router.replace("/register");
        })
        .catch(() => {});
    }
  } else {
    ElMessage({
      message: "用户名或密码错误",
      type: "error",
    });
  }
};


//重置密码按钮
const restPassword = ()=>{
  router.push('/restPassword')
}
</script>
<style lang='less' scoped>
.login_container {
  width: 100%;
  height: 100vh;
  // background-image: url(src/assets/banner/image/海岛风景.jpeg);
  // background-size: 100% 100%;
  overflow: hidden; //关闭bfc
  background-color: white;
}
.login {
  width: 500px;
  padding: 10px 25px 25px;
  margin: 200px auto;
  text-align: center;
  background: white;
  border-radius: 15px;
  box-shadow:0 0 6px rgba(0, 0 ,0, .3);
  h3 {
    margin-bottom: 25px;
    font-size: 25px;
    font-style: italic;
    span{
      font-weight: bold;
    }
  }
  .bottom{
    margin-top: 20px;
    font-size: 12px;
  }
  .bottom:hover{
    text-decoration: underline;
    color: blue;
  }
}

.el-form-item{
  margin:0 auto 15px;
}
</style>