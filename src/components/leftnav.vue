/**
* 左边菜单
*/ 
<template>
  <el-menu
    :collapse="collapsed"
    collapse-transition
    router
    :default-active="$route.path"
    unique-opened
    class="el-menu-vertical-demo"
    background-color="#334157"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt />
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  name: "leftnav",
  data() {
    return {
      collapsed: false,
      allmenu: [],
      user: ""
    };
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.user = JSON.parse(localStorage.getItem("userdata"));
    // console.log("用户信息", this.user);
    if (this.user.loginUser.role == 1) {
      var res = {
        success: true,
        data: [
          {
            menuid: 2,
            icon: "li-icon-xiangmuguanli",
            menuname: "基本数据管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 22,
                icon: "icon-cat-skuQuery",
                menuname: "年龄段列表",
                hasThird: "N",
                url: "grade",
                menus: null
              },
              {
                menuid: 23,
                icon: "icon-cat-skuQuery",
                menuname: "话题列表",
                hasThird: "N",
                url: "subject",
                menus: null
              }
            ]
          },
          {
            menuid: 1,
            icon: "li-icon-xiangmuguanli",
            menuname: "课程管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 11,
                icon: "icon-cat-skuQuery",
                menuname: "课程列表",
                hasThird: "N",
                url: "course",
                menus: null
              }
            ]
          },
          {
            menuid: 3,
            icon: "li-icon-xiangmuguanli",
            menuname: "管理员管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 32,
                icon: "icon-cat-skuQuery",
                menuname: "管理员列表",
                hasThird: "N",
                url: "adminList",
                menus: null
              }
            ]
          },
          {
            menuid: 4,
            icon: "li-icon-xiangmuguanli",
            menuname: "互动管理",
            hasThird: null,
            url: null,
             menus: [
              {
                menuid: 32,
                icon: "icon-cat-skuQuery",
                menuname: "互动审核",
                hasThird: "N",
                url: "taskList",
                menus: null
              }
            ]
          },
          {
            menuid: 5,
            icon: "li-icon-xiangmuguanli",
            menuname: "活动管理",
            hasThird: null,
            url: null,
             menus: [
              {
                menuid: 51,
                icon: "icon-cat-skuQuery",
                menuname: "活动列表",
                hasThird: "N",
                url: "actList",
                menus: null
              }
            ]
          },
          {
            menuid: 6,
            icon: "li-icon-xiangmuguanli",
            menuname: "作业管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 61,
                icon: "icon-cat-skuQuery",
                menuname: "作业列表",
                hasThird: "N",
                url: "homework",
                menus: null
              }
            ]
          },
          {
            menuid: 7,
            icon: "li-icon-xiangmuguanli",
            menuname: "用戶管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 71,
                icon: "icon-cat-skuQuery",
                menuname: "用戶列表",
                hasThird: "N",
                url: "user",
                menus: null
              }
            ]
          },
          {
            menuid: 8,
            icon: "li-icon-xiangmuguanli",
            menuname: "统计管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 81,
                icon: "icon-cat-skuQuery",
                menuname: "课程维度",
                hasThird: "N",
                url: "platesCourseReView",
                menus: null
              },
              {
                menuid: 82,
                icon: "icon-cat-skuQuery",
                menuname: "用户维度",
                hasThird: "N",
                url: "userStatic",
                menus: null
              },
              {
                menuid: 83,
                icon: "icon-cat-skuQuery",
                menuname: "新增人数统计",
                hasThird: "N",
                url: "newStatics",
                menus: null
              },
            ]
          },
          {
            menuid: 9,
            icon: "li-icon-xiangmuguanli",
            menuname: "消息管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 91,
                icon: "icon-cat-skuQuery",
                menuname: "消息列表",
                hasThird: "N",
                url: "message",
                menus: null
              }
            ]
          },
          // {
          //   menuid: 10,
          //   icon: "li-icon-xiangmuguanli",
          //   menuname: "轮播图管理",
          //   hasThird: null,
          //   url: null,
          //   menus: [
          //     {
          //       menuid: 101,
          //       icon: "icon-cat-skuQuery",
          //       menuname: "轮播图列表",
          //       hasThird: "N",
          //       url: "banner",
          //       menus: null
          //     }
          //   ]
          // },
        ],
        msg: "success"
      };
    } else {
      var res = {
        success: true,
        data: [
          {
            menuid: 2,
            icon: "li-icon-xiangmuguanli",
            menuname: "年龄段管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 22,
                icon: "icon-cat-skuQuery",
                menuname: "年龄段管理",
                hasThird: "N",
                url: "grade",
                menus: null
              },
              {
                menuid: 23,
                icon: "icon-cat-skuQuery",
                menuname: "话题管理",
                hasThird: "N",
                url: "subject",
                menus: null
              }
            ]
          },
          {
            menuid: 1,
            icon: "li-icon-xiangmuguanli",
            menuname: "课程管理",
            hasThird: null,
            url: null,
            menus: [
              {
                menuid: 11,
                icon: "icon-cat-skuQuery",
                menuname: "课程列表",
                hasThird: "N",
                url: "course",
                menus: null
              }
            ]
          }
        ],
        msg: "success"
      };
    }

    this.allmenu = res.data;

    // 监听
    this.$root.Bus.$on("toggle", value => {
      this.collapsed = !value;
    });
  }
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>