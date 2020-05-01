/**
* 头部菜单
*/ 
<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#334157"
    text-color="#fff"
    active-text-color="#fff"
  >
    <el-button class="buttonimg">
      <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)" alt />
    </el-button>
    <el-submenu index="2" class="submenu">
      <!-- <template slot="title">{{user.userRealName}}</template> -->
      <template slot="title">{{user.realName}}（{{user.userName}}）</template>
      <el-menu-item @click="resetPassword()" index="2-2">
        <i class="el-icon-edit-outline" style="color:white"></i>修改密码
      </el-menu-item>
      <el-menu-item @click="exit()" index="2-3">
        <i class="el-icon-switch-button" style="color:white"></i>退出
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
import { loginOut } from "../api/getData";
export default {
  name: "navcon",
  data() {
    return {
      nickname: "navcon",
      role: "",
      collapsed: true,
      imgshow: require("../assets/img/show.png"),
      imgsq: require("../assets/img/sq.png"),
      user: {}
    };
  },

  // 导航栏展示
  // beforeCreate () {
  //   this.$root.Bus.$emit('toggle', this.collapsed)
  // },

  // 创建完毕状态(里面是操作)
  created() {
    var userdata = JSON.parse(localStorage.userdata);
    this.user = userdata.loginUser;
  },
  mounted() {},
  methods: {
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype;
      this.$root.Bus.$emit("toggle", this.collapsed);
    },
    // 退出登录
    exit() {
      this.$confirm("确认要退出吗?", "提示", { type: "warning" })
        .then(async () => {
          this.$store.commit("logout", "false");
          this.$router.push({ path: "/" });
          // try {
          //   const res = await loginOut();
          //   if (res.status == 0) {
          //     this.$message({
          //       message: "已退出登录",
          //       type: "success"
          //     });
          //     this.$store.commit('logout', 'false')
          //     this.$router.push({ path: '/' })
          //   } else {
          //     this.$message({
          //       type: "error",
          //       message: res.error
          //     });
          //     console.log(res);
          //   }
          // } catch (err) {
          //   this.listLoading = false;
          //   this.$message({
          //     type: "error",
          //     message: "请重试"
          //   });
          //   console.log(err);
          // }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //修改密码
     resetPassword() {
      this.$router.push({ path: "/resetPassword" });
    },
  }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
</style>