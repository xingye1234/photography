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
          size="default"
          status-icon
          label-position="left"
          label-width="80px"
        >
          <el-form-item prop="name" style="width: 80%" label="User">
            <el-input v-model="ruleForm.name" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password" style="width: 80%" label="Password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item prop="address" style="width: 80%" label="Address">
            <el-input
              v-model="address"
              :prefix-icon="Location"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item prop="phone" style="width: 80%" label="Phone">
            <el-input v-model="ruleForm.phone" :prefix-icon="Iphone" />
          </el-form-item>
          <el-form-item prop="email" style="width: 80%" label="Email">
            <el-input v-model="ruleForm.email" :prefix-icon="Folder" />
          </el-form-item>

          <el-button
            size="large"
            @click="registerBtn"
            color="#18c5a3"
            type="primary"
            style="width: 50%"
          >
            <span style="color: white">Register</span>
          </el-button>
          <el-button
            size="large"
            @click="resetForm(ruleFormRef)"
            color="#18c5a3"
            type="primary"
            style="width: 30%"
          >
            <span style="color: white">Reset</span>
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
window._AMapSecurityConfig = {
  securityJsCode: "d0eaa46af4ec97819cec9a56a18c3883",
};
</script>
<script setup lang="ts">
import TopHeader from "@/components/home/Header/TopHeader.vue";
import { reactive, ref, onMounted, h } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import requests from "@/network/request";
import { User, Lock, Location, Iphone, Folder } from "@element-plus/icons-vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const router = useRouter();
const route = useRoute();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  password: "",
  phone: "",
  email: "",
});
const address = ref("");

onMounted(() => {
  initMap();
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
  email: [{ required: true, message: "请输入你的邮箱", trigger: "blur" }],
  address: [{ required: true, message: "请输入你所在的城市", trigger: "blur" }],
});
//注册按钮
const registerBtn = async () => {
  const { data } = await requests({
    url: "/user/register",
    method: "POST",
    data: {
      username: ruleForm.name,
      password: ruleForm.password,
      address: address.value,
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
    router.push("/login");
  } else {
    ElMessage({
      message: data.msg,
      type: "error",
    });
  }
};

//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  return ElMessage({
    type: "success",
    message: "数据已清空",
  });
};

const initMap = () => {
  AMapLoader.load({
    key: "da6bd131d4dd8c8eca5b7e0743aa4c5d", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.CitySearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    AMapUI: {
      version: "1.1",
      plugins: [], // 需要加载的 AMapUI ui插件
    },
  })
    .then((AMap) => {
      //获取当前城市定位
      let city = new AMap.CitySearch();
      city.getLocalCity((status, result) => {
        if (status === "complete") {
          // console.log(result.rectangle.split(';')[0]);
          address.value = result.province + result.city;
          return ElMessage({
            message: `您当前所在城市${result.province + result.city}`,
          });
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
</script>
<style lang="less" scoped>
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
  margin: 150px auto;
  text-align: center;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  h3 {
    margin-bottom: 25px;
    font-size: 25px;
    font-style: italic;
    span {
      font-weight: bold;
    }
  }
}
.el-form-item {
  margin: 0 auto 15px;
}
</style>
