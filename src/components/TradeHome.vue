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
      title: '',
      lists: [
        { name: '持有份额（份）', value: '' },
        { name: '单位净值（元）', value: '' },
        { name: '净值日期', value: '' },
        { name: '产品开放日', value: '' }
      ]
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
.line {
  width: 100%;
  height: 100px;
  background-color: #fff;
  text-align: center;
  padding-top: 20px;
  margin-bottom: 20px;
}
.line span {
  display: block;
  margin: 0px auto;
  margin-bottom: 15px;
  color: #888;
}
.line h1 {
  margin: 0px;
  font-weight: normal;
  font-size: 16px;
}
.lines {
  height: 45px;
  line-height: 45px;
  padding: 0 15px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.name {
  float: left;
}
.value {
  float: right;
}


</style>
