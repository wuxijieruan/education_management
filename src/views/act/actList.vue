<template>
  <div class="main_wraper">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-bottom:10px;">
      <router-link to="/actAdd">
        <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
      </router-link>
    </div>

    <el-table :data="actsList" stripe border :default-expand-all="true" style="width: 70%">
      <!-- <el-table-column align="center" prop="activityId" label="活动Id" min-width="150"></el-table-column> -->
      <el-table-column align="center" prop="activityName" label="活动名称	" min-width="150"></el-table-column>
      <!-- <el-table-column align="center" prop="rule" label="活动规则	" min-width="150"></el-table-column> -->
      <el-table-column align="center" prop="startTime" label="开始时间	" min-width="150"></el-table-column>
      <el-table-column align="center" prop="endTime" label="结束时间	" min-width="100"></el-table-column>
      <!-- <el-table-column align="center" prop="courseId" label="绑定课程" min-width="100"></el-table-column>
      <el-table-column align="center" prop="enterpriseId" label="指定企业" min-width="100"></el-table-column> -->
      <el-table-column align="center" width="250">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
           <router-link
            :to="{ path: '/actEdit', query:{row:scope.row}}"
            style="margin-right: 10px;"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>
          <!-- <router-link
            :to="{ path: '/actDetial', query:{row:scope.row}}"
            style="margin-right: 10px;"
          >
            <el-button size="mini">详情</el-button>
          </router-link> -->
          <el-button
            size="mini"
            @click.native.prevent="del(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

  </div>
</template>
<script>
import { actList ,courseGet ,enterpriseGet,actDel} from "@/api/getData";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      // 获取数据
      enterpriseGetList:[],
      subjectsGetList: [],
      actsList: [],
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
    this.actList();
    this.getCourse();
    this.getenterprise();
  },
  methods: {
    searchcourse(a){
        subjectsGetList.forEach(item => {
          if(item.courseId==a){
            console.log(item.subjectName)
            return item.subjectName
          }
        });
    },
     // 获取课程列表
    async getCourse(e) {
      try {
        const res = await courseGet();
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.subjectsGetList = res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log("课程列表",res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    // 获取企业列表
    async getenterprise(e) {
      try {
        const res = await enterpriseGet();
        if (res.status == 200) {
          console.log("企业列表", res.data);
          this.enterpriseGetList = res.data.list;
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
    // 获取数据
    async actList() {
      try {
        this.listLoading = true;
        console.log(this.form);
        const res = await actList(this.form);
        console.log(res);
        this.actsList = res.data.list;
        this.pageparm.total = res.data.total;
        console.log(this.actsList);
        // this.searchVisible = false; //搜索
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
      this.actList();
    },
    // 禁用
    async del(row) {
      console.log(row);
      this.$confirm("确认删除该活动?", "提示", { type: "warning" })
        .then(async () => {
          const res = await actDel(row.activityId);
          console.log(res);
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.listLoading = false;
          this.actList(); //刷新页面
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 关闭弹出框
    closeDialog() {
      this.searchVisible = false; //搜索
    },
  }
};
</script>
<style scoped>
</style>