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

      <!-- <router-link to="/courseAdd">
        <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
      </router-link>-->
      <el-button size="small" type="success"  v-if="batchDeletionStatus" @click="tosub">邀请订阅</el-button>
      <el-dropdown split-button size="small" type="success" plain v-if="batchDeletionStatus" @click="toDeliveryMessage">
         发送{{temName}}
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item
            v-for="item in temList"
            :key="item.templateId"
            :label="item.templateName"
            :value="item.templateId"
            @click.native="denfineTem(item)"
            >
            {{item.templateName}}
          </el-dropdown-item>
          
        </el-dropdown-menu>
      </el-dropdown>
      
      <!-- <el-button size="small" type="danger" v-if="isshow" @click="ispostexcel=true" style="margin-left:10px;">导出</el-button> -->
      
      <el-select v-model="postExcel" placeholder="请选择导出内容" v-if="ispostexcel" @change="outExe()">
        <el-option value="1" label="导出当前页">导出当前页</el-option>
        <el-option value="2" label="全部导出">全部导出</el-option>
      </el-select>
    </div>

    <!--列表-->
    <el-table
      size="small"
      min-height="200"
      max-height="550"
      :data="userstableList"
      stripe
      highlight-current-row
      v-loading="listLoading"
      border
      element-loading-text="拼命加载中"
      style="width: 90%;"
      @selection-change="selectionChange"
    >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" prop="studentName" label="用户名" width="100"></el-table-column>
      <el-table-column align="center" prop="studentIdentity" label="用户身份" width="100"></el-table-column>
      <el-table-column align="center" prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column align="center" prop="studentAge" label="年龄" width="140"></el-table-column>
      <el-table-column
        align="center"
        prop="studentSex"
        :formatter="stateFormat"
        label="性别"
        width="100"
      ></el-table-column>
      <el-table-column align="center" prop="enterPriseNameCourse" label="企业名称" width="130"></el-table-column>
      <el-table-column align="center" prop="createTime" label="注册时间" min-width="130"></el-table-column>
      <el-table-column align="center" prop="isAcceptReturn" label="回访邀请" width="130"></el-table-column>
      <el-table-column align="center" prop="isSubscribe" label="是否订阅模板消息" width="130"></el-table-column>
      <!-- <el-table-column align="center" prop="registered_activity"  label="注册时参与的活动" min-width="160"></el-table-column> -->
      <!-- <el-table-column align="center" prop="registered_way" label="注册途径" width="160"></el-table-column> -->
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/userDetail',query: {users:scope.row,userstableList:userstableList}}"
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
        <el-form-item label="宝贝昵称" prop="studentName">
          <el-input v-model="searchList.studentName" style="width:30%;"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="searchList.phone" style="width:36%;"></el-input>
        </el-form-item>
        <el-form-item label="用户身份" prop="studentIdentity">
          <el-select v-model="searchList.studentIdentity" placeholder="请选择用户身份">
            <el-option value="游客" label="游客">游客</el-option>
            <el-option value="初级VIP" label="初级VIP">初级VIP</el-option>
            <el-option value="企业VIP" label="企业VIP">企业VIP</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄段">
          <el-input
            max="105"
            min="1"
            size="small"
            change="judgeage"
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            v-model="searchList.startStuAge"
            auto-complete="off"
            type="number"
            style="width:100px;margin-right:20px"
          ></el-input>-
          <el-input
            max="105"
            min="1"
            size="small"
            change="judgeage"
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            v-model="searchList.endStuAge"
            auto-complete="off"
            type="number"
            style="width:100px;margin-left:20px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="studentSex">
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
          <el-select v-model="searchList.isAcceptReturn" placeholder="请选择是否回访">
            <el-option value="已邀请" label="已邀请">已邀请</el-option>
            <el-option value="未邀请" label="未邀请">未邀请</el-option>
            <el-option value="拒绝" label="拒绝">拒绝</el-option>
            <el-option value="接受" label="接受">接受</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订阅状态" prop="isSubscribe">
          <el-select v-model="searchList.isSubscribe" placeholder="请选择订阅状态">
            <el-option value="未邀请" label="未邀请">未邀请</el-option>
            <el-option value="已邀请" label="已邀请">已邀请</el-option>
            <el-option value="已订阅" label="已订阅">已订阅</el-option>
            <el-option value="未订阅" label="未订阅">未订阅</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="searchList.startStuCreateTime"
            type="date"
            style="margin-right:20px"
            placeholder="开始日期"
          ></el-date-picker>-
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="searchList.endStuCreateTime"
            type="date"
            style="margin-left:20px"
            placeholder="截止日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="danger"
          icon="el-icon-refresh"
          @click="reset"
          style="margin-right:10px"
        >重置</el-button>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="searchuser">搜索</el-button>
      </span>
    </el-dialog>

    <!-- 导出选项 -->
    <!-- <el-dialog title="批量导出" :visible.sync="ispostexcel">
      <el-select v-model="postExcel" placeholder="请选择导出内容" default-first-option>
            <el-option value="1" label="导出当前选中的内容">导出当前选中的内容</el-option>
            <el-option value="2" label="全部导出">全部导出</el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ispostexcel=false">取消</el-button>
        <el-button type="primary" @click="batchDel">导出</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { userList, enterpriseGet } from "@/api/getData";
