
<!-- 分页组件
     作者：平原
     创建：2017-5-8
     优化：2017-7-7 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div v-if="showPagination" class="pagination">
    <ul class="page-list">
      <li class="item">
        <a
          @click="jumpPage(1)"
          :class="{ 'disabled': preOrNext === -1 }"
          class="flip">
          <span class="icon-arrow-double-left2"></span>
        </a>
      </li>
      <li class="item">
        <a
          @click="prePage()"
          :class="{ 'disabled': preOrNext === -1 }"
          class="flip">
          <span class="icon-arrow-left2"></span>
        </a>
      </li>
      <li
        v-for="(item, index) of pageList"
        :key="index"
        class="item">
        <a  
          :class="item.active ? 'active' : ''" 
          @click="jumpPage(item.page)">
          {{item.page}}
        </a>
      </li>
      <li class="item">
        <a
          @click="nextPage()"
          :class="{ 'disabled': preOrNext === 1 }"
          class="flip">
          <span class="icon-arrow-right2"></span>
        </a>
      </li>
      <li class="item">
        <a
          @click="jumpPage(pageCount)"
          :class="{ 'disabled': preOrNext === 1 }"
          class="flip">
          <span class="icon-arrow-double-right2"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        pageList: [],
        showPagination: 0,
        curPage: 1,
        preOrNext: 0,
        pageCount: 0
      }
    },

    props: {
      pageLimit: {
        required: true,
        type: Number
      }
    },

    computed: mapState({
      pagination: state => state.common.pagination
    }),

    watch: {
      pagination (val) {
        let { showPagination, curPage, pageItem, preOrNext } = val
        this.showPagination = showPagination
        this.curPage = curPage
        this.preOrNext = preOrNext
        this.pageCount = pageItem.length
        this.init(pageItem)
      }
    },

    methods: {
      init (pageItem) {
        let index = this.curPage - 1
        let start = index - 4
        let end = index + 5
        if (start < 0) {
          start = 0
          end = 9
        }
        if (end - pageItem.length > 0 && index > 2) {
          start = start - (end - pageItem.length)
        }
        this.pageList = Object.assign([], pageItem.slice(start, end))
      },

      jumpPage (toPage) {
        if (this.curPage === toPage) return
        this.$store.dispatch('updatePage', toPage)
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 100)
      },

      prePage () {
        if (this.preOrNext === -1) return
        let targetPage = this.curPage - 1
        this.jumpPage(targetPage)
      },

      nextPage () {
        if (this.preOrNext === 1) return
        let targetPage = this.curPage + 1
        this.jumpPage(targetPage)
      }
    }
  }
</script>
