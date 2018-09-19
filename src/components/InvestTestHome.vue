<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
  </div> -->
  <div class="view-container">
    <router-view :transition="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"></router-view>
  </div>
</div>
</div>
</template>
<script>
import XHeader from 'vux/src/components/x-header'
import PathMap from '../PathMap'
import Vue from 'vue'
export default {
  components: {
    XHeader
  },
  ready () {
    var me = this
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(currentPath)
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    this.$router.beforeEach(function (transition) {
      if (transition.from.path && transition.to.path) {
        var start = PathMap.search(transition.from.path)
        var end = PathMap.search(transition.to.path)
        me.direction = (end.weight > start.weight) ? 'forward' : 'backword'
        // console.log(start, end, me.direction)
        me.title = end.title
      }
      Vue.nextTick(function () {
        // 确保direction生效
        transition.next()
      })
    })
    this.$router.afterEach(function (transition) {
      var end = PathMap.search(transition.to.path)
      me.index = end.weight
    })
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
    'search-msg': function (beginDate, endDate) {
      var me = this
      me.$router.go('/trade-home/trademsg-page')
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
