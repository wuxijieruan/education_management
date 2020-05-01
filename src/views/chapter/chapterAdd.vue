<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节新增</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button size="small" type="danger" style="margin: 20px 0;" @click="back">返回列表</el-button>

    <!--列表-->
    <el-form label-width="100px" :model="form" :rules="rules" ref="form">
      <el-form-item label="章节名称" prop="courseChapterName">
        <el-input
          size="small"
          v-model="form.courseChapterName"
          auto-complete="off"
          placeholder="请输入章节名称"
          style="width:400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="章节顺序" prop="chapterIndex">
        <el-input
          size="small"
          v-model="form.chapterIndex"
          auto-complete="off"
          type="number"
          placeholder="请输入章节顺序"
          style="width:200px"
        ></el-input>
      </el-form-item>
      <el-form-item label="章节浏览数" prop="lookNo">
        <el-input
          size="small"
          v-model="form.lookNo"
          auto-complete="off"
          type="number"
          placeholder="请输入章节浏览数"
          style="width:200px"
        ></el-input>
      </el-form-item>
      <el-form-item label="章节视频">
        <input
          type="file"
          @change="uploadVideo($event)"
          v-loading.fullscreen.lock="fullscreenLoading"
        />
        <el-button size="small" type="primary" @click="uploadVideoUrl">上传文件路径</el-button>
        <div v-for="(item ,index ) in videoList" :key="index" style="width:500px">
          <div style="height:40px;">
            <p
              @click="videoPlay(item.fileUrl)"
              v-if="item.type==1"
              style="cursor: pointer;margin:0;float:left;width:95%"
            >文件名：{{item.fileName}}</p>
            <p v-if="item.type==0" style="cursor: pointer;margin:0;float:left;width:95%">
              文件名：{{item.fileName}}
              <span style="color:blue">（腾讯视频）</span>
            </p>
            <p style="cursor: pointer;float:right;margin:0;width:5%">
              <i class="el-icon-close" @click="removeVideo(item.fileName)"></i>
            </p>
          </div>
        </div>

        <video-player
          class="video-player"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          v-if="playerOptions.sources"
        ></video-player>
      </el-form-item>
      <el-form-item label="章节音频">
        <input
          type="file"
          @change="uploadVoice($event)"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="拼命加载中，正在对上传文件进行技术处理，此过程可能需要几分钟，请耐心等待"
        />
        <div v-for="(item ,index ) in voiceList" :key="index" style="width:500px">
          <div style="height:40px;">
            <p
              @click="voicePlay(item.fileUrl)"
              style="cursor: pointer;margin:0;float:left;width:95%"
            >文件名：{{item.fileName}}</p>
            <p style="cursor: pointer;float:right;margin:0;width:5%">
              <i class="el-icon-close" @click="removeVoice(item.fileName)"></i>
            </p>
          </div>
        </div>
        <div>
          <audio v-if="audioUrl" :src="audioUrl" controls></audio>
        </div>
      </el-form-item>
      <el-form-item label="章节图片">
        <el-upload
          :action="imgUrl"
          list-type="picture-card"
          :on-success="handleImageSuccess"
          :on-remove="handleRemoveimg"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogImageVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="章节书评文件" prop="bookReview">
        <el-button size="small" type="primary" @click="uploadbookReview">上传文件</el-button>
      </el-form-item>
      <el-table
        size="small"
        :data="bookReviewList"
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 801px;margin-left:100px;margin-bottom:20px;"
      >
        <el-table-column align="center" prop="coursePicUrl" label="书评图片" width="400">
          <template slot-scope="scope">
            <img :src="scope.row.bookReviewimgUrl" alt class="bookReviewimgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="bookReviewfilename" label="书评文件名" width="300"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="bookReviewleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="章节电子书" prop="elBook">
        <el-button size="small" type="primary" @click="uploadelBook">上传文件</el-button>
      </el-form-item>
      <el-table
        size="small"
        :data="elBookList"
        v-loading="listLoading"
        border
        element-loading-text="拼命加载中"
        style="width: 1101px;margin-left:100px;margin-bottom:20px;"
      >
        <el-table-column align="center" prop="coursePicUrl" label="电子书图片" width="400">
          <template slot-scope="scope">
            <img :src="scope.row.elBookimgUrl" alt class="elBookimgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="elBookfilename" label="电子书文件名" width="300"></el-table-column>
        <el-table-column align="center" prop="elBookfileUrl" label="电子书地址" width="300"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="elBookleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button size="small" type="primary" @click="submitAdd('form')">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 上传书评内容 -->
    <el-dialog
      title="上传书评内容"
      width="900px"
      :visible.sync="bookReviewVisible"
      @click="closebookReview"
    >
      <el-form
        label-width="120px"
        :model="bookReviewAform"
        ref="bookReviewAform"
        style="width:850px"
        v-loading="listLoading"
      >
        <el-form-item label="章节书评图片" prop="courseChapterName">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="bookReviewAform.bookReviewimgUrl"
              :src="bookReviewAform.bookReviewimgUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为700*265</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="章节书评文件" prop="courseChapterName">
          <input
            type="file"
            @change="uploadBookview($event)"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="拼命加载中，请耐心等待"
          />
          <div style="height:40px;" v-if="bookReviewAform.bookReviewfilename!=''">
            <p
              style="cursor: pointer;margin:0;float:left;width:95%"
            >文件名：{{bookReviewAform.bookReviewfilename}}</p>
            <p style="cursor: pointer;float:right;margin:0;width:5%">
              <i class="el-icon-close" @click="removeBookview"></i>
            </p>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closebookReview">取消</el-button>
        <el-button type="primary" @click="submitbookReview">确定</el-button>
      </span>
    </el-dialog>

    <!-- 上传电子书内容 -->
    <el-dialog title="上传电子书内容" width="900px" :visible.sync="elBookVisible" @click="closeelBook">
      <el-form
        label-width="120px"
        :model="elBookAform"
        :rules="elBookrules"
        ref="elBookAform"
        style="width:850px"
        v-loading="listLoading"
      >
        <el-form-item label="章节电子书图片">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="handleelBookSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="elBookAform.elBookimgUrl" :src="elBookAform.elBookimgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为700*265</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="章节电子书文件">
          <input
            type="file"
            @change="uploadElBook($event)"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="拼命加载中，请耐心等待"
          />
          <div style="height:40px;" v-if="elBookAform.elBookfilename!=''">
            <p
              style="cursor: pointer;margin:0;float:left;width:95%"
            >文件名：{{elBookAform.elBookfilename}}</p>
            <p style="cursor: pointer;float:right;margin:0;width:5%">
              <i class="el-icon-close" @click="removeelBook"></i>
            </p>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="el-upload__tip" style="color:blue">仅支持上传云展网的zip文件</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeelBook">取消</el-button>
        <el-button type="primary" @click="submitelBook">确定</el-button>
      </span>
    </el-dialog>

    <!-- 上传视频 -->
    <el-dialog title="上传视频内容" width="900px" :visible.sync="VideoVisible" @click="closeVideoDialog">
      <el-form
        label-width="120px"
        :model="Videoform"
        ref="Videoform"
        :rules="Videorules"
        style="width:850px"
        v-loading="listLoading"
      >
        <el-form-item label="视频名称" prop="fileName">
          <el-input
            size="small"
            v-model="Videoform.fileName"
            auto-complete="off"
            placeholder="请输入视频名称"
            style="width:90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频地址" prop="fileUrl">
          <el-input
            size="small"
            v-model="Videoform.fileUrl"
            auto-complete="off"
            placeholder="请输入视频地址"
            style="width:90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVideoDialog">取消</el-button>
        <el-button type="primary" @click="submitVideoUrl">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { courseChapterAdd, courseChapterFilrAdd } from "@/api/getData";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import {
  videoUrl,
  imgUrl,
  imagesUrl,
  newvideoUrl,
  zipFileUrl
} from "@/config/env";
export default {
  data() {
    return {
      newvideoUrl: newvideoUrl,
      videoUrl: videoUrl,
      imgUrl: imgUrl,
      imagesUrl: imagesUrl,
      zipFileUrl: zipFileUrl,
      listLoading: false, //是显示加载
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        courseId: "", //课程id
        chapterIndex: "", //章节顺序
        courseChapterName: "", //章节名称
        lookNo: 0, //章节浏览数
        videoUrl: "", //音频路径
        isVail: "1", //上否上架
        elBook: "", //电子书
        bookReview: "" //书评
      },
      bookReviewList: [],
      bookReviewAform: {
        bookReviewimgUrl: "",
        bookReviewfileUrl: "",
        bookReviewfilename: ""
      },
      elBookList: [],
      elBookAform: {
        elBookimgUrl: "",
        elBookfileUrl: "",
        elBookfilename: ""
      },
      elBookrules: {
        elBookfileUrl: [
          { required: true, message: "请输入章节顺序", trigger: "blur" }
        ],
        elBookfilename: [
          { required: true, message: "请输入章节名称", trigger: "blur" }
        ]
      },
      rules: {
        chapterIndex: [
          { required: true, message: "请输入章节顺序", trigger: "blur" }
        ],
        courseChapterName: [
          { required: true, message: "请输入章节名称", trigger: "blur" }
        ]
      },
      Videoform: {
        fileUrl: "",
        fileName: ""
      },
      Videorules: {
        fileUrl: [
          { required: true, message: "请输入章节顺序", trigger: "blur" }
        ],
        fileName: [
          { required: true, message: "请输入章节名称", trigger: "blur" }
        ]
      },

      chapterId: "",
      allfileList: [],
      dialogImageVisible: false,
      dialogImageUrl: "",
      audioUrl: "",
      videoList: [],
      voiceList: [],
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
      bookReviewVisible: false,
      elBookVisible: false,
      VideoVisible: false,
      listLoading: false, //是显示加载
      imageUrl: "", //电子书图片
      course: {}
    };
  },
  // 注册组件
  components: {
    videoPlayer
  },
  created() {
    var data = this.$route.query;
    // console.log("路由数据", data);
    this.form.courseId = data.courseId;
    this.course = data.course;
    var lastchapterIndex = data.lastchapterIndex;
    this.form.chapterIndex = lastchapterIndex + 1;
    // console.log(this.form.chapterIndex);
  },
  methods: {
    // 上传视频开始
    uploadVideo() {
      //上传视频
      var _this = this;
      var videofile = event.target.files;
      // console.log(videofile);
      var myfile = videofile[0];
      if (myfile != undefined) {
        console.log(myfile);
        var urlname = myfile.name;
        var index2 = urlname.lastIndexOf(".");
        var suffix = urlname.substring(index2);
        var fileName = urlname.substring(0, index2);
        console.log(fileName);
        console.log(suffix);
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
          var copyFile = new File([myfile], `${newvideoCreateTime}${suffix}`);
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
              var list = {
                chapterId: "",
                fileName: fileName,
                fileType: 1,
                fileUrl: res.data,
                type: 1
              };
              // console.log(list);
              _this.videoList.push(list);
              _this.allfileList.push(list);
              console.log("上传后的videoList", _this.videoList);
              console.log("上传后的allfileList", _this.allfileList);
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
    },
    videoPlay(e) {
      //播放视频
      console.log(e);
      this.playerOptions.sources = e;
    },
    removeVideo(e) {
      // 删除视频
      console.log(e);
      var name = e;
      var index1;
      this.videoList.forEach((element, index) => {
        // console.log("element", element);
        var fileName = element.fileName;
        if (fileName == name) {
          this.videoList.splice(index, 1);
        }
      });
      this.allfileList.forEach((element, index) => {
        // console.log("element", element);
        var fileName = element.fileName;
        if (fileName == name) {
          this.allfileList.splice(index, 1);
        }
      });
      if (this.videoList.length != 0) {
        var fileUrl = this.videoList[0].fileUrl;
        if (fileUrl.indexOf(".") > 0) {
          this.playerOptions.sources = this.videoList[0].fileUrl;
        }
      } else {
        this.playerOptions.sources = "";
      }
      console.log("删除后的videoList", this.videoList);
      console.log("删除后的allfileList", this.allfileList);
    },
    // 上传视频结束
    // 上传音频开始
    uploadVoice() {
      //上传音频
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
        console.log(suffix);
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
          var copyFile = new File([myfile], `${newvideoCreateTime}${suffix}`);
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
              var list = {
                chapterId: "",
                fileName: fileName,
                fileType: 2,
                fileUrl: res.url
              };
              // console.log(list);
              _this.voiceList.push(list);
              _this.allfileList.push(list);
              console.log("上传后的voiceList", _this.voiceList);
              console.log("上传后的allfileList", _this.allfileList);
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
    },
    voicePlay(e) {
      //播放音频
      this.audioUrl = e;
    },
    removeVoice(e) {
      // 删除音频
      console.log(e);
      var name = e;
      var index1;
      this.voiceList.forEach((element, index) => {
        // console.log("element", element);
        var fileName = element.fileName;
        if (fileName == name) {
          this.voiceList.splice(index, 1);
        }
      });
      this.allfileList.forEach((element, index) => {
        // console.log("element", element);
        var fileName = element.fileName;
        if (fileName == name) {
          this.allfileList.splice(index, 1);
        }
      });
      if (this.voiceList.length != 0) {
        this.audioUrl = this.voiceList[0].fileUrl;
      } else {
        this.audioUrl = "";
      }
      console.log("删除后的voiceList", this.voiceList);
      console.log("删除后的allfileList", this.allfileList);
    },
    // 上传音频结束
    // 上传图片开始
    beforeAvatarUpload(file) {
      console.log("添加图片之前", file);
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
    },
    handleImageSuccess(file) {
      console.log("添加图片", file);
      var imageUrl = file.url;
      var index1 = imageUrl.lastIndexOf("/");
      var urlname = imageUrl.substring(index1 + 1, imageUrl.length);
      var index2 = urlname.lastIndexOf(".");
      var name = urlname.substring(0, index2);
      this.dialogImageUrl = file.url;
      var list = {
        chapterId: "",
        fileName: urlname,
        fileType: 4,
        fileUrl: file.url
      };
      this.allfileList.push(list);
      console.log(this.allfileList);
    },
    handleRemoveimg(file) {
      // 删除图片
      console.log(file);
      this.allfileList.forEach((element, index) => {
        console.log("element", element);
        var url = element.fileUrl;
        if (url == file.response.url) {
          this.allfileList.splice(index, 1);
        }
      });
    },
    // 上传图片结束
    // 上传书评图片成功
    handleAvatarSuccess(file) {
      console.log(file);
      this.imageUrl = file.url;
      this.bookReviewAform.bookReviewimgUrl = file.url;
      console.log(this.bookReviewAform);
    },
    // 上传书评文件开始
    uploadBookview() {
      //上传书评文件
      var _this = this;
      if (_this.bookReviewAform.bookReviewfilename != "") {
        this.$message.warning("一个书评图片对应一个文件");
      } else {
        var videofile = event.target.files;
        var myfile = videofile[0];
        console.log(myfile);
        if (myfile != undefined) {
          var urlname = myfile.name;
          var index2 = urlname.lastIndexOf(".");
          var suffix = urlname.substring(index2);
          var fileName = urlname.substring(0, index2);
          console.log(fileName);
          console.log("文件类型", suffix);
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
            var newvideoCreateTime = Date.parse(new Date());
            var copyFile = new File([myfile], `${newvideoCreateTime}${suffix}`);
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
                _this.fullscreenLoading = false;
                _this.bookReviewAform.bookReviewfilename = fileName;
                _this.bookReviewAform.bookReviewfileUrl = res.url;
                console.log("上传后的bookReviewAform", _this.bookReviewAform);
              },
              error: function(res) {
                console.log(res);
              }
            });
            event.target.value = "";
          } else {
            this.$message({
              type: "error",
              message: "上传的文档文件格式错误，请选择正确的文件格式"
            });
            event.target.value = "";
          }
        }
      }
    },
    removeBookview() {
      this.bookReviewAform.bookReviewfilename = "";
      this.bookReviewAform.bookReviewfileUrl = "";
      console.log("删除后的bookReviewAform", this.bookReviewAform);
    },
    // 上传书评文件结束
    // 提交书评内容
    submitbookReview() {
      console.log(this.bookReviewAform);
      if (this.bookReviewAform.bookReviewimgUrl != "") {
        if (this.bookReviewAform.bookReviewfileUrl != "") {
          var bookReviewimgUrl = this.bookReviewAform.bookReviewimgUrl;
          var bookReviewfileUrl = this.bookReviewAform.bookReviewfileUrl;
          var bookReviewfilename = this.bookReviewAform.bookReviewfilename;
          this.bookReviewList.push({
            bookReviewimgUrl,
            bookReviewfileUrl,
            bookReviewfilename
          });
          console.log(this.bookReviewList);
          this.bookReviewAform = {
            bookReviewimgUrl: "",
            bookReviewfileUrl: "",
            bookReviewfilename: ""
          };
          this.bookReviewVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请上传书评文件"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请上传书评图片"
        });
      }
    },
    // 删除书评
    bookReviewleDel(row) {
      console.log(row);
      this.bookReviewList.forEach((element, index) => {
        // console.log("element", element);
        var name = element.bookReviewfilename;
        if (row.bookReviewfilename == name) {
          this.bookReviewList.splice(index, 1);
        }
      });
      console.log(this.bookReviewList);
    },
    // 上传电子书图片成功
    handleelBookSuccess(file) {
      console.log(file);
      this.imageUrl = file.url;
      this.elBookAform.elBookimgUrl = file.url;
      console.log(this.elBookAform);
    },
    // 上传电子书文件开始
    uploadElBook() {
      //上传电子书文件
      var _this = this;
      if (_this.elBookAform.elBookfilename != "") {
        this.$message.warning("一个图片对应一个文件");
      } else {
        var videofile = event.target.files;
        var myfile = videofile[0];
        console.log(myfile);
        if (myfile != undefined) {
          var urlname = myfile.name;
          var index2 = urlname.lastIndexOf(".");
          var suffix = urlname.substring(index2);
          var fileName = urlname.substring(0, index2);
          console.log(fileName);
          console.log("文件类型", suffix);
          if (suffix === ".zip") {
            _this.fullscreenLoading = true;
            var newvideoCreateTime = Date.parse(new Date());
            var copyFile = new File([myfile], `${newvideoCreateTime}${suffix}`);
            // console.log(copyFile);
            var file = new FormData();
            file.append("file", copyFile);
            file.append("submit", false);
            $.ajax({
              url: this.zipFileUrl,
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
                _this.elBookAform.elBookfilename = fileName;
                _this.elBookAform.elBookfileUrl = res.data;
                console.log("上传后的elBookAform", _this.elBookAform);
              },
              error: function(res) {
                console.log(res);
              }
            });
            event.target.value = "";
          } else {
            this.$message({
              type: "error",
              message: "上传的文档文件格式错误，请选择正确的文件格式"
            });
            event.target.value = "";
          }
        }
      }
    },
    removeelBook() {
      this.elBookAform.elBookfilename = "";
      this.elBookAform.elBookfileUrl = "";
      console.log("删除后的elBookAform", this.elBookAform);
    },
    // 上传电子书文件结束
    // 提交电子书内容
    submitelBook() {
      console.log(this.elBookAform);
      if (this.elBookAform.elBookimgUrl != "") {
        var elBookimgUrl = this.elBookAform.elBookimgUrl;
        var elBookfileUrl = this.elBookAform.elBookfileUrl;
        var elBookfilename = this.elBookAform.elBookfilename;
        this.elBookList.push({
          elBookimgUrl,
          elBookfileUrl,
          elBookfilename
        });
        console.log(this.elBookList);
        this.elBookAform = {
          elBookimgUrl: "",
          elBookfileUrl: "",
          elBookfilename: ""
        };
        this.elBookVisible = false;
      } else {
        this.$message({
          type: "error",
          message: "请上传电子书图片"
        });
      }
    },
    // 删除电子书
    elBookleDel(row) {
      console.log(row);
      this.elBookList.forEach((element, index) => {
        // console.log("element", element);
        var name = element.elBookfilename;
        if (row.elBookfilename == name) {
          this.elBookList.splice(index, 1);
        }
      });
      console.log(this.elBookList);
    },
    // 保存
    submitAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.form.elBook = JSON.stringify(this.elBookList);
          this.form.bookReview = JSON.stringify(this.bookReviewList);
          console.log("章节新增", this.form);
          const res = await courseChapterAdd(this.form);
          console.log("章节新增res", res);
          if (res.status == 200) {
            this.listLoading = false;
            this.courseChapterId = res.data.courseChapterId;
            console.log("章节新增附件", this.allfileList);
            if (this.allfileList.length != 0) {
              console.log(11);
              this.allfileList.forEach(item => {
                console.log(item);
                item.chapterId = res.data.courseChapterId;
              });
              console.log("章节新增附件", this.allfileList);
              this.fileAdd();
            } else {
              this.back();
            }
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
            message: "请将信息填写完整"
          });
          return false;
        }
      });
    },
    // 保存附件
    async fileAdd() {
      try {
        const res = await courseChapterFilrAdd(this.allfileList);
        console.log("章节新增附件res", res);
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
      } catch (err) {
        this.$message({
          type: "error",
          message: "请重试"
        });
        console.log(err);
        this.listLoading = false;
      }
    },
    back() {
      this.$router.push({
        path: "/chapter",
        query: {
          course: this.course,
          courseId: this.form.courseId
        }
      });
    },
    // 打开电子书弹出框
    uploadelBook() {
      this.elBookVisible = true;
      console.log(this.elBookAform);
    },
    // 关闭电子书弹出框
    closeelBook() {
      this.elBookAform = {
        elBookimgUrl: "",
        elBookfileUrl: "",
        elBookfilename: ""
      };
      this.elBookVisible = false;
    },
    // 打开书评弹出框
    uploadbookReview() {
      this.bookReviewVisible = true;
      console.log(this.bookReviewAform);
    },
    // 关闭书评弹出框
    closebookReview() {
      this.bookReviewAform = {
        bookReviewimgUrl: "",
        bookReviewfileUrl: "",
        bookReviewfilename: ""
      };
      this.bookReviewVisible = false;
    },
    submitVideoUrl() {
      console.log(this.Videoform);
      // var fileName = this.Videoform.fileName;
      // var fileUrl = this.Videoform.fileUrl;
      var list = {
        chapterId: "",
        fileName: this.Videoform.fileName,
        fileType: 1,
        fileUrl: this.Videoform.fileUrl,
        type: 0
      };
      console.log(list);
      this.videoList.push(list);
      this.allfileList.push(list);
      console.log(this.videoList);
      console.log(this.allfileList);
      var fileUrl = this.Videoform.fileUrl;
      if (fileUrl.indexOf(".") > 0) {
        this.playerOptions.sources = this.Videoform.fileUrl;
      }
      this.Videoform = {
        chapterId: "",
        fileName: "",
        fileType: 1,
        fileUrl: ""
      };
      this.VideoVisible = false;
    },
    // 打开弹出框
    uploadVideoUrl() {
      this.VideoVisible = true;
    },
    // 关闭弹出框
    closeVideoDialog() {
      this.Videoform = {
        chapterId: "",
        fileName: "",
        fileType: 1,
        fileUrl: ""
      };
      this.VideoVisible = false;
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

.elBookimgUrl,
.bookReviewimgUrl {
  width: 350px;
  height: 132px;
  
}
</style>


