<!-- 数据表组件
     作者：平原
     创建：2017-7-26 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <transition name="fade">
  <div v-if="loaded" class="book_details">
    <div class="details_info">
      <h3 class="title">Book Information</h3>
    </div>
    <div class="main_page">
      <div class="banner">
        <a
          @click="$router.go(-1)"
          class="back">
          <span class="icon-arrow-left2"></span>
          back
        </a>
        <img v-lazy="'//o4a7cbihz.qnssl.com/picture/daddb268-f1a3-4abb-a765-fc9eafc1a1a8'" alt="">
        <h2 class="title">{{ bookDetails.title }}</h2>
        <p class="authors">{{ 'by ' + bookDetails.authors }}</p>
      </div>
      <div class="cover">
        <span class="icon-spinner8 rotate"></span>
        <img v-lazy="bookDetails.cover" alt="">
      </div>
      <div class="download">
        <a
          v-if="bookDetails.url"
          :href="bookDetails.url"
          class="download_now btn_solid">{{ 'Download (' + bookDetails._size + ')' }}</a>
        <a :href="bookDetails.downloadUrl" target="_blank" class="to_download btn_hollow">To Download Page</a>
      </div>
      <div class="details">
        <span class="line"></span>
        <ul class="details_info">
          <li v-if="bookDetails.ISBN">
            <span class="key_icon icon-barcode"></span>
            <span class="key">ISBN</span>
            <span class="value">{{ bookDetails.ISBN }}</span>
          </li>
          <li v-if="bookDetails.language">
            <span class="key_icon icon-keyboard2"></span>
            <span class="key">Language</span>
            <span class="value">{{ bookDetails.language }}</span>
          </li>
          <li v-if="bookDetails.publisher">
            <span class="key_icon icon-library2"></span>
            <span class="key">Publisher</span>
            <span class="value">{{ bookDetails.publisher }}</span>
          </li>
          <li v-if="bookDetails.year">
            <span class="key_icon icon-calendar"></span>
            <span class="key">Year</span>
            <span class="value">{{ bookDetails.year }}</span>
          </li>
          <li v-if="bookDetails.pages">
            <span class="key_icon icon-files-empty"></span>
            <span class="key">Pages</span>
            <span class="value">{{ bookDetails.pages }}</span>
          </li>
          <li v-if="bookDetails.periodical">
            <span class="key_icon icon-spinner11"></span>
            <span class="key">Periodical</span>
            <span class="value">{{ bookDetails.periodical }}</span>
          </li>
          <li v-if="bookDetails.city">
            <span class="key_icon icon-office"></span>
            <span class="key">City</span>
            <span class="value">{{ bookDetails.city }}</span>
          </li>
          <li v-if="bookDetails.volume">
            <span class="key_icon icon-headphones"></span>
            <span class="key">Volume</span>
            <span class="value">{{ bookDetails.volume }}</span>
          </li>
          <li v-if="bookDetails.createdAt">
            <span class="key_icon icon-folder-upload"></span>
            <span class="key">Time added</span>
            <span class="value">{{ bookDetails._createdAt }}</span>
          </li>
          <li v-if="bookDetails.updatedAt">
            <span class="key_icon icon-quill"></span>
            <span class="key">Time modified</span>
            <span class="value">{{ bookDetails._updatedAt }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
  import { getUrlQuery } from '../../../utils/enhance'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        bookId: getUrlQuery('id'),
        loaded: 0
      }
    },

    computed: mapState({
      bookDetails: state => state.content.bookDetails
    }),

    watch: {
    },

    mounted () {
      console.log(this.bookId)
      this.$store.dispatch('getBookDetails', this.bookId)
      this.loaded = 1
    },

    methods: {
    }
  }
</script>
