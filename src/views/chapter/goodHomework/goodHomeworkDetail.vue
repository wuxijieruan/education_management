<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>优秀作业列表</el-breadcrumb-item>
      <el-breadcrumb-item>优秀作业</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <div style="margin-bottom:10px;">
      <el-button size="small" type="danger" @click="back">返回列表</el-button>
    </div>
    <div>
      <div>
        <p class="title">课程作业题目：</p>
        <p class="content">{{form.exercisestName}}</p>
      </div>
      <div>
        <p>优秀作业视频：</p>
        <div v-if="form.answerVideo!=''">
          <p style="margin-bottom: 20px;">文件名：{{answerVideoName}}</p>
          <video-player
            class="video-player"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
        </div>
      </div>
      <div>
        <p>优秀作业音频：</p>
        <div v-if="form.answerVoice!=''">
          <p>文件名：{{answerVoiceName}}</p>
          <audio v-if="form.answerVoice" :src="form.answerVoice" controls></audio>
        </div>
      </div>
      <div v-if="form.answerImg!=''">
        <p>优秀作业图片：</p>
        <img :src="form.answerImg" class="answerImg" />
      </div>
      <div>
        <p class="title">优秀作业内容：</p>
        <p class="content">{{form.answerTest}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import { videoUrl, imgUrl, imagesUrl } from "@/config/env";
export default {
  data() {
    return {
      form: {},
      answerVideoName: "",
      answerVoiceName: "",
      courseChapterId: "",
      course: {},
      chapter: {},
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
      }
    };
  },
  components: {
    videoPlayer
  },
  created() {
    var data = this.$route.query;
    console.log("路由数据", data);
    this.form = data.row;
    if (data.row.answerVideo != "") {
      this.answerVideoName = data.row.fileName;
      this.playerOptions.sources = data.row.answerVideo;
    }
    if (data.row.answerVoice != "") {
      this.answerVoiceName = data.row.fileName;
      this.answerVoiceName = answerVoiceName;
    }
    this.course = data.course;
    this.chapter = data.chapter;
    this.courseChapterId = data.courseChapterId;
  },
  mounted() {},
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
    }
  }
};
</script>
<style scoped>
.title {
  width: 120px;
  display: inline-block;
}
.content {
  display: inline-block;
}
.answerImg {
  width: 178px;
  height: 178px;
}
</style>
