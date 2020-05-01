<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>轮播栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播栏列表</el-breadcrumb-item>
      <el-breadcrumb-item>轮播栏新增</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="danger" @click="back">返回</el-button>
        <el-button size="small" type="primary" @click="submitAdd">保存</el-button>
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
          <el-select v-model="form.groupId" filterable placeholder="请选择年龄段" @change="groupChange">
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
          <el-select
            v-model="form.bannerUrl"
            filterable
            placeholder="请选择课程名称"
            @change="courseChange"
          >
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="轮播栏名称" prop="bannerName">
        <el-input size="small" v-model="form.bannerName" auto-complete="off" placeholder="请输入轮播栏名称"></el-input>
      </el-form-item>
      <el-form-item label="轮播图片" prop="bannerPicUrl" style="display:block">
        <el-upload
          :action="imgUrl"
          list-type="picture-card"
          ref="upload"
          :on-preview="handlePictureCardPreview"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :limit="1"
          :file-list="fileList"
          :before-remove="beforeRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { gradeSubjectGet, bannerAdd, courseGet } from "@/api/getData";
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
        bannerName: "",
        bannerPicUrl: "",
        bannerUrl: "",
        groupId: "",
        courseId: "",
        priority: "",
        isVail: "1"
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
    this.getGradeSubject();
  },
  methods: {
    // 年龄段选择
    groupChange(e) {
      this.form.groupId = e;
      this.courseList = [];
      this.form.bannerUrl = "";
      this.getCourse();
    },
    //课程选择
    courseChange(e) {
      this.form.courseId = e;
    },
    // 上传图片成功
    handleSuccess(file, fileList) {
      this.fileList[0] = file;
      console.log("添加图片", this.fileList);
    },
    // 删除图片之前
    beforeRemove(file, fileList) {
      this.fileList = [];
      console.log("删除图片", this.fileList);
    },
    //放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片错误提示
    handleExceed(files, fileList) {
      this.$message.warning("只能选择1张图片");
    },
    back() {
      this.$router.go(-1);
    },
    // 获取年龄段话题列表
    async getGradeSubject() {
      try {
        this.listLoading = true;
        const res = await gradeSubjectGet();
        if (res.status == 200) {
          console.log("年龄段话题列表", res.data);
          this.gradeList = res.data.list;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
        }
      } catch (err) {
        this.listLoading = false;
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },

    // 获取课程列表
    async getCourse(e) {
      try {
        var para = {
          groupId: this.form.groupId
        };
        const res = await courseGet(para);
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.courseList = res.data.list;
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

    //新增页面
    async submitAdd() {
      this.listLoading = true;
      try {
        // 图片格式
        if (this.fileList.length != 0) {
          var bannerPicUrl = [];
          this.fileList.forEach(element => {
            bannerPicUrl.push(element.url);
          });
          this.form.bannerPicUrl = bannerPicUrl.join(",");
        } else {
          this.form.bannerPicUrl = "";
        }
        console.log("轮播栏新增", this.form);

        const res = await bannerAdd(this.form);
        if (res.status == 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.listLoading = false;
          this.back();
          this.$refs.upload.clearFiles();
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
          this.listLoading = false;
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
        this.listLoading = false;
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
