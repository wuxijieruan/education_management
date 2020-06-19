<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增人数统计</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin-top:30px;">
      <el-form>
        <el-form-item label="统计时间区间：">
          <el-date-picker
            v-model="formpage.startTime"
            type="date"
            placeholder="选择开始时间"
            style="margin-left: 20px; margin-right: 20px;width:150px;"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>-
          <el-date-picker
            v-model="formpage.endTime"
            type="date"
            placeholder="选择结束时间"
            style=" margin-left: 20px;width:150px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="searchlist"
            style="margin-left:30px"
          >搜索</el-button>

          <el-button size="small" type="danger" @click="ispostexcel=true">导出</el-button>
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
      <el-tab-pane label="累计用户新增统计" name="zero">
        <el-table
          size="small"
          height="475"
          :data="newlist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="useDate" label="日期"></el-table-column>
          <el-table-column align="center" prop="newUserQtyTotalDay" label="总人数"></el-table-column>
          <el-table-column align="center" prop="newTouristQtyTotalDay" label="游客"></el-table-column>
          <el-table-column align="center" prop="newComVipQtyTotalDay" label="初级VIP"></el-table-column>
          <el-table-column align="center" prop="newEnterpriseVipQtyTotalDay" label="企业VIP"></el-table-column>
          <el-table-column align="center" prop="xieCheng" label="携程"></el-table-column>
          <el-table-column align="center" prop="zhongYin" label="中银电池"></el-table-column>
          <el-table-column align="center" prop="qianCheng" label="前程照明"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

        <!-- <div id="main" style="width: 600px;height: 400px;"></div> -->
      </el-tab-pane>
      <el-tab-pane label="每日用户新增统计" name="first">
        <el-table
          size="small"
          height="475"
          :data="perNewlist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="useDate" label="日期"></el-table-column>
          <el-table-column align="center" prop="newUserQtyPerDay" label="总人数"></el-table-column>
          <el-table-column align="center" prop="newTouristQtyPerDay" label="游客"></el-table-column>
          <el-table-column align="center" prop="newComVipQtyPerDay" label="初级VIP"></el-table-column>
          <el-table-column align="center" prop="newEnterpriseVipQtyPerDay" label="企业VIP"></el-table-column>
          <el-table-column align="center" prop="xieCheng" label="携程"></el-table-column>
          <el-table-column align="center" prop="zhongYin" label="中银电池"></el-table-column>
          <el-table-column align="center" prop="qianCheng" label="前程照明"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

        <!-- <div id="main" style="width: 600px;height: 400px;"></div> -->
      </el-tab-pane>
    </el-tabs>
    <!-- 导出选项 -->
    <!-- <el-dialog title="批量导出" :visible.sync="ispostexcel">
     
      <span slot="footer" class="dialog-footer">
        <el-button @click="ispostexcel=false">取消</el-button>
        <el-button type="primary" @click="outExe">导出</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
