<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑管理员</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 20px;">
      <el-button size="small" type="danger" @click="goback">返回列表</el-button>
    </div>
    <div class="main_wraper">
        <div class="fromm">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="130px"
            style="width:40%"
            class="demo-ruleForm"
          >
           <el-form-item label="用户名" prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="ruleForm.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" type="number" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="ruleForm.remarks" placeholder="例如：XXX出版社"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="usrStatus">
            <el-radio-group v-model="ruleForm.isCan">
              <el-radio label="启用" ></el-radio>
              <el-radio label="禁用"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="goback()">取消</el-button>
          </el-form-item>
          </el-form>
        </div>
    </div>
  </div>
</template>
<script>
import { adminEdit } from "@/api/getData";
export default {
  data() {
    return {
      ruleForm: {
        userName: "",
        userPassword: "",
        realName: "",
        phone: "",
        role:"2",
        isCan: "启用",
        remarks:''
      },
      rules: {
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  mounted() {
    var data = this.$route.query;
    console.log("路由数据", data.row);
    this.ruleForm = data.row;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.ruleForm.isCan == "启用") {
            this.ruleForm.isCan = 1;
          } else {
            this.ruleForm.isCan = -1;
          }
          console.log(this.ruleForm);
          const res = await adminEdit(this.ruleForm);
          console.log(res);
          if (res !== "error") {
            this.$message({
              message: "提交成功",
              type: "success"
            });
             this.$router.go(-1);//返回上一层
          }
        }
      });
    },
    goback(){
      this.$router.go(-1);//返回上一层
    }
  }
};
</script>
<style scoped>
</style>