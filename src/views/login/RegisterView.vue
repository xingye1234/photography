<template>
<div>
  <TopHeader></TopHeader>
  <div class="login_container">
    <!-- 注册 -->
    <div class="login">
      <h3>
        <span>Register</span>
      </h3>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
        label-position="left"
        label-width="80px"
      >
      <el-form-item  prop="name" style="width:80%" label="User">
          <el-input v-model="ruleForm.name" :prefix-icon="User" />
        </el-form-item>
        <el-form-item  prop="password" style="width:80%" label="Password">
          <el-input v-model="ruleForm.password" type="password" :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item  prop="address" style="width:80%" label="Address">
          <el-input v-model="ruleForm.address" :prefix-icon="Location"/>
        </el-form-item>
        <el-form-item  prop="phone" style="width:80%" label="Phone">
          <el-input v-model="ruleForm.phone" :prefix-icon="Iphone"/>
        </el-form-item>
        <el-form-item  prop="email" style="width:80%" label="Email">
          <el-input v-model="ruleForm.email" :prefix-icon="Folder"/>
        </el-form-item>

        <el-button size="large" @click="registerBtn" color="#18c5a3" type="primary" style="width:80%">
          <span style="color:white">Register</span>
          </el-button
        >
      </el-form>
    </div>
  </div>
</div>
</template>
<script setup lang="ts">
import TopHeader from "@/components/home/Header/TopHeader.vue";
import { reactive, ref, onMounted, h } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import requests from "@/network/request";
import { User,Lock, Location,Iphone,Folder } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  password: "",
  address: "",
  phone:"",
  email:""
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
  phone: [
    { required: true, message: "请输入你的电话号码", trigger: "blur" },
    { min: 11, max: 11, message: "密码长度为11位", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入你的邮箱", trigger: "blur" },
  ],
  address: [{ required: true, message: "请输入你所在的城市", trigger: "blur" }],
});
//注册按钮
const registerBtn = async () => {
  if (ruleForm.address.trim() === "")
    return ElMessage({ message: "请填写你所在的城市", type: "error" });
  const { data } = await requests({
    url: "/user/register",
    method: "POST",
    data: {
      username: ruleForm.name,
      password: ruleForm.password,
      address: ruleForm.address,
      phone: ruleForm.phone,
      email: ruleForm.email,
    },
  });
  //判断是否注册成功
  if (data.code === 200) {
    ElMessage({
      message: "注册成功！",
      type: "success",
    });
    router.push('/login')
  } else {
    ElMessage({
      message: data.msg,
      type: "error",
    });
  }
};
</script>
<style lang='less' scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background-image: url(src/assets/banner/image/海岛风景.jpeg);
  background-size: 100% 100%;
  overflow: hidden; //关闭bfc
}
.login {
  width: 500px;
  padding: 10px 25px 25px;
  margin: 150px auto;
  text-align: center;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  h3 {
    margin-bottom: 25px;
    font-size: 25px;
    font-style: italic;
    span{
      font-weight: bold;
    }
  }

  
}
.el-form-item{
  margin: 0 auto 15px;
}
</style>