/* 登录相关状态机
 * 原作：刘政
 * 重构：平原
 * 2017-6 */

import Cookie from '../../utils/cookie'
import Storage from '../../utils/storage'
import base64 from '../../utils/base64'
import { TOP_LEVEL_HOST } from '../../config'
import account from '../../config/account'

const state = {
  isLogin: false
}

const mutations = {
  LOGIN_STATUS (state, flag) {
    if (!flag) {
      Storage.clear()
      Cookie.delCookie('_login_token', TOP_LEVEL_HOST)
    }
    state.isLogin = flag
  }
}

const actions = {
  // 登录成功
  loginSuccess ({ commit }) {
    commit('LOGIN_STATUS', true)
  },

  // 退出登录
  logout ({ commit }) {
    commit('LOGIN_STATUS', false)
  },

  login ({ commit }, data) {
    let username = base64.decode(data.username)
    let password = base64.decode(data.password)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (account[username] === password) {
          Cookie.setCookie('_login_token', data.username + data.password, TOP_LEVEL_HOST, 1)
          if (data.saveLoginStatus) {
            Cookie.setCookie('_login_token', data.username + data.password, TOP_LEVEL_HOST, 7)
          }
          Storage.set('_user_name', username)
          commit('LOGIN_STATUS', true)
        } else {
          commit('BOXY_SHOW', { type: 'tip', message: 'Please check your account,\n and try again.' })
        }
        resolve()
      }, 700)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
