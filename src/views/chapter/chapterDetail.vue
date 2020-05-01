<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="form" class="user-search" ref="form">
      <el-form-item>
        <el-button size="small" type="danger" @click="back">返回列表</el-button>
      </el-form-item>
    </el-form>
    <ul class="courseDetailList">
      <li>课程章节名称：{{courseChapter.courseChapterName}}</li>
      <li>课程章节顺序：{{courseChapter.chapterIndex}}</li>
      <li>课程章节浏览数：{{courseChapter.lookNo}}</li>
    </ul>
    <div class="coursePreviewVideo">
      <p>章节视频：</p>
      <div v-for="(item ,index ) in videoList" :key="index" style="margin-bottom: 20px;">
        <p
          @click="bofang(item.fileUrl)"
          v-if="item.type==1"
          style="cursor: pointer;"
        >文件名：{{item.fileName}}</p>
        <p v-if="item.type==0" style="cursor: pointer;">文件名：{{item.fileName}} <span style="color:blue">（腾讯视频）</span></p>
      </div>
      
      <video-player
        class="video-player"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        v-if="playerOptions.sources"
      ></video-player>
    </div>
    <div class="coursePreviewVideo">
      <p>章节音频：</p>
      <div v-for="(item ,index ) in voiceList" :key="index">
        <p>文件名：{{item.fileName}}</p>
        <audio v-if="item.fileUrl" :src="item.fileUrl" controls></audio>
      </div>
    </div>
    <div class="coursePreviewVideo">
      <p>章节图片：</p>
      <div v-for="(item ,index ) in imgList" :key="index">
        <img
          width="100%"
          :src="item.fileUrl"
          alt
          style="width:150px;height:150px;margin:20px 20px 20px 0;float:left"
        />
      </div>
    </div>
    <div class="coursePreviewVideo" style="clear:both">
      <p>章节书评文件：</p>
      <el-table
        size="small"
        :data="bookReviewList"
        border
        element-loading-text="拼命加载中"
        style="width: 701px;margin-left:100px;margin:20px 0;"
      >
        <el-table-column align="center" prop="coursePicUrl" label="书评图片" width="400">
          <template slot-scope="scope">
            <img :src="scope.row.bookReviewimgUrl" alt class="bookReviewimgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="bookReviewfilename" label="书评文件名" width="300"></el-table-column>
      </el-table>
    </div>
     <div class="coursePreviewVideo" style="clear:both">
      <p>章节电子书文件：</p>
      <el-table
        size="small"
        :data="elBookList"
        border
        element-loading-text="拼命加载中"
        style="width: 1001px;margin-left:100px;margin:20px 0;"
      >
        <el-table-column align="center" prop="coursePicUrl" label="电子书图片" width="400">
          <template slot-scope="scope">
            <img :src="scope.row.elBookimgUrl" alt class="elBookimgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="elBookfilename" label="电子书文件名" width="300"></el-table-column>
        <el-table-column align="center" prop="elBookfileUrl" label="电子书地址" width="300"></el-table-column>
      </el-table>
    </div>
    <div class="coursePreviewVideo">
      <p class="title">章节练习题:</p>

      <p v-for="(item ,index) in chapterExercisesList" :key="index">题目：{{item.exercisestName}}</p>
    </div>
  </div>
</template>
<script>
import { courseChapterDetail, chapterExercisesGet } from "@/api/getData";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import { videoUrl, imgUrl, imagesUrl } from "@/config/env";
export default {
  data() {
    return {
      videoUrl: videoUrl,
      imgUrl: imgUrl,
      imagesUrl: imagesUrl,
      courseChapter: "",
      annexList: "",
      voiceList: "",
      imgList: "",
      videoList: "",
      chapterExercisesList: "",
      form: {
        chapterId: "" //章节id
      },
      bookReviewList: [],
      elBookList: [],
      Exercisesform: {
        courseChapterId: "" //章节id
      },
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
      course: {},
      chapter: {}
    };
  },
  // 注册组件
  components: {
    videoPlayer
  },
  created() {
    var data = this.$route.query;
    console.log("章节详情query", data);
    this.form.chapterId = data.chapterId;
    this.Exercisesform.courseChapterId = data.chapterId;
    this.course = data.course;
    this.chapter = data.chapter;
  },
  mounted() {
    this.getChapter();
    this.getChapterExercises();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/chapter",
        query: {
          course: this.course,
          chapter: this.chapter
        }
      });
    },
    // 获取章节信息详情
    async getChapter() {
      try {
        const res = await courseChapterDetail(this.form.chapterId);
        if (res.status == 200) {
          console.log("章节信息详情", res.data);
          var courseChapter = res.data.courseChapter;
          // 章节名称和顺序
          this.courseChapter = courseChapter;
          // 章节书评文件
          var bookReviewList = courseChapter.bookReview;
          console.log(bookReviewList);
          if (bookReviewList != "" && bookReviewList != null) {
            this.bookReviewList = $.parseJSON(bookReviewList);
          }
          console.log("bookReviewList", this.bookReviewList);
          // 章节电子书文件
          var elBookList = courseChapter.elBook;
          console.log(elBookList);
          if (elBookList != "" && elBookList != null) {
            this.elBookList = $.parseJSON(elBookList);
          }
          console.log("elBookList", this.elBookList);
          // 章节音频
          if (res.data.audioList.length != 0) {
            this.voiceList = res.data.audioList;
            this.audioUrl = this.voiceList[0].fileUrl;
            console.log("章节音频", this.voiceList);
          }

          // 章节图片
          if (res.data.imgList.length != 0) {
            this.imgList = res.data.imgList;
            console.log("章节图片", this.imgList);
          }

          // 章节视频
          if (res.data.videoList.length != 0) {
            this.videoList = res.data.videoList;
            var fileUrl = this.videoList[0].fileUrl;
            if (fileUrl.indexOf(".") > 0) {
              this.playerOptions.sources = this.videoList[0].fileUrl;
            }
            console.log("章节视频", this.videoList);
          }
          res.data.videoList.forEach(item => {
            console.log(item);
            if (item.fileUrl.indexOf(".") > 0) {
              console.log(1);
              item.type = 1;
            } else {
              console.log(0);
              item.type = 0;
            }
          });
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
    async getChapterExercises() {
      try {
        this.listLoading = true;
        const res = await chapterExercisesGet(this.Exercisesform);
        if (res.status == 200) {
          console.log("练习列表", res.data);
          this.chapterExercisesList = res.data.list;
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
    bofang(e) {
      console.log(e);
      this.playerOptions.sources = e;
    }
  }
};
</script>
<style scoped>
.courseDetailList {
  width: 80%;
  height: 20px;
}
.courseDetailList li {
  min-width: 200px;
  float: left;
  list-style: none;
}
.classIntroduce {
  width: 600px;
  margin-bottom: 50px;
}
.coursePicUrl {
  width: 600px;
  margin: 20px 0 20px 40px;
}
.coursePicUrl img {
  width: 600px;
  height: 200px;
}
.twoCodeImg {
  margin: 20px 0 20px 40px;
}
.twoCodeImg img {
  width: 178px;
  height: 178px;
}
.coursePreviewVideo {
  margin: 20px 0 20px 40px;
}

.elBookimgUrl,.bookReviewimgUrl {
  width: 350px;
  height: 132px;
}
</style>
