<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-button size="small" type="danger" style="margin: 20px 0;" @click="backback">返回列表</el-button>
    <!--列表-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程基本信息" name="zero">
        <courseEdit></courseEdit>
      </el-tab-pane>
      <el-tab-pane label="课程导读" name="first">
        <router-link
          :to="{ path: '/courseAddA',query: {courseId:form.courseId,resourceType:1,router:2}}"
        >
          <el-button size="small" type="primary" style="margin-bottom: 20px;">新增课程导读</el-button>
        </router-link>
        <el-table
          size="small"
          :data="list"
          stripe
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 80%;"
        >
          
          <el-table-column align="center" prop="courseResourceBundle.courseResourceBundleId" label="课程导读id"></el-table-column>
          <el-table-column align="center" prop="courseResourceBundle.resourceTitle" label="课程导读名称"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="{ path: '/courseResourcesDetail',query: {data:scope.row}}">
                <el-button size="small" type="primary">编辑</el-button>
              </router-link>
              <el-button size="small" type="danger" @click="courseResourcesDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="课程绘本" name="second">
        <router-link
          :to="{ path: '/courseAddA',query: {courseId:form.courseId,resourceType:2,router:2}}"
        >
          <el-button size="small" type="primary" style="margin-bottom: 20px;">新增课程绘本</el-button>
        </router-link>
        <el-table
          size="small"
          :data="list"
          stripe
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 80%;"
        >
          
          <el-table-column align="center" prop="courseResourceBundle.courseResourceBundleId" label="课程绘本id"></el-table-column>
          <el-table-column align="center" prop="courseResourceBundle.resourceTitle" label="课程绘本名称"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="{ path: '/courseResourcesDetail',query: {data:scope.row}}">
                <el-button size="small" type="primary">编辑</el-button>
              </router-link>
              <el-button size="small" type="danger" @click="courseResourcesDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="课程知识点" name="third">
        <router-link
          :to="{ path: '/courseAddA',query: {courseId:form.courseId,resourceType:3,router:2}}"
        >
          <el-button size="small" type="primary" style="margin-bottom: 20px;">新增课程知识点</el-button>
        </router-link>
        <el-table
          size="small"
          :data="list"
          stripe
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 80%;"
        >
        <el-table-column align="center" prop="courseResourceBundle.courseResourceBundleId" label="课程知识点id"></el-table-column>
          <el-table-column align="center" prop="courseResourceBundle.resourceTitle" label="课程知识点名称"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="{ path: '/courseResourcesDetail',query: {data:scope.row}}">
                <el-button size="small" type="primary">编辑</el-button>
              </router-link>
              <el-button size="small" type="danger" @click="courseResourcesDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="课程互动游戏" name="fourth">
        <router-link
          :to="{ path: '/courseAddA',query: {courseId:form.courseId,resourceType:4,router:2}}"
        >
          <el-button size="small" type="primary" style="margin-bottom: 20px;">新增课程互动游戏</el-button>
        </router-link>
        <el-table
          size="small"
          :data="list"
          stripe
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 80%;"
        >
        <el-table-column align="center" prop="courseResourceBundle.courseResourceBundleId" label="课程互动游戏id"></el-table-column>
          <el-table-column
            align="center"
            prop="courseResourceBundle.resourceTitle"
            label="课程互动游戏名称"
          ></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="{ path: '/courseResourcesDetail',query: {data:scope.row}}">
                <el-button size="small" type="primary">编辑</el-button>
              </router-link>
              <el-button size="small" type="danger" @click="courseResourcesDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="互动作业" name="fifth">
        <router-link
          :to="{ path: '/courseAddA',query: {courseId:form.courseId,resourceType:5,router:2}}"
        >
          <el-button size="small" type="primary" style="margin-bottom: 20px;">新增互动作业</el-button>
        </router-link>
        <el-table
          size="small"
          :data="list"
          stripe
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 80%;"
        >
        <el-table-column align="center" prop="courseResourceBundle.courseResourceBundleId" label="互动作业id"></el-table-column>
          <el-table-column align="center" prop="courseResourceBundle.resourceTitle" label="互动作业名称"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="{ path: '/courseResourcesDetail',query: {data:scope.row}}">
                <el-button size="small" type="primary">编辑</el-button>
              </router-link>
              <el-button size="small" type="danger" @click="courseResourcesDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { courseDetails, courseResourcesDel } from "@/api/getData";
import courseEdit from "./courseEdit.vue";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      activeName: "zero",
      form: {
        courseId: "",
        resourceType: ""
      },
      courseData: ""
    };
  },
  components: {
    courseEdit
  },
  mounted() {
    var data = this.$route.query;
    console.log("课程详情query", data);
    this.form.courseId = data.courseId;
    this.form.resourceType = data.resourceType;
    this.courseData = data.courseData;
    if (data.resourceType == 1) {
      this.activeName = "first";
      this.getcourseDetails();
    } else if (data.resourceType == 2) {
      this.getcourseDetails();
      this.activeName = "second";
    } else if (data.resourceType == 3) {
      this.getcourseDetails();
      this.activeName = "third";
    } else if (data.resourceType == 4) {
      this.getcourseDetails();
      this.activeName = "fourth";
    } else if (data.resourceType == 5) {
      this.getcourseDetails();
      this.activeName = "fifth";
    }
  },
  methods: {
    backback() {
      this.$router.push({
        path: "/course",
        query: {
          courseData: this.courseData
        }
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.label == "课程基本信息") {
        this.form.resourceType = 0;
      } else if (tab.label == "课程导读") {
        this.form.resourceType = 1;
        this.getcourseDetails();
      } else if (tab.label == "课程绘本") {
        this.form.resourceType = 2;
        this.getcourseDetails();
      } else if (tab.label == "课程知识点") {
        this.form.resourceType = 3;
        this.getcourseDetails();
      } else if (tab.label == "课程互动游戏") {
        this.form.resourceType = 4;
        this.getcourseDetails();
      } else if (tab.label == "互动作业") {
        this.form.resourceType = 5;
        this.getcourseDetails();
      }
    },
    async getcourseDetails() {
      // console.log(this.form);
      const res = await courseDetails(this.form);
      console.log(res);
      this.list = res.data;
    },
    async courseResourcesDel(row) {
      console.log(row);
      this.$confirm("确认删除该信息?", "提示", { type: "warning" })
        .then(async () => {
          var courseResourceBundleId =
            row.courseResourceBundle.courseResourceBundleId;
          console.log(courseResourceBundleId);

          const res = await courseResourcesDel(courseResourceBundleId);
          if (res.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getcourseDetails();
          } else {
            this.$message({
              type: "error",
              message: res.error
            });
            console.log(res);
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
