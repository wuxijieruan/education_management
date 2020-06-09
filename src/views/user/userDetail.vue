<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button size="small" type="danger" style="margin: 20px 0;" @click="backback">返回列表</el-button>

        <el-form label-width="200px" :v-model="usersdetail" ref="form" element-loading-text="拼命加载中">
            <el-form-item label="宝贝昵称：" prop="studentName" v-show="usersdetail.studentName">
                {{usersdetail.studentName}}
            </el-form-item>
            <el-form-item label="年龄：" prop="studentAge" >
                {{usersdetail.studentAge}}
            </el-form-item>
            <el-form-item label="性别：" prop="studentSex" :class="usersdetail.studentSex==null?'mywarning':''">
                {{usersdetail.studentSex==null?'暂无信息':(usersdetail.studentSex==0?'男':'女')}}
            </el-form-item>
            <el-form-item label="用户身份：" prop="studentIdentity" >
                {{usersdetail.studentIdentity}}
            </el-form-item>
            <el-form-item label="电话：" prop="phone" >
                 {{usersdetail.phone}}
            </el-form-item>
            <el-form-item label="注册时间：" prop="createTime" >
                {{usersdetail.createTime}}
            </el-form-item>
            <el-form-item label="回访邀请：" prop="isAcceptReturn" :class="usersdetail.isAcceptReturn==null?'mywill':''">
                {{usersdetail.isAcceptReturn==null?'未邀请':(usersdetail.isAcceptReturn==1?'接受':'拒绝')}}
            </el-form-item>
            <el-form-item label="是否订阅模板消息：" prop="is_subscribe" >
                {{usersdetail.is_subscribe==null?'暂无信息':(usersdetail.is_subscribe==1?'接受':'拒绝')}}
            </el-form-item>
            <el-form-item label="注册时参与的活动：" prop="registered_activity" :class="usersdetail.registered_activity==null?'mywarning':''">
                {{usersdetail.registered_activity==null?'暂无信息':usersdetail.registered_activity}}
            </el-form-item>
            <el-form-item label="注册途径：" prop="registered_way" :class="usersdetail.registered_way==null?'mywarning':''">
                {{usersdetail.registered_way==null?'暂无信息':usersdetail.registered_way}}
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
            usersdetail:{},//这作业详情
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
        console.log("用户详情query", data);
        this.usersdetail=data.users
        console.log("用户详情", this.usersdetail);
        

    },
    methods:{
        backback() {
            this.$router.push({
                path: "/user",
                query: {
                // courseData: this.courseData
                }
            });
        },
    }
}
</script>

<style scoped>
.mywarning{
    color: red;
}
.mywill{
    color: aquamarine;
}
</style>