<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>复刷统计</el-breadcrumb-item>
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
        </el-form-item>
          
        
        
          
        
      </el-form>
      
    </div>
    
    <!--列表-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="资源使用统计" name="zero">
        <el-table
          size="small"
          :data="sourselist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
        >
          
          <el-table-column align="center" prop="resourcesCountCountName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="resourcesCountSource"  label="资源名称"></el-table-column>
          <el-table-column align="center" prop="resourcesCountCountTotal" label="总点击次数"></el-table-column>
          <el-table-column align="center" prop="resourcesCountStuTotal" label="点击人数"></el-table-column>
          <el-table-column align="center" prop="is_end" label="完播率"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>


      </el-tab-pane>
      <el-tab-pane label="板块复刷统计" name="first">
        <el-table
          size="small"
          :data="platelist"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
        >
          
          <el-table-column align="center" prop="platesCourseReViewCountName" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountSource"  label="资源名称"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountTotal" label="复刷次数"></el-table-column>
          <el-table-column align="center" prop="platesCourseReViewCountStuTotal" label="复刷人数"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="标签热门统计" name="second">
        <el-table
          size="small"
          :data="taglist"
          
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
        >
          
          <el-table-column align="center" prop="tagHotCountTagName" label="标签名"></el-table-column>
          <el-table-column align="center" prop="tagHotCountStuCount"  label="总观看人次"></el-table-column>
          <el-table-column align="center" prop="tagHotCountClickTotal" label="总点击次数"></el-table-column>
          <el-table-column align="center" prop="tagHotCountTimeCount" label="总播放时长(分钟)"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="课程热门统计" name="third">
        <el-table
          size="small"
          :data="hotcourselist"
          
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 90%;"
        >
          
          <el-table-column align="center" prop="courseHotCountName" label="课程名"></el-table-column>
          <el-table-column align="center" prop="courseHotCountStuTotal"  label="总观看人次"></el-table-column>
          <el-table-column align="center" prop="courseHotCountChickTotal" label="总点击次数"></el-table-column>
          <el-table-column align="center" prop="courseHotCountTimeCount" label="总播放时长(分钟)"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="课程复刷统计" name="fourth">
        <el-table
          size="small"
          :data="recourselist"
          :cell-class-name="tableRowClassName"
          highlight-current-row
          v-loading="listLoading"
          border
          element-loading-text="拼命加载中"
          style="width: 60%;"
        >
          
          <el-table-column align="center" prop="courseReViewCountName" label="课程名称" min-width="200"></el-table-column>
          <el-table-column align="center" prop="courseReViewCountTotal"  label="复刷次数" width="150"></el-table-column>
          <el-table-column align="center" prop="courseReViewCountStuTotal" label="复刷人数" width="150"></el-table-column>
          
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
      
    </el-tabs>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { hotCourseList,hotTagList  , plateList ,reCourseList,sourceList} from "@/api/getData";
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

      sourselist:[],//资源统计统计
      platelist:[],//复刷板块
      taglist:[],//标签热门统计
      hotcourselist:[],//课程热门统计
      recourselist:[],// 课程复刷统计
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
    };
  },
  components: {
    Pagination
  },
  mounted() {
    this.getsourselist()
  },
  methods: {
    stChange(val) {
            console.log(val);
            if(val==''||val==undefined||val==null){
              this.formpage.startTime=''
            }
    },
    endChange(val) {
            console.log(val);
            if(val==''||val==undefined||val==null){
              this.formpage.endTime=''
            }
    },
    // 分页插件事件
    callFather(parm) {
      // console.log(parm)
      this.formpage.page = parm.currentPage;
      this.formpage.pageSize = parm.pageSize;
      if (this.form.resourceType == 0) {
        this.getsourselist()
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
    tableRowClassName({row, column,rowIndex,columnIndex}){//判断表格颜色
      var list =this.platelist
      if(list){
        
        if (row.platesCourseReViewCountSource == "该资源名称为空，请尽快补充资料！" && columnIndex == 1) {
          // console.log("row",row.platesCourseReViewCountSource)
          // console.log(columnIndex)
          return 'warning-row';
        }
      }
      return '';
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.label == "资源使用统计") {
        this.form.resourceType = 0;
        this.getsourselist()
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
    searchlist(){
      if (this.form.resourceType == 0) {
        this.getsourselist()
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
    async getplateDetails() {//板块复刷
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined&&this.formpage.startTime!=null&&this.formpage.endTime!=null){
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
        const res = await plateList(data);
         console.log(res);
        if (res.status == 200) {
          this.platelist = res.data.list;
          
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
    async getsourselist() {//资源统计
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined&&this.formpage.startTime!=null&&this.formpage.endTime!=null){
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
        const res = await sourceList(data);
        
        if (res.status == 200) {
          console.log(res.data.list);
          this.sourselist = res.data.list;
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
    async getcourselist() {//热门课程统计
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined&&this.formpage.startTime!=null&&this.formpage.endTime!=null){
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
        const res = await hotCourseList(data);
         console.log(res);
        if (res.status == 200) {
          this.hotcourselist = res.data.list;
          
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
    async gettaglist() {//热门标签统计
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined&&this.formpage.startTime!=null&&this.formpage.endTime!=null){
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
        const res = await hotTagList(data);
         console.log(res);
        if (res.status == 200) {
          this.taglist = res.data.list;
          
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
    async getrecourselist() {//课程复刷统计
      if(this.formpage.startTime!=undefined&&this.formpage.endTime!=undefined&&this.formpage.startTime!=null&&this.formpage.endTime!=null){
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
        const res = await reCourseList(data);
         console.log(res);
        if (res.status == 200) {
          this.recourselist = res.data.list;
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
