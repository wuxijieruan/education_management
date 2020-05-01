<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节练习题列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="danger" @click="back">返回</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete"
          v-if="batchDeletionStatus"
          @click="batchDel"
        >批量删除</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-form ref="form" :model="form">
      <el-table
        size="small"
        :data="list"
        stripe
        highlight-current-row
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%;"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column prop="exercisestName" label="题目" min-width="200">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.exercisestName"
              @change="changeexercisestName(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isVail" label="练习题状态" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" @click="handleDel(scope.row)" v-if="scope.row.isVail=='已下架'">上架</el-button>
            <el-button size="small" @click="handleDel(scope.row)" v-if="scope.row.isVail=='已上架'">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addVisible" :close-on-click-modal="false">
      <el-form label-width="100px" :model="addForm" ref="addForm" :rules="addrules">
        <el-form-item label="题目" prop="exercisestName">
          <el-input
            size="small"
            v-model="addForm.exercisestName"
            auto-complete="off"
            placeholder="请输入题目"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="submitAdd('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  chapterExercisesGet,
  chapterExercisesDel,
  chapterExercisesAdd,
  chapterExercisesPut
} from "@/api/getData";

export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      form: {
        exercisestName: "",
        courseChapterId: "",
        page: 1,
        pageSize: 10
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchDeletionStatus: false,
      batchList: [],
      addVisible: false,
      addForm: {
        courseChapterId: "",
        exercisestName: "",
        isVail: 1
      },
      addrules: {
        exercisestName: [
          { required: true, message: "请输入题目名称", trigger: "blur" }
        ]
      },
      course: {},
      chapter: {}
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    var data = this.$route.query;
    console.log("章节练习题列表query", data);
    this.form.courseChapterId = data.courseChapterId;
    this.course = data.course;
    this.chapter = data.chapter;
  },
  mounted() {
    this.getChapterExercises();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/chapter",
        query: {
          course: this.course,
          chapter: this.chapter
        }
      });
    },
    // 多选/全选
    selectionChange(e) {
      if (e.length != 0) {
        this.batchList = e;
        this.batchDeletionStatus = true;
      } else {
        this.batchList = [];
        this.batchDeletionStatus = false;
      }
    },
    //批量删除
    batchDel() {
      var chapterExercisesId = [];
      this.batchList.forEach(element => {
        chapterExercisesId.push(element.chapterExercisesId);
      });
      chapterExercisesId = chapterExercisesId.join(",");
      var row = {
        chapterExercisesId: chapterExercisesId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getChapterExercises();
    },
    // 获取练习列表
    async getChapterExercises() {
      try {
        this.listLoading = true;
        const res = await chapterExercisesGet(this.form);
        if (res.status == 200) {
          console.log("练习列表", res.data);
          this.list = res.data.list;
          this.list.forEach(element => {
            // console.log(element);
            if (element.isVail == 1) {
              element.isVail = "已上架";
            } else if (element.isVail == -1) {
              element.isVail = "已下架";
            }
          });
          this.pageparm.total = res.data.total;
          this.listLoading = false;
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

    //上下架
    async handleDel(row) {
      try {
        this.listLoading = true;
        console.log(row);
        var isVail;
        if (row.isVail == "已上架") {
          isVail = -1;
        } else {
          isVail = 1;
        }
        console.log(row.chapterExercisesId, isVail);
        const res = await chapterExercisesDel(row.chapterExercisesId, isVail);
        if (res.status == 200) {
          this.$message({
            message: "下架成功",
            type: "success"
          });
          this.listLoading = false;
          this.getChapterExercises();
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
    },
    // 上传文件成功
    handleSuccess(file, fileList) {
      if (file.status == 200) {
        this.$message({
          message: "上传成功",
          type: "success"
        });
        this.getChapterExercisesList();
      } else {
        this.$message({
          message: file.msg,
          type: "error"
        });
      }
      this.$refs.upload.clearFiles();
    },
    // 显示新增
    handleAdd() {
      this.addVisible = true;
      this.addForm = {
        courseChapterId: this.form.courseChapterId,
        exercisestName: "",
        answer: "",
        answerParsing: "",
        isVail: 1
      };
    },
    // 新增
    submitAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.addForm);
          const res = await chapterExercisesAdd(this.addForm);
          if (res.status == 200) {
            this.addVisible = false;
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getChapterExercises();
          } else {
            this.$message({
              type: "error",
              message: res.error
            });
            console.log(res);
          }
        } else {
          this.$message({
            type: "error",
            message: "请将信息填写完整"
          });
          return false;
        }
      });
    },
    //编辑
    async changeexercisestName(row) {
      console.log(row)
      if (row.exercisestName != "") {
        var isVail;
        if (row.isVail == "已上架") {
          isVail = 1;
        } else {
          isVail = -1;
        }
        var form = {
          courseChapterId: row.courseChapterId,
          chapterExercisesId: row.chapterExercisesId,
          exercisestName: row.exercisestName,
          isVail: isVail
        };
        console.log(form);
        try {
          const res = await chapterExercisesPut(form);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getChapterExercises();
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
      } else {
        this.$message({
          type: "error",
          message: "请输入题目名称"
        });
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
</style>
