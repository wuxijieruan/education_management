<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
        <el-breadcrumb-item>作业管理</el-breadcrumb-item>
        <el-breadcrumb-item>作业列表</el-breadcrumb-item>
        <el-breadcrumb-item>作业详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button size="small" type="danger" style="margin: 20px 0;" @click="backback">返回列表</el-button>

        <el-form label-width="200px" :model="homeworkdetail" ref="form" element-loading-text="拼命加载中">
            <el-form-item label="活动名称：" prop="activityName" v-show="homeworkdetail.activityName">
                {{homeworkdetail.activityName}}
            </el-form-item>
            <el-form-item label="课程名称：" prop="courseName" v-show="homeworkdetail.courseName">
                {{homeworkdetail.courseName}}
            </el-form-item>
            <el-form-item label="宝贝昵称：" prop="studentName" v-show="homeworkdetail.studentName">
                {{homeworkdetail.studentName}}
            </el-form-item>
              <el-form-item label="用户身份：" prop="studentIdentity" v-show="homeworkdetail.studentIdentity">
                {{homeworkdetail.studentIdentity}}
            </el-form-item>
                <el-form-item label="企业名称：" prop="enterpriseName" v-show="homeworkdetail.enterpriseName">
                {{homeworkdetail.enterpriseName}}
            </el-form-item>
            <el-form-item label="年龄：" prop="studentAge" >
                {{homeworkdetail.studentAge}}
            </el-form-item>
            <el-form-item label="作业留言：" prop="answerTest" v-show="homeworkdetail.answerTest">
                {{homeworkdetail.answerTest}}
            </el-form-item>
            <el-form-item label="作业图片：" prop="answerImg" v-show="homeworkdetail.answerImg">
                 <img style="max-width: 100%; max-height: 200px;" :src="homeworkdetail.answerImg" />
            </el-form-item>
            <el-form-item label="作业音频：" prop="answerVoice" v-show="homeworkdetail.answerVoice">
                 <audio
                    v-if="homeworkdetail.answerVoice"
                    :src="homeworkdetail.answerVoice"
                    controls
                    style="margin-left:20px;margin-bottom: 20px;"
                ></audio>
            </el-form-item>
            <el-form-item label="作业视频：" prop="answerVideo" v-show="homeworkdetail.answerVideo">
                 <video-player
                    class="video-player"
                    ref="answerVideo"
                    :playsinline="true"
                    :options="playerOptions"
                    v-if="homeworkdetail.answerVideo"
                    style="margin-left:50px;margin-bottom: 20px;"
                ></video-player>
            </el-form-item>
            <el-form-item label="作业日期：" prop="createTime" v-show="homeworkdetail.createTime">
                {{homeworkdetail.createTime}}
            </el-form-item>
        </el-form>


    </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
export default {
    data(){
        return{
            listLoading: false, //是显示加载
            homeworkdetail:{},//这作业详情
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
        }
    },
    components: {
        videoPlayer
    },
    mounted(){
        var data = this.$route.query;
        console.log("作业详情query", data);
        this.homeworkdetail=data.homework
        console.log("作业详情", this.homeworkdetail);
        if(this.homeworkdetail.answerVideo){
            this.playerOptions.sources=this.homeworkdetail.answerVideo
        }
        

    },
    methods:{
        backback() {
           this.$router.go(-1);
        },
    }
}
</script>