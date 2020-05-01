<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>年龄段管理</el-breadcrumb-item>
      <el-breadcrumb-item>年龄段列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
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
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 461px;"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column prop="gradeName" label="年龄段名称" width="100"></el-table-column>
        <el-table-column align="center" prop="gradeIndex" label="年龄段顺序" width="100"></el-table-column>
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
                v-if="user.loginUser.role==1"
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
      <el-form label-width="100px" :model="editForm" :rules="editrules" ref="editForm">
        <el-form-item label="年龄段" prop="gradeName">
          <el-input
            size="small"
            v-model="editForm.gradeName"
            auto-complete="off"
            placeholder="请输入年龄段名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄段顺序" prop="gradeIndex">
          <el-input
            size="small"
            v-model="editForm.gradeIndex"
            type="number"
            auto-complete="off"
            placeholder="请输入年龄段顺序"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editVisible=false">取消</el-button>
          <el-button type="primary" @click="submitEdit('editForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="100px" :model="addForm" :rules="addrules" ref="addForm">
        <el-form-item label="年龄段" prop="gradeName">
          <el-input
            size="small"
            v-model="addForm.gradeName"
            auto-complete="off"
            placeholder="请输入年龄段名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄段顺序" prop="gradeIndex">
          <el-input
            size="small"
            v-model="addForm.gradeIndex"
            type="number"
            auto-complete="off"
            placeholder="请输入年龄段顺序"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="submitAdd('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { gradeAdd, gradeDel, gradePut, gradeGet } from "@/api/getData";

export default {
  data() {
    return {
      editVisible: false,
      addVisible: false,
      listLoading: false, //是显示加载
      list: [],
      form: {
        gradeId: "",
        gradeName: "",
        gradeIndex: "",
        page: 1,
        pageSize: 10
      },
      editForm: {
        gradeId: "",
        gradeName: "",
        gradeIndex: ""
      },
      editrules: {
        gradeName: [
          { required: true, message: "请输入年龄段名称", trigger: "blur" }
        ],
        gradeIndex: [
          { required: true, message: "请输入年龄段顺序", trigger: "blur" }
        ]
      },
      addForm: {
        gradeName: "",
        gradeIndex: ""
      },
      lastgradeIndex: "",
      addrules: {
        gradeName: [
          { required: true, message: "请输入年龄段名称", trigger: "blur" }
        ],
        gradeIndex: [
          { required: true, message: "请输入年龄段顺序", trigger: "blur" }
        ]
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchDeletionStatus: false,
      batchList: [],
      user: ""
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("userdata"));
    // console.log('用户信息',this.user)
  },
  mounted() {
    this.getGrade();
  },
  methods: {
    // 添加行
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      console.log("row.index: " + row.index);
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
    //批量删除
    batchDel() {
      var gradeId = [];
      this.batchList.forEach(element => {
        gradeId.push(element.gradeId);
      });
      gradeId = gradeId.join(",");
      var row = {
        gradeId: gradeId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getGrade();
    },
    // 获取年龄段
    async getGrade() {
      try {
        this.listLoading = true;
        const res = await gradeGet(this.form);
        if (res.status == 200) {
          this.listLoading = false;
          console.log("年龄段列表", res);
          var list = res.data.list;
          this.list = list;
          this.pageparm.total = res.data.total;
          if (list.length == 0) {
            this.lastgradeIndex = 0;
          } else if (list.length == 1) {
            this.lastgradeIndex = 1;
          } else {
            var lastgrade = list[list.length - 1];
            var lastgradeIndex = lastgrade.gradeIndex;
            this.lastgradeIndex = lastgradeIndex;
            console.log(lastgradeIndex);
          }
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
    // 显示新增
    handleAdd() {
      this.addVisible = true;
      this.title = "新增";
      this.addForm = {
        gradeName: "",
        gradeIndex: this.lastgradeIndex + 1
      };
    },
    // 新增
    submitAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.addForm);
          const res = await gradeAdd(this.addForm);
          if (res.status == 200) {
            this.addVisible = false;
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getGrade();
          } else {
            this.$message({
              type: "error",
              message: res.error
            });
            console.log(res);
          }
        } else {
          this.$message({
            type: "error",
            message: "请将信息填写完整"
          });
          return false;
        }
      });
    },
    // 显示编辑
    handleEdit(row) {
      this.editVisible = true;
      this.editForm = {
        gradeId: row.gradeId,
        gradeName: row.gradeName,
        gradeIndex: row.gradeIndex
      };
    },
    // 编辑
    submitEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.addForm);
          const res = await gradePut(this.editForm);
          if (res.status == 200) {
            this.editVisible = false;
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getGrade();
          } else {
            this.$message({
              type: "error",
              message: res.error
            });
            console.log(res);
          }
        } else {
          this.$message({
            type: "error",
            message: "请将信息填写完整"
          });
          return false;
        }
      });
    },
    // 删除
    handleDel: function(row) {
      this.$confirm("此操作会删除相关课程，请谨慎操作！确认要删除吗?", "提示", {
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await gradeDel(row.gradeId);
            if (res.status == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.listLoading = false;
              if (this.list.length == 1 && this.pageparm.currentPage != 1) {
                this.pageparm.currentPage = this.pageparm.currentPage - 1;
              }
              this.getGrade();
            } else {
              this.$message({
                type: "error",
                message: res.error
              });
              console.log(res);
              this.listLoading = false;
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
