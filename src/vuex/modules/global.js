/* 全局状态机
 * 作者：平原
 * 2017-6-14 */

const state = {
  isPc: true,
  eventEmitter: {},
  redirect: ''
}

const mutations = {
  EVENT_EMITTER (state, data) {
    state.eventEmitter = Object.assign({}, data)
  },

  IS_PC (state, flag) {
    state.isPc = flag
  },

  REDIRECT (state, data) {
    state.redirect = data
  }
}

const actions = {
  // 依照业务层的错误信息进行相关操作
  requestFail ({ commit }, res) {
    commit('BOXY_SHOW', { type: 'tip', message: res.message })

    // 登录超时
    if (res.need_login === 1) {
      commit('REDIRECT', '/')
      commit('LOGIN_STATUS', false)
    }
  },

  // 全剧消息广播
  eventEmitter ({ commit }, { event, data }) {
    try {
      if (!event && typeof event !== String) {
        throw new Error('action[eventEmitter]只接收字符串格式的消息类型！')
      }
      commit('EVENT_EMITTER', { event, data })
    } catch (err) {
      console.log(err)
    }
  },

  // 判断浏览设备
  getPcFlag ({ commit }) {
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let item of Agents) {
      if (userAgentInfo.indexOf(item) > 0) {
        flag = false
        break
      }
    }
    commit('IS_PC', flag)
  }
}

export default {
  state,
  mutations,
  actions
}
