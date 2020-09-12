<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      <el-breadcrumb-item>作业列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-bottom:10px;">
      <el-button  type="primary" icon="el-icon-search" @click="submitSearch">搜索</el-button>

      <!-- <router-link to="/courseAdd">
        <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
      </router-link>-->
      <!-- <el-button size="small" type="danger" icon="el-icon-delete" @click="batchDel">批量导出</el-button> -->
      <el-select v-model="postExcel" placeholder="请选择导出内容" v-if="ispostexcel"
            @change="outExe()">
        <el-option value="1" label="导出当前页">导出当前页</el-option>
        <el-option value="2" label="全部导出">全部导出</el-option>
      </el-select>
    </div>

    <!--列表-->
    <!-- <el-form ref="hwsList" :model="hwsList"> -->
    <el-table
      size="small"
      min-height="200"
      max-height="680"
      :data="hwsList"
      stripe
      highlight-current-row
      v-loading="listLoading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
    
      <el-table-column align="center" prop="activityName" label="活动名称" width="280"></el-table-column>
      <!-- <el-table-column align="center" type="index" label="序号" width="100"></el-table-column> -->
      <el-table-column align="center" prop="studentName" label="宝贝昵称" width="180"></el-table-column>
      <el-table-column align="center" prop="studentAge" label="年龄" min-width="80"></el-table-column>
       <el-table-column align="center" prop="studentIdentity" label="用户身份" min-width="180"></el-table-column>
        <el-table-column align="center" prop="enterpriseName" label="企业名称" min-width="180"></el-table-column>
      <el-table-column align="center" prop="hwtype" label="作业类型" width="140"></el-table-column>
      <el-table-column align="center" prop="courseName" label="课程" width="200"></el-table-column>
      <el-table-column align="center" prop="createTime" label="作业日期" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/homeworkDetail',query: {homework:scope.row,homeworkData:hwsList}}"
          >
            <el-button size="small" style="margin-left:10px">详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-form> -->
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <!-- 搜索界面 -->
    <el-dialog title="搜索" width="900px" :visible.sync="searchVisible" @click="closeDialog">
      <el-form
        label-width="100px"
        :model="searchList"
        ref="searchList"
        style="width:850px"
        v-loading="listLoading"
      >
        <el-form-item label="宝贝昵称" prop="studentName">
          <el-input
            size="small"
            v-model="searchList.studentName"
            auto-complete="off"
            placeholder="请输入用户名"
            style="width:220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            size="small"
            v-model="searchList.courseName"
            auto-complete="off"
            placeholder="请输入课程名称"
            style="width:220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-select v-model="searchList.activityName" filterable placeholder="请选择活动">
            <el-option value>请选择活动</el-option>
            <el-option
              v-for="item in actsList"
              :key="item.activityId"
              :label="item.activityName"
              :value="item.activityName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-select v-model="searchList.enterpriseId" filterable placeholder="请选择企业">
            <el-option value>请选择企业</el-option>
            <el-option
              v-for="item in enterpriseList"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="作业类型" prop="exercisesType">
          <el-select v-model="searchList.exercisesType" placeholder="请选择课程类型">
            <el-option value="1" label="作业">作业</el-option>
            <el-option value="2" label="游戏">游戏</el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="searchList.startTime"
            type="datetime"
            placeholder="选择日期"
            default-time="00:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="searchList.endTime"
            type="datetime"
            placeholder="选择日期"
            default-time="23:59:59"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
