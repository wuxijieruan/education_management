<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑活动</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 20px;">
      <el-button size="small" type="danger" @click="goback">返回列表</el-button>
    </div>
    <div class="main_wraper">
      <div class="fromm">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="180px"
          style="width:40%"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="ruleForm.activityName" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动代码" prop="activityCode">
            <el-input v-model="ruleForm.activityCode" placeholder="请输入活动代码"></el-input>
          </el-form-item>
          <el-form-item label="活动规则" prop="rule">
            <el-input type="textarea" :rows="5" v-model="ruleForm.rule" placeholder="请输入活动规则"></el-input>
          </el-form-item>
          <el-form-item label="活动开始时间（日期）" prop="startTime">
            <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动结束时间（日期）" prop="endTime">
            <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="绑定课程" prop="courseId">
            <el-select
              v-model="ruleForm.courseId"
              filterable
              placeholder="请选择课程"
              style="width:350px"
            >
              <el-option
                v-for="item in subjectsGetList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户身份" prop="studentIdentity">
            <el-select v-model="ruleForm.activityUserType" placeholder="请选择注册活动用户身份">
              <el-option value="初级VIP" label="初级VIP">初级VIP</el-option>
              <el-option value="企业VIP" label="企业VIP">企业VIP</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户注册方式" prop="studentIdentity">
            <el-select v-model="ruleForm.userRegMode" placeholder="请选择活动注册方式">
              <el-option
                v-for="item in selectAllEnumsActivityList"
                :key="item.enumValue"
                :label="item.enumName"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动注册赠送积分" prop="points">
            <el-input
              size="small"
              style="width:350px"
              v-model="ruleForm.points"
              auto-complete="off"
              type="number"
              placeholder="请输入赠送积分"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动注册赠送vip月份" prop="overMouth">
            <el-input
              size="small"
              style="width:350px"
              v-model="ruleForm.overMouth"
              auto-complete="off"
              type="number"
              placeholder="请输入月份"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动弹框图片" prop="picUrl" style="display:block">
            <el-upload
              class="avatar-uploader"
              :action="imgUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="ruleForm.picUrl" :src="ruleForm.picUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为630*800</div>
            </el-upload>
          </el-form-item>

         <el-form-item
            label="活动封面图片"
            prop="coverImg"
            style="display: block"
          >
            <el-upload
              class="avatar-uploader"
              :action="imgUrl"
              :show-file-list="false"
              :on-success="handlecoverImgSuccess"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
            >
              <img
                v-if="ruleForm.coverImg"
                :src="ruleForm.coverImg"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
               图片最佳上传尺寸为700*265
              </div>
            </el-upload>
          </el-form-item>


          <el-form-item label="关联课程" prop="relationCourseId">
            <el-select
              v-model="ruleForm.relationCourseIds"
              placeholder="请选择课程"
              multiple
              style="width:350px"
              size="mini"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in subjectsGetList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="指定企业" prop="courseId">
            <el-select
              v-model="ruleForm.enterpriseId"
              filterable
              placeholder="请选择指定企业"
              style="width:350px"
            >
              <el-option
                v-for="item in enterpriseGetList"
                :key="item.enterpriseId"
                :label="item.enterpriseName"
                :value="item.enterpriseId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优秀作品" prop="videoUrl">
            <input
              type="file"
              v-loading.fullscreen.lock="fullscreenLoading"
              @change="uploadVideo($event)"
              element-loading-text="拼命加载中，正在对上传文件进行技术处理，此过程可能需要几分钟，请耐心等待"
            />
            <el-input
              size="small"
              v-model="playerOptions.sources"
              auto-complete="off"
              placeholder="腾讯视频请直接输入VID"
              style="width:80%"
            ></el-input>
          </el-form-item>
          <video-player
            class="video-player"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
            v-if="playerOptions.sources"
            style="margin-left:130px;margin-bottom: 20px;"
          ></video-player>
          <el-form-item label="切换课程栏目时弹窗" prop="popupOnSwitchSection">
            <el-switch
              v-model="ruleForm.popupOnSwitchSection"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onSwitch"
            ></el-switch>
          </el-form-item>
          <el-form-item
            label="切换课程栏目时弹窗图片"
            prop="popupImageOnSwitchSection"
            v-if="popupOnSwitchSectionIsShow"
          >
            <el-upload
              class="avatar-uploader"
              :action="imgUrl"
              :show-file-list="false"
              :on-success="handlePopupSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.popupImageOnSwitchSection"
                :src="ruleForm.popupImageOnSwitchSection"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为630*800</div>
            </el-upload>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="goback()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" id="imgpop">
      <img width="100%" style :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import {
  actEdit,
  courseGet,
  enterpriseGet,
  courseResourcesFileDel,
  selectAllEnumsActivity,
} from "@/api/getData";
import { imgUrl } from "@/config/env";
import { newVideoUrl } from "@/config/env";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      imgList: [],
      selectAllEnumsActivityList: [],
      enterpriseGetList: [{ enterpriseId: "", enterpriseName: "无" }],
      subjectsGetList: [{ courseId: "", courseName: "无" }],
      imgUrl: imgUrl,
      imgFileList: [],
      ruleForm: {
        activityId: "",
        activityName: "",
        rule: "",
        startTime: "",
        endTime: "",
        courseId: "",
        relationCourseId: "",
        enterpriseId: "",
        relationCourseIds: [],
        activityUserType: "",
        points: "",
        overMouth: "",
        picUrl: "",
        userRegMode: "",
        popupOnSwitchSection: false,
        popupImageOnSwitchSection: "",
        coverImg:''
      },
      rules: {
        activityName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
      VideoVisible: false,
      Videoform: {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: "",
      },
      fullscreenLoading: false,
      videoShow: false,
      VideoList: [],
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<Video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: "", //视频地址
        poster: "", //你的封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
      newVideoUrl: newVideoUrl,
      popupOnSwitchSectionIsShow: false,
    };
  },
  // 注册组件
  components: {
    videoPlayer,
  },
  mounted() {
    var data = this.$route.query;
    console.log("路由数据", data.row);

    console.log("转换后的数据", this.ruleForm.relationCourseIds);
    this.ruleForm = data.row;
    if (data.row.relationCourseId != "" && data.row.relationCourseId != null) {
      this.ruleForm.relationCourseIds = data.row.relationCourseId.split(",");
    }
    if (data.row.popupOnSwitchSection == 1) {
      this.ruleForm.popupOnSwitchSection = true;
      this.popupOnSwitchSectionIsShow = true;
    } else {
      this.ruleForm.popupOnSwitchSection = false;
      this.popupOnSwitchSectionIsShow = false;
    }
    //this.ruleForm.relationCourseIds=[data.row.relationCourseId]
    this.getCourse();
    this.getenterprise();
    this.getselectAllEnumsActivity();
    this.playerOptions.sources = this.ruleForm.videoUrl;
  },
  methods: {
    VideoAdd() {
      this.VideoVisible = true;
    },
    Videoedit(row) {
      console.log(row);
      this.Videoform = row;
      this.VideoVisible = true;
      this.VideoEdit = true;
    },
    closeVideoDialog() {
      this.Videoform = {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: "",
      };
      this.VideoVisible = false;
    },

    // 上传封面图片前
    beforeAvatarUpload(file) {
      const isJPG = file.type;
      // console.log("type", isJPG);
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

    // 获取课程默认封面列表
    async getselectAllEnumsActivity() {
      try {
        //this.listLoading = true;
        const res = await selectAllEnumsActivity();
        if (res.status == 200) {
          console.log("列表", res.data);
          this.selectAllEnumsActivityList = res.data;
          console.log(this.selectAllEnumsActivityList, "列表");
          // this.listLoading = false;
        } else {
          this.$message({
            type: "error",
            message: res.error,
          });
          console.log(res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试",
        });
        console.log(err);
      }
    },

    // 上传封面图片成功
    handleAvatarSuccess(file) {
      // console.log(file);
      this.ruleForm.picUrl = file.url;
    },
    // 上传切换课程栏目时弹窗图片成功
    handlePopupSuccess(file) {
      // console.log(file);
      this.ruleForm.popupImageOnSwitchSection = file.url;
      console.log(this.ruleForm.popupImageOnSwitchSection);
    },
     handlecoverImgSuccess(file) {
      this.ruleForm.coverImg = file.url;
      console.log(this.ruleForm.coverImg);
    },
   // 点击查看大图
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.response.url;
      var img = new Image();
      img.src = this.dialogImageUrl;
      console.log(img.width, img.height);
      var width = img.width + "px";
      var divShow = $("#imgpop .el-dialog");
      console.log(divShow);
      $(divShow).css("width", width);
      this.dialogVisible = true;
    },

    uploadVideo() {
      //上传视频
      var _this = this;
      var Videofile = event.target.files;
      console.log(Videofile);
      var myfile = Videofile[0];
      if (myfile != undefined) {
        console.log(myfile);
        var urlname = myfile.name;
        var index2 = urlname.lastIndexOf(".");
        var suffix = urlname.substring(index2);
        // console.log(suffix);
        if (
          suffix === ".mp4" ||
          suffix === ".avi" ||
          suffix === ".mov" ||
          suffix === ".rmvb" ||
          suffix === ".flv" ||
          suffix === ".3gp"
        ) {
          _this.fullscreenLoading = true;
          var newVideoCreateTime = Date.parse(new Date());
          var copyFile = new File([myfile], `${newVideoCreateTime}${suffix}`);
          // console.log(copyFile);
          var file = new FormData();
          file.append("file", copyFile);
          file.append("submit", false);
          console.log(this.newVideoUrl);
          $.ajax({
            url: this.newVideoUrl,
            type: "post",
            data: file,
            headers: {
              Authorization: localStorage.learn_token,
            },
            processData: false,
            contentType: false,
            success: function (res) {
              // console.log(res);
              _this.fullscreenLoading = false;
              _this.playerOptions.sources = res.data;
            },
            error: function (res) {
              console.log(res);
              _this.fullscreenLoading = false;
              this.$message({
                type: "error",
                message: res.error,
              });
            },
          });
          event.target.value = "";
        } else {
          this.$message({
            type: "error",
            message: "上传的视频文件格式错误，请选择正确的文件格式",
          });
          event.target.value = "";
        }
      }
    },
    submitVideoUrl() {
      console.log(this.Videoform);

      if (this.Videoform.fileName != "") {
        if (this.Videoform.fileUrl != "") {
          var fileUrl = this.Videoform.fileUrl;
          var list = this.Videoform;
          if (this.VideoEdit) {
            console.log("编辑");
          } else {
            console.log("新增");
            this.VideoList.push(list);
            if (fileUrl.indexOf("https") != -1) {
              this.playerOptions.sources = this.Videoform.fileUrl;
            }
            this.ruleForm.videoUrl = this.Videoform.fileUrl;
          }
          this.Videoform = {
            fileName: "",
            fileUrl: "",
            fileLanguageTag: "",
            fileSceneTypeTag: "",
            fileContentTag: "",
          };
          this.VideoEdit = false;
          this.VideoVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请填写视频地址",
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请填写视频名称",
        });
      }
    },
    // 获取课程列表
    async getCourse(e) {
      try {
        const res = await courseGet();
        if (res.status == 200) {
          console.log("课程列表", res.data);
          res.data.list.forEach((element) => {
            this.subjectsGetList.push(element);
          });

          // this.subjectsGetList =res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.error,
          });
          console.log("课程列表", res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试",
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
          res.data.list.forEach((element) => {
            this.enterpriseGetList.push(element);
          });
        } else {
          this.$message({
            type: "error",
            message: res.error,
          });
          console.log("企业列表", res);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试",
        });
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.popupOnSwitchSection) {
            this.ruleForm.popupOnSwitchSection = 1;
            if (
              this.ruleForm.popupImageOnSwitchSection == null ||
              this.ruleForm.popupImageOnSwitchSection == ""
            ) {
              this.$message({
                message: "请上传切换课程栏目时弹窗图片",
                type: "warning",
              });
              return false;
            }
          } else {
            this.ruleForm.popupOnSwitchSection = 2;
          }
          this.ruleForm.videoUrl = this.playerOptions.sources;
          console.log(this.ruleForm.relationCourseIds, "kdkkkkk");
          if (this.ruleForm.relationCourseIds != undefined) {
            this.ruleForm.relationCourseId = this.ruleForm.relationCourseIds.join();
          }

          console.log(this.ruleForm);
          const res = await actEdit(this.ruleForm);
          console.log(res);
          if (res !== "error") {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.$router.go(-1); //返回上一层
          }
        }
      });
    },
    goback() {
      this.$router.go(-1); //返回上一层
    },
    onSwitch() {
      console.log("切换课程栏目时弹窗", this.ruleForm.popupOnSwitchSection);
      if (this.ruleForm.popupOnSwitchSection) {
        this.popupOnSwitchSectionIsShow = true;
      } else {
        this.popupOnSwitchSectionIsShow = false;
      }
    },
  },
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
  width: 50%;
  display: block;
}
</style>
<style >
#imgpop .el-dialog {
  width: 70%;
}
#imgpop .el-dialog__header {
  padding: 0;
}
#imgpop .el-dialog__body {
  padding: 0;
}
</style>