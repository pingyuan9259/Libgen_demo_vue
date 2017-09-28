/* vuex入口
 * 作者：平原
 * 包含：状态初始化中间件
 * 2017-5-31 */

import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

// modules
import global from './modules/global'
import common from './modules/common'
import login from './modules/login'
import boxy from './modules/boxy'
import content from './modules/content'

Vue.use(Vuex)

// 初始化状态树
// dispatch: Container.vue --> routerChanged
const initState = store => {
  store.hotUpdate({
    mutations: {
      INIT_STATE (state) {
        // for (let i in state) {
        //   if (i === 'iso' || i === 'global' || i === 'login' || i === 'boxy') continue
        //   // 暂时先不加缓存
        //   // let _i = state[i]
        //   // let cache = state[i].cache
        //   state[i] = _.cloneDeep(state.iso[i])
        //   // state[i].cache = _.merge(cache, _i)
        // }
      }
    },

    actions: {
      initState ({ commit }) {
        commit('INIT_STATE')
      }
    }
  })

  const newState = Object.assign(store.state, {
    iso: _.cloneDeep(store.state)
  })
  store.replaceState(newState)
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    global,
    common,
    login,
    boxy,
    content
  },
  plugins: [initState],
  strict: debug
})
