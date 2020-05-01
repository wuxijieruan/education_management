<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>年级管理</el-breadcrumb-item>
      <el-breadcrumb-item>年级组列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
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
        highlight-current-row
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%;"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column sortable prop="gradeGroupName" label="年级组" min-width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
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

    <!-- 编辑界面 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="100px" :model="editForm" ref="form">
        <el-form-item label="年级组" prop="gradeGroupName">
          <el-input
            size="small"
            v-model="editForm.gradeGroupName"
            auto-complete="off"
            placeholder="请输入年级组名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="100px" :model="addForm" ref="form">
        <el-form-item label="年级组" prop="gradeGroupName">
          <el-input
            size="small"
            v-model="addForm.gradeGroupName"
            auto-complete="off"
            placeholder="请输入年级组名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="submitAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  gradeGroupAdd,
  gradeGroupDel,
  gradeGroupPut,
  gradeGroupGet
} from "@/api/getData";

export default {
  data() {
    return {
      editVisible: false,
      addVisible: false,
      listLoading: false, //是显示加载
      list: [],
      form: {
        gradeGroupId: "",
        gradeGroupName: ""
      },
      editForm: {
        gradeGroupId: "",
        gradeGroupName: ""
      },
      addForm: {
        gradeGroupName: ""
      },
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
    localStorage.courseCurrentPage = 1; //课程
    localStorage.bannerCurrentPage = 1; //轮播
    localStorage.chapterCurrentPage = 1; //章节
  },
  mounted() {
    this.getgradeGroup();
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
      var gradeGroupId = [];
      this.batchList.forEach(element => {
        gradeGroupId.push(element.gradeGroupId);
      });
      gradeGroupId = gradeGroupId.join(",");
      var row = {
        gradeGroupId: gradeGroupId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      this.pageparm.currentPage = parm.currentPage;
      this.pageparm.pageSize = parm.pageSize;
      this.getgradeGroup();
    },
    // 重置
    reset() {
      this.pageparm.currentPage = 1;
      this.getgradeGroup();
    },
    // 获取年级组
    async getgradeGroup() {
      try {
        this.listLoading = true;
        var parm = {
          page: this.pageparm.currentPage,
          pageSize: this.pageparm.pageSize
        };
        const res = await gradeGroupGet(parm);
        if (res.status == 200) {
          this.listLoading = false;
          console.log("年级组列表", res);
          this.list = res.data.list;
          this.pageparm.total = res.data.total;
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
          this.listLoading = false;
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
        this.listLoading = false;
      }
    },
    // 显示新增
    handleAdd() {
      this.addVisible = true;
      this.title = "新增";
      this.addForm = {
        gradeGroupName: ""
      };
    },
    // 新增
    async submitAdd() {
      try {
        const res = await gradeGroupAdd(this.addForm);
        if (res.status == 200) {
          this.editVisible = false;
          this.addVisible = false;
          this.$message({
            type: "success",
            message: "成功"
          });
          this.getgradeGroup();
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
      }
    },
    // 显示编辑
    handleEdit(row) {
      this.editVisible = true;
      this.editForm = {
        gradeGroupId: row.gradeGroupId,
        gradeGroupName: row.gradeGroupName
      };
    },
    // 编辑
    async submitEdit(row) {
      try {
        const res = await gradeGroupPut(this.editForm);
        if (res.status == 200) {
          this.editVisible = false;
          this.addVisible = false;
          this.$message({
            type: "success",
            message: "成功"
          });
          this.getgradeGroup();
        } else {
          this.$message({
            type: "error",
            message: res.error
          });
          console.log(res);
        }
      } catch (err) {
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
            const res = await gradeGroupDel(row.gradeGroupId);
            if (res.status == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.listLoading = false;
              if (this.list.length == 1 && this.pageparm.currentPage != 1) {
                this.pageparm.currentPage = this.pageparm.currentPage - 1;
              }
              this.getgradeGroup();
            } else {
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
  width: 30px;
  height: 30px;
}
</style>
