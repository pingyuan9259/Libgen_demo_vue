<!-- 数据表组件
     作者：平原
     创建：2017-7-26 -->

<style lang="scss">
  @import "./index";
</style>

<template>
<transition name="fade">
  <div v-if="loaded" class="data_table">
    <div class="table_info">
      <div class="breadcrumb">
        <span class="first_level">{{ breadcrumb.firstLevel }}</span>
        <span class="second_level no_warp">{{ breadcrumb.secondLevel }}</span>
        <a
          v-if="searchContent.searchVal"
          @click="searchBack()"
          class="back">Back</a>
      </div>

      <p class="count pull_right">
        <span>{{ searchTotal }}</span>
        &nbsp;books found
      </p>

    </div>

    <transition name="fade">
    <table>
      <tr
        @click="sortList($event.target)"
        class="table_head">
        <th>
          <span
            :class="{ 'bold': sort.order && sort.sort === 'id' }"
            title="id">Id</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'id'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th>
          <span
            :class="{ 'bold': sort.order && sort.sort === 'authors' }"
            title="authors">Author(s)</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'authors'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th>
          <span
            :class="{ 'bold': sort.order && sort.sort === 'title' }"
            title="title">Title</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'title'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th>
          <span
            :class="{ 'bold': sort.order && sort.sort === 'publisher' }"
            title="publisher">Publisher</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'publisher'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th class="text_center">
          <span
            :class="{ 'bold': sort.order && sort.sort === 'year' }"
            title="year">Year</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'year'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th class="text_center">
          <span
            :class="{ 'bold': sort.order && sort.sort === 'pages' }"
            title="pages">Pages</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'pages'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th class="text_center">
          <span
            :class="{ 'bold': sort.order && sort.sort === 'language' }"
            title="language">Language</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'language'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th class="text_center">
          <span
            :class="{ 'bold': sort.order && sort.sort === 'size' }"
            title="size">Size</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'size'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
        <th class="text_center">
          <span
            :class="{ 'bold': sort.order && sort.sort === 'extension' }"
            title="extension">Extension</span>
          <transition name="fade-quick"><span
            v-if="sortLoading && sort.sort === 'extension'"
            class="icon-spinner8 rotate"></span></transition>
        </th>
      </tr>
      <tr
        v-for="(item, index) in books"
        :key="index"
        @click="selectItem($event.target, item.title, item._id)"
        class="table_item">
        <td>{{ item.id }}</td>
        <td class="bold search_item" title="authors" style="maxWidth: 20vw;">{{ item.authors || '-' }}</td>
        <td class="bold">{{ item.title }}</td>
        <td class="search_item" title="publisher" style="maxWidth: 25vw;">{{ item.publisher || '-' }}</td>
        <td class="search_item text_center" title="year">{{ item._year || '-' }}</td>
        <td class="text_center">{{ item.pages }}</td>
        <td class="search_item text_center" title="language">{{ item.language }}</td>
        <td class="text_center">{{ item._size }}</td>
        <td class="text_center">{{ item.extension }}</td>
      </tr>
    </table>
    </transition>

    <div v-if="books && !books.length" class="tip">
      <p>{{ 'No result match ' + breadcrumb.secondLevel }}</p>
    </div>

    <pagination :page-limit="25"></pagination>
  </div>
</transition>
</template>

<script>
  import Pagination from '../Pagination/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        showTable: 0,
        loaded: 0,
        sort: { order: '', sort: '' },
        sortLoading: 0
      }
    },

    components: {
      Pagination
    },

    computed: mapState({
      books: state => state.content.books,
      searchTotal: state => state.content.searchTotal,
      breadcrumb: state => state.content.breadcrumb,
      topicId: state => state.content.topicId,
      searchContent: state => state.content.searchContent,
      searchWithTopicId: state => state.content.searchWithTopicId
    }),

    mounted () {
      this.loaded = 1
    },

    methods: {
      selectItem (target, title, id) {
        if (target.className.indexOf('search_item') > -1) {
          this.$store.dispatch('search', {
            searchVal: target.innerText,
            searchFields: target.title,
            withTopicId: this.searchWithTopicId
          })
          let searchData = {
            page: 1,
            limit: 25,
            search: target.innerText,
            searchFields: target.title
          }
          if (this.searchWithTopicId) {
            searchData.topicId = this.topicId
          }
          this.$store.dispatch('getBooksList', searchData)
        } else {
          this.$router.push({
            path: 'details',
            query: { id: id }
          })
        }
      },

      async sortList (target) {
        if (this.sortLoading) return
        if (target.nodeName === 'SPAN') {
          this.sortLoading = 1
          if (this.sort.sort === target.title) {
            if (this.sort.order === '') {
              this.sort.order = 'desc'
            } else if (this.sort.order === 'desc') {
              this.sort.order = 'asc'
            } else if (this.sort.order === 'asc') {
              this.sort.order = ''
            }
          } else {
            this.sort.order = 'desc'
          }
          this.sort.sort = target.title
          await this.$store.dispatch('addSort', this.sort)
          await this.$store.dispatch('getBooksList', { page: 1, limit: 25, topicId: this.topicId })
          this.sortLoading = 0
        }
      },

      async searchBack () {
        await this.$store.dispatch('search', {
          searchVal: '',
          searchFields: 'Title'
        })
        this.$store.dispatch('eventEmitter', {
          event: 'getBooksList',
          data: this.topicId
        })
      }
    }
  }
</script>

