<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
      <!-- <router-link to="/courseAdd">
        <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
      </router-link> -->
      <el-button
        size="small"
        type="danger"
        icon="el-icon-delete"
        v-if="batchDeletionStatus"
        @click="batchDel"
      >批量导出</el-button>
      <el-button
        size="small"
        type="danger"
        icon="el-icon-delete"
        v-if="batchDeletionStatus"
        @click="batchDel"
      >邀请回访</el-button>
    </div>
    

    <!--列表-->
      <el-table
        size="small"
        :data="usersList"
        stripe
        highlight-current-row
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%;"
        @selection-change="selectionChange"
        
        >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" prop="studentName" label="用户名" width="100"></el-table-column>
        <el-table-column align="center" prop="studentIdentity" label="用户身份" width="100"></el-table-column>
        <el-table-column align="center" prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column align="center" prop="studentAge" label="年龄" width="140"></el-table-column>
        <el-table-column align="center" prop="studentSex" :formatter="stateFormat" label="性别" width="100"></el-table-column>
        <el-table-column align="center" prop="createTime" label="注册时间" width="200"></el-table-column>
        <el-table-column align="center" prop="isAcceptReturn" :formatter="returnFormat" label="回访邀请" width="130"></el-table-column>
        <!-- <el-table-column align="center" prop="is_subscribe" :formatter="subFormat" label="是否订阅模板消息" width="130"></el-table-column> -->
        <!-- <el-table-column align="center" prop="registered_activity"  label="注册时参与的活动" min-width="160"></el-table-column> -->
        <!-- <el-table-column align="center" prop="registered_way" label="注册途径" width="160"></el-table-column> -->
        <el-table-column align="center" label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <router-link
              :to="{ path: '/userDetail',query: {users:scope.row,usersList:usersList}}"
            >
              <el-button size="small" style="margin-left:10px">详情</el-button>
            </router-link>
            <!-- <el-button size="small" style="margin-left:10px" @click="outExe">导出</el-button> -->
          </template>
        </el-table-column>
      </el-table>
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
        <el-form-item label="用户身份" prop="studentIdentity">
          <el-select v-model="searchList.studentIdentity" placeholder="请选择用户身份">
            <el-option value="游客" label="游客">游客</el-option>
            <el-option value="初级VIP" label="初级VIP">初级VIP</el-option>
            <el-option value="企业VIP" label="企业VIP">企业VIP</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄段" >
          <el-input
            max=105
            min=1
            size="small"
            change="judgeage"
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            v-model="searchList.startStuAge"
            auto-complete="off"
            type="number"
            style="width:100px;margin-right:20px"
          ></el-input>-
          <el-input
            max=105
            min=1
            size="small"
            change="judgeage"
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            v-model="searchList.endStuAge"
            auto-complete="off"
            type="number"
            style="width:100px;margin-left:20px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="studentSex" >
          <el-select v-model="searchList.studentSex" placeholder="请选择性别">
            <el-option value="0" label="男">男</el-option>
            <el-option value="1" label="女">女</el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="企业名称" prop="enterpriseId">
          <el-select v-model="searchList.enterpriseId" filterable placeholder="请选择企业名称">
            <el-option value>请选择企业名称</el-option>
            <el-option
              v-for="item in enterpriseList"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收回访" prop="exercisesType">
          <el-radio v-model="searchList.isAcceptReturn" label="1" style="margin-left:50px;">是</el-radio>
          <el-radio v-model="searchList.isAcceptReturn" label="-1">否</el-radio>
        </el-form-item>
        <el-form-item label="注册时间">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="searchList.startStuCreateTime"
              type="date"
              style="margin-right:20px"
              placeholder="开始日期">
            </el-date-picker>-
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="searchList.endStuCreateTime"
              type="date"
              style="margin-left:20px"
              placeholder="截止日期">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="searchuser">搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { userList,enterpriseGet } from "@/api/getData";
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
      usersList:[],//用户列表
      enterpriseList:[],//企业列表
      coursesList:[],//课程列表
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
    // console.log("用户信息", this.user);
    var data = this.$route.query;
    console.log("课程列表query", data);
    if (data.courseData != undefined && data.courseData.page != undefined) {
      this.form = data.courseData;
      this.pageparm.currentPage = data.courseData.page;
    }
  },
  mounted() {
    this.getuserList();
    this.getenterprise()
    if(this.searchList.startStuAge>104||this.searchList.startStuAge<1){
      this.searchList.startStuAge=1
    }
  },
  methods: {
    // 导出
    outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.hwsList //你要导出的数据list。
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
      if((this.searchList.startStuAge!=undefined&&this.searchList.startStuAge!="")||(this.searchList.endStuAge!=undefined&&this.searchList.endStuAge!="")){//起始和截止不都为空
          //控制年龄大小
          if((this.searchList.startStuAge<0&&this.searchList.startStuAge>105)||(this.searchList.endStuAge<0&&this.searchList.endStuAge>105)){
            if(this.searchList.startStuAge<=this.searchList.endStuAge){//控制起始年龄比终止小
            }else{
              alert('请正确填写年龄区间')
              return
            }
          }else{
              console.log(this.searchList)
              alert('请正确填写年龄区间')
              return
            }
      }
      
      if(this.searchList.startStuCreateTime!=undefined&&this.searchList.endStuCreateTime!=undefined){
        let st = new Date(this.searchList.startStuCreateTime)
        let en = new Date(this.searchList.endStuCreateTime)
        let starttime = st.getTime(st)
        let endtime = en.getTime(en)
        console.log(starttime,endtime)
        if(starttime>endtime){
          alert("请填写正确的日期区间")
          return
        }
      }

      this.getuserList()
    }
  },

  //判断男女
  stateFormat(row, column) {
      if (row.studentSex === 0) {
        return '男'
      } else  if(row.studentSex === 1){
        return '女'
      } else{
        return ''
      }

  },
  //判断是否接受回访
  returnFormat(row, column) {
      if (row.isAcceptReturn === 1) {
        return '接受'
      } else  if(row.isAcceptReturn === -1){
        return '拒绝'
      } else{
        return '未邀请'
      }
  },
  //是否订阅模板消息
  subFormat(row, column) {
      if (row.isAcceptReturn === 1) {
        return '接受'
      } else  if(row.isAcceptReturn === -1){
        return '拒绝'
      } else{
        return ''
      }
  },
  judgeage(e){
    console.log(e)
  },
  //获取企业列表
  async getenterprise(e) {
      try {
        const res = await enterpriseGet();
        if (res.status == 200) {
          console.log("企业列表", res.data);
           res.data.list.forEach(element => {
            this.enterpriseList.push(element)
          })
         
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log("企业列表",res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
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
 //批量导出
    async batchDel() {
      var usersId = "";
      this.batchList.forEach(element => {
        usersId = usersId+",";
        usersId= usersId + element.studentId;
        
      });
     console.log(usersId)
     window.location.href = "https://zhjy.917tou.com/learn/wechat/ExportStudent?ids="+usersId
    },
    // 分页插件事件
callFather(parm) {
      // console.log(parm)
      this.searchList.page = parm.currentPage;
      this.searchList.pageSize = parm.pageSize;
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getuserList();
},
    // 重置
reset() {
      this.searchList.page = 1;
      this.searchList.pageSize = 10;
      this.form.page = 1;
      this.form.pageSize = 10;
      this.pageparm.currentPage = 1;
      this.getuserList();
},
    // 搜索页面
    submitSearch() {
      this.searchVisible = true;
    },
    // 关闭弹出框
    closeDialog() {
      this.searchList={
         page: 1,
        pageSize: 10,
       }
      this.searchVisible = false; //搜索
    },



  //获取用户列表
  async getuserList() {
      try {
        this.listLoading = true;
        console.log('搜索列表',this.searchList)
        const res = await userList(this.searchList);
        console.log("获取用户时返回",res);
        if(res.status==200){
          this.listLoading = false;
          this.usersList = res.data.list;
          console.log("用户列表",this.usersList);
          this.pageparm.total = res.data.total;
          this.closeDialog()
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
