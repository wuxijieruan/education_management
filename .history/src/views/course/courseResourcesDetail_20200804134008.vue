<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeA">添加课程导读</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeB">添加课程绘本</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeC">添加课程知识点</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeD">添加课程互动游戏</el-breadcrumb-item>
      <el-breadcrumb-item v-show="resourceTypeE">添加课程互动作业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button size="small" type="danger" style="margin: 20px 0;" @click="back">返回列表</el-button>
    <el-button size="small" type="primary" @click="submit()">保存</el-button>
    <el-form label-width="200px" :model="form" ref="form" element-loading-text="拼命加载中">
      <el-form-item label="导读名称" prop="resourceTitle" v-show="resourceTypeA">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入导读名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="绘本名称" prop="resourceTitle" v-show="resourceTypeB">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入绘本名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="知识点名称" prop="resourceTitle" v-show="resourceTypeC">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入知识点名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="知识点互动游戏名称" prop="resourceTitle" v-show="resourceTypeD">
        <el-input
          size="small"
          v-model="form.resourceTitle"
          style="width:350px"
          placeholder="请输入知识点互动游戏名称"
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
      <el-form-item label="适合年龄段" prop="gradeId" v-show="resourceTypeH">
        <el-select v-model="form.gradeId" placeholder="请选择适合年龄段" style="width:350px">
          <el-option
            v-for="item in gradeGetList"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-left:130px;margin-bottom: 20px;" v-show="resourceTypeF">
        <el-button size="small" @click="videoType">+ 视频</el-button>
        <el-button size="small" @click="audioType">+ 音频</el-button>
        <el-button size="small" @click="imgType">+ 图片</el-button>
        <el-button size="small" @click="pictureBookType" v-show="resourceTypeG">+ 电子书</el-button>
      </div>

      <el-form-item label="课程视频" v-show="videoShow">
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
           <el-table-column align="center" prop="fileImgUrl" label="视频封面"></el-table-column>
        <el-table-column align="center" prop="fileLanguageTag" label="语种标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileSceneTypeTag" label="场景类型标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileContentTag" label="内容标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileIndex" label="内容标签" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="Videoedit(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="VideoPlay(scope.row.fileUrl)">播放</el-button>
            <el-button size="small" type="danger" @click="VideoDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="课程音频" v-show="audioShow">
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
        <el-table-column align="center" prop="fileImgUrl" label="音频封面">
          <template slot-scope="scope">
            <img
              v-if="scope.row.fileImgUrl"
              :src="scope.row.fileImgUrl"
              width="80"
              height="40"
              class="head_pic"
            />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="teacherName" label="主讲老师" width="150"></el-table-column>
        <el-table-column align="center" prop="fileLanguageTag" label="语种标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileSceneTypeTag" label="场景类型标签" width="100"></el-table-column>
        <el-table-column align="center" prop="fileContentTag" label="内容标签" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="audioedit(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="audioPlay(scope.row.fileUrl)">播放</el-button>
            <el-button size="small" type="danger" @click="audioDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="课程图片" v-show="imgShow">
        <el-upload
          :action="imgUrl"
          list-type="picture-card"
          :on-success="handleImageSuccess"
          :before-remove="handleRemoveimg"
          :file-list="imgList"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程电子书" v-show="pictureBookShow">
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
        <el-table-column align="center" prop="fileImgUrl" label="电子书图片" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.fileImgUrl" alt class="fileImgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="pictureBookDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 上传视频 -->
    <el-dialog title="视频内容" width="900px" :visible.sync="VideoVisible" @click="closeVideoDialog">
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
            element-loading-text="拼命加载中，正在对上传文件进行技术处理，此过程可能需要几分钟，请耐心等待"
          />
          <el-input
            size="small"
            v-model="Videoform.fileUrl"
            auto-complete="off"
            placeholder="腾讯视频请直接输入VID"
            style="width:80%"
          ></el-input>
        </el-form-item>

        <el-form-item label="视频图片" prop="fileImgUrl" style="display:block">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="vdhandleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="Videoform.fileImgUrl" :src="Videoform.fileImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">图片最佳上传为长方形</div>
          </el-upload>
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
    <el-dialog
      title="音频内容"
      width="900px"
      :visible.sync="audioVisible"
      @click="closeaudioDialog"
      close="closeaudioDialog"
    >
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
            element-loading-text="拼命加载中，正在对上传文件进行技术处理，此过程可能需要几分钟，请耐心等待"
          />
          <el-input
            size="small"
            v-model="audioform.fileUrl"
            auto-complete="off"
            placeholder="请输入音频地址"
            style="width:80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="fileImgUrl" style="display:block">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="vhandleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="audioform.fileImgUrl" :src="audioform.fileImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">图片最佳上传为正方形</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="主讲老师" prop="teacherName">
          <el-input
            size="small"
            v-model="audioform.teacherName"
            auto-complete="off"
            placeholder="请输入主讲老师"
            style="width:90%"
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
      title="电子书内容"
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
            element-loading-text="拼命加载中，正在对上传文件进行技术处理，此过程可能需要几分钟，请耐心等待"
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
            <div slot="tip" class="el-upload__tip">图片最佳上传尺寸为265*265</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closepictureBookDialog">取消</el-button>
        <el-button type="primary" @click="submitpictureBookUrl">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" id="imgpop">
      <img width="100%" style :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import {
  gradeGet,
  courseResourcesEdit,
  courseResourcesFileDel,
} from "@/api/getData";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import {
  VideoUrl,
  imgUrl,
  imagesUrl,
  newVideoUrl,
  zipFileUrl,
} from "@/config/env";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",

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
      resourceTypeH: false,
      videoShow: false,
      audioShow: false,
      imgShow: false,
      pictureBookShow: false,
      gradeGetList: [],
      form: {
        courseId: "",
        resourceType: "",
        resourceTitle: "",
        gradeId: "",
      },
      Videoform: {
        fileName: "",
        fileUrl: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: "",
        fileImgUrl: "",
      },
      videoEdit: false,
      audioform: {
        fileName: "",
        fileUrl: "",
        fileImgUrl: "",
        teacherName: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: "",
      },
      audioEdit: false,
      pictureBookform: {
        fileName: "",
        fileUrl: "",
        fileImgUrl: "",
      },
      VideoList: [],
      audioList: [],
      imgList: [],
      imgFileList: [],
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
          fullscreenToggle: true, //全屏按钮
        },
      },

      audioUrl: "",
      VideoVisible: false,
      audioVisible: false,
      pictureBookVisible: false,
      // workImgUrl: ""
    };
  },
  // 注册组件
  components: {
    videoPlayer,
  },
  mounted() {
    var data = this.$route.query;
    console.log("路由数据", data);
    var resourceType = data.data.courseResourceBundle.resourceType;
    this.form = data.data.courseResourceBundle;
    if (resourceType == 1) {
      this.resourceTypeA = true;
    } else if (resourceType == 2) {
      this.resourceTypeB = true;
      this.resourceTypeG = true;
    } else if (resourceType == 3) {
      this.resourceTypeC = true;
      this.resourceTypeH = true;
      this.getGrade();
    } else if (resourceType == 4) {
      this.resourceTypeD = true;
      this.resourceTypeH = true;
      this.getGrade();
    } else if (resourceType == 5) {
      this.resourceTypeE = true;
      this.resourceTypeF = false;
      this.imgShow = true;
    }
    if (data.data.videoFileList != "" && data.data.videoFileList != null) {
      this.videoShow = true;
      this.VideoList = data.data.videoFileList;
      var fileUrl = data.data.videoFileList[0].fileUrl;
      console.log(fileUrl);
      if (fileUrl.indexOf("https") != -1) {
        console.log(11);
        this.playerOptions.sources = fileUrl;
      }
    }
    if (data.data.audioFileList != "" && data.data.audioFileList != null) {
      this.audioShow = true;
      this.audioList = data.data.audioFileList;
      this.audioUrl = data.data.audioFileList[0].fileUrl;
    }
    if (data.data.imgFileList != "" && data.data.imgFileList != null) {
      this.imgShow = true;
      var imgList = [];
      this.imgFileList = data.data.imgFileList;
      data.data.imgFileList.forEach((element, index) => {
        // console.log("element", element);
        var url = element.fileUrl;
        var name = element.fileName;
        var response = {
          url: element.fileUrl,
        };
        var courseResourceBundleFileId = element.courseResourceBundleFileId;
        imgList.push({ url, name, response, courseResourceBundleFileId });
      });
      this.imgList = imgList;
      // console.log(this.imgList);
    }
    if (
      data.data.pictureBookFileList != "" &&
      data.data.pictureBookFileList != null
    ) {
      this.pictureBookShow = true;
      this.pictureBookList = data.data.pictureBookFileList;
    }
  },
  watch: {
    audioVisible: function (newVal) {
      if (!newVal) {
        this.audioform = {
          fileName: "",
          fileUrl: "",
          fileImgUrl: "",
          teacherName: "",
          fileLanguageTag: "",
          fileSceneTypeTag: "",
          fileContentTag: "",
        };
      }
    },
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
          // console.log("年龄段列表", res.data);
          this.gradeGetList = res.data.list;
          this.listLoading = false;
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
    back() {
      this.$router.push({
        path: "/courseDetail",
        query: {
          courseId: this.form.courseId,
          resourceType: this.form.resourceType,
        },
      });
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid() {
      return (
        this.S4() +
        this.S4() +
        "" +
        this.S4() +
        "" +
        this.S4() +
        "" +
        this.S4() +
        "" +
        this.S4() +
        this.S4() +
        this.S4()
      );
    },
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
    uploadVideo() {
      //上传视频
      var _this = this;
      var Videofile = event.target.files;
      console.log("hhhhhladsnladlad;ladsand;ad;adn;a;d;ad", this.Videoform);
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
          if (this.Videoform.fileUrl) {
            var data = {
              file: file,
              fileId: this.Videoform.courseResourceBundleFileId,
            };
            var fileId = this.Videoform.courseResourceBundleFileId;
          } else {
            var data = {
              file: file,
            };
          }

          $.ajax({
            url: this.newVideoUrl + "?fileId=" + fileId,
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
              _this.Videoform.fileUrl = res.data;
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
            
          if(){
            
          }
          if (this.Videoform.fileUrl.indexOf("https") >= 0) {
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
          }else{
            this.$message({
            type: "error",
            message: "当前是外部链接视频，无法获取其封面，请手动上传封面",
          });
          }
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
    VideoPlay(e) {
      //播放视频
      console.log(e);
      var fileUrl = e.fileUrl;
      if (fileUrl.indexOf("https") != -1) {
        this.playerOptions.sources = this.Videoform.fileUrl;
      } else {
        this.$message({
          type: "error",
          message: "当前视频不支持在pc端播放",
        });
      }
    },
    // 删除视频
    async VideoDel(e) {
      console.log(e);
      var courseResourceBundleFileId, num;
      this.VideoList.forEach((element, index) => {
        // console.log("element", element);
        if (e.fileName == element.fileName) {
          courseResourceBundleFileId = element.courseResourceBundleFileId;
          num = index;
        }
      });
      console.log(courseResourceBundleFileId);
      if (courseResourceBundleFileId != undefined) {
        const res = await courseResourcesFileDel(courseResourceBundleFileId);
        if (res.status == 200) {
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
          console.log(res.msg);
        }
      }
      this.VideoList.splice(num, 1);
      if (this.VideoList != "") {
        this.playerOptions.sources = this.VideoList[0].fileUrl;
      } else {
        this.playerOptions.sources = "";
      }
      console.log(this.VideoList);
    },
    audioAdd() {
      this.audioVisible = true;
    },
    audioedit(row) {
      console.log(row);
      var list = row;
      this.audioform = list;
      this.audioVisible = true;
      this.audioEdit = true;
    },
    closeaudioDialog() {
      this.audioform = {
        fileName: "",
        fileUrl: "",
        fileImgUrl: "",
        teacherName: "",
        fileLanguageTag: "",
        fileSceneTypeTag: "",
        fileContentTag: "",
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
          suffix === ".MP3" ||
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
              Authorization: localStorage.learn_token,
            },
            processData: false,
            contentType: false,
            success: function (res) {
              // console.log(res);
              _this.fullscreenLoading = false;
              _this.audioform.fileUrl = res.url;
            },
            error: function (res) {
              console.log(res);
              _this.fullscreenLoading = false;
              this.$message({
                type: "error",
                message: res.msg,
              });
            },
          });
          event.target.value = "";
        } else {
          this.$message({
            type: "error",
            message: "上传的音频文件格式错误，请选择正确的文件格式",
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
          if (this.audioEdit) {
            console.log("编辑");
            // this.$set(table,index,this.audioform)
          } else {
            console.log("新增");
            this.audioList.push(list);
            this.audioUrl = this.audioform.fileUrl;
          }
          console.log(this.audioList);
          this.audioform = {
            fileName: "",
            fileUrl: "",
            fileImgUrl: "",
            teacherName: "",
            fileLanguageTag: "",
            fileSceneTypeTag: "",
            fileContentTag: "",
          };
          this.audioEdit = false;
          this.audioVisible = false;
          this.$forceUpdate();
        } else {
          this.$message({
            type: "error",
            message: "请填写音频地址",
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请填写音频名称",
        });
      }
    },
    audioPlay(e) {
      //播放音频
      // console.log(e);
      this.audioUrl = e;
    },
    // 删除音频
    async audioDel(e) {
      console.log(e);
      var courseResourceBundleFileId, num;
      this.audioList.forEach((element, index) => {
        // console.log("element", element);
        if (e.fileName == element.fileName) {
          courseResourceBundleFileId = element.courseResourceBundleFileId;
          num = index;
        }
      });
      console.log(courseResourceBundleFileId);
      if (courseResourceBundleFileId != undefined) {
        const res = await courseResourcesFileDel(courseResourceBundleFileId);
        if (res.status == 200) {
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
          console.log(res.msg);
        }
      }
      this.audioList.splice(num, 1);
      if (this.audioList != "") {
        this.audioUrl = this.audioList[0].fileUrl;
      } else {
        this.audioUrl = "";
      }
      console.log(this.audioList);
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
          message: "上传的图片文件格式错误，请选择正确的文件格式",
        });
        return false;
      }
    },
    handleImageSuccess(file) {
      // console.log("添加图片", file);
      var list = {
        fileUrl: file.url,
      };
      this.imgFileList.push(list);
      console.log(this.imgFileList);
    },
    async handleRemoveimg(file) {
      return this.$confirm("确认要删除吗?", "提示", {
        type: "warning",
      }).then(async () => {
        // 删除图片
        console.log(file);
        var courseResourceBundleFileId, num;
        this.imgFileList.forEach((element, index) => {
          console.log("imgFileListelement", element);
          if (
            element.fileUrl == file.url ||
            element.fileUrl == file.response.url
          ) {
            courseResourceBundleFileId = element.courseResourceBundleFileId;
            num = index;
          }
        });
        console.log(courseResourceBundleFileId);
        if (courseResourceBundleFileId != undefined) {
          const res = await courseResourcesFileDel(courseResourceBundleFileId);
          if (res.status == 200) {
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
            console.log(res.msg);
          }
        }
        this.imgFileList.splice(num, 1);
        console.log(this.imgFileList);
      });
      //   .catch(() => {
      //     this.listLoading = false;
      // });
    },
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
    pictureBookAdd() {
      this.pictureBookVisible = true;
    },
    closepictureBookDialog() {
      this.pictureBookform = {
        fileName: "",
        fileUrl: "",
        fileImgUrl: "",
      };
      this.pictureBookVisible = false;
    },
    handleAvatarSuccess(file) {
      console.log(file);
      this.pictureBookform.fileImgUrl = file.url;
      console.log(this.pictureBookform);
    },
    vhandleAvatarSuccess(file) {
      console.log(file);
      this.audioform.fileImgUrl = file.url;
      console.log(this.audioform);
      // var aa=this.audioform.teacherName
      // this.audioform.teacherName="abc"
      // this.audioform.teacherName=aa
      this.$forceUpdate();
    },
    vdhandleAvatarSuccess(file) {
      console.log(file);
      this.Videoform.fileImgUrl = file.url;
      console.log(this.audioform);
      // var aa=this.audioform.teacherName
      // this.audioform.teacherName="abc"
      // this.audioform.teacherName=aa
      this.$forceUpdate();
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
        if (suffix === ".zip") {
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
            url: this.zipFileUrl,
            type: "post",
            data: file,
            headers: {
              Authorization: localStorage.learn_token,
            },
            processData: false,
            contentType: false,
            success: function (res) {
              console.log(res);
              _this.fullscreenLoading = false;
              _this.pictureBookform.fileUrl = res.data;
            },
            error: function (res) {
              console.log(res);
              _this.fullscreenLoading = false;
              this.$message({
                type: "error",
                message: res.msg,
              });
            },
          });
          event.target.value = "";
        } else {
          this.$message({
            type: "error",
            message: "上传的电子书文件格式错误，请选择正确的文件格式",
          });
          event.target.value = "";
        }
      }
    },
    submitpictureBookUrl() {
      // console.log(this.pictureBookform);
      if (this.pictureBookform.fileName != "") {
        if (this.pictureBookform.fileUrl != "") {
          if (this.pictureBookform.fileImgUrl != "") {
            var list = this.pictureBookform;

            this.pictureBookList.push(list);
            this.pictureBookUrl = this.pictureBookform.fileUrl;
            // console.log(this.pictureBookList);
            this.pictureBookform = {
              fileName: "",
              fileUrl: "",
              fileImgUrl: "",
            };
            this.pictureBookVisible = false;
          } else {
            this.$message({
              type: "error",
              message: "请上传电子书封面图片",
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请填写电子书地址",
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请填写电子书名称",
        });
      }
    },
    // 删除电子书
    async pictureBookDel(e) {
      console.log(e);
      var courseResourceBundleFileId, num;
      this.pictureBookList.forEach((element, index) => {
        // console.log("element", element);
        if (e.fileName == element.fileName) {
          courseResourceBundleFileId = element.courseResourceBundleFileId;
          num = index;
        }
      });
      console.log(courseResourceBundleFileId);
      if (courseResourceBundleFileId != undefined) {
        const res = await courseResourcesFileDel(courseResourceBundleFileId);
        if (res.status == 200) {
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
          console.log(res.msg);
        }
      }
      this.pictureBookList.splice(num, 1);
      console.log(this.pictureBookList);
    },

    async submit() {
      var isdata = true;
      console.log("form", this.form);
      console.log("VideoList", this.VideoList);
      console.log("audioList", this.audioList);
      console.log("imgFileList", this.imgFileList);
      if (this.form.resourceType == 3 || this.form.resourceType == 4) {
        // if (this.form.resourceTitle != "" && this.form.resourceTitle != null) {
        if (this.form.gradeId != "" && this.form.gradeId != null) {
          isdata = true;
        } else {
          this.$message({
            type: "error",
            message: "请选择关联年龄段组",
          });
          isdata = false;
        }
        // } else {
        //   this.$message({
        //     type: "error",
        //     message: "请输入资源包名称"
        //   });
        //   isdata = false;
        // }
      }

      if (this.form.resourceType == 5) {
        if (this.form.resourceTitle != "" && this.form.resourceTitle != null) {
          isdata = true;
        } else {
          this.$message({
            type: "error",
            message: "请输入互动作业名称",
          });
          isdata = false;
        }
      }

      console.log(isdata);
      if (isdata) {
        var data = [];
        var courseResourceBundle = this.form;
        var videoFileList = this.VideoList;
        var audioFileList = this.audioList;
        var imgFileList = this.imgFileList;
        var pictureBookFileList = this.pictureBookList;
        console.log("VideoList", videoFileList);
        console.log("audioList", audioFileList);
        console.log("imgFileList", imgFileList);
        console.log("pictureBookFileList", pictureBookFileList);
        console.log("courseResourceBundle", courseResourceBundle);
        data.push({
          courseResourceBundle,
          videoFileList,
          audioFileList,
          imgFileList,
          pictureBookFileList,
        });
        console.log(data);
        const res = await courseResourcesEdit(data);
        console.log(res);
        if (res.status == 200) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.listLoading = false;
          this.back();
        } else {
          this.$message({
            type: "error",
            message: res.error,
          });
          console.log(res);
          this.listLoading = false;
        }
      }
    },
  },
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
  width: 132px;
  height: 132px;
  line-height: 132px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
/* .avatar-uploader .avatar {
  width: 132px;
  height: 132px;
  display: block;
} */
/* .fileImgUrl {
  width: 132px;
  height: 132px;
} */
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