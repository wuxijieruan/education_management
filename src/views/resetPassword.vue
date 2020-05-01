<template>
  <div class="resetPassword">
    <h1>修改密码</h1>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width: 40%;
        margin: 0 auto;"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model.number="ruleForm.userName"
          disabled
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          type="password"
          v-model="ruleForm.oldPassword"
          autocomplete="off"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          v-model="ruleForm.newPassword"
          autocomplete="off"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="rePassword">
        <el-input
          type="password"
          v-model="ruleForm.rePassword"
          autocomplete="off"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="logining">确定</el-button>
        <el-button @click="goback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { resetPassword } from "@/api/getData";
export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        id: "",
        userName: "",
        oldPassword: "",
        newPassword: "",
        rePassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        rePassword: [
          { required: true, message: "请输入再次新密码", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userdata"));
    console.log(this.user.loginUser);
    this.ruleForm.userName = this.user.loginUser.userName;
    this.ruleForm.id = this.user.loginUser.id;
    console.log(this.ruleForm);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.ruleForm);
          if (this.ruleForm.newPassword === this.ruleForm.rePassword) {
            const res = await resetPassword(
              this.ruleForm.id,
              this.ruleForm.oldPassword,
              this.ruleForm.newPassword
            );
            console.log(res);
            if (res.status == 200) {
              this.$router.push({ path: "/" }); //返回登录
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          } else {
            this.$message({
              message: "2次输入的新密码不同",
              type: "error"
            });
          }
        }
      });
    },
    goback() {
      this.$router.go(-1); //返回上一层
    }
  }
};
</script>
<style scoped>
.resetPassword {
  text-align: center;
}
h1 {
  margin: 40px 0;
}
</style>