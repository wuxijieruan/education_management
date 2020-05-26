<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;">
        <el-breadcrumb-item>作业管理</el-breadcrumb-item>
        <el-breadcrumb-item>作业列表</el-breadcrumb-item>
        <el-breadcrumb-item>作业详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button size="small" type="danger" style="margin: 20px 0;" @click="backback">返回列表</el-button>
         <el-button
              size="small"
              style="margin-left:10px"
              @click="courseSetTop(scope.row.courseId)"
            >导出</el-button>


    </div>
</template>

<script>
export default {
    data(){
        return{
            listLoading: false, //是显示加载
            homeworkdetail:"",//这作业详情
        }
    },
    mounted(){
        var data = this.$route.query;
        console.log("作业详情query", data);
        this.homeworkdetail=data.homework
        console.log("作业详情", this.homeworkdetail);

    },
    methods:{
        backback() {
            this.$router.push({
                path: "/homework",
                query: {
                // courseData: this.courseData
                }
            });
        },
    }
}
</script>