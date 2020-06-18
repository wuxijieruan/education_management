<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>优秀作业列表</el-breadcrumb-item>
      <el-breadcrumb-item>优秀作业编辑</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button size="small" type="danger" style="margin: 20px 0;" @click="back">返回列表</el-button>

    <!--列表-->
    <el-form label-width="150px" :model="form" :rules="rules" ref="form">
      <el-form-item label="所属练习题" prop="chapterExerciseId">
        <el-select v-model="form.chapterExerciseId" placeholder="请选择所属练习题" style="width:300px">
          <el-option
            v-for="item in list"
            :key="item.chapterExercisesId"
            :label="item.exercisestName"
            :value="item.chapterExercisesId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优秀作业视频">
        <input
          type="file"
          @change="uploadVideo($event)"
          v-loading.fullscreen.lock="fullscreenLoading"
        />
        <div style="width:500px;height:40px;" v-if="form.answerVideo">
          <p style="cursor: pointer;margin:0;float:left;width:95%">文件名：{{form.fileName}}</p>
          <p style="cursor: pointer;float:right;margin:0;width:5%">
            <i class="el-icon-close" @click="removeVideo"></i>
          </p>
        </div>
        <video-player
          class="video-player"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          v-if="playerOptions.sources"
        ></video-player>
      </el-form-item>
      <el-form-item label="优秀作业音频">
        <input
          type="file"
          @change="uploadVoice($event)"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="拼命加载中，正在对上传文件进行技术处理，此过程可能需要几分钟，请耐心等待"
        />
        <div style="width:500px;height:40px;" v-if="form.answerVoice">
          <p style="cursor: pointer;margin:0;float:left;width:95%">文件名：{{form.fileName}}</p>
          <p style="cursor: pointer;float:right;margin:0;width:5%">
            <i class="el-icon-close" @click="removeVoice"></i>
          </p>
        </div>
        <div>
          <audio v-if="form.answerVoice" :src="form.answerVoice" controls></audio>
        </div>
      </el-form-item>
      <el-form-item label="优秀作业图片" prop="courseChapterName">
        <el-upload
          :action="imgUrl"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handleImageSuccess"
          :on-remove="handleRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeImgUpload"
          :file-list="imgList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="form.answerImg" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="优秀作业内容" prop="answerTest">
        <el-input
          size="small"
          v-model="form.answerTest"
          auto-complete="off"
          type="textarea"
          style="width:500px"
          :rows="8"
          placeholder="优秀作业内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="submitAdd('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { excellentHomeworkPut, chapterExercisesGet } from "@/api/getData";
import { imgUrl, videoUrl, imagesUrl, newvideoUrl } from "@/config/env";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
export default {
  data() {
    return {
      newvideoUrl: newvideoUrl,
      videoUrl: videoUrl,
      imgUrl: imgUrl,
      imagesUrl: imagesUrl,
      imgUrl: imgUrl,
      form: {
        courseChapterId: "",
        chapterExerciseId: "",
        answerTest: "",
        answerVideo: "",
        answerVoice: "",
        answerImg: "",
        answerAnnex: ""
      },
      rules: {
        chapterExerciseId: [
          { required: true, message: "请选择所属练习题", trigger: "change" }
        ],
        answerTest: [
          { required: true, message: "请输入优秀作业内容", trigger: "blur" }
        ]
      },
      list: [], //章节练习题
      fullscreenLoading: false,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
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
          fullscreenToggle: true //全屏按钮
        }
      },
      dialogImageVisible: false,
      dialogImageUrl: "",
      audioUrl: "",
      dialogVisible: false,
      courseChapterId: "",
      course: {},
      chapter: {},
      imgList: []
    };
  },
  components: {
    videoPlayer
  },
  created() {
    var data = this.$route.query;
    console.log("路由数据", data);
    this.form = data.row;
    this.course = data.course;
    this.chapter = data.chapter;
    this.courseChapterId = data.courseChapterId;

    if (data.row.answerImg != "") {
      var url = data.row.answerImg;
      var index1 = url.lastIndexOf("/");
      var urlname = url.substring(index1 + 1, url.length);
      var index2 = urlname.lastIndexOf(".");
      var name = urlname.substring(0, index2);
      var response = {
        url: url
      };
      var list = [];
      list.push({ url, name, response });
      this.imgList = list;
      console.log(this.imgList);
    }

    if (data.row.answerVideo != "") {
      this.playerOptions.sources = data.row.answerVideo;
    }
    if (data.row.answerVoice != "") {
      this.audioUrl = data.row.answerVoice;
    }
  },
  mounted() {
    this.getChapterExercises();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/goodHomework",
        query: {
          course: this.course,
          chapter: this.chapter,
          courseChapterId: this.courseChapterId
        }
      });
    },
    // 获取练习列表
    async getChapterExercises() {
      try {
        this.listLoading = true;
        var courseChapter = {
          courseChapterId: this.form.courseChapterId
        };
        const res = await chapterExercisesGet(courseChapter);
        if (res.status == 200) {
          // console.log("练习列表", res.data);
          this.list = res.data.list;
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
    // 上传视频开始
    uploadVideo() {
      //上传视频
      console.log(this.form);
      if (this.form.answerVoice != "" || this.form.answerImg != "") {
        this.$message({
          type: "error",
          message: "只能上传视频、音频或图片中的一种附件"
        });
        event.target.value = "";
        // return false;
      } else {
        if (this.form.answerVideo != "") {
          this.$message({
            type: "error",
            message: "只能上传一个视频文件"
          });
          event.target.value = "";
        } else {
          var _this = this;
          var videofile = event.target.files;
          // console.log(videofile);
          var myfile = videofile[0];
          if (myfile != undefined) {
            // console.log(myfile);
            var urlname = myfile.name;
            var index2 = urlname.lastIndexOf(".");
            var suffix = urlname.substring(index2);
            var fileName = urlname.substring(0, index2);
            console.log(fileName);
            if (
              suffix === ".mp4" ||
              suffix === ".avi" ||
              suffix === ".mov" ||
              suffix === ".rmvb" ||
              suffix === ".flv" ||
              suffix === ".3gp"
            ) {
              _this.fullscreenLoading = true;
              var newvideoCreateTime = Date.parse(new Date());
              var copyFile = new File(
                [myfile],
                `${newvideoCreateTime}${suffix}`
              );
              // console.log(copyFile);
              var file = new FormData();
              file.append("file", copyFile);
              file.append("submit", false);
              $.ajax({
                url: this.newvideoUrl,
                type: "post",
                data: file,
                headers: {
                  Authorization: localStorage.learn_token
                },
                processData: false,
                contentType: false,
                success: function(res) {
                  console.log(res);
                  _this.playerOptions.sources = res.data;
                  _this.fullscreenLoading = false;
                  _this.form.answerVideo = res.data;
                  _this.form.fileName = fileName;
                  console.log("上传视频后的form", _this.form);
                },
                error: function(res) {
                  console.log(res);
                }
              });
              event.target.value = "";
            } else {
              this.$message({
                type: "error",
                message: "上传的视频文件格式错误，请选择正确的文件格式"
              });
              event.target.value = "";
            }
          }
        }
      }
    },
    removeVideo() {
      // 删除视频
      this.form.answerVideo = "";
      this.form.fileName = "";
      this.playerOptions.sources = "";
      console.log("删除视频后的form", this.form);
    },
    // 上传视频结束
    // 上传音频开始
    uploadVoice() {
      //上传音频
      console.log(this.form);
      if (this.form.answerVideo != "" || this.form.answerImg != "") {
        this.$message({
          type: "error",
          message: "只能上传视频、音频或图片中的一种附件"
        });
        event.target.value = "";
        // return false;
      } else {
        if (this.form.answerVoice != "") {
          this.$message({
            type: "error",
            message: "只能上传一个音频文件"
          });
          event.target.value = "";
        } else {
          var _this = this;
          var videofile = event.target.files;
          // console.log(videofile);
          var myfile = videofile[0];
          if (myfile != undefined) {
            // console.log(myfile);
            var urlname = myfile.name;
            var index2 = urlname.lastIndexOf(".");
            var suffix = urlname.substring(index2);
            var fileName = urlname.substring(0, index2);
            console.log(fileName);
            if (
              suffix === ".cd" ||
              suffix === ".ogg" ||
              suffix === ".mp3" ||
              suffix === ".asf.wma" ||
              suffix === ".wav" ||
              suffix === ".mp3pro" ||
              suffix === ".rm" ||
              suffix === ".real" ||
              suffix === ".ape" ||
              suffix === ".module" ||
              suffix === ".midi" ||
              suffix === ".vqf"
            ) {
              _this.fullscreenLoading = true;
              var newvideoCreateTime = Date.parse(new Date());
              var copyFile = new File(
                [myfile],
                `${newvideoCreateTime}${suffix}`
              );
              // console.log(copyFile);
              var file = new FormData();
              file.append("file", copyFile);
              file.append("submit", false);
              $.ajax({
                url: this.videoUrl,
                type: "post",
                data: file,
                headers: {
                  Authorization: localStorage.learn_token
                },
                processData: false,
                contentType: false,
                success: function(res) {
                  console.log(res);
                  _this.audioUrl = res.url;
                  _this.fullscreenLoading = false;
                  _this.form.answerVoice = res.url;
                  _this.form.fileName = fileName;
                  console.log("上传音频后的form", _this.form);
                },
                error: function(res) {
                  console.log(res);
                }
              });
              event.target.value = "";
            } else {
              this.$message({
                type: "error",
                message: "上传的音频文件格式错误，请选择正确的文件格式"
              });
              event.target.value = "";
            }
          }
        }
      }
    },
    removeVoice() {
      // 删除音频
      this.form.answerVoice = "";
      this.form.fileName = "";
      this.audioUrl = "";
      console.log("删除音频后的form", this.form);
    },
    // 上传音频结束
    // 上传图片开始
    beforeImgUpload(file) {
      console.log("添加图片之前", file);
      console.log(this.form);
      if (this.form.answerVoice != "" || this.form.answerVideo != "") {
        this.$message({
          type: "error",
          message: "只能上传视频、音频或图片中的一种附件"
        });
        return false;
      } else {
        var urlname = file.name;
        var index2 = urlname.lastIndexOf(".");
        var suffix = urlname.substring(index2);
        console.log(suffix);
        if (
          suffix === ".bmp" ||
          suffix === ".gif" ||
          suffix === ".jpg" ||
          suffix === ".tiff" ||
          suffix === ".psd" ||
          suffix === ".png" ||
          suffix === ".swf" ||
          suffix === ".svg" ||
          suffix === ".jpeg"
        ) {
          return true;
        } else {
          this.$message({
            type: "error",
            message: "上传的图片文件格式错误，请选择正确的文件格式"
          });
          return false;
        }
      }
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogVisible = true;
    },
    handleImageSuccess(file) {
      console.log("添加图片", file);
      var imageUrl = file.url;
      var index1 = imageUrl.lastIndexOf("/");
      var urlname = imageUrl.substring(index1 + 1, imageUrl.length);
      console.log(urlname);
      this.form.answerImg = file.url;
      this.form.fileName = urlname;
      console.log("上传图片后的form", this.form);
    },
    handleExceed(files, fileList) {
      this.$message({
        type: "error",
        message: "只能上传一张图片"
      });
    },
    handleRemove(file, fileList) {
      this.$confirm("确认要删除吗?", "提示", {
        type: "warning"
      })
      .then(async () => {
        console.log(file, fileList);
        this.form.answerImg = "";
        console.log(this.form);
      })
        .catch(() => {
          
      });
    },
    // 保存
    submitAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log("章节编辑", this.form);
          const res = await excellentHomeworkPut(this.form);
          console.log("章节编辑res", res);
          if (res.status == 200) {
            this.back();
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
    }
  }
};
</script>
<style scoped>
.tishi {
  margin-left: 100px;
  color: red;
  margin-bottom: 20px;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.bookReviewimgUrl {
  width: 178px;
  height: 178px;
}
</style>


