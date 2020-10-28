// 导入组件
import Vue from 'vue'
import Router from 'vue-router'

// 启用路由
Vue.use(Router)


const routes= [
  {
    path: '/',
    name: '登录',
    component: resolve => require(['@/views/login'], resolve),
    hidden: true,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/resetPassword',
    name: '修改密码',
    component: resolve => require(['@/views/resetPassword'], resolve),
    hidden: true,
    meta: {
      requireAuth: false,
      type: 'login'  // 是否需要判断是否登录,这里是需要判断
    }
  },
  {
    path: '/index',
    name: '首页',
    component: resolve => require(['@/views/index'], resolve),
    iconCls: 'el-icon-tickets',
    children: [
      {
        path: '/course',
        name: '课程列表',
        component: resolve => require(['@/views/course/course'], resolve),
        meta: {
          requireAuth: true,
          keepAlive: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/courseDetail',
        name: '课程详情',
        component: resolve =>
          require(['@/views/course/courseDetail'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/courseAdd',
        name: '课程添加',
        component: resolve =>
          require(['@/views/course/courseAdd'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/grade',
        name: '年龄段管理',
        component: resolve =>
          require(['@/views/group/grade'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/subject',
        name: '话题管理',
        component: resolve =>
          require(['@/views/group/subject'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/adminAdd',
        name: '新增管理员',
        component: resolve =>
          require(['@/views/admin/adminAdd'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/adminEdit',
        name: '编辑管理员',
        component: resolve =>
          require(['@/views/admin/adminEdit'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/adminList',
        name: '管理员列表',
        component: resolve =>
          require(['@/views/admin/adminList'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/taskList',
        name: '作业管理',
        component: resolve =>
          require(['@/views/task/taskList'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/taskDetial',
        name: '作业详情',
        component: resolve =>
          require(['@/views/task/taskDetial'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/courseAddA',
        name: '新增课程资源包',
        component: resolve =>
          require(['@/views/course/courseAddA'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/courseResourcesDetail',
        name: '课程资源包编辑',
        component: resolve =>
          require(['@/views/course/courseResourcesDetail'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/actList',
        name: '课程资源包编辑',
        component: resolve =>
          require(['@/views/act/actList'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/actAdd',
        name: '活动添加',
        component: resolve =>
          require(['@/views/act/actAdd'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/actEdit',
        name: '活动编辑',
        component: resolve =>
          require(['@/views/act/actEdit'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/actDetial',
        name: '活动详情',
        component: resolve =>
          require(['@/views/act/actDetial'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/homework',
        name: '作业列表',
        component: resolve => require(['@/views/homework/homework'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/homeworkDetail',
        name: '作业详情',
        component: resolve =>require(['@/views/homework/homeworkDetail'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/user',
        name: '用户列表',
        component: resolve => require(['@/views/user/user'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/userDetail',
        name: '用户详情',
        component: resolve =>require(['@/views/user/userDetail'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/platesCourseReView',
        name: '课程维度统计详情',
        component: resolve =>require(['@/views/statics/platesCourseReView'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/userStatic',
        name: '用户维度统计详情',
        component: resolve =>require(['@/views/statics/userStatic'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/newStatics',
        name: '新增人数统计',
        component: resolve =>require(['@/views/statics/newStatics'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/message',
        name: '消息列表',
        component: resolve =>require(['@/views/message/message'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/messageDetails',
        name: '消息详情',
        component: resolve =>require(['@/views/message/messageDetails'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
      {
        path: '/banner',
        name: '轮播图',
        component: resolve =>require(['@/views/banner/banner'], resolve),
        meta: {
          requireAuth: true,
          type: 'login'  // 是否需要判断是否登录,这里是需要判断
        }
      },
    ]
  }
]




// 导出路由
export default new Router({
  routes
})
