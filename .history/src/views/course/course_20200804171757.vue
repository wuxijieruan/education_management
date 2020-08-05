<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理
        <!-- <strong style="font-size:18px;">课程管理</strong> -->
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        课程列表
      </el-breadcrumb-item>
      
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-top:5px;margin-bottom:5px;">
      <!-- <el-button size="small" type="primary" icon="el-icon-search" @click="submitSearch">搜索</el-button> -->
      <el-form label-width="80px" :model="form" ref="form" v-loading="listLoading" :inline="true">
        <el-form-item >
          <router-link to="/courseAdd">
            <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
          </router-link>
          <el-button
          size="small"
          type="danger"
          icon="el-icon-refresh"
          @click="reset"
          style="margin-right:10px"
        >重置</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-if="batchDeletionStatus"
            @click="batchDel"
          >批量下架</el-button>

          <strong style="font-size:16px;color:green">显示</strong> <strong style="font-size:20px;"> || </strong> <strong style="font-size:16px;color:red">隐藏</strong>
          <el-tooltip :content="isHidden+'浏览数'" placement="top">
            <el-switch
              v-model="isHidden"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="隐藏"
              inactive-value="显示"
             
              @change="batchShow"
                  :active-value="1"
                  :inactive-value="2"
              >
            </el-switch>
          </el-tooltip>
          
         
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-select
            v-model="form.courseName"
            autocomplete
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            loading-text="加载中..."
            :loading="listLoading"
            @change="getCourse"
          >
            <el-option
              v-for="item in courseNameList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <!-- <el-input
            size="small"
            v-model="form.courseName"
            auto-complete="off"
            placeholder="请输入课程名称"
            style="width:220px"
            @blur="getCourse"
          ></el-input>-->
        </el-form-item>
        <el-form-item label="课程话题" prop="subjectId">
          <el-select v-model="form.subjectId" filterable placeholder="请选择话题" @change="getCourse">
            <el-option value>请选择话题</el-option>
            <el-option
              v-for="item in subjectsGetList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"
            ></el-option>  
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-select v-model="form.courseType" placeholder="请选择课程类型" @change="getCourse">
            <el-option value="1" label="主课程">主课程</el-option>
            <el-option value="2" label="拓展课程">拓展课程</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态" prop="isVail">
          <el-select v-model="form.isVail" placeholder="请选择课程状态" @change="getCourse">
            <el-option value="-1" label="下架">下架</el-option>
            <el-option value="1" label="上架">上架</el-option>
          </el-select>
        </el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="small" @click="getCourse">搜索</el-button> -->
        
      </el-form>
    </div>

    <!--列表-->
    <el-form ref="form" :model="form">
      <el-table
        size="small"
        min-height="200"
        max-height="700"
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
        <el-table-column align="center" prop="courseType" label="课程类型" width="80"></el-table-column>
        <el-table-column align="center" prop="subjectName" label="课程话题" width="100"></el-table-column>
        <el-table-column align="center" prop="coursePicUrl" label="课程封面图片" width="240">
          <template slot-scope="scope">
            <img :src="scope.row.coursePicUrl" alt class="img_table" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称" min-width="200"></el-table-column>

        <el-table-column align="center" prop="remarks" label="发布人" width="100"></el-table-column>
        <el-table-column align="center" prop="isVail" label="上下架状态" width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.isVail" @change="changeisVail(scope.row)">
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="-1"></el-option>
            </el-select>
          </template>
        </el-table-column>
      

        <el-table-column align="center" prop="courseIndex" label="排列序号" min-width="100">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              style="width:100px"
              v-model="scope.row.courseIndex"
              auto-complete="off"
              @change="changecourseIndex(scope.row)"
              :min="0"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isHot" label="是否热门" width="80"></el-table-column>
        <el-table-column align="center" prop="isTop" label="是否推荐" width="80"></el-table-column>
        <el-table-column align="center" label="操作" width="350" fixed="right">
          <template slot-scope="scope">
            <el-button type="mini">
              <el-dropdown>
                <span class="el-dropdown-link">
                  新增
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <router-link
                      :to="{ path: '/courseAddA',query: {courseId:scope.row.courseId,resourceType:1,router:1,courseData:form}}"
                    >课程导读</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link
                      :to="{ path: '/courseAddA',query: {courseId:scope.row.courseId,resourceType:2,router:1,courseData:form}}"
                    >课程绘本</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link
                      :to="{ path: '/courseAddA',query: {courseId:scope.row.courseId,resourceType:4,router:1,courseData:form}}"
                    >课程互动游戏</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link
                      :to="{ path: '/courseAddA',query: {courseId:scope.row.courseId,resourceType:3,router:1,courseData:form}}"
                    >课程知识点</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link
                      :to="{ path: '/courseAddA',query: {courseId:scope.row.courseId,resourceType:5,router:1,courseData:form}}"
                    >课程互动作业</router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
            <router-link
              :to="{ path: '/courseDetail',query: {courseId:scope.row.courseId,courseData:form}}"
            >
              <el-button size="mini" style="margin-left:10px">编辑</el-button>
            </router-link>
            <el-button
              size="mini"
              type="danger"
              style="margin-left:10px"
              @click="courseSetTop(scope.row.courseId)"
            >置顶</el-button>
            <el-button
              v-if="scope.row.courseType=='主课程'"
              type="warning"
              size="mini"
              style="margin-left:10px"
              @click="courseSetline(scope.row.courseId)"
            >排序置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 分页组件 -->

    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <!-- 搜索界面 -->
    <!-- <el-dialog title="搜索" width="900px" :visible.sync="searchVisible" @click="closeDialog"> -->

    <!-- </el-dialog> -->
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  courseGet,
  courseDel,
  subjectsGet,
  courseputOn,
  courseSetTop,
  courseHidden,
  updateIsShowNumAll,
  updateCourseIndexByID,
  courseNameGet,
  setFirst
} from "@/api/getData";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      gradeGetList: [],
      subjectsGetList: [],
      courseNameList: [],
      isHidden:0,
      form: {
        createUserId: "",
        subjectId: "", //话题id
        courseName: "", //课程名称
        isVail: "",
        isHidden: "",
        courseType: "",
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
      searchVisible: false,
      hotCourseName: ""
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userdata"));
    this.form.createUserId = this.user.loginUser.id;
    // console.log("用户信息", this.user);
    var data = this.$route.query;
    console.log("课程列表query", data);
    if (data.courseData != undefined && data.courseData.page != undefined) {
      this.form = data.courseData;
      this.pageparm.currentPage = data.courseData.page;
    }
  },
  mounted() {
    // this.getCourse();
    this.getSubject();
    this.getcourseName();
  },
  methods: {
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
      var courseId = [];
      this.batchList.forEach(element => {
        courseId.push(element.courseId);
      });
      courseId = courseId.join(",");
      var row = {
        courseId: courseId
      };
      this.handleDel(row);
    },
    //批量显示
    async batchShow() {
      console.log(this.isHidden);
      var type = this.isHidden=='隐藏'?1:2;
      const res = await updateIsShowNumAll(type);
      console.log(res.data);
      if (res.status == 200) {
        this.$message({
          message: res.data,
          type: "success"
        });
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
        console.log(res.msg);
      }
    },
    // 分页插件事件
    callFather(parm) {
      // console.log(parm)
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getCourse();
    },
    // 重置
    reset() {
      this.form.subjectId = "";
      this.form.courseName = "";
      this.form.isVail = "";
      this.form.isHidden = "";
      this.form.courseType = "";
      this.form.page = 1;
      this.form.pageSize = 10;
      this.pageparm.currentPage = 1;
      this.getCourse();
    },
    // 获取课程列表
    async getCourse() {
      try {
        this.listLoading = true;
        // console.log("this.form", this.form);
        const res = await courseGet(this.form);
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.list = res.data.list;
          this.list.forEach(element => {
            // console.log(element);
            if (element.isVail == 1) {
              element.isVail = "上架";
            } else if (element.isVail == -1) {
              element.isVail = "下架";
            }
            if (element.courseType == 1) {
              element.courseType = "主课程";
            } else if (element.courseType == 2) {
              element.courseType = "拓展课程";
            }
            if (element.isHot == 1) {
              element.isHot = "是";
            } else if (element.isHot == 0) {
              element.isHot = "否";
            }
            if (element.isTop == 1) {
              element.isTop = "是";
              this.hotCourseName = element.courseName;
            } else if (element.isTop == 0) {
              element.isTop = "否";
            }
          });
          this.pageparm.total = res.data.total;
          this.listLoading = false;
          this.searchVisible = false; //搜索
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
    // 获取话题列表
    async getSubject() {
      try {
        this.listLoading = true;
        const res = await subjectsGet();
        if (res.status == 200) {
          // console.log("话题列表", res.data);
          this.subjectsGetList = res.data.list;
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

    async getcourseName() {
      try {
        this.listLoading = true;
        const res = await courseNameGet();
        if (res.status == 200) {
          console.log("话题列表", res.data);
          this.courseNameList = res.data.list;
          console.log("课程名称列表", this.courseNameList);
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

    // 搜索页面
    submitSearch() {
      this.searchVisible = true;
    },
    // 关闭弹出框
    closeDialog() {
      this.searchVisible = false; //搜索
    },
    // 修改上下架
    async changeisVail(row) {
      console.log(row);
      if (row.isVail == 1) {
        this.$confirm("确认上架该课程?", "提示", { type: "warning" })
          .then(async () => {
            const res = await courseputOn(row.courseId);
            console.log(res);
            if (res.status == 200) {
              this.$message({
                message: "上架成功",
                type: "success"
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
              console.log(res.msg);
            }
          })
          .catch(() => {
            this.listLoading = false;
          });
      } else {
        this.$confirm("确认下架该课程?", "提示", { type: "warning" })
          .then(async () => {
            const res = await courseDel(row.courseId);
            console.log(res);
            if (res.status == 200) {
              this.$message({
                message: "下架成功",
                type: "success"
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
              console.log(res.msg);
            }
          })
          .catch(() => {
            this.listLoading = false;
          });
      }
    },
    // 隐藏显示浏览数
    async changeisHidden(row) {
      console.log(row);
      if (row.isHidden == 1) {
        this.$confirm("确认隐藏该课程浏览数?", "提示", { type: "warning" })
          .then(async () => {
            var data = {
              id: row.courseId,
              type: 1
            };
            console.log('89');
            const res = await courseHidden(data);
            console.log(res);
            if (res.status == 200) {
              this.$message({
                message: "上架成功",
                type: "success"
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
              console.log(res.msg);
            }
          })
          .catch(() => {
            this.listLoading = false;
          });
      } else {
        this.$confirm("确认显示该课程浏览数?", "提示", { type: "warning" })
          .then(async () => {
            var data = {
              id: row.courseId,
              type: 2
            };
            const res = await courseHidden(data);
            console.log(res);
            if (res.status == 200) {
              this.$message({
                message: "下架成功",
                type: "success"
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
              console.log(res.msg);
            }
          })
          .catch(() => {
            this.listLoading = false;
          });
      }
    },
    // 课程置顶
    async courseSetTop(courseId) {
      // console.log(courseId);
      var hotCourseName = this.hotCourseName;
      var content = "确认置顶该课程?  当前主课程为：" + hotCourseName;
      this.$confirm(content, "提示", { type: "warning" })
        .then(async () => {
          const res = await courseSetTop(courseId);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              message: "置顶成功",
              type: "success"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
            console.log(res.msg);
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 修改课程的排列序号
    async changecourseIndex(row) {
      console.log(row.courseIndex);
      if (row.courseIndex != "") {
        var data = {
          courseIndex: row.courseIndex,
          courseId: row.courseId
        };
        console.log(data);
        try {
          const res = await updateCourseIndexByID(data);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getCourse();
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
          message: "请输入排列序号"
        });
      }
    },
    //修改主课程位置置1
    async courseSetline(courseId){
      const res = await setFirst(courseId);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              message: "成功",
              type: "success"
            });
            this.getCourse()
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
            console.log(res.msg);
          }
        
    }
  }
};
</script>
<style scoped>
.img_table {
  width: 200px;
  height: 80px;
}
</style>
