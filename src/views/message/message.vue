<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>消息管理</el-breadcrumb-item>
      <el-breadcrumb-item>消息列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-bottom:10px;">
      <el-button size="small" type="primary" icon="el-icon-search" @click="submitSearch">搜索</el-button>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-refresh"
        @click="reset"
        style="margin-right:10px"
      >重置</el-button>
      
    </div>
    

    <!--列表-->
      <el-table
        size="small"
        :data="messagesList"
        stripe
        highlight-current-row
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 90%;"
        @selection-change="selectionChange"
        
        >
        <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
        <el-table-column align="center" prop="studentName" label="用户名" width="100"></el-table-column>
        <el-table-column align="center" prop="stutem_id"  label="学生ID" width="130"></el-table-column>
        <!-- <el-table-column align="center" prop="receive_openid" label="openid" width="100"></el-table-column> -->
        <el-table-column align="center" prop="templateId" label="模板ID" width="120"></el-table-column>
        <el-table-column align="center" prop="createTime" label="发送时间" width="130"></el-table-column>
        <el-table-column align="center" prop="content"  label="内容" min-width="130"></el-table-column>
        <el-table-column align="center" label="操作" width="100" fixed="right">
          <!-- <template slot-scope="scope">
            <router-link
              :to="{ path: '/userDetail',query: {users:scope.row,usersList:usersList}}"
            >
              <el-button size="small" style="margin-left:10px">详情</el-button>
            </router-link>
            
          </template> -->
        </el-table-column>
      </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { baseUrl ,baseFileUrl} from '@/config/env'
import {
  getMessList
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
      messagesList:[],//消息列表
      searchList:{
        page: 1,
        pageSize: 10,
      },//搜索列表
      excelData:""
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() { 
    this.user = JSON.parse(localStorage.getItem("userdata"));
    this.form.createUserId = this.user.loginUser.id;
    
  },
  mounted() {
    this.getmessageList()
  },
  methods: {
    // 导出
    outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.batchList //你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {
                
                });
    },
    export2Excel() {
                var that = this;
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../excel/Export2Excel'); //这里必须使用绝对路径
                    const filterVal = ['activityName','studentName', 'studentAge', 'hwtype','courseName','createTime',"answerImg","answerTest"]; // 导出的表头名
                    const tHeader = ['活动名称','宝贝昵称','年龄', '作业类型','课程','作业日期','图片','文字']; // 导出的表头字段名
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
                    export_json_to_excel(tHeader, data, `${currentdate}作业列表excel`);// 导出的表格名称，根据需要自己命名
                })
   },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  
  //搜索判定
  searchuser(){
    if(this.searchList!=[]){
      

      this.getmessageList()
    }
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
    // 分页插件事件
callFather(parm) {
      // console.log(parm)
      this.searchList.page = parm.currentPage;
      this.searchList.pageSize = parm.pageSize;
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getmessageList();
},
    // 重置
reset() {
      this.searchList={
         page: 1,
        pageSize: 10,
       }
      this.form.page = 1;
      this.form.pageSize = 10;
      this.pageparm.currentPage = 1;
      this.getmessageList();
},
    // 搜索页面
    submitSearch() {
      this.searchList={
         page: 1,
          pageSize: 10,
       }
      this.searchVisible = true;
    },
    // 关闭弹出框
    closeDialog() {
      this.searchVisible = false; //搜索
    },



  //获取信息列表
  async getmessageList() {
      try {
        this.listLoading = true;
        console.log('搜索消息列表',this.searchList)
        const res = await getMessList(this.searchList);
        console.log("获取消息时返回",res);
        if(res.status==200){
          this.listLoading = false;
          this.messagesList = res.data.list;
          console.log("信息列表",this.messagesList);
          this.pageparm.total = res.data.total;
          // this.closeDialog()
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
<style scoped>
.img_table {
  width: 200px;
  height: 80px;
}
</style>
