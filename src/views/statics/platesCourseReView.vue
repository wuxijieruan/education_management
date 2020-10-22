<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程统计</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin-top:30px;">
      <!-- 搜索条件 开始时间-结束时间 开始时间以00:00:00开头，结束时间为23:59:59-->
      <el-form>
        <el-form-item label="统计时间区间：">
          <el-date-picker
            v-model="formpage.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="margin-left: 20px; margin-right: 20px;width:250px;"
            value-format="yyyy-MM-dd HH:mm:ss"
             default-time="00:00:00"
            
          ></el-date-picker>-
          <el-date-picker
            v-model="formpage.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style=" margin-left: 20px;width:250px"
             value-format="yyyy-MM-dd HH:mm:ss"
            
             default-time="23:59:59"
          ></el-date-picker>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="searchlist"
            style="margin-left:30px"
          >搜索</el-button>

          <!-- <el-button size="small" type="danger" @click="ispostexcel=true">导出</el-button> -->
          <!-- <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="outExeall"
          >全部导出</el-button>-->

          <el-select
            v-model="postExcel"
            placeholder="请选择导出内容"
            v-if="ispostexcel"
            @change="outExe()"
          >
            <el-option value="1" label="导出当前页">导出当前页</el-option>
            <el-option value="2" label="全部导出">全部导出</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!--列表-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="资源使用统计" name="zero">
        <el-table
          size="small"
          height="475"
          :data="soursetablelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          @selection-change="selectionChange"
          style="width: 90%;"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="resourcesCountCountName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="resourcesCountSource" label="资源名称"></el-table-column>
          <el-table-column align="center" prop="resourcesCountSourceType" label="资源包类型"></el-table-column>
          <el-table-column align="center" prop="resourcesCountSourceFileType" label="资源类型"></el-table-column>
          <el-table-column align="center" prop="resourcesCountCountTotal" label="总点击次数"></el-table-column>
          <el-table-column align="center" prop="resourcesCountStuTotal" label="点击人数"></el-table-column>

          <el-table-column align="center" prop="is_end" label="完播次数"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="板块复刷统计" name="first">
        <el-table
          size="small"
          height="475"
          :data="platetablelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountSource" label="资源名称"></el-table-column>
          <el-table-column align="center" prop="resourcesCountSourceType" label="资源包类型"></el-table-column>
          <el-table-column align="center" prop="resourcesCountSourceFileType" label="资源类型"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountTotal" label="复刷次数"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountStuTotal" label="复刷人数"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="标签热门统计" name="second">
        <el-table
          size="small"
          height="475"
          :data="tagtablelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="tagHotCountTagName" label="标签名"></el-table-column>
          <el-table-column align="center" prop="tagHotCountStuCount" label="总观看人次"></el-table-column>
          <el-table-column align="center" prop="tagHotCountClickTotal" label="总点击次数"></el-table-column>
          <el-table-column align="center" prop="tagHotCountTimeCount" label="总播放时长(分钟)"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="课程热门统计" name="third">
        <el-table
          size="small"
          height="475"
          :data="hotcoursetablelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="courseHotCountName" label="课程名"></el-table-column>
          <el-table-column align="center" prop="courseHotCountStuTotal" label="总观看人次"></el-table-column>
          <el-table-column align="center" prop="courseHotCountChickTotal" label="总点击次数"></el-table-column>
          <el-table-column align="center" prop="courseHotCountTimeCount" label="总播放时长(分钟)"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="课程复刷统计" name="fourth">
        <el-table
          size="small"
          height="475"
          :data="recoursetablelist"
          :cell-class-name="tableRowClassName"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 60%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="courseReViewCountName" label="课程名称" min-width="200"></el-table-column>
          <el-table-column align="center" prop="courseReViewCountTotal" label="复刷次数" width="150"></el-table-column>
          <el-table-column align="center" prop="courseReViewCountStuTotal" label="复刷人数" width="150"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- 导出选项 -->
    <!-- <el-dialog title="批量导出" :visible.sync="ispostexcel">
      <el-select v-model="postExcel" placeholder="请选择导出内容" default-first-option>
            <el-option value="1" label="导出当前选中的内容">导出当前选中的内容</el-option>
            <el-option value="2" label="全部导出">全部导出</el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ispostexcel=false">取消</el-button>
        <el-button type="primary" @click="outExe">导出</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  hotCourseList,
  hotTagList,
  plateList,
  reCourseList,
  sourceList
} from "@/api/getData";
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

      soursetablelist: [], //资源统计统计
      platetablelist: [], //复刷板块
      tagtablelist: [], //标签热门统计
      hotcoursetablelist: [], //课程热门统计
      recoursetablelist: [], // 课程复刷统计

      batchList: [],
      isreturnBack: false,
      excelData: "",
      formpage: {
        page: 1,
        pageSize: 10,
        startTime: "",
        endTime: ""
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      ispostexcel: false, //导出弹窗的显现
      postExcel: "" //导出类型
    };
  },
  components: {
    Pagination
  },
  mounted() {
    this.getsourselist();
  },
  methods: {
    async isPostSatatus() {
      if (this.postExcel == 1) {
        //导出当前选中的内容
        if (this.batchList != "" || this.batchList.length > 0) {
          this.excelData = this.batchList; //你要导出的数据list。
        } else {
          if (this.form.resourceType == 0) {
           this.excelData = this.soursetablelist; //你要导出的数据list。
          } else if (this.form.resourceType == 1) {
            this.excelData = this.platetablelist; //你要导出的数据list。
          } else if (this.form.resourceType == 2) {
            this.excelData = this.tagtablelist; //你要导出的数据list。
          } else if (this.form.resourceType == 3) {
            this.excelData = this.hotcoursetablelist; //你要导出的数据list。
          } else if (this.form.resourceType == 4) {
            this.excelData = this.recoursetablelist; //你要导出的数据list。
          }
        }
        console.log(this.excelData);
        this.ispostexcel = false;
        this.postExcel = "";
      } else if (this.postExcel == 2) {
        //全部导出
        if (
          this.formpage.startTime != undefined &&
          this.formpage.endTime != undefined &&
          this.formpage.startTime != null &&
          this.formpage.endTime != null
        ) {
          let st = new Date(this.formpage.startTime);
          let en = new Date(this.formpage.endTime);
          let starttime = st.getTime(st);
          let endtime = en.getTime(en);
          console.log(starttime, endtime);
          if (starttime > endtime) {
            alert("请填写正确的日期区间");
            return;
          }
        }
        var data = this.formpage;
        if (this.formpage.startTime == null) {
          data.startTime = "";
        }
        if (this.formpage.endTime == null) {
          data.endTime = "";
        }
        delete data.page;
        delete data.pageSize;
        try {
          this.ispostexcel = false;
          this.listLoading = true;
          console.log(data);
          if (this.form.resourceType == 0) {
            var res = await sourceList(data);
          } else if (this.form.resourceType == 1) {
            var res = await plateList(data);
          } else if (this.form.resourceType == 2) {
            var res = await hotTagList(data);
          } else if (this.form.resourceType == 3) {
            var res = await hotCourseList(data);
          } else if (this.form.resourceType == 4) {
            var res = await reCourseList(data);
          }

          if (res.status == 200) {
            console.log(res.data.list);
            this.excelData = res.data.list;
            this.listLoading = false;
              this.postExcel = "";
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
      if (that.form.resourceType == 0) {
        //累计
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径
          const filterVal = [
            "resourcesCountCountName",
            "resourcesCountSource",
            "resourcesCountSourceType",
            "resourcesCountSourceFileType",
            "resourcesCountCountTotal",
            "resourcesCountStuTotal",
            "is_end"
          ]; // 导出的表头名
          const tHeader = [
            "课程名称",
            "资源名称",
            "资源包类型",
            "资源类型",
            "总点击次数",
            "点击人数",
            "完播次数"
          ]; // 导出的表头字段名
          const list = that.excelData;
          const data = that.formatJson(filterVal, list);
          let datetime = new Date();
          var seperator1 = "-";
          var year = datetime.getFullYear();
          var month = datetime.getMonth() + 1;
          var strDate = datetime.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;

          export_json_to_excel(tHeader, data, `${currentdate}资源统计excel`); // 导出的表格名称，根据需要自己命名
        });
      } else if (that.form.resourceType == 1) {
        //每日
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径

          const filterVal = [
            "platesCourseReViewCountName",
            "platesCourseReViewCountSource",
            "resourcesCountSourceType",
            "resourcesCountSourceFileType",
            "platesCourseReViewCountTotal",
            "platesCourseReViewCountStuTotal"
          ]; // 导出的表头名

          const tHeader = [
            "课程名称",
            "资源名称",
            "资源包类型",
            "资源类型",
            "复刷次数",
            "复刷人数"
          ]; // 导出的表头字段名
          const list = that.excelData;
          const data = that.formatJson(filterVal, list);
          let datetime = new Date();
          var seperator1 = "-";
          var year = datetime.getFullYear();
          var month = datetime.getMonth() + 1;
          var strDate = datetime.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;

          export_json_to_excel(
            tHeader,
            data,
            `${currentdate}板块复刷统计excel`
          ); // 导出的表格名称，根据需要自己命名
        });
      } else if (that.form.resourceType == 2) {
        //每日
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径

          const filterVal = [
            "tagHotCountTagName",
            "tagHotCountStuCount",
            "tagHotCountClickTotal",
            "tagHotCountTimeCount"
          ]; // 导出的表头名

          const tHeader = [
            "标签名",
            "总观看人次",
            "总点击次数",
            "总播放时长(分钟)"
          ]; // 导出的表头字段名
          const list = that.excelData;
          const data = that.formatJson(filterVal, list);
          let datetime = new Date();
          var seperator1 = "-";
          var year = datetime.getFullYear();
          var month = datetime.getMonth() + 1;
          var strDate = datetime.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;

          export_json_to_excel(
            tHeader,
            data,
            `${currentdate}标签热门统计excel`
          ); // 导出的表格名称，根据需要自己命名
        });
      } else if (that.form.resourceType == 3) {
        //每日
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径

          const filterVal = [
            "courseHotCountName",
            "courseHotCountStuTotal",
            "courseHotCountChickTotal",
            "courseHotCountTimeCount"
          ]; // 导出的表头名

          const tHeader = [
            "课程名",
            "总观看人次",
            "总点击次数",
            "总播放时长(分钟)"
          ]; // 导出的表头字段名
          const list = that.excelData;
          const data = that.formatJson(filterVal, list);
          let datetime = new Date();
          var seperator1 = "-";
          var year = datetime.getFullYear();
          var month = datetime.getMonth() + 1;
          var strDate = datetime.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;

          export_json_to_excel(
            tHeader,
            data,
            `${currentdate}课程热门统计excel`
          ); // 导出的表格名称，根据需要自己命名
        });
      } else if (that.form.resourceType == 4) {
        //每日
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径

          const filterVal = [
            "courseReViewCountName",
            "courseReViewCountTotal",
            "courseReViewCountStuTotal"
          ]; // 导出的表头名

          const tHeader = ["课程名称", "复刷次数", "复刷人数"]; // 导出的表头字段名
          const list = that.excelData;
          const data = that.formatJson(filterVal, list);
          let datetime = new Date();
          var seperator1 = "-";
          var year = datetime.getFullYear();
          var month = datetime.getMonth() + 1;
          var strDate = datetime.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;

          export_json_to_excel(
            tHeader,
            data,
            `${currentdate}课程复刷统计excel`
          ); // 导出的表格名称，根据需要自己命名
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    // 多选/全选
    selectionChange(e) {
      if (e.length != 0) {
        this.batchList = e;
        this.isreturnBack = true;
      } else {
        this.batchList = [];
        this.isreturnBack = false;
      }
    },

    stChange(val) {
      console.log(val);
      if (val == "" || val == undefined || val == null) {
        this.formpage.startTime = "";
      }
    },
    endChange(val) {
      console.log(val);
      if (val == "" || val == undefined || val == null) {
        this.formpage.endTime = "";
      }
    },
    // 分页插件事件
    callFather(parm) {
      // console.log(parm)
      this.formpage.page = parm.currentPage;
      this.formpage.pageSize = parm.pageSize;
      if (this.form.resourceType == 0) {
        this.getsourselist();
      } else if (this.form.resourceType == 1) {
        this.getplateDetails();
      } else if (this.form.resourceType == 2) {
        this.gettaglist();
      } else if (this.form.resourceType == 3) {
        this.getcourselist();
      } else if (this.form.resourceType == 4) {
        this.getrecourselist();
      }
    },
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      //判断表格颜色
      var list = this.platetablelist;
      if (list) {
        if (
          row.platesCourseReViewCountSource ==
            "该资源名称为空，请尽快补充资料！" &&
          columnIndex == 1
        ) {
          // console.log("row",row.platesCourseReViewCountSource)
          // console.log(columnIndex)
          return "warning-row";
        }
      }
      return "";
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.label == "资源使用统计") {
        this.form.resourceType = 0;
        this.getsourselist();
      } else if (tab.label == "板块复刷统计") {
        this.form.resourceType = 1;
        this.getplateDetails();
      } else if (tab.label == "标签热门统计") {
        this.form.resourceType = 2;
        this.gettaglist();
      } else if (tab.label == "课程热门统计") {
        this.form.resourceType = 3;
        this.getcourselist();
      } else if (tab.label == "课程复刷统计") {
        this.form.resourceType = 4;
        this.getrecourselist();
      }
    },
    searchlist() {
      if (this.form.resourceType == 0) {
        this.getsourselist();
      } else if (this.form.resourceType == 1) {
        this.getplateDetails();
      } else if (this.form.resourceType == 2) {
        this.gettaglist();
      } else if (this.form.resourceType == 3) {
        this.getcourselist();
      } else if (this.form.resourceType == 4) {
        this.getrecourselist();
      }
    },
    async getplateDetails() {
      //板块复刷
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined &&
        this.formpage.startTime != null &&
        this.formpage.endTime != null
      ) {
        let st = new Date(this.formpage.startTime);
        let en = new Date(this.formpage.endTime);
        let starttime = st.getTime(st);
        let endtime = en.getTime(en);
        console.log(starttime, endtime);
        if (starttime > endtime) {
          alert("请填写正确的日期区间");
          return;
        }
      }
      var data = this.formpage;
      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      console.log(this.formpage);
      try {
        this.listLoading = true;
        const res = await plateList(data);
        console.log(res);
        if (res.status == 200) {
          this.platetablelist = res.data.list;

          this.pageparm.total = res.data.total;
          this.listLoading = false;
          this.ispostexcel = true;
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
    },
    async getsourselist() {
      //资源统计
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined &&
        this.formpage.startTime != null &&
        this.formpage.endTime != null
      ) {
        let st = new Date(this.formpage.startTime);
        let en = new Date(this.formpage.endTime);
        let starttime = st.getTime(st);
        let endtime = en.getTime(en);
        console.log(starttime, endtime);
        if (starttime > endtime) {
          alert("请填写正确的日期区间");
          return;
        }
      }
      var data = this.formpage;
      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      try {
        this.listLoading = true;
        console.log(data);
        const res = await sourceList(data);

        if (res.status == 200) {
          console.log(res.data.list);
          this.soursetablelist = res.data.list;
          this.pageparm.total = res.data.total;
          this.listLoading = false;
            this.ispostexcel = true;
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
    },
    async getcourselist() {
      //热门课程统计
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined &&
        this.formpage.startTime != null &&
        this.formpage.endTime != null
      ) {
        let st = new Date(this.formpage.startTime);
        let en = new Date(this.formpage.endTime);
        let starttime = st.getTime(st);
        let endtime = en.getTime(en);
        console.log(starttime, endtime);
        if (starttime > endtime) {
          alert("请填写正确的日期区间");
          return;
        }
      }
      var data = this.formpage;
      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      try {
        this.listLoading = true;
        const res = await hotCourseList(data);
        console.log(res);
        if (res.status == 200) {
          this.hotcoursetablelist = res.data.list;

          this.pageparm.total = res.data.total;
          this.listLoading = false;
            this.ispostexcel = true;
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
    },
    async gettaglist() {
      //热门标签统计
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined &&
        this.formpage.startTime != null &&
        this.formpage.endTime != null
      ) {
        let st = new Date(this.formpage.startTime);
        let en = new Date(this.formpage.endTime);
        let starttime = st.getTime(st);
        let endtime = en.getTime(en);
        console.log(starttime, endtime);
        if (starttime > endtime) {
          alert("请填写正确的日期区间");
          return;
        }
      }
      var data = this.formpage;
      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      try {
        this.listLoading = true;
        const res = await hotTagList(data);
        console.log(res);
        if (res.status == 200) {
          this.tagtablelist = res.data.list;

          this.pageparm.total = res.data.total;
          this.listLoading = false;
            this.ispostexcel = true;
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
    },
    async getrecourselist() {
      //课程复刷统计
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined &&
        this.formpage.startTime != null &&
        this.formpage.endTime != null
      ) {
        let st = new Date(this.formpage.startTime);
        let en = new Date(this.formpage.endTime);
        let starttime = st.getTime(st);
        let endtime = en.getTime(en);
        console.log(starttime, endtime);
        if (starttime > endtime) {
          alert("请填写正确的日期区间");
          return;
        }
      }
      var data = this.formpage;
      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      try {
        this.listLoading = true;
        const res = await reCourseList(data);
        console.log(res);
        if (res.status == 200) {
          this.recoursetablelist = res.data.list;
          this.pageparm.total = res.data.total;
          this.listLoading = false;
            this.ispostexcel = true;
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
  }
};
</script>
<style >
.el-table .warning-row {
  /* background: oldlace; */
  color: red;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
