/* 封装请求
 * 作者：张军祥
 * 创建：2017-6 */

import axios from 'axios'
import logger from './logger'
import cookie from './cookie'

export default {
  _checkParams (params) {
    if (!params.url) {
      throw new Error('无效的请求地址')
    }
  },

  _logError (data, url, type) {
    if (data.code === 0) {
      logger.error(`${url}'s request fail(${type}):`, data)
    }
  },

  _logFail (data, url, type) {
    logger.error(`${url}'s request fail(${type}):`, data)
  },

  get (params, token) {
    this._checkParams(params)
    return axios({
      method: 'get',
      url: params.url
    }).then((res) => {
      let data = res.data
      if (!cookie.getCookie('_login_token')) {
        data.need_login = 1
        data.message = 'Sign in time out.'
      }
      this._logError(data, params.url, 'get')
      return data
    }).catch((error) => {
      this._logFail(error.data, params.url, 'get')
    })
  }
}

