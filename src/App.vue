<!-- 作者：平原
     创建：2017-5 -->

<style lang="scss">
  @import "./styles/iconfont/style.scss";
  @import "./styles/base/common.scss";
  @import "./styles/base/reset.css";

  #app {
    width: 100%;
  }
</style>
<template>
  <div id="app">
    <container></container>
  </div>
</template>

<script>
  import Container from './components/modules/Container/'

  export default {
    name: 'app',

    data () {
      return {
        showError: false
      }
    },

    components: {
      Container
    }
  }
</script>
