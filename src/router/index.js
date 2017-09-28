/* 路由配置
 * 作者：平原
 * 创建：2017-5-27 */

import Vue from 'vue'
import Router from 'vue-router'
import DataTable from '../components/modules/DataTable/'
import BookDetails from '../components/modules/BookDetails/'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/topic',
      component: DataTable,
      alias: '/'
    },
    {
      path: '/details',
      component: BookDetails
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
  } else {
    next()
  }
})

export default router
