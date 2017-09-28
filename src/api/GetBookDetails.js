/* 作者：平原
 * 创建：2017-7-26 */

import Request from '../utils/request'
import Store from '../vuex/store'

export default async (bookId) => {
  try {
    if (!bookId) {
      throw new Error('api: "GetBookDetails.js" param "bookId" error')
    }

    let res = await Request.get({
      url: `//libgen.xinshengdaxue.com/papers/${bookId}`
    })

    if (res.code && res.code === 1) {
      return Promise.resolve(res.result)
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
