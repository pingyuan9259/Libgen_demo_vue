<!-- 登录页面组件
     作者：平原
     创建：2017-7-25 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="login_pannel">
    <div class="mash"></div>
    <video
      ref="videoBg"
      loop
      :muted="true"
      :controls="false"
      class="video_bg"> 
      <source src="//static.tinfinite.com/xinsheng_web_first_page_video.webm" type="video/webm">
      <source src="//o3b126ie1.qnssl.com/cover/96642cc1-5791-4761-a1ce-17931dbd39bf" type="video/mp4">
    </video>

    <div class="logo">
      <img
        :class="{ 'visibility': showGrayLogo }"
        src="//o4a7cbihz.qnssl.com/picture/308459dc-841b-43ba-8113-1ad91965ddfe">
      <img
        :class="{ 'visibility': showColorLogo }"
        src="//o4a7cbihz.qnssl.com/picture/1867836a-a902-41f5-82ac-9c3a49820536">
    </div>

    <div
      :class="{ 'visibility': showColorLogo }"
      class="form">
      <div
        :class="{
          'focus': focusInput === 'username',
          'hasVal': username
        }"
        class="username">
        <span class="placeholder">Please Enter Username</span>
        <input
          v-model="username"
          @focus="focusInput = 'username'"
          @blur="focusInput = ''"
          id="username"
          type="text">
        <div class="border"></div>
      </div>

      <div
        :class="{
          'focus': focusInput === 'password',
          'hasVal': password
        }"
        class="password">
        <span class="placeholder">Please Enter Password</span>
        <input
          v-model="password"
          @focus="focusInput = 'password'"
          @blur="focusInput = ''"
          id="password"
          type="password">
        <div class="border"></div>
      </div>

      <a
        @click="saveLoginStatus = !saveLoginStatus"
        class="save_login_status pull_left">
        <span :class="saveLoginStatus ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked'"></span>
        &nbsp;Remember Me
      </a>
      <a
        @click="submit()"
        :class="{ 'submiting': submiting }"
        class="submit btn_solid pull_right">Sign In</a>
    </div>

    <loading
      id="login"
      :animation="false"
      fadeSpeed="fade-slow"></loading>
  </div>
</template>

<script>
  import Loading from '../../modules/Loading/'
  import base64 from '../../../utils/base64'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        showGrayLogo: 0,
        showColorLogo: 0,
        focusInput: '',
        username: '',
        password: '',
        saveLoginStatus: 0,
        submiting: 0,
        submitError: '',
        video: null,
        timer: null
      }
    },

    components: {
      Loading
    },

    computed: mapState({
    }),

    watch: {
    },

    created () {
    },

    mounted () {
      this.showGrayLogo = 1
      this.$store.dispatch('loadingHide', 'login')
      this.video = this.$refs.videoBg
      this.timer = setTimeout(() => {
        this.video.play()
        this.showGrayLogo = 0
        this.showColorLogo = 1
      }, 700)
    },

    methods: {
      async submit () {
        if (!this.username) {
          this.$store.dispatch('boxyTip', { message: 'Please enter your username.' })
          return
        } else if (!this.password) {
          this.$store.dispatch('boxyTip', { message: 'Please enter your password.' })
          return
        }
        this.submiting = 1
        await this.$store.dispatch('login', {
          username: base64.encode(this.username),
          password: base64.encode(this.password),
          saveLoginStatus: this.saveLoginStatus
        })
        this.submiting = 0
      }
    }
  }
</script>
