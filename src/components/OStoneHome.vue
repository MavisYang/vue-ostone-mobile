<template>
<!-- app -->
<div class="home">
<!-- <div class="header-container">
  <x-header :left-options="{backText: '返回', showBack: true}">{{title}}</x-header>
</div> -->
<div class="view-container">
  <router-view :transition="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"></router-view>
</div>
<tabbar>
  <tabbar-item link="/ostone-home/product-page" :selected="index == 1">
    <i slot="icon" class="icon iconfont">&#xe611;</i>
    <span slot="label">产品</span>
  </tabbar-item>
  <tabbar-item link="/ostone-home/activity-page" :selected="index == 2">
    <i slot="icon" class="icon iconfont">&#xe610;</i>
    <span slot="label">活动</span>
  </tabbar-item>
  <tabbar-item link="/ostone-home/market-page" :selected="index == 3">
    <i slot="icon" class="icon iconfont">&#xe60f;</i>
    <span slot="label">产品净值</span>
  </tabbar-item>
  <tabbar-item link="/ostone-home/msg-page" :selected="index == 4">
    <i slot="icon" class="icon iconfont">&#xe60d;</i>
    <span slot="label">信息披露</span>
  </tabbar-item>
  <tabbar-item link="/ostone-home/main-page" :selected="index == 5">
    <i slot="icon" class="icon iconfont">&#xe60c;</i>
    <span slot="label">我的</span>
  </tabbar-item>
</tabbar>
</div>
</template>
<script>
import {Tabbar, TabbarItem} from 'vux/src/components/tabbar'
import XHeader from 'vux/src/components/x-header'
import PathMap from '../PathMap'
export default {
  components: {
    Tabbar,
    TabbarItem,
    XHeader
  },
  events: {
    'toActivity': function (activityID) {
      var me = this
      me.$router.go('/activity-home/' + activityID)
    },
    'toNews': function (newsID) {
      var me = this
      me.$router.go('/news-home/' + newsID)
    },
    'goCeShi': function () {
      this.$router.go('/investtest-home/begintest-page')
    }
  },
  ready () {
    var me = this
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(current)
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    this.$router.ostonehome = me
    this.$router.afterEach(function (transition) {
      var end = PathMap.search(transition.to.path)
      me.index = end.weight
    })
  },
  destroyed () {
    delete this.$router.ostonehome
    this.$router.ostonehome = null
  },
  data () {
    return {
      index: 0,
      direction: 'forward',
      title: ''
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.header-container {
  z-index: 999;
}
.weui_tabbar a {
  padding: 0;
}
.weui_tabbar {
  background-color: #f9f7f8!important;
  z-index: 9999;
  padding: 5px 0;
  /*box-shadow: 1px -1px 10px 1px #e2e2e2;*/
}
a {
  text-decoration: none;
}
.weui_tabbar_item i {
  font-size: 18px;
  color: #000;
}

.weui_bar_item_on i, .weui_bar_item_on p span {
  color: #f8665b;
}
</style>
<style media="screen">
.view-container {
  height: calc(100% - 57px)!important;
  /*margin-bottom: 48px;*/
  overflow-y: hidden;
}
.weui_tabbar_icon {
  text-align: center;
}
</style>