import { baseUrl, baseFileUrl } from "@/config/env";
import {
  courseGet,
  courseDel,
  subjectsGet,
  courseputOn,
  courseSetTop,
  toSubscribe,
  getMessList,
  getTemID,
  postTemID
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
      isshow:false,
      plist: {
        page: 1,
        pageSize: 10
      },
      userstableList: [], //用户列表
      enterpriseList: [], //企业列表
      coursesList: [], //课程列表
      temList:[],//模板列表
      tempId:'',//模板id
      istemId:false,//显示选择模板框
      temName:"消息模板",
      searchList: {
        page: 1,
        pageSize: 10
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
    // this.getuserList();
    this.getenterprise();
    this.gettemid()
    if (this.searchList.startStuAge > 104 || this.searchList.startStuAge < 1) {
      this.searchList.startStuAge = 1;
    }
  },
  methods: {
    async isPostSatatus() {//判断导出
      if (this.postExcel == 1) {
        if (this.batchList != "" || this.batchList.length > 0) {
          this.excelData = this.batchList; //你要导出的数据list。
        } else {
          this.excelData = this.userstableList;
        }

        //导出当前选中的内容
        this.postExcel = "";
        this.ispostexcel = false;
      } else if (this.postExcel == 2) {
        //全部导出
        try {
          this.listLoading = true;
          var postdata = this.searchList;
          delete postdata.page;
          delete postdata.pageSize;
          console.log("搜索列表", postdata);
          const res = await userList(postdata);
          console.log("获取用户时返回", res);
          if (res.status == 200) {
            var datas = res.data.list;
            this.listLoading = false;
            this.excelData = res.data.list;
            this.postExcel = "";
            this.ispostexcel = false;
          }
        } catch (err) {
          this.$message({
            type: "error",
            message: "请重试"
          });
          console.log(err);
        }
      }
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
        const { export_json_to_excel } = require("../../excel/Export2Excel"); //这里必须使用绝对路径
        const filterVal = [
          "studentName",
          "studentAge",
          "studentIdentity",
          "phone",
          "enterPriseNameCourse",
          "isAcceptReturn"
        ]; // 导出的表头名
        const tHeader = [
          "宝贝昵称",
          "年龄",
          "用户身份",
          "电话",
          "企业名称",
          "回访邀请"
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
        export_json_to_excel(tHeader, data, `${currentdate}作业列表excel`); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    //搜索判定
    searchuser() {
      if (this.searchList != []) {
        if (
          (this.searchList.startStuAge != undefined &&
            this.searchList.startStuAge != "") ||
          (this.searchList.endStuAge != undefined &&
            this.searchList.endStuAge != "")
        ) {//起始和截止但凡有一项有值
          var issttrue = 0
          if(this.searchList.startStuAge != undefined && this.searchList.startStuAge != ""){
            if(this.searchList.startStuAge > 0 && this.searchList.startStuAge < 105){
              issttrue = 1
              console.log("比大小正确1")
            }else{
              console.log("起始年龄区间不对")
              issttrue = 0
            }
          }else{
            console.log("起始年龄为空")
            issttrue = 2
          }
          var isentrue = 0
          if(this.searchList.endStuAge != undefined && this.searchList.endStuAge != ""){
            if(this.searchList.endStuAge > 0 && this.searchList.endStuAge < 105){
              isentrue = 1
               console.log("比大小正确2")
            }else{
              console.log("截止年龄区间不对")
              isentrue = 0
            }
          }else{
            console.log("截止年龄为空")
            isentrue = 2
          }
          if (issttrue == 0 || isentrue == 0) {
            alert("请正确填写年龄区间");
            return;
          }
          //控制年龄大小
          if (issttrue == 1 && isentrue == 1) {
               //控制起始年龄比终止小
                if (this.searchList.startStuAge <= this.searchList.endStuAge) {
                 console.log("比大小正确12")
                } else {
                  alert("请正确填写年龄区间");
                  return;
                }
          }
        }
        

        if (
          this.searchList.startStuCreateTime != undefined &&
          this.searchList.endStuCreateTime != undefined
        ) {
          let st = new Date(this.searchList.startStuCreateTime);
          let en = new Date(this.searchList.endStuCreateTime);
          let starttime = st.getTime(st);
          let endtime = en.getTime(en);
          console.log(starttime, endtime);
          if (starttime > endtime) {
            alert("请填写正确的日期区间");
            return;
          }
        }

        this.getuserList();
      }
    },

    //判断男女
    stateFormat(row, column) {
      if (row.studentSex === 0) {
        return "男";
      } else if (row.studentSex === 1) {
        return "女";
      } else {
        return "";
      }
    },
    //判断是否接受回访
    returnFormat(row, column) {
      if (row.isAcceptReturn === 1) {
        return "接受";
      } else if (row.isAcceptReturn === -1) {
        return "拒绝";
      } else {
        return "未邀请";
      }
    },
    judgeage(e) {
      console.log(e);
    },
    //获取企业列表
    async getenterprise(e) {
      // const resss = await getMessList(this.searchList);
      // console.log("xiaoxi",resss)

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

    //邀请订阅
    async tosub() {
      //邀请订阅
      var opensId = "";
      let num = this.batchList.length;
      this.batchList.forEach(element => {
        if (element.studentName == null) {
          // alert("您选择的用户中含有姓名为空的用户，无法邀请！")
          return;
        }
        opensId = opensId + ",";
        opensId = opensId + element.openId;
      });
      let count = opensId.length - opensId.replace(",", "").length + 1; //去除逗号后剩下的数量
      console.log(num, count);
      console.log(opensId);
      if (num >= count) {
        if (opensId == null || opensId == "") {
          alert("用户名全部为空，无法邀请！");
          return;
        }
        alert("姓名为空的用户，无法邀请！");
      }
      var rrr = {
        openIDs: opensId,
        type: 2
      };
      const tryres = await toSubscribe(rrr);
      console.log("邀请订阅返回", tryres);
      if (tryres.status == 200) {
        if (tryres.data == "成功") {
          alert("邀请成功");
          this.getuserList();
        }
      } else {
      }
    },

    //获取模板消息
    async gettemid(e) {
      try {
        const res = await getTemID();
        if (res.status == 200) {
          console.log("模板列表", res.data);
          res.data.forEach(element => {
            this.temList.push(element);
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
    //判断选择的模板
    denfineTem(e){
      console.log("模板",e)
      this.tempId = e.templateId
      this.temName = '“'+ e.templateName + '”'
    },

    //发动消息
    async toDeliveryMessage() {
      // if(this.istemId==false){
      //   this.istemId=true
      //   return
      // }
      if(this.tempId==''){
        this.$message.error('请选择信息模板！');
        return
      }
      var opensId = "";
      let num = this.batchList.length;
      this.batchList.forEach(element => {
        if (element.studentName == null||element.isSubscribe!="已订阅") {
          // alert("您选择的用户中含有姓名为空的用户，无法邀请！")
          return;
        }
        opensId = opensId + ",";
        opensId = opensId + element.openId;
      });
      let count = opensId.length - opensId.replace(",", "").length + 1; //去除逗号后剩下的数量
      console.log(num, count);
      console.log(opensId);
      if (num >= count) {
        if (opensId == null || opensId == "") {
          this.$message.error("用户名全部为空或用户未订阅，无法发送消息！");
          return;
        }
        this.$message.error("姓名为空或未订阅的用户，无法发送消息！");
      }
      
      var rrr = {
        openIDs: opensId,
        templateId: this.tempId
      };
      const tryres = await postTemID(rrr);
      console.log("发送消息返回", tryres);
      if (tryres.status == 200) {
        if (tryres.data ==  "发送成功") {
          alert("发送成功");
          this.getuserList();
        }
      } else {
      }
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
      this.searchList = {
        page: 1,
        pageSize: 10
      };
      this.form.page = 1;
      this.form.pageSize = 10;
      this.pageparm.currentPage = 1;
      this.getuserList();
    },
    // 搜索页面
    submitSearch() {
      this.searchList = {
        page: 1,
        pageSize: 10
      };
      this.searchVisible = true;
    },
    // 关闭弹出框
    closeDialog() {
      this.searchVisible = false; //搜索
    },

    //获取用户列表
    async getuserList() {
      try {
        this.listLoading = true;
        console.log("搜索列表", this.searchList);
        const res = await userList(this.searchList);
        console.log("获取用户时返回", res);
        if (res.status == 200) {
          this.listLoading = false;
          this.isshow=true;
          this.userstableList = res.data.list;
          console.log("用户列表", this.userstableList);
          this.pageparm.total = res.data.total;
            this.ispostexcel = true;
          this.closeDialog();
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
