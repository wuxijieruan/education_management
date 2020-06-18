// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
// 引入路由
import router from './router/index';
// 引入状态管理
import store from './vuex/store';
// 引入icon
import './assets/icon/iconfont.css'

import 'jquery'

// 配置百度编辑器

import Blob from './excel/Blob.js'
import Export2Excel from './excel/Export2Excel.js'

import Print from 'vue-print-nb'
Vue.use(Print); //注册

import 'babel-polyfill'

Vue.config.productionTip = false;

// 使用element UI
Vue.use(ElementUI);
// 过滤器
import * as custom from './utils/util'

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})

router.beforeEach((to, from, next) => {
  　　console.log("from",from)
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  　　let toDepth = to.path.split('/').length
      let fromDepth = from.path.split('/').length
      if (toDepth < fromDepth) {
        console.log('back...')
        from.meta.keepAlive = false
        to.meta.keepAlive = true
      }
  　　next();
  });

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //使用store vuex状态管理
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})