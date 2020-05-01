<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>年级管理</el-breadcrumb-item>
      <el-breadcrumb-item>年级学科关系列表</el-breadcrumb-item>
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
        <el-table-column sortable prop="gradeName" label="年级" min-width="100"></el-table-column>
        <el-table-column sortable prop="subjectName" label="学科" min-width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- <el-button
              size="small"
              icon="el-icon-reading"
              @click="handleDetail(scope.row)"
            ></el-button>-->
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

    <!-- 详情界面 -->
    <el-dialog title="详情" :visible.sync="detailVisible" width="20%">
      <el-form label-width="100px" :model="form" ref="form">
        <el-form-item label="年级组" prop="gradeGroupName">
          <el-input size="mini" v-model="form.gradeGroupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="gradeName">
          <el-input size="mini" v-model="form.gradeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="学科" prop="subjectName">
          <el-input size="mini" v-model="form.subjectName" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑界面 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="100px" :model="editForm" ref="form">
        <el-form-item label="年级组" prop="gradeGroupId">
          <el-select v-model="editForm.gradeGroupId" placeholder="请选择" filterable>
            <el-option
              v-for="item in group"
              :key="item.gradeGroupId"
              :label="item.gradeGroupName"
              :value="item.gradeGroupId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model="editForm.gradeId" placeholder="请选择" filterable>
            <el-option
              v-for="item in grade"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectName">
          <el-select v-model="editForm.subjectId" placeholder="请选择" filterable>
            <el-option
              v-for="item in subject"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"
            ></el-option>
          </el-select>
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
        <el-form-item label="年级组" prop="gradeGroupId">
          <el-select v-model="addForm.gradeGroupId" placeholder="请选择" filterable>
            <el-option
              v-for="item in group"
              :key="item.gradeGroupId"
              :label="item.gradeGroupName"
              :value="item.gradeGroupId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model="addForm.gradeId" placeholder="请选择" filterable>
            <el-option
              v-for="item in grade"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="addForm.subjectId" placeholder="请选择" filterable>
            <el-option
              v-for="item in subject"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"
            ></el-option>
          </el-select>
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
  gradeGroupGet,
  gradeGet,
  subjectsGet,
  gradeSubjectAdd,
  gradeSubjectDel,
  gradeSubjectPut,
  gradeSubjectGet
} from "@/api/getData";

export default {
  data() {
    return {
      value: "",
      title: "编辑",
      detailVisible: false,
      editVisible: false,
      addVisible: false,
      listLoading: false, //是显示加载
      list: [],
      form: {
        gradeGroupName: "",
        gradeId: "",
        gradeName: "",
        gradeGroupId: "",
        groupId: "",
        subjectId: "",
        subjectName: ""
      },
      editForm: {
        groupId: "",
        gradeGroupId: "",
        gradeId: "",
        subjectId: ""
      },
      addForm: {
        gradeGroupId: "",
        gradeId: "",
        subjectId: ""
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      batchDeletionStatus: false,
      batchList: [],
      group: [], //年级组
      grade: [], //年级
      subject: [] //学科
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
    this.gradeGroup();
    this.getGrades();
    this.getSubject();
    this.getGradeSubject();
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
      var groupId = [];
      this.batchList.forEach(element => {
        groupId.push(element.groupId);
      });
      groupId = groupId.join(",");
      var row = {
        groupId: groupId
      };
      this.handleDel(row);
    },
    // 分页插件事件
    callFather(parm) {
      this.pageparm.currentPage = parm.currentPage;
      this.pageparm.pageSize = parm.pageSize;
      this.getGradeSubject();
    },
    // 重置
    reset() {
      this.pageparm.currentPage = 1;
      this.getGradeSubject();
    },
    // 获取年级关系列表
    async getGradeSubject() {
      try {
        this.listLoading = true;
        var para = {
          page: this.pageparm.currentPage,
          pageSize: this.pageparm.pageSize
        };
        const res = await gradeSubjectGet(para);
        if (res.status == 200) {
          console.log("获取年级关系列表", res);
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
    // 获取年级组
    async gradeGroup() {
      try {
        const res = await gradeGroupGet();
        if (res.status == 200) {
          console.log("年级组列表", res);
          this.group = res.data.list;
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
    // 获取年级
    async getGrades() {
      try {
        const res = await gradeGet();
        if (res.status == 200) {
          console.log("年级列表", res);
          this.grade = res.data.list;
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
    // 获取学科
    async getSubject() {
      try {
        const res = await subjectsGet();
        if (res.status == 200) {
          console.log("学科列表", res);
          this.subject = res.data.list;
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
    // 显示详情界面
    handleDetail(row) {
      this.detailVisible = true;
      this.form = {
        gradeGroupName: row.gradeGroupName,
        gradeId: row.gradeId,
        gradeName: row.gradeName,
        gradeGroupId: row.gradeGroupId,
        groupId: row.groupId,
        subjectId: row.subjectId,
        subjectName: row.subjectName
      };
    },
    // 显示新增
    handleAdd() {
      this.addVisible = true;
      this.title = "新增";
      this.addForm = {
        gradeGroupId: "",
        gradeId: "",
        subjectId: ""
      };
    },
    // 新增
    async submitAdd() {
      try {
        const res = await gradeSubjectAdd(this.addForm);
        if (res.status == 200) {
          this.addVisible = false;
          this.$message({
            type: "success",
            message: "成功"
          });
          this.getGradeSubject();
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
        gradeId: row.gradeId,
        gradeGroupId: row.gradeGroupId,
        groupId: row.groupId,
        subjectId: row.subjectId
      };
    },
    // 编辑
    async submitEdit() {
      try {
        const res = await gradeSubjectPut(this.editForm);
        if (res.status == 200) {
          this.editVisible = false;
          this.$message({
            type: "success",
            message: "成功"
          });
          this.getGradeSubject();
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
            const res = await gradeSubjectDel(row.groupId);
            if (res.status == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.listLoading = false;
              if (this.list.length == 1 && this.pageparm.currentPage != 1) {
                this.pageparm.currentPage = this.pageparm.currentPage - 1;
              }
              this.getGradeSubject();
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
