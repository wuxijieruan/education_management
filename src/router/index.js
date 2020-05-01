// 导入组件
import Vue from 'vue'
import Router from 'vue-router'

// 启用路由
Vue.use(Router)

// 导出路由
export default new Router({
  routes: [
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
        requireAuth: false
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
            requireAuth: true
          }
        },
        {
          path: '/courseDetail',
          name: '课程详情',
          component: resolve =>
            require(['@/views/course/courseDetail'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/courseAdd',
          name: '课程添加',
          component: resolve =>
            require(['@/views/course/courseAdd'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/grade',
          name: '年龄段管理',
          component: resolve =>
            require(['@/views/group/grade'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/subject',
          name: '话题管理',
          component: resolve =>
            require(['@/views/group/subject'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/adminAdd',
          name: '新增管理员',
          component: resolve =>
            require(['@/views/admin/adminAdd'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/adminEdit',
          name: '编辑管理员',
          component: resolve =>
            require(['@/views/admin/adminEdit'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/adminList',
          name: '管理员列表',
          component: resolve =>
            require(['@/views/admin/adminList'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/taskList',
          name: '作业管理',
          component: resolve =>
            require(['@/views/task/taskList'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/taskDetial',
          name: '作业详情',
          component: resolve =>
            require(['@/views/task/taskDetial'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/courseAddA',
          name: '新增课程资源包',
          component: resolve =>
            require(['@/views/course/courseAddA'], resolve),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/courseResourcesDetail',
          name: '课程资源包编辑',
          component: resolve =>
            require(['@/views/course/courseResourcesDetail'], resolve),
          meta: {
            requireAuth: true
          }
        },
      ]
    }
  ]
})
