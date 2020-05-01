<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      <el-breadcrumb-item>作业审核</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin:20px 0">
      <el-select v-model="form.reviewStatus" @change="changePage()">
        <el-option label="全部" value=""></el-option>
        <el-option label="未审核" value="0"></el-option>
        <el-option label="通过" value="1"></el-option>
        <el-option label="未通过" value="-1"></el-option>
      </el-select>
      <el-button size="small" @click="batchToExamine">批量审核</el-button>
    </div>

    <!--列表-->
    <el-form ref="form" :model="form">
      <el-table
        size="small"
        :data="list"
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        @selection-change="selectionChange"
        style="width:100%"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" prop="studentName" label="学生名称" width="100"></el-table-column>
        <el-table-column align="center" prop="tag" label="互动标签" width="150"></el-table-column>
        <el-table-column align="center" prop="answerTest" label="互动内容" ></el-table-column>
        <el-table-column align="center" prop="createTime" label="提交时间" width="150"></el-table-column>
        <el-table-column align="center" prop="reviewStatus" label="审核状态" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <router-link :to="{ path: '/taskDetial', query: {data:scope.row,taskForm:form}}">
              <el-button size="small" style="margin-right: 10px;">详情</el-button>
            </router-link>
            <el-button
              size="small"
              v-if="scope.row.reviewStatus=='未审核'"
              @click="toExamine(scope.row)"
            >审核通过</el-button>
            <el-button
              size="small"
              v-if="scope.row.reviewStatus=='未审核'"
              @click="auditFailed(scope.row)"
            >审核不通过</el-button>
            <el-button size="small" v-if="scope.row.reviewStatus!=='未审核'" disabled>审核通过</el-button>
            <el-button size="small" v-if="scope.row.reviewStatus!=='未审核'" disabled>审核不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getConStudentExercisesList,
  reviewStudentExercises
} from "@/api/getData";

export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      form: {
        reviewStatus: "",
        page: 1,
        pageSize: 10
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      taskList: []
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    var data = this.$route.query;
    console.log("课程列表query", data);
    if (data.taskForm != undefined && data.taskForm.page != undefined) {
      this.form = data.taskForm;
      this.pageparm.currentPage = data.taskForm.page;
    }
  },
  mounted() {
    this.getConStudentExercisesList();
  },
  methods: {
    // 获取作业列表
    async getConStudentExercisesList() {
      try {
        this.listLoading = true;
        console.log(this.form)
        const res = await getConStudentExercisesList(this.form);
        if (res.status == 200) {
          this.listLoading = false;
          console.log("作业列表", res);
          var list = res.data.list;
          this.list = list;
          this.pageparm.total = res.data.total;
          this.list.forEach(element => {
            // console.log(element);
            if (element.reviewStatus == 0) {
              element.reviewStatus = "未审核";
            } else if (element.reviewStatus == 1) {
              element.reviewStatus = "通过";
            } else if (element.reviewStatus == -1) {
              element.reviewStatus = "未通过";
            }
          });
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
    changePage() {
      console.log(this.form)
      this.getConStudentExercisesList();
    },
    // 多选/全选
    selectionChange(e) {
      console.log(e);
      if (e.length != 0) {
        this.taskList = e;
      } else {
        this.taskList = [];
      }
    },
    //批量审核
    batchToExamine() {
      var studentExercisesId = [];
      this.taskList.forEach(element => {
        console.log(element);
        studentExercisesId.push(element.studentExercisesId);
      });
      studentExercisesId = studentExercisesId.join(",");
      var row = {
        studentExercisesId: studentExercisesId
      };
      this.toExamine(row);
    },
    // 分页插件事件
    callFather(parm) {
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getConStudentExercisesList();
    },
    // 审核通过
    toExamine: function(row) {
      this.$confirm("是否允许作业通过审核", "提示", {
        type: "warning"
      })
        .then(async () => {
          try {
            console.log(row);
            var data = {
              ids: row.studentExercisesId,
              reviewStatus: 1
            };
            console.log(data);
            const res = await reviewStudentExercises(data);
            if (res.status == 200) {
              console.log(res);
              this.$message({
                message: res.data,
                type: "success"
              });
              this.getConStudentExercisesList();
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
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    auditFailed: function(row) {
      this.$confirm("是否不允许作业通过审核", "提示", {
        type: "warning"
      })
        .then(async () => {
          try {
            console.log(row);
            var data = {
              ids: row.studentExercisesId,
              reviewStatus: -1
            };
            console.log(data);
            const res = await reviewStudentExercises(data);
            if (res.status == 200) {
              console.log(res);
              this.$message({
                message: res.data,
                type: "success"
              });
              this.getConStudentExercisesList();
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
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
<style scoped>
</style>
