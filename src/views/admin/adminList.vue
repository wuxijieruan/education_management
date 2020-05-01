<template>
  <div class="main_wraper">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-bottom:10px;">
      <router-link to="/adminAdd">
        <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
      </router-link>
    </div>

    <el-table :data="adminList" stripe border :default-expand-all="true" style="width: 100%">
      <el-table-column align="center" prop="userName" label="用戶名" min-width="150"></el-table-column>
      <el-table-column align="center" prop="realName" label="姓名" min-width="150"></el-table-column>
      <el-table-column align="center" prop="phone" label="电话" min-width="150"></el-table-column>
      <el-table-column align="center" prop="remarks" label="备注" min-width="150"></el-table-column>
      <el-table-column align="center" prop="isCan" label="状态" min-width="100"></el-table-column>
      <el-table-column align="center" width="250">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/adminEdit', query:{row:scope.row}}"
            style="margin-right: 80px;"
            v-if="scope.row.role==1"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>
           <router-link
            :to="{ path: '/adminEdit', query:{row:scope.row}}"
            style="margin-right: 10px;"
            v-if="scope.row.role==2"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>
          <el-button
            size="mini"
            @click.native.prevent="jinyong(scope.$index, scope.row)"
            v-if="scope.row.isCan=='启用'&scope.row.role==2"
          >禁用</el-button>
          <el-button
            size="mini"
            @click.native.prevent="qiyong(scope.$index, scope.row)"
            v-if="scope.row.isCan=='禁用'&scope.row.role==2"
          >启用</el-button>
          <el-button size="mini" @click.native.prevent="reset(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <!-- 重置密码 -->
    <el-dialog title="重置密码" width="900px" :visible.sync="searchVisible" @click="closeDialog">
      <el-form
        label-width="130px"
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        style="width:850px"
      >
        <el-form-item label="管理员名称" prop="userName">
          <el-input
            size="small"
            v-model="ruleForm.userName"
            auto-complete="off"
            placeholder="请输入管理员名称"
            style="width:220px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="userPassword">
          <el-input
            size="small"
            v-model="ruleForm.userPassword"
            auto-complete="off"
            placeholder="请输入管理员密码"
            style="width:220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认管理员密码" prop="userPassword2">
          <el-input
            size="small"
            v-model="ruleForm.userPassword2"
            auto-complete="off"
            placeholder="请输入再次管理员密码"
            style="width:220px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="resetPassword('ruleForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { adminList, adminDel, adminresetPassword } from "@/api/getData";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      // 获取数据
      adminList: [],
      listLoading: false,
      form: {
        page: 1,
        pageSize: 10
      },
      ruleForm: {
        userName: "",
        userPassword: "",
        userPassword2: "",
        id:''
      }, 
      rules: {
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchVisible: false
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  mounted() {
    this.getAdmin();
  },
  methods: {
    // 获取数据
    async getAdmin() {
      try {
        this.listLoading = true;
        console.log(this.form);
        const res = await adminList(this.form);
        console.log(res);
        this.adminList = res.data.list;
        // this.pageparm.total = res.total;
        console.log(this.adminList);
        this.adminList.forEach(element => {
          // console.log(element);
          if (element.isCan == 1) {
            element.isCan = "启用";
          } else if (element.isCan == -1) {
            element.isCan = "禁用";
          }
        });
        this.searchVisible = false; //搜索
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    // 分页插件事件
    callFather(parm) {
      this.form.currentPage = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getAdmin();
    },
    // 启用
    async qiyong(index, row) {
      console.log(index, row);
      this.$confirm("确认启用该用户?", "提示", { type: "warning" })
        .then(async () => {
          const res = await adminDeladminDel(row.id,1);
          console.log(res);
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.listLoading = false;
          this.getAdmin(); //刷新页面
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 禁用
    async jinyong(index, row) {
      console.log(index, row);
      this.$confirm("确认禁用该用户?", "提示", { type: "warning" })
        .then(async () => {
          const res = await adminDel(row.id,-1);
          console.log(res);
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.listLoading = false;
          this.getAdmin(); //刷新页面
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 关闭弹出框
    closeDialog() {
      this.searchVisible = false; //搜索
    },
    // 打开输入密码弹窗
    reset(index, row) {
      console.log(row);
      this.ruleForm.userName=row.userName
      this.ruleForm.id=row.id
      this.searchVisible = true;
    },
    // 重置密码
    resetPassword(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.ruleForm);
          if(this.ruleForm.userPassword===this.ruleForm.userPassword2){
 const res = await adminresetPassword(this.ruleForm.id,this.ruleForm.userPassword);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.searchVisible = false; 
            this.getAdmin(); 
          }
          }else{
             this.$message({
            message: "两次输入的密码不一致",
            type: "erro"
          });
          }
         
        }
      });
    }
  }
};
</script>
<style scoped>
</style>