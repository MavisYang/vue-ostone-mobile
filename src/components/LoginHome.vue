<template>
<!-- app -->
<div class="home">
<!-- <div class="header-container">
  <x-header :left-options="{backText: '返回', showBack: true}">{{title}}</x-header>
</div> -->
<div class="view-container">
  <router-view :transition="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"></router-view>
</div>
</div>
</template>
<script>
import XHeader from 'vux/src/components/x-header'
import PathMap from '../PathMap'
export default {
  components: {
    XHeader
  },
  ready () {
    var me = this
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    if (current) {
      me.title = current.title
    }
    me.$router.loginhome = me
  },
  destroyed () {
    delete this.$router.loginhome
    this.$router.loginhome = null
  },
  data () {
    return {
      direction: 'forward',
      title: ''
    }
  },
  methods: {
  },
  events: {
    'goLogin': function () {
      var me = this
      me.$router.go('/login-home/register-page')
    },
    'goForget': function () {
      var me = this
      me.$router.go('/login-home/password-page')
    }
  }
}
</script>

<style scoped>
.view-container {
  padding-bottom: 0;
  height: 100%!important;
}
</style>
