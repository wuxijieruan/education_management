<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加课程互动作业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button size="small" type="danger" style="margin: 20px 0;" @click="back">返回列表</el-button>
    <el-button size="small" type="primary" @click="submit()">保存</el-button>
    <div v-for="(item,index) in formData" :key="index">
      <el-form label-width="200px" :model="form" ref="form" element-loading-text="拼命加载中">
        <el-form-item label="* 作业名称" prop="resourceTitle">
          <el-input
            size="small"
            v-model="item.courseResourceBundle.resourceTitle"
            style="width:350px"
            placeholder="请输入作业名称"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="* 作业图片" prop="fileImgUrl">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="handleworkImgUrlSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="item.courseResourceBundle.imgFileList[index].fileUrl" :src="item.courseResourceBundle.imgFileList[index].fileUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
      </el-form>
    </div>
      <el-button type="primary" style="margin-left:200px;margin-bottom: 20px;">
        <i class="iconfont icon-tianjialianxiren"></i>添加互动作业
      </el-button>
  </div>
</template>
<script>
import { courseAddOther } from "@/api/getData";
import { imgUrl } from "@/config/env";
export default {
  data() {
    return {
      imgUrl: imgUrl,
      formData: [
        {
          courseResourceBundle: "",
          imgFileList: []
        }
      ],
      form: {
        courseId: "",
        resourceType: "",
      }
    };
  },
  mounted() {
    var data = this.$route.query;
    console.log("路由数据", data);
    this.form.courseId = data.courseId;
    this.form.resourceType = data.resourceType;
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 上传图片开始
    beforeAvatarUpload(file) {
      // console.log("添加图片之前", file);
      var urlname = file.name;
      var index2 = urlname.lastIndexOf(".");
      var suffix = urlname.substring(index2);
      // console.log(suffix);
      if (suffix === ".jpg" || suffix === ".png" || suffix === ".jpeg") {
        return true;
      } else {
        this.$message({
          type: "error",
          message: "上传的图片文件格式错误，请选择正确的文件格式"
        });
        return false;
      }
    },
    // 上传作业图片
    handleworkImgUrlSuccess(file) {
      console.log(file);
      this.workImgUrl = file.url;
      console.log(this.workImgUrl);
    },
    async submit() {
      var data = [];
      var courseResourceBundle = this.form;
      var imgFileList = this.imgList;
      console.log("imgList", imgFileList);
      data.push({
        courseResourceBundle,
        imgFileList
      });
      console.log(data);
      const res = await courseAddOther(data);
      console.log(res);
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
    }
  }
};
</script>
<style scoped>
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
