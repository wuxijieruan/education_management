<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户统计</el-breadcrumb-item>
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
          <el-button
          size="small"
          type="danger"
          v-if="isreturnBack"
          @click="returnBack"
          >邀请回访</el-button>

           <el-button
            size="small"
            type="danger"
            @click="ispostexcel=true"
          >批量导出</el-button>
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
      <el-tab-pane label="用户统计" name="zero">
        <el-table
          size="small"
           height="475"
          :data="deeptablelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountStuName" label="用户名"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountStuPhone"  label="手机号"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountStuScenario" label="注册途径"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountRegisteredActivity" label="活动名称"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountUCourseTotal" label="累计解锁课程数量"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountExerciseTotal" label="上传作业数量"></el-table-column>
          <el-table-column align="center" prop="stuProfundityCountTimeTotal" label="每周平均使用时长"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="使用时段统计" name="first">
        <el-table
          size="small"
           height="475"
          :data="timetablelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          @selection-change="selectionChange"
          style="width: 90%;"
          >
            <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="useIntervalCountDate" label="时间段"></el-table-column>
          <el-table-column align="center" prop="useIntervalCountStuCount"  label="使用人数"></el-table-column>
          <el-table-column align="center" prop="useIntervalCountAvgTimeCount" label="平均时长(分钟)"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

        <!-- <div id="main" style="width: 600px;height: 400px;"></div> -->
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
    </el-dialog> -->
  </div>
