<!-- 页面入口
     作者：平原
     入口功能：登录态、store初始化
     创建：2017-7-25 -->

<style lang="scss">
  .body_pannel {
    overflow: hidden;
    margin-top: 54px;
    margin-left: 170px;
  }
</style>

<template>
  <div class="container">
    <transition name="fade">
      <div v-if="!isLogin" class="login_container">
        <login-pannel></login-pannel>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="isLogin" class="page_container">
        <nav-pannel></nav-pannel>
        <header-pannel></header-pannel>
        <div
          @click="$store.dispatch('eventEmitter', { event: 'clickBody' })"
          class="body_pannel">
          <router-view></router-view>
        </div>
      </div>
    </transition>

    <boxy></boxy>
  </div>
</template>

<script>
  import Cookie from '../../../utils/cookie'
  import LoginPannel from '../LoginPannel/'
  import NavPannel from '../NavPannel/'
  import HeaderPannel from '../HeaderPannel/'
  import Boxy from '../Boxy/'
  import Loading from '../Loading/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        requestFailRes: {}
      }
    },

    components: {
      LoginPannel,
      NavPannel,
      HeaderPannel,
      Boxy,
      Loading
    },

    computed: mapState({
      isLogin: state => state.login.isLogin,
      redirect: state => state.global.redirect,
      requestFail: state => state.global.requestFail
    }),

    watch: {
      isLogin (val) {
        if (val && Cookie.getCookie('_login_token')) {
          this.$router.replace('/')
        }
      },

      redirect (val) {
        this.$router.replace(val)
      },

      '$route': 'routeChanged'
    },

    created () {
      if (Cookie.getCookie('_login_token')) {
        this.$store.dispatch('loginSuccess')
      }
      this.$store.dispatch('getPcFlag')
    },

    methods: {
      routeChanged (to, from) {
        // 所跳转页面是否需要初始化Store
        // 判断依据：当前页面与下个页面均不需要初始化，以区分是同级路由
        // 此判断主要用于解决userBanner切换tab时出现闪动的问题
        if (to.meta.initStateDisabled && from.meta.initStateDisabled) return
        this.$store.dispatch('initState')
      },

      click () {
        console.log(this.requestFail)
      }
    }
  }
</script>
