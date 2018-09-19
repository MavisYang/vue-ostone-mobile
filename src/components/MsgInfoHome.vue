<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
  </div> -->
  <div class="view-container">
    <div class="page">
      <h1 class="title">
        {{msgInfo.title}}
        <!-- 东方点钻-东兴礡璞2号新三板投资基金B类（劣后级）成立了 -->
      </h1>
      <span class="date">{{msgInfo.infoDate}}</span>
      <p class="content">
        {{{msgInfo.article}}}
      </p>
      <a :href="list.url" v-for="list in msgInfo.attachments" class="link">{{list.title}}</a>
    </div>
  </div>
</div>
</div>
</template>
<script>
import XHeader from 'vux/src/components/x-header'
import PathMap from '../PathMap'
import api from '../api'
import Vue from 'vue'
export default {
  components: {
    XHeader
  },
  ready () {
    var me = this
    var infoID = api.get('infoID') // 获取信息ID
    me.$dispatch('loading-start', '正在加载数据..')
    this.testGet(infoID)
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(currentPath)
    if (current) {
      me.index = current.weight
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
      msgInfo: {}
    }
  },
  methods: {
    testGet: function (infoID) {
      var me = this
      var userID = api.get('myAccMsg').userID
      console.log(infoID)
      api.getInfoDetail(infoID, userID, function (result) {
        me.$dispatch('loading-end', 'loading')
        // console.log(result.data)
        console.log(result)
        me.msgInfo = result.data
      })
    }
  },
  events: {
  }
}
</script>

<style scoped>
.view-container {
  padding-bottom: 0;
  height: 100%!important;
}
.page {
  padding: 15px;
}
.title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.date {
  font-size: 12px;
  color: #ababab;
  display: block;
  margin: 10px 0;
}
.content {
  font-size: 12px;
}
.link {
  display: block;
  margin: 5px 0;
}
</style>
