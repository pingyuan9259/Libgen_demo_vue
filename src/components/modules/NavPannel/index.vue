<!-- 侧边栏导航组件
     作者：平原
     创建：2017-7-26 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div 
    :style="{ marginLeft: '-' + fixedScrollOffset + 'px' }"
    class="nav_pannel">
    <div class="logo">
      <img src="//o4a7cbihz.qnssl.com/picture/498c93b0-8e17-45d1-bf60-afda2e5d7e5d">
    </div>

    <h3 class="title">
      <span class="icon-radio-checked2"></span>
      Topic
    </h3>

    <div class="first_nav_list">
      <ul>
        <li
          v-for="(item, index) in topics"
          :key="index"
          @click="updateSecondTopics(index)"
          :class="{ 'active': showSecondTopic === index }"
          class="first_nav_item">
          <span>{{ index }}</span>
        </li>
      </ul>
      <div class="hidden_block"></div>
    </div>

    <div 
      :class="{
        'second_nav_active': showSecondTopic === secondTopics.topicName,
        'second_nav_selected': activeTopics > -1
      }"
      class="second_nav_list">
      <ul>
        <li
          v-for="(item, index) in secondTopics.list"
          :key="index"
          @click="selectSecondTopic(secondTopics.topicName, item.subName, index, item._id)"
          :class="{ 'active': activeTopics === index }"
          class="second_nav_item">
          <span>{{ item.subName }}</span>
        </li>
      </ul>
      <div class="hidden_block"></div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        fixedScrollOffset: 0,
        secondTopics: {},
        showSecondTopic: '',
        activeTopics: -1,
        selectedTopic: {
          firstLevel: '',
          secondLevel: -1
        },
        curTopicId: '',
        timer: null,
        loaded: 0
      }
    },

    computed: mapState({
      topics: state => state.content.topics,
      curPage: state => state.common.curPage,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      curPage (val) {
        this.$store.dispatch('getBooksList', { page: val, limit: 25, topicId: this.curTopicId })
      },

      eventEmitter (val) {
        let {event} = val
        if (event === 'clickBody' && this.activeTopics === -1) {
          this.showSecondTopic = ''
          if (this.selectedTopic.firstLevel) {
            this.updateSecondTopics(this.selectedTopic.firstLevel)
          }
          if (this.selectedTopic.secondLevel > -1) {
            this.activeTopics = this.selectedTopic.secondLevel
          }
        } else if (event === 'getBooksList') {
          let topicId = val.data
          this.$store.dispatch('getBooksList', {
            page: 1,
            limit: 25,
            topicId: topicId
          })
          let firstLevel = ''
          let secondLevel = ''
          for (let i in this.topics) {
            let _i = this.topics[i]
            for (let j in _i) {
              let _j = _i[j]
              if (_j._id === topicId) {
                firstLevel = i
                secondLevel = _j.subName
              }
            }
          }
          this.$store.dispatch('initBreadcrumb', {
            firstLevel: firstLevel + ' / ',
            secondLevel: secondLevel
          })
        }
      }
    },

    async created () {
      try {
        await this.$store.dispatch('getTopics')
        let initFirstTopic = Object.keys(this.topics)[0]
        let initSecondTopic = this.topics[initFirstTopic][0].subName
        let initTopicId = this.topics[initFirstTopic][0]._id

        this.updateSecondTopics(initFirstTopic)
        this.selectSecondTopic(initFirstTopic, initSecondTopic, 0, initTopicId)
        this.loaded = 1
      } catch (err) {
        console.log(err)
      }
    },

    mounted () {
      window.addEventListener('scroll', () => {
        this.fixedScrollOffset = window.scrollX
      })
    },

    methods: {
      updateSecondTopics (key) {
        this.secondTopics = {
          topicName: key,
          list: this.topics[key]
        }
        this.activeTopics = -1
        // 延迟产生闭合后重新打开的效果
        this.timer = setTimeout(() => {
          this.showSecondTopic = key
        }, 200)
      },

      selectSecondTopic (firstLevel, secondLevel, index, id) {
        if (this.loaded) {
          this.$router.push('topic')
        }
        this.activeTopics = index
        this.selectedTopic = {
          firstLevel: firstLevel,
          secondLevel: index
        }
        this.curTopicId = id
        this.$store.dispatch('getBooksList', { page: 1, limit: 25, topicId: this.curTopicId })
        this.$store.dispatch('initBreadcrumb', { firstLevel: firstLevel + ' / ', secondLevel: secondLevel })
        this.$store.dispatch('eventEmitter', { event: 'clearSearchVal' })
      }
    }
  }
</script>

