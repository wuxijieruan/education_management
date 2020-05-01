<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>轮播栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播栏列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        <router-link to="/carouselBarAdd">
          <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
        </router-link>
        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete"
          v-if="batchDeletionStatus"
          @click="batchDel"
        >批量删除</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-form ref="form" :model="form">
      <el-table
        size="small"
        :data="list"
        stripe
        highlight-current-row
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%;"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column sortable align="center" prop="bannerPicUrl" label="轮播栏图片" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.bannerPicUrl" alt class="img_table" />
          </template>
        </el-table-column>
        <el-table-column sortable prop="bannerName" label="轮播栏名称" min-width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
            <router-link :to="{ path: '/carouselBarDetail', query: {row:scope.row}}">
              <el-button size="small" icon="el-icon-reading"></el-button>
            </router-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <router-link :to="{ path: '/carouselBarEdit', query: {row:scope.row}}">
              <el-button size="small" icon="el-icon-edit"></el-button>
            </router-link>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { bannerGet, bannerDel } from "@/api/getData";

export default {
  data() {
    return {
      listLoading: false, //是显示加载
      list: [],
      form: {},
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchDeletionStatus: false,
      batchList: []
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    this.pageparm.currentPage = parseInt(localStorage.bannerCurrentPage);
    localStorage.courseCurrentPage = 1; //课程
    // localStorage.bannerCurrentPage = 1; //轮播
    localStorage.chapterCurrentPage = 1; //章节
  },
  mounted() {
    this.getBanner();
  },
  methods: {
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
    //批量删除
    batchDel() {
      var bannerId = [];
      this.batchList.forEach(element => {
        bannerId.push(element.bannerId);
      });
      bannerId = bannerId.join(",");
      var row = {
        bannerId: bannerId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      localStorage.bannerCurrentPage = parm.currentPage;
      this.pageparm.currentPage = parm.currentPage;
      this.pageparm.pageSize = parm.pageSize;
      this.getBanner();
    },
    // 重置
    reset() {
      localStorage.bannerCurrentPage = 1;
      this.pageparm.currentPage = 1;
      this.getBanner();
    },
    // 获取轮播栏列表
    async getBanner() {
      try {
        this.listLoading = true;
        var para = {
          page: this.pageparm.currentPage,
          pageSize: this.pageparm.pageSize
        };
        const res = await bannerGet(para);
        if (res.status == 200) {
          console.log("轮播栏列表", res.data);
          this.list = res.data.list;
          this.pageparm.total = res.data.total;

          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
        }
      } catch (err) {
        this.listLoading = false;
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },

    // 删除
    handleDel: function(row) {
      this.$confirm("确认要删除吗?", "提示", { type: "warning" })
        .then(async () => {
          try {
            const res = await bannerDel(row.bannerId);
            if (res.status == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.listLoading = false;
              if (this.list.length == 1 && this.pageparm.currentPage != 1) {
                this.pageparm.currentPage = this.pageparm.currentPage - 1;
              }
              this.getBanner();
            } else {
              this.listLoading = false;
              this.$message({
                type: "error",
                message: res.error
              });
              console.log(res);
            }
          } catch (err) {
            this.listLoading = false;
            this.$message({
              type: "error",
              message: "请重试"
            });
            console.log(err);
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.img_table {
  width: 100px;
  height: 30px;
}
</style>
