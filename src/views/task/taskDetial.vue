<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      <el-breadcrumb-item>作业列表</el-breadcrumb-item>
      <el-breadcrumb-item>作业详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:20px">
      <el-button size="small" type="danger" @click="back">返回列表</el-button>
      <el-button size="small" v-if="form.reviewStatus=='未审核'" @click="toExamine">通过审核</el-button>
      <el-button size="small" v-if="form.reviewStatus=='未审核'" @click="auditFailed">审核不通过</el-button>
      <el-button size="small" v-if="form.reviewStatus!='未审核'" disabled>已审核</el-button>
    </div>

    <ul class="taskDetail">
      <li>
        <p class="lf">学生名称：</p>
        <p class="rt">{{form.studentName}}</p>
      </li>
      <li>
        <p class="lf">课程章节名称：</p>
        <p class="rt">{{form.courseChapterName}}</p>
      </li>
      <li>
        <p class="lf">课程章节练习题名称：</p>
        <p class="rt">{{form.exercisestName}}</p>
      </li>
      <li>
        <p class="lf">作业内容</p>
      </li>
      <li>
        <p class="lf">文字：</p>
        <p class="rt">{{form.answerTest}}</p>
      </li>
      <li>
        <p class="lf">图片：</p>
        <p class="rt">
          <img
            width="100%"
            v-if="form.answerImg!=null"
            :src="form.answerImg"
            alt
            style="width:150px;height:150px;margin:20px 20px 20px 0;"
          />
        </p>
      </li>
      <li>
        <p class="lf">音频：</p>
        <p class="rt">
          <audio v-if="form.answerVoice" :src="form.answerVoice" controls></audio>
        </p>
      </li>
      <li>
        <p class="lf">视频：</p>
        <p class="rt">
          <video-player
            class="video-player"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
            v-if="playerOptions.sources"
          ></video-player>
        </p>
      </li>
      <li>
        <p class="lf">提交时间：</p>
        <p class="rt">{{form.createTime}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { reviewStudentExercises } from "@/api/getData";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
export default {
  data() {
    return {
      form: {},
      taskForm: {},
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
    console.log("作业详情", this.$route.query.data.answerVideo);
    this.taskForm = this.$route.query.taskForm;
    this.form = this.$route.query.data;
    if (this.form.answerVideo != null && this.form.answerVideo != undefined) {
      this.playerOptions.sources = this.form.answerVideo;
    }
  },
  methods: {
    back() {
      this.$router.push({
        path: "/taskList",
        query: {
          taskForm: this.taskForm
        }
      });
    },
    async toExamine() {
      var data = {
        ids: this.form.studentExercisesId,
        reviewStatus: 1
      };
      console.log(data);
      const res = await reviewStudentExercises(data);
      if (res.status == 200) {
        console.log(res);
        this.$message({
          type: "success",
          message: res.data
        });
        this.form.reviewStatus = "通过";
      } else {
        this.$message({
          type: "error",
          message: res.error
        });
        console.log(res);
      }
    },
    async auditFailed() {
      var data = {
        ids: this.form.studentExercisesId,
        reviewStatus: -1
      };
      console.log(data);
      const res = await reviewStudentExercises(data);
      if (res.status == 200) {
        console.log(res);
        this.$message({
          type: "success",
          message: res.data
        });
        this.form.reviewStatus = "未通过";
      } else {
        this.$message({
          type: "error",
          message: res.error
        });
        console.log(res);
      }
    }
  }
};
</script>
<style scoped>
.taskDetail li {
  width: 100%;
  min-height: 30px;
}
.taskDetail li:after {
  content: "";
  display: block;
  clear: both;
}
.lf {
  width: 200px;
  text-align: right;
  margin-right: 20px;
  float: left;
}
.rt {
  float: left;
}
</style>
