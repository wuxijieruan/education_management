<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>优秀作业列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-bottom:10px;">
      <el-button size="small" type="danger" @click="back" style="margin-right:10px;">返回</el-button>
      <router-link
        :to="{ path: '/goodHomeworkAdd', query: {courseChapterId:form.courseChapterId,course:course,chapter:chapter,homework:form}}"
      >
        <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
      </router-link>
    </div>

    <!--列表-->
    <el-form ref="form" :model="form">
      <el-table
        size="small"
        :data="list"
        stripe
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%;"
      >
        <el-table-column  prop="exercisestName" label="课程作业名称" min-width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
              <router-link
                :to="{ path: '/goodHomeworkDetail', query: {row:scope.row,course:course,chapter:chapter,courseChapterId:form.courseChapterId}}"
              >
                <el-button size="small" icon="el-icon-reading" style="margin-right: 10px;"></el-button>
              </router-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <router-link
                :to="{ path: '/goodHomeworkEdit', query: {row:scope.row,course:course,chapter:chapter,courseChapterId:form.courseChapterId}}"
              >
                <el-button size="small" icon="el-icon-edit" style="margin-right: 10px;"></el-button>
              </router-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="handleDel(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
import { excellentHomeworkList ,excellentHomeworkDel} from "@/api/getData";

export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list:[],
      form: {
        courseChapterId: ""
      },
      course: {},
      chapter: {}
    };
  },
  created() {
    var data = this.$route.query;
    console.log("优秀作业列表query", data);
    this.form.courseChapterId = data.courseChapterId;
    this.course = data.course;
    this.chapter = data.chapter;
  },
  mounted() {
    this.getList();
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
    // 获取章节列表
    async getList() {
      try {
        this.listLoading = true;
        console.log(this.form);
        const res = await excellentHomeworkList(this.form);
        if (res.status == 200) {
          console.log("章节列表data", res.data);
          this.list = res.data;
          this.listLoading = false;
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
    //删除
    handleDel(row) {
      this.$confirm("确认要删除吗?", "提示", { type: "warning" })
        .then(async () => {
          try {
            this.listLoading = true;
            const res = await excellentHomeworkDel(row.id);
            if (res.status == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.listLoading = false;
              this.getList();
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
