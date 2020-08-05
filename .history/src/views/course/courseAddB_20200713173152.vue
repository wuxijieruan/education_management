<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeA">添加课程导读</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeB">添加课程绘本</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeC">添加课程互动游戏</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeD">添加课程解读</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeE">添加课程互动作业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button size="small" type="danger" style="margin: 20px 0;" @click="back">返回列表</el-button>
    <el-button size="small" type="primary" @click="submit()">保存</el-button>
    <el-form label-width="200px" :model="form" ref="form" element-loading-text="拼命加载中">
      <el-form-item label="* 导读名称" prop="resourceTitle" v-show="resourceTypeA">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入导读名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="* 绘本名称" prop="resourceTitle" v-show="resourceTypeB">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入绘本名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="* 游戏名称" prop="resourceTitle" v-show="resourceTypeC">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入游戏名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="* 适合年龄段" prop="gradeId" v-show="resourceTypeD">
        <el-select v-model="form.gradeId" placeholder="请选择适合年龄段" style="width:350px">
          <el-option
            v-for="item in gradeGetList"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="* 解读名称" prop="resourceTitle" v-show="resourceTypeD">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入解读名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="* 作业名称" prop="resourceTitle" v-show="resourceTypeE">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入作业名称"
        ></el-input>
      </el-form-item>
      <div style="margin-left:130px;margin-bottom: 20px;" v-show="resourceTypeF">
        <el-button size="small" @click="videoType">+ 视频</el-button>
        <el-button size="small" @click="audioType">+ 音频</el-button>
        <el-button size="small" @click="imgType">+ 图片</el-button>
        <el-button size="small" @click="pictureBookType" v-show="resourceTypeG">+ 电子书</el-button>
      </div>

      <el-form-item label="章节视频" v-show="videoShow">
        <el-button size="small" type="primary" @click="VideoAdd">上传视频</el-button>
      </el-form-item>
      <video-player
        class="video-player"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        v-if="playerOptions.sources"
        style="margin-left:130px;margin-bottom: 20px;"
      ></video-player>
      <!-- 视频列表 -->
      <el-table
        v-show="videoShow"
        size="small"
        :data="VideoList"
        stripe
        highlight-current-row
        border
        element-loading-text="拼命加载中"
        style="width: 80%;margin-left:130px;margin-bottom: 20px;"
        v-if="VideoList!=''"
      >
        <el-table-column align="center" prop="fileName" label="视频名称" width="200"></el-table-column>
        <el-table-column align="center" prop="fileUrl" label="视频地址"></el-table-column>
        <el-table-column align="center" prop="fileLanguageTag" label="语种标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileSceneTypeTag" label="场景类型标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileContentTag" label="内容标签" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="VideoPlay(scope.row.fileUrl)">播放</el-button>
            <el-button size="small" type="danger" @click="VideoDel(scope.row.fileName)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="章节音频" v-show="audioShow">
        <el-button size="small" type="primary" @click="audioAdd">上传音频</el-button>
      </el-form-item>
      <audio
        v-if="audioUrl"
        :src="audioUrl"
        controls
        style="margin-left:130px;margin-bottom: 20px;"
      ></audio>
      <!-- 音频列表 -->
      <el-table
        v-show="audioShow"
        size="small"
        :data="audioList"
        stripe
        highlight-current-row
        border
        element-loading-text="拼命加载中"
        style="width: 80%;margin-left:130px;margin-bottom: 20px;"
        v-if="audioList!=''"
      >
        <el-table-column align="center" prop="fileName" label="音频名称" width="200"></el-table-column>
        <el-table-column align="center" prop="fileUrl" label="音频地址"></el-table-column>
        <el-table-column align="center" prop="fileLanguageTag" label="语种标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileSceneTypeTag" label="场景类型标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileContentTag" label="内容标签" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="audioPlay(scope.row.fileUrl)">播放</el-button>
            <el-button size="small" type="danger" @click="audioDel(scope.row.fileName)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="章节图片" v-show="imgShow">
        <el-upload
          :action="imgUrl"
          list-type="picture-card"
          :on-success="handleImageSuccess"
          :before-remove="handleRemoveimg"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="章节电子书" v-show="pictureBookShow">
        <el-button size="small" type="primary" @click="pictureBookAdd">上传电子书</el-button>
      </el-form-item>
      <!-- 电子书列表 -->
      <el-table
        v-show="pictureBookShow"
        size="small"
        :data="pictureBookList"
        stripe
        highlight-current-row
        border
        element-loading-text="拼命加载中"
        style="width: 80%;margin-left:130px;margin-bottom: 20px;"
        v-if="pictureBookList!=''"
      >
        <el-table-column align="center" prop="fileName" label="电子书名称" width="200"></el-table-column>
        <el-table-column align="center" prop="fileUrl" label="电子书地址"></el-table-column>
        <el-table-column align="center" prop="fileImgUrl" label="电子书图片" width="400">
          <template slot-scope="scope">
            <img :src="scope.row.fileImgUrl" alt class="fileImgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="pictureBookDel(scope.row.fileName)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="* 作业图片" prop="fileImgUrl" v-show="resourceTypeE">
        <el-upload
          class="avatar-uploader"
          :action="imgUrl"
          :show-file-list="false"
          :on-success="handleworkImgUrlSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
        >
          <img v-if="workImgUrl" :src="workImgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- 上传视频 -->
    <el-dialog title="上传视频内容" width="900px" :visible.sync="VideoVisible" @click="closeVideoDialog">
      <el-form label-width="120px" :model="Videoform" ref="Videoform" style="width:850px">
        <el-form-item label="* 视频名称" prop="fileName">
          <el-input
            size="small"
            v-model="Videoform.fileName"
            auto-complete="off"
            placeholder="请输入视频名称"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="* 视频地址" prop="fileUrl">
          <input
            type="file"
            v-loading.fullscreen.lock="fullscreenLoading"
            @change="uploadVideo($event)"
          />
          <el-input
            size="small"
            v-model="Videoform.fileUrl"
            auto-complete="off"
            placeholder="请输入视频地址"
            style="width:80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="语种标签" prop="fileLanguageTag">
          <el-input
            size="small"
            v-model="Videoform.fileLanguageTag"
            auto-complete="off"
            placeholder="请输入语种标签"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="场景类型标签" prop="fileSceneTypeTag">
          <el-input
            size="small"
            v-model="Videoform.fileSceneTypeTag"
            auto-complete="off"
            placeholder="请输入场景类型标签"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容标签" prop="fileContentTag">
          <el-input
            size="small"
            v-model="Videoform.fileContentTag"
            auto-complete="off"
            placeholder="请输入内容标签"
            style="width:90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVideoDialog">取消</el-button>
        <el-button type="primary" @click="submitVideoUrl('Videoform')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 上传音频 -->
    <el-dialog title="上传音频内容" width="900px" :visible.sync="audioVisible" @click="closeaudioDialog">
      <el-form label-width="120px" :model="audioform" ref="audioform" style="width:850px">
        <el-form-item label="* 音频名称" prop="fileName">
          <el-input
            size="small"
            v-model="audioform.fileName"
            auto-complete="off"
            placeholder="请输入音频名称"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="* 音频地址" prop="fileUrl">
          <input
            type="file"
            v-loading.fullscreen.lock="fullscreenLoading"
            @change="uploadaudio($event)"
          />
          <el-input
            size="small"
            v-model="audioform.fileUrl"
            auto-complete="off"
            placeholder="请输入音频地址"
            style="width:80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="语种标签" prop="fileLanguageTag">
          <el-input
            size="small"
            v-model="audioform.fileLanguageTag"
            auto-complete="off"
            placeholder="请输入语种标签"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="场景类型标签" prop="fileSceneTypeTag">
          <el-input
            size="small"
            v-model="audioform.fileSceneTypeTag"
            auto-complete="off"
            placeholder="请输入场景类型标签"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容标签" prop="fileContentTag">
          <el-input
            size="small"
            v-model="audioform.fileContentTag"
            auto-complete="off"
            placeholder="请输入内容标签"
            style="width:90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeaudioDialog">取消</el-button>
        <el-button type="primary" @click="submitaudioUrl">确定</el-button>
      </span>
    </el-dialog>

    <!-- 上传电子书 -->
    <el-dialog
      title="上传电子书内容"
      width="900px"
      :visible.sync="pictureBookVisible"
      @click="closepictureBookDialog"
    >
      <el-form
        label-width="120px"
        :model="pictureBookform"
        ref="pictureBookform"
        style="width:850px"
      >
        <el-form-item label="* 电子书名称" prop="fileName">
          <el-input
            size="small"
            v-model="pictureBookform.fileName"
            auto-complete="off"
            placeholder="请输入电子书名称"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="* 电子书地址" prop="fileUrl">
          <input
            type="file"
            v-loading.fullscreen.lock="fullscreenLoading"
            @change="uploadpictureBook($event)"
          />
          <el-input
            size="small"
            v-model="pictureBookform.fileUrl"
            auto-complete="off"
            placeholder="请输入电子书地址"
            style="width:80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="* 绘本封面图片" prop="fileImgUrl">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="pictureBookform.fileImgUrl" :src="pictureBookform.fileImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为700*265</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closepictureBookDialog">取消</el-button>
        <el-button type="primary" @click="submitpictureBookUrl">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { gradeGet, courseAddOther } from "@/api/getData";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import {
  VideoUrl,
  imgUrl,
  imagesUrl,
  newVideoUrl,
  zipFileUrl
} from "@/config/env";
export default {
  data() {
    return {
      dialogVisible:false,
      dialogImageUrl:'',
      
      newVideoUrl: newVideoUrl,
      VideoUrl: VideoUrl,
      imgUrl: imgUrl,
      imagesUrl: imagesUrl,
      zipFileUrl: zipFileUrl,
      resourceTypeA: false,
      resourceTypeB: false,
      resourceTypeC: false,
      resourceTypeD: false,
      resourceTypeE: false,
      resourceTypeF: true,
      resourceTypeG: false,
      videoShow: false,
      audioShow: false,
      imgShow: false,
      pictureBookShow: false,
      gradeGetList: [],
      form: {
        courseId: "",
        resourceType: "",
        resourceTitle: "",
        gradeId: ""
      },
      Videoform: {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: ""
      },
      audioform: {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: ""
      },
      pictureBookform: {
        fileName: "",
        fileUrl: "",
        fileImgUrl: ""
      },
      VideoList: [],
      audioList: [],
      imgList: [],
      pictureBookList: [],
      fullscreenLoading: false,
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
          fullscreenToggle: true //全屏按钮
        }
      },
      audioUrl: "",
      VideoVisible: false,
      audioVisible: false,
      pictureBookVisible: false,
      workImgUrl: ""
    };
  },
  // 注册组件
  components: {
    videoPlayer
  },
  mounted() {
    var data = this.$route.query;
    console.log("路由数据", data);
    this.form.courseId = data.courseId;
    this.form.resourceType = data.resourceType;
    if (data.resourceType == 1) {
      this.resourceTypeA = true;
    } else if (data.resourceType == 2) {
      this.resourceTypeB = true;
      this.resourceTypeG = true;
    } else if (data.resourceType == 3) {
      this.resourceTypeC = true;
      this.resourceTypeG = true;
    } else if (data.resourceType == 4) {
      this.resourceTypeD = true;
      this.getGrade();
    } else if (data.resourceType == 5) {
      this.resourceTypeE = true;
      this.resourceTypeF = false;
    }
  },
  methods: {
    videoType() {
      this.videoShow = true;
    },
    audioType() {
      this.audioShow = true;
    },
    imgType() {
      this.imgShow = true;
    },
    pictureBookType() {
      this.pictureBookShow = true;
    },
    async getGrade() {
      try {
        this.listLoading = true;
        const res = await gradeGet();
        if (res.status == 200) {
          // console.log("年级列表", res.data);
          this.gradeGetList = res.data.list;
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
    back() {
      this.$router.go(-1);
    },
    VideoAdd() {
      this.VideoVisible = true;
    },
    closeVideoDialog() {
      this.Videoform = {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: ""
      };
      this.VideoVisible = false;
    },
    uploadVideo() {
      //上传视频
      var _this = this;
      var Videofile = event.target.files;
      // console.log(Videofile);
      var myfile = Videofile[0];
      if (myfile != undefined) {
        // console.log(myfile);
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
          $.ajax({
            url: this.newVideoUrl,
            type: "post",
            data: file,
            headers: {
              Authorization: localStorage.learn_token
            },
            processData: false,
            contentType: false,
            success: function(res) {
              // console.log(res);
              _this.fullscreenLoading = false;
              _this.Videoform.fileUrl = res.data;
            },
            error: function(res) {
              // console.log(res);
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
    },
    submitVideoUrl() {
      // console.log(this.Videoform);
      if (this.Videoform.fileName != "") {
        if (this.Videoform.fileUrl != "") {
          var list = this.Videoform;
          this.VideoList.push(list);
          this.playerOptions.sources = this.Videoform.fileUrl;
          // console.log(this.VideoList);
          this.Videoform = {
            fileName: "",
            fileUrl: "",
            fileLanguageTag: "",
            fileSceneTypeTag: "",
            fileContentTag: ""
          };
          this.VideoVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请填写视频地址"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请填写视频名称"
        });
      }
    },
    VideoPlay(e) {
      //播放视频
      // console.log(e);
      this.playerOptions.sources = e;
    },
    // 删除视频
    VideoDel(e) {
      // console.log(e);
      this.VideoList.forEach((element, index) => {
        // console.log("element", element);
        var name = element.fileName;
        if (e == name) {
          this.VideoList.splice(index, 1);
        }
      });
      // console.log(this.VideoList);
    },
    audioAdd() {
      this.audioVisible = true;
    },
    closeaudioDialog() {
      this.audioform = {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: ""
      };
      this.audioVisible = false;
    },
    uploadaudio() {
      //上传音频
      var _this = this;
      var audiofile = event.target.files;
      // console.log(audiofile);
      var myfile = audiofile[0];
      if (myfile != undefined) {
        // console.log(myfile);
        var urlname = myfile.name;
        var index2 = urlname.lastIndexOf(".");
        var suffix = urlname.substring(index2);
        // console.log(suffix);
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
          var newaudioCreateTime = Date.parse(new Date());
          var copyFile = new File([myfile], `${newaudioCreateTime}${suffix}`);
          // console.log(copyFile);
          var file = new FormData();
          file.append("file", copyFile);
          file.append("submit", false);
          $.ajax({
            url: this.VideoUrl,
            type: "post",
            data: file,
            headers: {
              Authorization: localStorage.learn_token
            },
            processData: false,
            contentType: false,
            success: function(res) {
              // console.log(res);
              _this.fullscreenLoading = false;
              _this.audioform.fileUrl = res.url;
            },
            error: function(res) {
              // console.log(res);
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
    },
    submitaudioUrl() {
      // console.log(this.audioform);
      if (this.audioform.fileName != "") {
        if (this.audioform.fileUrl != "") {
          var list = this.audioform;
          this.audioList.push(list);
          this.audioUrl = this.audioform.fileUrl;
          // console.log(this.audioList);
          this.audioform = {
            fileName: "",
            fileUrl: "",
            fileLanguageTag: "",
            fileSceneTypeTag: "",
            fileContentTag: ""
          };
          this.audioVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请填写音频地址"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请填写音频名称"
        });
      }
    },
    audioPlay(e) {
      //播放音频
      // console.log(e);
      this.audioUrl = e;
    },
    // 上传图片开始
    beforeAvatarUpload(file) {
      // console.log("添加图片之前", file);
      var urlname = file.name;
      var index2 = urlname.lastIndexOf(".");
      var suffix = urlname.substring(index2);
      // console.log(suffix);
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
    },
    handleImageSuccess(file) {
      // console.log("添加图片", file);
      var list = {
        fileUrl: file.url
      };
      this.imgList.push(list);
      // console.log(this.imgList);
    },
    handleRemoveimg(file) {
      // 删除图片
      return this.$confirm("确认要删除吗?", "提示", {
        type: "warning"
      })
      .then(async () => {
          console.log(file);
          this.imgList.forEach((element, index) => {
            console.log("element", element);
            if (element.fileUrl == file.response.url) {
              this.imgList.splice(index, 1);
            }
          });
      })
      //   .catch(() => {
      //     this.listLoading = false;
      // });
    },
    pictureBookAdd() {
      this.pictureBookVisible = true;
    },
    closepictureBookDialog() {
      this.pictureBookform = {
        fileName: "",
        fileUrl: "",
        fileImgUrl: ""
      };
      this.pictureBookVisible = false;
    },
    handleAvatarSuccess(file) {
      console.log(file);
      this.pictureBookform.fileImgUrl = file.url;
      console.log(this.pictureBookform);
    },
    uploadpictureBook() {
      //上传电子书
      var _this = this;
      var pictureBookfile = event.target.files;
      // console.log(pictureBookfile);
      var myfile = pictureBookfile[0];
      if (myfile != undefined) {
        // console.log(myfile);
        var urlname = myfile.name;
        var index2 = urlname.lastIndexOf(".");
        var suffix = urlname.substring(index2);
        // console.log(suffix);
        if (
          suffix === ".txt" ||
          suffix === ".doc" ||
          suffix === ".xls" ||
          suffix === ".ppt" ||
          suffix === ".docx" ||
          suffix === ".xlsx" ||
          suffix === ".pdf" ||
          suffix === ".pptx" ||
          suffix === ".epub"
        ) {
          _this.fullscreenLoading = true;
          var newpictureBookCreateTime = Date.parse(new Date());
          var copyFile = new File(
            [myfile],
            `${newpictureBookCreateTime}${suffix}`
          );
          // console.log(copyFile);
          var file = new FormData();
          file.append("file", copyFile);
          file.append("submit", false);
          $.ajax({
            url: this.VideoUrl,
            type: "post",
            data: file,
            headers: {
              Authorization: localStorage.learn_token
            },
            processData: false,
            contentType: false,
            success: function(res) {
              console.log(res);
              _this.fullscreenLoading = false;
              _this.pictureBookform.fileUrl = res.url;
            },
            error: function(res) {
              // console.log(res);
            }
          });
          event.target.value = "";
        } else {
          this.$message({
            type: "error",
            message: "上传的电子书文件格式错误，请选择正确的文件格式"
          });
          event.target.value = "";
        }
      }
    },
    submitpictureBookUrl() {
      // console.log(this.pictureBookform);
      if (this.pictureBookform.fileName != "") {
        if (this.pictureBookform.fileUrl != "") {
          var list = this.pictureBookform;
          this.pictureBookList.push(list);
          this.pictureBookUrl = this.pictureBookform.fileUrl;
          // console.log(this.pictureBookList);
          this.pictureBookform = {
            fileName: "",
            fileUrl: "",
            fileImgUrl: ""
          };
          this.pictureBookVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请填写音频地址"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请填写音频名称"
        });
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
      var videoFileList = this.VideoList;
      var audioFileList = this.audioList;
      var imgFileList = [];
      if (this.form.resourceType == 5) {
        var workImgUrl = this.workImgUrl;
        console.log(workImgUrl);
        imgFileList.push({
          fileUrl: workImgUrl
        });
      } else {
        imgFileList = this.imgList;
      }
      var pictureBookList = this.pictureBookList;
      console.log("VideoList", videoFileList);
      console.log("audioList", audioFileList);
      console.log("imgList", imgFileList);
      console.log("pictureBookList", pictureBookList);
      console.log("courseResourceBundle", courseResourceBundle);
      data.push({
        courseResourceBundle,
        videoFileList,
        audioFileList,
        imgFileList,
        pictureBookList
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
#lab-file {
  line-height: 30px;
  font-size: 12px;
  padding: 0 10px;
  display: inline-block;
  color: #fff;
  background: rgb(102, 177, 255);
  border: none;
  border-radius: 5px;
}
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
.fileImgUrl {
  width: 350px;
  height: 132px;
}
</style>
