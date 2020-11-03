<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>

    
    <!--列表-->
      <el-table
        size="small"
        :data="bannersList"
        stripe
        highlight-current-row
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 90%;"
        @selection-change="selectionChange"
        
        >
        <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
        <el-table-column align="center" prop="bannerId" label="轮播图id" width="100"></el-table-column>
        <el-table-column align="center" prop="bannerName"  label="图片名称" width="130"></el-table-column>
        <el-table-column align="center" prop="bannerPicUrl" label="图片" width="260">
          <template slot-scope="scope">
      　　　　<img v-if="scope.row.bannerPicUrl" :src="scope.row.bannerPicUrl" width="190" height="80" class="head_pic"/>
              <span v-else>无</span>
      　　</template>
        </el-table-column>
        <el-table-column align="center" prop="bannerUrl" label="链接地址" width="260"></el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称" width="260"></el-table-column>
        <el-table-column align="center" prop="isVail"  label="是否有效" min-width="50"></el-table-column>
        <el-table-column align="center" prop="priority"  label="优先级" width="180"></el-table-column>
        <el-table-column align="center" prop="createTime"  label="创建时间" width="150"></el-table-column>
        <el-table-column align="center" label="操作" min-width="150" fixed="right">
     
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
  bannerList
} from "@/api/getData";
export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
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
      searchVisible: false,
      plist: {
        page: 1,
        pageSize: 10
      },
      bannersList:[],//bannerList
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
    this.bannersList=[
      {
        banner_id:1,
        banner_name:"图1",
        banner_pic_url:"https://www.bolekids.com/file-local-1.0.0/download/file?filePath=/27feaf2d39baf285ef6ee50c4590ae8b/700265携程-小布丁(1).jpg",
        priority:"",
        isVail:"是",
        enterpriseId:"1361313",
        createTime:"2020-05-29 13:48:28"
      }
    ]
  },
  methods: {
    // 导出
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
        const res = await bannerList(this.searchList);
        console.log("获取消息时返回",res);
        if(res.status==200){
          this.listLoading = false;
          this.bannersList = res.data.list;
          console.log("信息列表",this.bannersList);
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
