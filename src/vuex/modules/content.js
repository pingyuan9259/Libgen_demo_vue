/* topic状态机
 * 作者：平原
 * 2017-6-14 */

import GetTopics from '../../api/GetTopics'
import GetBooksList from '../../api/GetBooksList'
import GetBookDetails from '../../api/GetBookDetails'
import Logger from '../../utils/logger'
import { objKeySort, parseTime } from '../../utils/enhance'

const state = {
  topics: [],
  books: [],
  searchTotal: 0,
  topicId: '',
  breadcrumb: {},
  searchContent: {
    searchVal: '',
    searchFields: ''
  },
  searchWithTopicId: '',
  sort: {},
  bookDetails: {}
}

const mutations = {
  GET_TOPICS (state, topics) {
    state.topics = Object.assign({}, topics)
    console.log(topics)
  },

  GET_BOOKS_LIST (state, { books, data }) {
    for (let i in books) {
      let _i = books[i]
      let size = _i.size.split(' ')
      _i._size = size[0] + size[1]
      _i._year = Number(_i.year)
    }
    state.books = Object.assign([], books)
    state.searchTotal = data.total
    if (data.topicId) {
      state.topicId = data.topicId
    }
  },

  INIT_BREADCRUMB (state, data) {
    state.breadcrumb = Object.assign({}, data)
  },

  SEARCH (state, data) {
    state.searchContent = Object.assign({}, data)
  },

  SEARCH_WITH_TOPIC_ID (state, withTopicId) {
    state.searchWithTopicId = withTopicId
  },

  ADD_SORT (state, data) {
    state.sort = Object.assign({}, data)
  },

  GET_BOOK_DETAILS (state, bookDetails) {
    let size = bookDetails.size.split(' ')
    bookDetails._size = size[0] + size[1]
    bookDetails._createdAt = parseTime(bookDetails.createdAt, '{y}-{m}-{d} {h}:{i}')
    bookDetails._updatedAt = parseTime(bookDetails.updatedAt, '{y}-{m}-{d} {h}:{i}')
    state.bookDetails = Object.assign({}, bookDetails)
  }
}

const actions = {
  async getTopics ({ commit }) {
    try {
      let topics = await GetTopics()
      topics = objKeySort(topics)
      commit('GET_TOPICS', topics)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: 'Topics list require failed.' })
      Logger.error(err.message, 'action: content/getTopics')
    }
  },

  async getBooksList (context, data) {
    let commit = context.commit
    let state = context.state

    try {
      if (state.sort.order) {
        data.order = state.sort.order
        data.sort = state.sort.sort
      }
      let result = await GetBooksList(data)
      let books = result.rows
      data.total = result.total
      commit('GET_BOOKS_LIST', { books, data })
      commit('INIT_PAGINATION', data)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: 'Books list require failed.' })
      Logger.error(err.message, 'action: content/getBooksList')
    }
  },

  initBreadcrumb ({ commit }, data) {
    commit('INIT_BREADCRUMB', data)
  },

  search ({ commit }, data) {
    commit('SEARCH', data)
  },

  searchWithTopicId ({ commit }, withTopicId) {
    commit('SEARCH_WITH_TOPIC_ID', withTopicId)
  },

  addSort ({ commit }, data) {
    commit('ADD_SORT', data)
  },

  async getBookDetails ({ commit }, bookId) {
    try {
      let bookDetails = await GetBookDetails(bookId)
      commit('GET_BOOK_DETAILS', bookDetails)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: 'Book Details require failed.' })
      Logger.error(err.message, 'action: content/getBookDetails')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