</template>
<script>
import echarts from 'echarts'
import Pagination from "@/components/Pagination";
import { timeList,deepList,returnBackStu } from "@/api/getData";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      activeName: "zero",
      form: {
        courseId: "",
        resourceType: ""
      },

      timetablelist:[],//时长统计
      deeptablelist:[],//深度统计
      formpage:{
        page: 1,
        pageSize: 10,
        startTime:'',
        endTime:''
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchList:[],
      isreturnBack:false,
      excelData:"",

      charts: '',
			/*	opinion: ["1", "3", "3", "4", "5"],*/
      opinionData: ["3", "2", "4", "4", "5"],
      
      ispostexcel:false,//导出弹窗的显现
      postExcel:"",//导出类型
    };
  },
  components: {
    Pagination
  },
  created(){
    this.getdeeplist()
  },
  mounted() {
    
    // this.$nextTick(function() {
		// 		this.drawLine('main')
		// })
  },
  methods: {
    async isPostSatatus(){
      if(this.postExcel==1){//导出当前选中的内容
        if (this.batchList != "" || this.batchList.length > 0) {
          this.excelData = this.batchList; //你要导出的数据list。
        } else {        
          if (this.form.resourceType == 0) {
           console.log(this.deeptablelist)
            this.excelData = this.deeptablelist; //你要导出的数据list。
          } else {
              this.excelData = this.timetablelist
          }
        }
 console.log(this.excelData)
        this.ispostexcel = false;
        this.postExcel = "";
      }else if(this.postExcel==2){//全部导出
        if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined){
          let st = new Date(this.formpage.startTime)
          let en = new Date(this.formpage.endTime)
          let starttime = st.getTime(st)
          let endtime = en.getTime(en)
          console.log(starttime,endtime)
          if(starttime>endtime){
            alert("请填写正确的日期区间")
            return
          }
        }
        var data = this.formpage
        if(this.formpage.startTime==null){
          data.startTime=''
        }
        if(this.formpage.endTime==null){
          data.endTime=''
        }
        delete data.page
        delete data.pageSize
        try {
          this.ispostexcel=false
          this.listLoading = true;
          console.log(data);
          if (this.form.resourceType == 0) {
            var res = await deepList(data)
          } else if (this.form.resourceType == 1) {
            var res = await timeList(data);
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
        this.formpage={
          page: 1,
          pageSize: 10,
          startTime: "",
          endTime: ""
        }
        this.export2Excel()
    },
     // 导出
    outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isPostSatatus()
                }).catch(() => {
                
                });
    },
    export2Excel() {
                var that = this;
                if (that.form.resourceType == 0) {//累计
                    require.ensure([], () => {
                        const { export_json_to_excel } = require('../../excel/Export2Excel'); //这里必须使用绝对路径
                        const filterVal = ['stuProfundityCountStuName','stuProfundityCountStuPhone', 'stuProfundityCountStuScenario', 'stuProfundityCountRegisteredActivity','stuProfundityCountUCourseTotal','stuProfundityCountExerciseTotal',"stuProfundityCountTimeTotal"]; // 导出的表头名
                        const tHeader = ['用户名','手机号','注册途径', '活动名称','累计解锁课程数量','上传作业数量','每周平均使用时长']; // 导出的表头字段名
                        const list = that.excelData;
                        const data = that.formatJson(filterVal, list);
                        let datetime=new Date()
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
                        
                        export_json_to_excel(tHeader, data, `${currentdate}用户统计excel`);// 导出的表格名称，根据需要自己命名
                        
                        
                      })



                    } else if(that.form.resourceType == 1){//每日
                      require.ensure([], () => {
                        const { export_json_to_excel } = require('../../excel/Export2Excel'); //这里必须使用绝对路径
                        
                         const filterVal = ['useIntervalCountDate','useIntervalCountStuCount', 'useIntervalCountAvgTimeCount']; // 导出的表头名
                        
                        
                        const tHeader = ['时间段','使用人数','平均时长(分钟)']; // 导出的表头字段名
                        const list = that.excelData;
                        const data = that.formatJson(filterVal, list);
                        let datetime=new Date()
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
                        
                          export_json_to_excel(tHeader, data, `${currentdate}使用时段统计excel`);// 导出的表格名称，根据需要自己命名
                        
                        
                    })



                  }
               
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
    //邀请回访
    async returnBack() {
      var usersId = "";
      this.batchList.forEach(element => {
        usersId = usersId+",";
        usersId= usersId + element.stuProfundityCountStuID;
        
      });
     console.log(usersId)
     var data={
       ids :usersId 
     }
     const res = await returnBackStu(data);
     console.log("回访返回",res)
     if(res.status==200){
        alert('邀请成功！')
        this.getdeeplist()
     }
    },
    // 分页插件事件
    callFather(parm) {
      // console.log(parm)
      this.formpage.page = parm.currentPage;
      this.formpage.pageSize = parm.pageSize;
      if (this.form.resourceType == 0) {
        this.getdeeplist();
      } else if (this.form.resourceType == 1) {
        this.gettimeDetails()
      } 
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.label == "用户统计") {
        // this.batchList = [];
        this.isreturnBack = false;
        this.form.resourceType = 0;
        this.getdeeplist();
      } else if (tab.label == "使用时段统计") {
        // this.batchList = [];
        this.isreturnBack = false;
        this.form.resourceType = 1;
        this.gettimeDetails()
      } 
    },
    searchlist(){
      if (this.form.resourceType == 0) {
        this.getdeeplist();
      } else if (this.form.resourceType == 1) {
        this.gettimeDetails()
      } 
    },
    async gettimeDetails() {//用户时长统计
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined){
        let st = new Date(this.formpage.startTime)
        let en = new Date(this.formpage.endTime)
        let starttime = st.getTime(st)
        let endtime = en.getTime(en)
        console.log(starttime,endtime)
        if(starttime>endtime){
          alert("请填写正确的日期区间")
          return
        }
      }
      var data = this.formpage
      if(this.formpage.startTime==null){
        data.startTime=''
      }
      if(this.formpage.endTime==null){
        data.endTime=''
      }
      console.log(this.formpage)
      try {
        
        this.listLoading = true
        const res = await timeList(data);
         console.log(res);
        if (res.status == 200) {
          this.timetablelist = res.data.list;
          
          this.pageparm.total =res.data.total
          this.listLoading = false
         
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
    async getdeeplist() {//用户深度统计
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined){
        let st = new Date(this.formpage.startTime)
        let en = new Date(this.formpage.endTime)
        let starttime = st.getTime(st)
        let endtime = en.getTime(en)
        console.log(starttime,endtime)
        if(starttime>endtime){
          alert("请填写正确的日期区间")
          return
        }
      }
      var data = this.formpage
      if(this.formpage.startTime==null){
        data.startTime=''
      }
      if(this.formpage.endTime==null){
        data.endTime=''
      }
      try {
        this.listLoading = true
        console.log(data)
        const res = await deepList(data);
        
        if (res.status == 200) {
          console.log(res.data.list);
          this.deeptablelist = res.data.list;
          this.pageparm.total =res.data.total
          this.listLoading = false
         
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
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['使用人数','平均时长']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},

					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
					  data: ["1","2","3","4","5"]
					
					},
					yAxis: {
						type: 'value'
					},

					series: [{
						name: '近七日收益',
						type: 'line',
						stack: '总量',
						data: this.opinionData
					}]
				})
			},
    
    
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
