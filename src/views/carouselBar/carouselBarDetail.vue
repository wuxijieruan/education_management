<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>轮播栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播栏列表</el-breadcrumb-item>
      <el-breadcrumb-item>轮播栏详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="danger" @click="back">返回</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-form
      label-width="100px"
      :model="form"
      ref="form"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
    >
      <el-form-item label="课程年龄段" prop="groupId">
        <template>
          <el-select v-model="form.groupId" filterable placeholder="请选择年龄段" disabled>
            <el-option
              v-for="item in gradeList"
              :key="item.groupId"
              :label="item.gradeGroupName+'：'+item.gradeName+'：'+item.subjectName"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="课程名称" prop="bannerUrl">
        <template>
          <el-select v-model="form.bannerUrl" filterable placeholder="请选择课程名称" disabled>
            <el-option
              v-for="item in list"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="轮播栏名称" prop="bannerName">
        <el-input
          size="small"
          v-model="form.bannerName"
          auto-complete="off"
          placeholder="请输入轮播栏名称"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="轮播图片" prop="bannerPicUrl" style="display:block">
        <img :src="form.bannerPicUrl" alt style="width:600px;height:200px;" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { gradeSubjectGet, courseGet } from "@/api/getData";
import { imgUrl } from "@/config/env";

export default {
  data() {
    return {
      imgUrl: imgUrl,
      dialogImageUrl: "",
      dialogVisible: false,
      listLoading: false, //是显示加载
      list: [],
      courseList: [],
      gradeList: [],
      form: {
        bannerId: "",
        bannerName: "",
        bannerPicUrl: "",
        bannerUrl: "",
        groupId: ""
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchDeletionStatus: false,
      fileList: []
    };
  },

  // 注册组件
  components: {
    Pagination
  },
  created() {
    var data = this.$route.query;
    console.log("路由数据", data);
    this.form = data.row;
  },
  mounted() {
    this.getGradeSubject();
    this.getCourse();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取年龄段话题列表
    async getGradeSubject() {
      try {
        const res = await gradeSubjectGet();
        if (res.status == 200) {
          console.log("年龄段话题列表", res.data);
          this.gradeList = res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    // 获取课程列表
    async getCourse() {
      var that = this;
      try {
        var para = {
          groupId: this.form.groupId
        };
        const res = await courseGet(para);
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.getGradeSubject();
          this.courseList = res.data.list;
          this.courseList.forEach(element => {
            if (that.form.courseId == element.courseId) {
              that.list.push(element);
            }
          });
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    }
  }
};
</script>
<style scoped>
.img_table {
  width: 30px;
  height: 30px;
}
.el-form-item {
  display: inline-block;
}

.img_Edit {
  width: 20%;
  height: 20%;
}
</style>