import echarts from "echarts";
import Pagination from "@/components/Pagination";
import { getPerNewList, getNewList } from "@/api/getData";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      activeName: "zero",
      form: {
        courseId: "",
        resourceType: ""
      },
      newlist: [], //累计新增统计
      perNewlist: [], //每日
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
      batchList: [],
      isreturnBack: false,
      excelData: "",

      charts: "",
      /*	opinion: ["1", "3", "3", "4", "5"],*/
      opinionData: ["3", "2", "4", "4", "5"],

      ispostexcel: false, //导出弹窗的显现
      postExcel: "" //导出类型
    };
  },
  components: {
    Pagination
  },
  created() {
    this.getnew();
  },
  mounted() {
    // this.$nextTick(function() {
    // 		this.drawLine('main')
    // })
  },
  methods: {
    async isPostSatatus() {
      if (this.postExcel == 1) {
        //导出当前选中的内容
         console.log(this.batchList.length)
        if (this.batchList != "" || this.batchList.length > 0) {
          this.excelData = this.batchList; //你要导出的数据list。
        } else {        
          if (this.form.resourceType == 0) {
            this.excelData = this.newlist; //你要导出的数据list。
          } else {
              this.excelData = this.perNewlist
          }
        }

        this.ispostexcel = false;
        this.postExcel = "";
      } else if (this.postExcel == 2) {
        //全部导出
        if (
          this.formpage.startTime != undefined &&
          this.formpage.endTime != undefined
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
        data.startTime = this.formpage.startTime.replace("-", "/");
        data.endTime = this.formpage.startTime.replace("-", "/");
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
          // console.log(data)
          if (this.form.resourceType == 0) {
            var res = await getNewList(data);
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
          } else if (this.form.resourceType == 1) {
            var res = await getPerNewList(data);
            if (res.status == 200) {
              this.excelData = res.data.list;
              console.log(res.data.list);
              this.listLoading = this.postExcel = "";
            } else {
              this.$message({
                type: "error",
                message: res.error
              });
            }
          }
          console.log("新增返回", res);
          if (res.status == 200) {
            let jidata = Array.from(res.data.list);
            this.excelData = jidata;

            this.listLoading = false;
          } else {
            this.$message({
              type: "error",
              message: "请重试"
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
            "useDate",
            "newUserQtyTotalDay",
            "newTouristQtyTotalDay",
            "newComVipQtyTotalDay",
            "newEnterpriseVipQtyTotalDay",
            "xieCheng",
            "zhongYin",
            "qianCheng"
          ]; // 导出的表头名
          const tHeader = [
            "日期",
            "总人数",
            "游客",
            "初级VIP",
            "企业VIP",
            "携程",
            "中银电池",
            "前程照明"
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
            `${currentdate}用户累计新增excel`
          ); // 导出的表格名称，根据需要自己命名
        });
      } else if (that.form.resourceType == 1) {
        //每日
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径
          const filterVal = [
            "useDate",
            "newUserQtyPerDay",
            "newTouristQtyPerDay",
            "newComVipQtyPerDay",
            "newEnterpriseVipQtyPerDay",
            "xieCheng",
            "zhongYin",
            "qianCheng"
          ]; // 导出的表头名
          const tHeader = [
            "日期",
            "总人数",
            "游客",
            "初级VIP",
            "企业VIP",
            "携程",
            "中银电池",
            "前程照明"
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
            `${currentdate}用户每日新增excel`
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

    // 分页插件事件
    callFather(parm) {
      // console.log(parm)
      this.formpage.page = parm.currentPage;
      this.formpage.pageSize = parm.pageSize;
      if (this.form.resourceType == 0) {
        this.getnew();
      } else if (this.form.resourceType == 1) {
        this.getPernew();
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.label == "累计用户新增统计") {
        this.form.resourceType = 0;
        this.getnew();
      } else if (tab.label == "每日用户新增统计") {
        this.form.resourceType = 1;
        this.getPernew();
      }
    },
    searchlist() {
      if (this.form.resourceType == 0) {
        this.getnew();
      } else if (this.form.resourceType == 1) {
        this.getPernew();
      }
    },

    async getnew() {
      //累计新增统计
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined
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

      data.startTime = this.formpage.startTime.replace("-", "/");
      data.endTime = this.formpage.startTime.replace("-", "/");

      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      try {
        this.listLoading = true;
        console.log(data);
        const res = await getNewList(data);
        console.log("新增返回", res);
        if (res.status == 200) {
          console.log(res.data.list);
          this.newlist = res.data.list;
          this.pageparm.total = res.data.total;
          this.listLoading = false;
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

    async getPernew() {
      //每日新增统计
      if (
        this.formpage.startTime != undefined &&
        this.formpage.endTime != undefined
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

      data.startTime = this.formpage.startTime.replace("-", "/");
      data.endTime = this.formpage.startTime.replace("-", "/");

      if (this.formpage.startTime == null) {
        data.startTime = "";
      }
      if (this.formpage.endTime == null) {
        data.endTime = "";
      }
      try {
        this.listLoading = true;
        console.log(data);
        const res = await getPerNewList(data);
        console.log("每日新增返回", res);
        if (res.status == 200) {
          console.log(res.data.list);
          this.perNewlist = res.data.list;
          this.pageparm.total = res.data.total;
          this.listLoading = false;
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

    //折线图
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["使用人数", "平均时长"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["1", "2", "3", "4", "5"]
        },
        yAxis: {
          type: "value"
        },

        series: [
          {
            name: "近七日收益",
            type: "line",
            stack: "总量",
            data: this.opinionData
          }
        ]
      });
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