<el-button type="primary" icon="el-icon-search"  @click="gethomework" style="margin-right:20px;">搜索</el-button>
        <el-button
          
          type="danger"
          icon="el-icon-refresh"
          @click="reset"
          style="margin-right:10px;"
        >重置</el-button>
        <el-button @click="closeDialog">取消</el-button>
        
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { allactList, homeworkList, enterpriseGet } from "@/api/getData";
import { baseUrl, baseFileUrl } from "@/config/env";
import {
  courseGet,
  courseDel,
  subjectsGet,
  courseputOn,
  courseSetTop
} from "@/api/getData";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      gradeGetList: [],
      subjectsGetList: [],
      form: {
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
      hotCourseName: "",

      plist: {
        page: 1,
        pageSize: 10
      },
      actsList: [], //活动列表
      enterpriseList: [], //企业列表
      hwsList: [], //作业列表
      coursesList: [], //课程列表
      searchList: {
        page: 1,
        pageSize: 10,
        
    
      }, //搜索列表
      excelData: "",
          ispostexcel: false, //导出弹窗的显现
           postExcel: "" //导出类型
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
    this.actList();
     this.gethomework();
    this.getenterprise();
  },
  methods: {
    async isPostSatatus() {
      if (this.postExcel == 1) {
        //导出当前选中的内容
 console.log("搜索列表"+ this.hwsList);
        this.hwsList.forEach(element => {
          this.excelData =  this.excelData + ",";
           this.excelData =  this.excelData + element.studentExercisesId;
        });
        console.log("列表"+ this.excelData);
      } else if (this.postExcel == 2) {
        //全部导出

       var data1 = this.searchList;
        delete data1.page;
        delete data1.pageSize;
        try {
          var res = await homeworkList(data1);
          if (res.status == 200) {
            console.log(res.data.list.length);
            res.data.list.forEach(element => {
             this.excelData =  this.excelData + ",";
           this.excelData =  this.excelData + element.studentExercisesId;
            });
          } else {
            this.$message({
              type: "error",
              message: res.error
            });
          }
        } catch (err) {
          this.$message({
            type: "error",
            message: "请重试"
          });
          console.log(err);
        }
      }
      this.formpage = {
        page: 1,
        pageSize: 10,
        startTime: "",
        endTime: ""
      };
      this.export2Excel();
    },

    // 导出
    outExe() {
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isPostSatatus();
        })
        .catch(() => {});
    },
    export2Excel() {
      var that = this;
      require.ensure([], () => {
      console.log(this.excelData+"最终的数据");  
      var ids=this.excelData;
           window.location.href = baseUrl+"/activity/getManyStudentExercisesByIds?ids="+ids;
           this.postExcel="";
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
    //批量导出
    // async batchDel() {
    //   var studentExercisesId = "";
    //   this.hwsList.forEach(element => {
    //     studentExercisesId = studentExercisesId + ",";
    //     studentExercisesId = studentExercisesId + element.studentExercisesId;
    //   });
    //   // studentExercisesId = studentExercisesId.substr(1);

    //   console.log(studentExercisesId);
    //   console.log(
    //     baseFileUrl +
    //       "/learn/activity/getManyStudentExercisesByIds?ids=" +
    //       studentExercisesId
    //   );
    //   window.location.href = "http://localhost:8080/restfulapi_war_exploded/activity/getManyStudentExercisesByIds?ids=" +
    //     studentExercisesId;
    //   // try {
    //   //   // this.listLoading = true;
    //   //   const res = await homeworkdownload(studentExercisesId);
    //   //    console.log("作业导出", res);
    //   //     // if (res!= "") {
    //   //       // this.listLoading = false;
    //   //     // }
    //   // }catch (err) {
    //   //   this.$message({
    //   //     type: "error",
    //   //     message: "请重试"
    //   //   });
    //   //   console.log(err);
    //   // }
    // },
    // 分页插件事件
    callFather(parm) {
      console.log(parm);
      this.searchList.page = parm.currentPage;
      this.searchList.pageSize = parm.pageSize;
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.gethomework();
    },
    // 重置
    reset() {
       this.searchList = {
        page: 1,
        pageSize: 10
      };
      
      this.form.page = 1;
      this.form.pageSize = 10;
      this.pageparm.currentPage = 1;
      this.gethomework();
    },
    //获取企业列表
    async getenterprise(e) {
      try {
        const res = await enterpriseGet();
        if (res.status == 200) {
          console.log("企业列表", res.data);
          res.data.list.forEach(element => {
            this.enterpriseList.push(element);
          });
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log("企业列表", res);
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
      try {
        this.listLoading = true;
        console.log("this.form", this.form);
        const res = await courseGet(this.form);
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.list = res.data.list;
          this.coursesList = res.data.list;
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
    // 搜索页面
    submitSearch() {
      this.searchList.page = 1;
      this.searchList.pageSize = 10;
      this.searchVisible = true;
    },
    // 关闭弹出框
    closeDialog() {
      this.searchList = {
        page: this.form.page,
        pageSize: 10
      };
      this.searchVisible = false; //搜索
    },

    //获取活动列表
    async actList() {
      try {
        this.listLoading = true;
        const res = await allactList();
        console.log("获取活动时返回", res);
        if (res.status == 200) {
          this.listLoading = false;
          this.actsList = res.data;

          console.log(this.actsList);
        }

        // this.searchVisible = false; //搜索
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    // 获取作业列表
    async gethomework() {
      console.log("searchList", this.searchList);
      try {
        this.listLoading = true;
        if(this.searchList.activityName!=''&&this.searchList.activityName!=null){
          this.searchList.activityName=this.searchList.activityName.replace(/#/g,'@'); 
        }

        if(this.searchList.courseName!=''&&this.searchList.courseName!=null){
        this.searchList.courseName=this.searchList.courseName.replace(/#/g,'@');
        }
      
        const res = await homeworkList(this.searchList);
        if(this.searchList.activityName!=''&&this.searchList.activityName!=null){
           this.searchList.activityName=this.searchList.activityName.replace( /@/g,'#');
        }
        if(this.searchList.courseName!=''&&this.searchList.courseName!=null){
       this.searchList.courseName=this.searchList.courseName.replace( /@/g,'#');
        }
        if(this.searchList.startTime==null){
          delete this.searchList.startTime;
        }if(this.searchList.endTime==null){
          delete this.searchList.endTime;
        }
        if (res.status == 200) {
          console.log("作业列表", res.data.list.length);
          this.hwsList=[];
          this.hwsList = res.data.list;
          this.searchList.page=this.form.page;
          this.searchList.pageSize=10;
         
          this.hwsList.forEach(item => {
            if (item.answerImg) {
              item.hwtype = "图片";
            } else if (item.answerVideo) {
              item.hwtype = "视频";
            } else if (item.answerVoice) {
              item.hwtype = "音频";
            } else {
              item.hwtype = "文字";
            }
          });
          this.pageparm.total = res.data.total;
          this.ispostexcel=true;
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
