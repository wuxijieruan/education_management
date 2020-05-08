<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增活动</el-breadcrumb-item>
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
          label-width="180px"
          style="width:40%"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="ruleForm.activityName" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动规则" prop="rule">
            <el-input  type="textarea" :rows="5" v-model="ruleForm.rule" placeholder="请输入活动规则"></el-input>
          </el-form-item>
          <el-form-item label="活动开始时间（日期）" prop="startTime">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动结束时间（日期）" prop="endTime">
            <el-date-picker
              v-model="ruleForm.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="绑定课程" prop="courseId">
            <el-select v-model="ruleForm.courseId" filterable placeholder="请选择课程" style="width:350px">
              <el-option
                v-for="item in subjectsGetList"
                :key="item.courseId"
                :label="item.subjectName"
                :value="item.courseId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指定企业" prop="courseId">
            <el-select v-model="ruleForm.enterpriseId" filterable placeholder="请选择指定企业" style="width:350px">
              <el-option
                v-for="item in enterpriseGetList"
                :key="item.enterpriseId"
                :label="item.enterpriseName"
                :value="item.enterpriseId"
              ></el-option>
            </el-select>
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
import { actAdd,courseGet ,enterpriseGet} from "@/api/getData";
export default {
  data() {
    return {
      enterpriseGetList:[],
      subjectsGetList: [],
      ruleForm: {
        activityName: "",
        rule: "",
        startTime:"",
        endTime:"",
        courseId:"",
        enterpriseId:""
      },
      rules: {
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        
      }
    };
  },
  created(){

  },
  mounted() {
    this.getCourse();
     this.getenterprise();
  },
  methods: {
    // 获取课程列表
    async getCourse(e) {
      try {
        const res = await courseGet();
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.subjectsGetList = res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log("课程列表",res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    // 获取企业列表
    async getenterprise(e) {
      try {
        const res = await enterpriseGet();
        if (res.status == 200) {
          console.log("企业列表", res.data);
          this.enterpriseGetList = res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log("企业列表",res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.ruleForm);
          const res = await actAdd(this.ruleForm);
          console.log(res);
          if (res !== "error") {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.go(-1); //返回上一层
          }else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log("提交失败",res);
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
</style>