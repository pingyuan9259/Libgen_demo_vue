/* 作者：平原
 * 创建：2017-7-26 */

import Request from '../utils/request'
import Store from '../vuex/store'

export default async ({ page, limit, search, searchFields, topicId, order, sort }) => {
  try {
    if (!page || !limit) {
      throw new Error('api: "GetBooksList.js" params error')
    }

    let options = JSON.stringify({ topicId: topicId })
    let offset = (page - 1) * 10

    let searchConf = ''
    if (search) {
      searchFields = JSON.stringify([searchFields || ''])
      searchConf = `&search=${search}&search_fields=${searchFields}`
    }

    let sortConf = ''
    if (sort) {
      sortConf = `&sort=${sort}&order=${order}`
    }

    let res = await Request.get({
      url: `//libgen.xinshengdaxue.com/papers?page=${page}&offset=${offset}&options=${options}${sortConf}${searchConf}`
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
