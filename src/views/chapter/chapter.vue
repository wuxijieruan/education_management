<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="danger" @click="back" style="margin-right:10px;">返回</el-button>
        <!-- <el-button size="small" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button> -->
        <router-link
          :to="{ path: '/chapterAdd', query: {courseId:this.form.courseId,course:course,lastchapterIndex:lastchapterIndex}}"
        >
          <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
        </router-link>
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
        <el-table-column prop="courseChapterName" label="课程章节名称" min-width="200"></el-table-column>
        <el-table-column align="center" prop="chapterIndex" label="课程章节顺序" width="100"></el-table-column>
        <el-table-column align="center" prop="lookNo" label="课程章节浏览数" width="120"></el-table-column>
        <el-table-column align="center" prop="isVail" label="章节状态" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="340">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
              <router-link
                :to="{ path: '/chapterDetail', query: {chapterId:scope.row.courseChapterId,course:course,chapter:form}}"
              >
                <el-button size="small" icon="el-icon-reading" style="margin-right: 10px;"></el-button>
              </router-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <router-link
                :to="{ path: '/chapterEdit', query: {chapterId:scope.row.courseChapterId,course:course,chapter:form}}"
              >
                <el-button size="small" icon="el-icon-edit" style="margin-right: 10px;"></el-button>
              </router-link>
            </el-tooltip>
            <el-button
              size="small"
              @click="putOn(scope.row)"
              v-if="scope.row.isVail=='已下架'"
              style="margin-right: 10px;"
            >上架</el-button>
            <el-button
              size="small"
              @click="handleDel(scope.row)"
              v-if="scope.row.isVail=='已上架'"
              style="margin-right: 10px;"
            >下架</el-button>
            <el-tooltip class="item" effect="dark" content="练习题" placement="top-start">
              <router-link
                :to="{ path: '/chapterExercises', query: {courseChapterId:scope.row.courseChapterId,course:course,chapter:form}}"
              >
                <el-button size="small" icon="el-icon-tickets" style="margin-right: 10px;"></el-button>
              </router-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="优秀作业" placement="top-start">
              <router-link
                :to="{ path: '/goodHomework', query: {courseChapterId:scope.row.courseChapterId,course:course,chapter:form}}"
              >
                <el-button size="small" icon="el-icon-document-add"></el-button>
              </router-link>
            </el-tooltip>
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
  courseChapterGet,
  courseChapterDel,
  courseChapterputOn
} from "@/api/getData";

export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      form: {
        courseId: "", //课程id
        chapterIndex: "", //章节顺序
        courseChapterName: "", //章节名称
        videoUrl: "", //音频路径
        isVail: "1", //上否上架
        page: 1,
        pageSize: 10
      },
      lastchapterIndex: "",
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchDeletionStatus: false,
      batchList: [],
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
    console.log("章节列表query", data);
    this.course = data.course;
    this.chapter = data.chapter;
    if (data.chapter != undefined && data.chapter.page != undefined) {
      this.form = data.chapter;
      this.pageparm.currentPage = data.chapter.page;
    } else {
      this.form.courseId = data.courseId;
    }
  },
  mounted() {
    this.getChapter();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/course",
        query: {
          course: this.course
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
      var courseChapterId = [];
      this.batchList.forEach(element => {
        courseChapterId.push(element.courseChapterId);
      });
      courseChapterId = courseChapterId.join(",");
      var row = {
        courseChapterId: courseChapterId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      console.log(parm);
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getChapter();
    },
    // 获取章节列表
    async getChapter() {
      try {
        this.listLoading = true;
        console.log(this.form);
        const res = await courseChapterGet(this.form);
        if (res.status == 200) {
          console.log("章节列表data", res.data);
          var list = res.data.list;
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
          if (list.length == 0) {
            this.lastchapterIndex = 0;
          } else if (list.length == 1) {
            this.lastchapterIndex = 1;
          } else {
            var lastchapter = list[list.length - 1];
            var lastchapterIndex = lastchapter.chapterIndex;
            this.lastchapterIndex = lastchapterIndex;
            console.log(lastchapterIndex);
          }
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
    async handleDel(row) {
      try {
        this.listLoading = true;
        const res = await courseChapterDel(row.courseChapterId);
        if (res.status == 200) {
          this.$message({
            message: "下架成功",
            type: "success"
          });
          this.listLoading = false;
          this.getChapter();
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
    //上架
    async putOn(row) {
      try {
        console.log(row.courseChapterId);
        const res = await courseChapterputOn(row.courseChapterId);
        if (res.status == 200) {
          this.$message({
            message: "上架成功",
            type: "success"
          });
          this.listLoading = false;
          this.getChapter();
        } else {
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
