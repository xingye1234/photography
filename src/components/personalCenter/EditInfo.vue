<template>
  <div id="edit_info">
    <TopHeader></TopHeader>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px" style="height: 90vh">
          <div class="avatar" style="border-bottom: 1px solid #e9e9e9">
            <img :src="userStore.userInfo.avatar" alt="" class="avatar_img" v-if="userStore.userInfo.avatar"/>
            <img src="../../assets/个人中心/head180.png" alt="" class="avatar_img" v-else/>
            <div class="nick_name">{{ userStore.name }}</div>
            <div class="bottom">
              <li class="attention">关注<a href="#">{{ userStore.userInfo.followee_count }}</a></li>
              <li class="attention">粉丝<a href="#">{{ userStore.userInfo.follower_count }}</a></li>
              <li class="attention">作品<a href="#">0</a></li>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-header>个人资料</el-header>
          <!-- 基本信息 -->
          <el-main>
            <p>基本信息</p>
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="64px"
              label-position="left"
              class="demo-ruleForm"
              :size="formSize"
              status-icon
            >
              <el-col :span="6">
                <el-form-item label="用户名" prop="name">
                  <el-input v-model="ruleForm.name" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="ruleForm.nickName" />
                </el-form-item>
              </el-col>
              <el-form-item label="性别" >
                <el-radio-group v-model="ruleForm.sex">
                  <el-radio label="男" />
                  <el-radio label="女" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="地区" prop="address1">
                <el-select v-model="ruleForm.address1">
                  <el-option
                    :value="city"
                    v-for="(city, index) in cities"
                    :key="index"
                  />
                </el-select>
                <el-select v-model="ruleForm.address2" style="margin-left: 5px">
                  <el-option
                    :value="item"
                    v-for="(item, index) in dataMap[ruleForm.address1]"
                    :key="index"
                  />
                </el-select>
              </el-form-item>
              <el-col :span="6">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="ruleForm.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="邮箱" prop="mail">
                  <el-input v-model="ruleForm.mail" />
                </el-form-item>
              </el-col>

              <el-form-item label="生日">
                <el-col :span="11">
                  <el-form-item prop="birthday">
                    <el-date-picker
                      v-model="ruleForm.birthday"
                      type="date"
                      label="Pick a date"
                      placeholder="出生年月"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-col :span="6">
                <el-form-item label="微信" prop="chat">
                  <el-input v-model="ruleForm.chat" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="QQ" prop="QQ">
                  <el-input v-model="ruleForm.qq" />
                </el-form-item>
              </el-col>
              <el-form-item label="签名" prop="desc">
                <el-input v-model="ruleForm.desc" type="textarea" rows="4" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)"
                  >保存</el-button
                >
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 底部 -->
    <Footer></Footer>
  </div>
</template>
<script setup lang="ts">
import TopHeader from "@/components/home/Header/TopHeader.vue";
import Footer from "@/components/home/Footer.vue";
import { userInfo } from "@/stores/userInfo";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { dataMap, cities } from "@/mapData";
import requests from "@/network/request";
import { getId } from "@/utils/login";

//从状态库中取出用户名
const userStore = userInfo();
//调用pinia中的getName方法
userStore.getName();
userStore.getUserInfo();

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
//表单数据
const ruleForm = reactive({
  name: userStore.name,
  nickName: "",
  sex: "",
  address1: "",
  address2: "",
  desc: "",
  birthday: "",
  phone: "",
  mail: "",
  chat: "",
  qq: "",
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 5, message: "字符长度为3-5", trigger: "blur" },
  ],
  sex:[{required:true, message:"请选择你的性别"}],
  address1: [{ required: true }],
  nickName: [{ required: true ,message: "请输入你的昵称"}],
  phone: [{ required: true, message: "请输入你的号码" }],
  mail: [{ required: true, message: "请输入你的邮箱" }],
});

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { data } = await requests({
        url: "/user/editInfo",
        method: "POST",
        data: {
          user_id: localStorage.getItem("id"),
          name: ruleForm.name,
          nickName: ruleForm.nickName,
          sex: ruleForm.sex,
          address1: ruleForm.address1,
          address2: ruleForm.address2,
          desc: ruleForm.desc,
          birthday: ruleForm.birthday,
          phone: ruleForm.phone,
          mail: ruleForm.mail,
          chat: ruleForm.chat,
          qq: ruleForm.qq,
        },
      });
      // console.log(ruleForm);
      // console.log(data);
      if (data.code === 200) {
        return ElMessage({
          message: data.msg,
          type: "success",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  ElMessage({
    message: "已重置",
    type: "success",
  });
};

</script>
<style lang='less' scoped>
#edit_info {
  .radius {
    border-radius: 5px;
    background-color: white;
  }
  .el-aside {
    // background-color: skyblue;
    margin-right: 25px;
    border-radius: 3px;
    .radius();
  }
  .el-header {
    font-weight: bold;
    line-height: 60px;
    .radius();
  }
  .el-main {
    .radius();
    padding: 7px 25px;
    margin-top: 10px;
    p {
      height: 56px;
      line-height: 56px;
      border-bottom: 1px solid #e9e9e9;
      box-sizing: border-box;
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
      padding-top: 5px;
      box-sizing: border-box;
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