<!-- header组件
     作者：平原
     创建：2017-5-25 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <transition name="from-top">
  <div class="header_pannel">
    <div
      :style="{ marginLeft: '-' + fixedScrollOffset + 'px' }"
      class="header">
      <div class="search pull_left">
        <span @click="searchItem()" class="icon-search">&nbsp;</span>
        <input
          v-model="searchVal"
          :placeholder="withTopicId ? 'Search from this topic...' : 'Search from all books...'" 
          type="text" class="no_warp">
        <a
          @click="showSearchFieldsList = !showSearchFieldsList"
          class="search_fields">
          <span class="icon-arrow-left2"></span>
          {{ searchFields }}
        </a>
        <transition name="fade">
          <ul
            v-if="showSearchFieldsList"
            class="search_fields_list">
            <li
              @click="searchWithTopicId()"
              class="search_fields_at">
              <span :class="withTopicId ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked'"></span>
              Search From This Topic
            </li>

            <li
              v-for="(item, index) in searchFieldsList"
              :key="index"
              @click="selectSearchField(index)"
              class="search_fields_list_item">
              {{ index }}
            </li>
          </ul>
        </transition>
      </div>
      <div class="logout pull_right" @click="logout()">
        <span class="icon-switch"></span>
        <span class="text">Sign Out</span>
      </div>
      <div class="username pull_right">
        <span>{{ username }}</span>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
  import Storage from '../../../utils/storage'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        fixedScrollOffset: 0,
        username: Storage.get('_user_name'),
        searchVal: '',
        searchFields: 'Title',
        searchFieldsList: {
          'Title': 'title',
          'Author(s)': 'authors',
          'Publisher': 'publisher',
          'Year': 'year'
        },
        showSearchFieldsList: 0,
        withTopicId: 0,
        topicIdBk: ''
      }
    },

    computed: mapState({
      isLogin: state => state.login.isLogin,
      searchContent: state => state.content.searchContent,
      topicId: state => state.content.topicId,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      searchContent (val) {
        this.searchVal = val.searchVal
        this.searchFields = val.searchFields
        if (!val.withTopicId) {
          this.$store.dispatch('initBreadcrumb', {
            firstLevel: 'Search: ',
            secondLevel: this.searchVal
          })
        }
      },

      topicId (val) {
        if (val) this.topicIdBk = val
      },

      eventEmitter (val) {
        if (val.event === 'clearSearchVal') {
          this.searchVal = ''
        } else if (val.event === 'clickBody') {
          this.showSearchFieldsList = 0
        }
      }
    },

    mounted () {
      window.addEventListener('scroll', () => {
        this.fixedScrollOffset = window.scrollX
      })
    },

    methods: {
      searchItem () {
        if (!this.searchVal) return
        this.$router.push('topic')
        this.$store.dispatch('search', {
          searchVal: this.searchVal,
          searchFields: this.searchFields
        })
        let searchData = {
          page: 1,
          limit: 25,
          search: this.searchVal,
          searchFields: this.searchFieldsList[this.searchFields]
        }
        if (this.withTopicId) {
          searchData.topicId = this.topicId
        }
        this.$store.dispatch('getBooksList', searchData)
        this.searchVal = ''
      },

      selectSearchField (name) {
        this.searchFields = name
        this.showSearchFieldsList = 0
      },

      searchWithTopicId () {
        this.withTopicId = !this.withTopicId
        this.$store.dispatch('searchWithTopicId', this.withTopicId)

        // 如果在全局搜索以后点击search from this topic
        // 此时topicId未定义，要告诉Nav重新拉去此前的列表
        // 在此之前要备份一个topicId
        if (!this.topicId && this.withTopicId) {
          this.$store.dispatch('eventEmitter', { event: 'getBooksList', data: this.topicIdBk })
        }
      },

      logout (confirm) {
        let self = this
        this.$store.dispatch('boxyConfirm', {
          message: 'You want to sign out?',
          callback () {
            self.$store.dispatch('logout')
          }
        })
      }
    }
  }
</script>
