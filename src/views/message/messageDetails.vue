<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
        <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息列表</el-breadcrumb-item>
        <el-breadcrumb-item>消息详情</el-breadcrumb-item>
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
            <el-form-item label="企业名称：" prop="enterPriseNameCourse" >
                {{usersdetail.enterPriseNameCourse}}
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
                {{usersdetail.isSubscribe}}
            </el-form-item>
            <el-form-item label="注册时参与的活动：" prop="registered_activity" :class="usersdetail.registered_activity==null?'mywarning':''">
                {{usersdetail.registered_activity==null?'暂无信息':usersdetail.registered_activity}}
            </el-form-item>
            <el-form-item label="注册途径：" prop="registered_way" :class="usersdetail.registered_way==null?'mywarning':''">
                {{usersdetail.registered_way==null?'暂无信息':usersdetail.registered_way}}
            </el-form-item>
            <el-form-item label="vip到期时间：" prop="studentIdentityOverdueTime" >
                <el-date-picker
                    v-model="usersdetail.studentIdentityOverdueTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="积分：" prop="studentPoints" >
                <el-input
                 type="number"
                 v-model="usersdetail.studentPoints"
                 style="width:150px"
                 :min="0"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="danger" style="margin: 10px 0;" @click="savechange">保存</el-button>
            </el-form-item>
            
        </el-form>


    </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import { changejifen } from "@/api/getData";
import "video.js/dist/video-js.css";
export default {
    data(){
        return{
            listLoading: false, //是显示加载
            usersdetail:{},//用户详情
            changelist:{}
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
        //保存
        async savechange(){
            if(this.usersdetail.studentIdentityOverdueTime==''||this.usersdetail.studentIdentityOverdueTime==null){
                alert('会员到期时间不能为空')
                return
            }
            var createTime = new Date(this.usersdetail.createTime);
            var studentIdentityOverdueTime = new Date(this.usersdetail.studentIdentityOverdueTime);
            var ct = createTime.getTime()
            var st = studentIdentityOverdueTime.getTime()
            if(ct>st){
                alert('会员到期时间不能早于注册时间')
                return
            }
            if(this.usersdetail.studentPoints<0){
                alert('积分不能为负1')
                return
            }
            this.changelist ={
                studentId:this.usersdetail.studentId,
                studentIdentityOverdueTime:this.usersdetail.studentIdentityOverdueTime,
                studentPoints:this.usersdetail.studentPoints,
            }
            console.log(this.changelist)
            try {
                const res = await changejifen(this.changelist);
                console.log(res)
                if(res.status==200){
                    if(res.data== "修改成功"){
                        alert("修改成功")
                    }
                }

            }catch (err) {
                this.$message({
                type: "error",
                message: "请重试"
                });
                console.log(err);
            }
        }
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