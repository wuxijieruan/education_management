<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>基础数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>话题列表</el-breadcrumb-item>
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
        style="width: 861px;"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column prop="subjectName" label="话题名称" width="200">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.subjectName"
              @change="changeexercisestName(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isShow" label="是否推荐(显示)" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.isShow" @change="changeisShow(scope.row)">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isTop" label="是否置顶" width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.isTop" @change="changeIsTop(scope.row)">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="showCourseNo" label="上架课程数" width="100"></el-table-column>

        <el-table-column align="center" prop="weight" label="排序序号" width="200">
          <template slot-scope="scope">
            <el-input-number 
              size="small"
              style="width:100px"
              v-model="scope.row.weight"
              auto-complete="off"
              @change="changeexercisestweight(scope.row)"
                :min="0"
            >
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              v-if="user.loginUser.role==1"
              @click="handleDel(scope.row)"
            ></el-button>
          </template>
        </el-table-column>

 

      </el-table>
    </el-form>

    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="100px" :model="addForm" :rules="addrules" ref="addForm">
        <el-form-item label="话题" prop="subjectName">
          <el-input
            size="small"
            v-model="addForm.subjectName"
            auto-complete="off"
            placeholder="请输入话题名称"
          ></el-input>

         
        </el-form-item>

     <el-form-item label="排序序号" prop="weight">
        <el-input-number 
          size="small"
         
          style="width:100px"
          v-model="addForm.weight"
          auto-complete="off"
            :min = "0"
        >
        </el-input-number>
         
        </el-form-item>

        <el-form-item label="是否设为推荐" prop="isShow">
          <el-radio-group v-model="addForm.isShow">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-radio-group v-model="addForm.isTop">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitAdd('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  subjectsAdd,
  subjectsDel,
  subjectsPut,
  subjectsGet,
  updateSubjectsWeightByID
} from "@/api/getData";

export default {
  data() {
    return {
      addVisible: false,
      listLoading: false, //是显示加载
      list: [],
      form: {
        subjectId: "",
        subjectName: "",
        isShow: "0",
        page: 1,
        pageSize: 10
      },
      editForm: {
        subjectId: "",
        subjectName: "",
        isShow: "0"
      },
      editrules: {
        subjectName: [
          { required: true, message: "请输入话题名称", trigger: "blur" }
        ]
      },
      addForm: {
        subjectName: "",
        isShow: "0",
        isTop: "0",
        weight:2
      },
      addrules: {
        subjectName: [
          { required: true, message: "请输入话题名称", trigger: "blur" }
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
    this.getSubject();
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
      var subjectId = [];
      this.batchList.forEach(element => {
        subjectId.push(element.subjectId);
      });
      subjectId = subjectId.join(",");
      var row = {
        subjectId: subjectId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      this.form.page = parm.currentPage;
      this.form.pageSize = parm.pageSize;
      this.getSubject();
    },
    // 获取话题
    async getSubject() {
      try {
        this.listLoading = true;
        const res = await subjectsGet(this.form);
        if (res.status == 200) {
          this.listLoading = false;
          console.log("话题列表", res);
          this.list = res.data.list;
          this.pageparm.total = res.data.total;
          this.list.forEach(element => {
            if (element.isShow == 1) {
              element.isShow = "是";
            } else if (element.isShow == 0) {
              element.isShow = "否";
            }
            if (element.isTop == 1) {
              element.isTop = "是";
            } else if (element.isTop == 0) {
              element.isTop = "否";
            }
          });
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
        subjectName: "",
        isShow: "0",
        isTop: "0",
        weight:2
      };
    },
    // 新增
    submitAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log("addForm",this.addForm);
          const res = await subjectsAdd(this.addForm);
          if (res.status == 200) {
            this.addVisible = false;
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getSubject();
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
    // 编辑
    async changeexercisestName(row) {
      console.log(row);
      var isShow;
      if (row.isShow == "是") {
        isShow = 1;
      } else {
        isShow = 0;
      }
      if (row.subjectName != "") {
        var form = {
          subjectName: row.subjectName,
          subjectId: row.subjectId,
          isShow: isShow
        };
        console.log(form);
        try {
          const res = await subjectsPut(form);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getSubject();
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
      } else {
        this.$message({
          type: "error",
          message: "请输入话题名称"
        });
      }
    },
      // 修改权重
    async changeexercisestweight(row) {
      console.log(row.weight);
      if (row.weight != "") {
        var data = {
          weight: row.weight,
          subjectId: row.subjectId
        };
        console.log(data);
        try {
          const res = await updateSubjectsWeightByID(data);
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "成功"
            });
            this.getSubject();
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
      } else {
        this.$message({
          type: "error",
          message: "请输入权重"
        });
      }
    }
    ,
    // 课程推荐（显示）
    async changeisShow(row) {
      console.log(row);
      var form = {
        subjectName: row.subjectName,
        subjectId: row.subjectId,
        isShow: row.isShow
      };
      console.log(form);
      try {
        const res = await subjectsPut(form);
        console.log(res);
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.getSubject();
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

    //课程置顶
    async changeIsTop(row) {
      console.log(row);
      var form = {
        subjectName: row.subjectName,
        subjectId: row.subjectId,
        isTop: row.isTop
      };
      console.log(form);
      try {
        const res = await subjectsPut(form);
        console.log(res);
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.getSubject();
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

    closeDialog() {
      this.addVisible = false;
    },
    // 删除
    handleDel: function(row) {
      this.$confirm("确认要删除吗?", "提示", {
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await subjectsDel(row.subjectId);
            if (res.status == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.listLoading = false;
              if (this.list.length == 1 && this.pageparm.currentPage != 1) {
                this.pageparm.currentPage = this.pageparm.currentPage - 1;
              }
              this.getSubject();
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
            this.listLoading = false;
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
