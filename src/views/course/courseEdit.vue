<template>
  <div>
    <!-- 面包屑导航 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button size="small" type="danger" style="margin: 20px 0;" @click="back">返回列表</el-button>-->
    <el-form
      label-width="200px"
      :model="form"
      :rules="rules"
      ref="form"
      element-loading-text="拼命加载中"
    >
      <el-form-item label="课程类型" prop="courseType">
        <el-radio-group v-model="form.courseType" @change="courseType">
          <el-radio label="1">主课程</el-radio>
          <el-radio label="2">拓展课程</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="*  关联主课程" prop="linkId" v-show="linkShow">
        <el-select v-model="form.linkId" filterable placeholder="请选择关联主课程" style="width:350px">
          <el-option
            v-for="item in courseList"
            :key="item.index"
            :label="item.courseName"
            :value="item.courseId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称" prop="courseName">
        <el-input size="small" v-model="form.courseName" style="width:350px" placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item label="课程标签" prop="characterTag">
        <el-input
          size="small"
          style="width:350px"
          v-model="form.characterTag"
          placeholder="请输入课程标签(以逗号分隔)"
        ></el-input>
      </el-form-item>
      <el-form-item label="作业标签" prop="playTag">
        <el-input
          size="small"
          style="width:350px"
          v-model="form.playTag"
          placeholder="请输入作业标签(以逗号分隔)"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程老师" prop="teacherName">
        <el-input
          size="small"
          v-model="form.teacherName"
          style="width:350px"
          auto-complete="off"
          placeholder="请输入课程老师"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程浏览数" prop="listenerCount">
        <el-input
          size="small"
          style="width:350px"
          v-model="form.listenerCount"
          auto-complete="off"
          type="number"
          placeholder="请输入课程浏览数"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程所需积分" prop="unlockPoints">
        <el-input
          size="small"
          style="width:350px"
          v-model="form.unlockPoints"
          auto-complete="off"
          
          placeholder="请输入课程所需积分"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程有效时间" prop="unlockValidDay">
        <el-input
          size="small"
          style="width:170px"
          v-model="form.unlockValidDay"
          auto-complete="off"
          
          placeholder="请输入课程有效时间"
        ></el-input>天
      </el-form-item>
      <el-form-item label="课程话题" prop="subjectId">
        <el-select v-model="form.subjectId" filterable placeholder="请选择课程话题" style="width:350px">
          <el-option
            v-for="item in subjectsGetList"
            :key="item.subjectId"
            :label="item.subjectName"
            :value="item.subjectId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否设为推荐" prop="isHot">
        <el-radio-group v-model="form.isHot">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="封面图片" prop="coursePicUrl" style="display:block">
        <el-upload
          class="avatar-uploader"
          :action="imgUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.coursePicUrl" :src="form.coursePicUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为700*265</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="submitAdd('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { coursePut, subjectsGet, courseGet, courseDetail } from "@/api/getData";
import { imgUrl } from "@/config/env";
export default {
  name: "First",
  data() {
    return {
      listLoading: false,
      imgUrl: imgUrl,
      subjectsGetList: [],
      courseList: [],
      linkShow: false,
      form: {
        courseId: "",
        courseName: "", //课程名称
        characterTag: "", //标签
        subjectId: "", // 话题ID
        coursePicUrl: "", //封面图片
        teacherName: "", //老师名称
        listenerCount: 0, //浏览数
        isVail: "", //是否上下架
        isHot: "0", //是否有效
        isTop: "0", //是否有效
        createUserId: "", //创建者
        courseType: "", //是否是主课程
        linkId: "", //关联主课程ID
        playTag: "", //作业游戏标签
        playType: "录播", //播放类型
        unlockPoints:0,//所需积分
        unlockValidDay:0,//有效期
      },
      rules: {
        subjectId: [
          { required: true, message: "请选择课程话题", trigger: "change" }
        ],
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        teacherName: [
          { required: true, message: "请输入课程老师", trigger: "blur" }
        ],
        coursePicUrl: [
          { required: true, message: "请上传课程封面", trigger: "blur" }
        ],
        unlockPoints: [
          { required: true, message: "请输入课程所需积分", trigger: "blur" }
        ],
        unlockValidDay: [
          { required: true, message: "请输入课程有效时间", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    var data = this.$route.query;
    // console.log("路由数据", data);
    this.form.courseId = data.courseId;
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true;
        var courseId = this.form.courseId;
        const res = await courseDetail(courseId);
        if (res.status == 200) {
          console.log(res.data);
          this.form = res.data;
          // console.log(this.form);
          if (res.data.courseType == "1") {
            this.linkShow = false;
            this.form.courseType = "1";
          } else {
            this.linkShow = true;
            this.form.courseType = "2";
            this.getCourseList();
          }
          if (res.data.isHot == "1") {
            this.form.isHot = "1";
          } else {
            this.form.isHot = "0";
          }
          this.getSubject();
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: res.msg
          });
          console.log(res.msg);
        }
      } catch (err) {
        this.listLoading = false;
        this.$message({
          type: "error",
          message: "请重试"
        });
      }
    },
    back() {
      this.$router.go(-1);
    },
    courseType() {
      if (this.form.courseType == "1") {
        this.linkShow = false;
        this.form.linkId = "";
      } else {
        this.linkShow = true;
        this.getCourseList();
      }
    },
    // 获取主课程列表
    async getCourseList() {
      try {
        this.listLoading = true;
        var createUserId = this.form.createUserId;
        var data = {
          createUserId: createUserId,
          courseType: 1,
          isVail: 1,
          page: 1,
          pageSize: 10000
        };
        const res = await courseGet(data);
        if (res.status == 200) {
          console.log("课程列表", res.data);
          this.courseList = res.data.list;
          var courseidList = [];
          this.courseList.forEach(item => {
            courseidList.push(item.courseId);
          });
          var courseidStr=courseidList.toString()
          var linkId=this.form.linkId;
          console.log(courseidStr)
          if(courseidStr.indexOf(linkId)==-1){
            this.form.linkId=''
          }
          this.listLoading = false;
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
    // 获取话题列表
    async getSubject() {
      try {
        this.listLoading = true;
        const res = await subjectsGet();
        if (res.status == 200) {
          // console.log("话题列表", res.data);
          this.subjectsGetList = res.data.list;
          this.listLoading = false;
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
    // 上传封面图片前
    beforeAvatarUpload(file) {
      const isJPG = file.type;
      console.log("type", isJPG);
      if (
        isJPG === "image/jpeg" ||
        isJPG === "image/png" ||
        isJPG === "image/jpg"
      ) {
        // this.$message.error("上传图片格式错误!");
      } else {
        this.$message.error("上传图片格式错误!");
      }
      return isJPG;
    },
    // 上传封面图片成功
    handleAvatarSuccess(file) {
      // console.log(file);
      this.form.coursePicUrl = file.url;
    },
    //保存
    submitAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log("课程新增", this.form);
          if (this.form.coursePicUrl != "") {
            if (this.form.courseType == "1") {
              const res = await coursePut(this.form);
              console.log("课程新增之后", res);
              if (res.status == 200) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.listLoading = false;
                this.back();
              } else {
                this.$message({
                  type: "error",
                  message: res.error
                });
                console.log(res);
                this.listLoading = false;
              }
            } else {
              if (this.form.linkId != "") {
                const res = await coursePut(this.form);
                console.log("课程新增之后", res);
                if (res.status == 200) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.listLoading = false;
                  this.back();
                } else {
                  this.$message({
                    type: "error",
                    message: res.error
                  });
                  console.log(res);
                  this.listLoading = false;
                }
              } else {
                this.$message({
                  type: "error",
                  message: "请选择关联的主课程"
                });
              }
            }
          } else {
            this.$message({
              type: "error",
              message: "请添加课程封面"
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请将信息填写完整"
          });
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
/* 封面图片 */
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 350px;
  height: 132px;
  line-height: 132px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar-uploader .avatar {
  width: 350px;
  height: 132px;
  display: block;
}
</style>
