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
          icon="el-icon-delete"
          v-if="isreturnBack"
          @click="returnBack"
          >邀请回访</el-button>
        </el-form-item>
          
        
        
          
        
      </el-form>
      
    </div>
    
    <!--列表-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户统计" name="zero">
        <el-table
          size="small"
          :data="deeplist"
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
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="使用时段统计" name="first">
        <el-table
          size="small"
          :data="timelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
          >
          
          <el-table-column align="center" prop="useIntervalCountDate" label="时间段"></el-table-column>
          <el-table-column align="center" prop="useIntervalCountStuCount"  label="使用人数"></el-table-column>
          <el-table-column align="center" prop="useIntervalCountAvgTimeCount" label="平均时长(分钟)"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

        <!-- <div id="main" style="width: 600px;height: 400px;"></div> -->
      </el-tab-pane>
      
      
      
    </el-tabs>
  </div>
</template>
<script>
import echarts from 'echarts'
import Pagination from "@/components/Pagination";
import { timeList,deepList,returnBackStu} from "@/api/getData";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      activeName: "zero",
      form: {
        courseId: "",
        resourceType: ""
      },

      timelist:[],//时长统计
      deeplist:[],//深度统计
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


      charts: '',
			/*	opinion: ["1", "3", "3", "4", "5"],*/
			opinionData: ["3", "2", "4", "4", "5"]
    };
  },
  components: {
    Pagination
  },
  mounted() {
    this.getdeeplist()
    // this.$nextTick(function() {
		// 		this.drawLine('main')
		// })
  },
  methods: {
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
        this.form.resourceType = 0;
        this.getdeeplist();
      } else if (tab.label == "使用时段统计") {
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
          this.timelist = res.data.list;
          
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
          this.deeplist = res.data.list;
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
