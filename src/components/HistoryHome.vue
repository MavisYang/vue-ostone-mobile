<template>
<!-- app -->
<div class="home">
<!-- <div class="header-container">
  <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
</div> -->
<div class="view-container">
  <ul class="titles">
    <li class="col-xs-4" v-for="title in titles">{{title}}</li>
  </ul>
  <div class="msg-box">
    <ul v-for="list in history" class="msgs">
      <li class="col-xs-4" >{{list.profitDate}}</li>
      <li class="col-xs-4" >{{list.unitProfit}}</li>
      <li class="col-xs-4" >{{list.accumulatedProfit}}</li>
    </ul>
  </div>
</div>
</template>
<script>
import {Tabbar, TabbarItem} from 'vux/src/components/tabbar'
import api from '../api'
import XHeader from 'vux/src/components/x-header'
import Vue from 'vue'
import PathMap from '../PathMap'
export default {
  components: {
    Tabbar,
    TabbarItem,
    XHeader
  },
  ready () {
    var me = this
    // var productId = this.$route.params.productID // 获取产品ID
    // this.productID = productId
    me.history = api.get('historyData')
    console.log(me.history)
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(currentPath)
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    // this.testGet(productId)
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
  events: {
  },
  data () {
    return {
      index: 0,
      direction: 'forward',
      title: '',
      slideIndex: 0,
      productID: 0,
      titles: ['日期', '单位净值', '累计净值'],
      history: []
    }
  },
  methods: {
    // testGet: function (productId) {
    //   var me = this
    //   api.getProductProfitDetail('userMobile', 'passWord', 'openId', function (result) {
    //     // console.log(result.data.historyProfit)
    //     me.history = result.data.historyProfit
    //     console.log(me.history)
    //     // for (var key in result.data) {
    //
    //       // if (result.data[key].pruductID === productId) {
    //       //   me.thisDatas = result.data[key]
    //       //   me.title = result.data[key].productName
    //       //   // console.log(result.data[key])
    //       // }
    //     // }
    //     me.$dispatch('loading-end', 'loading')
    //   })
    // }
  }
}
</script>

<style scoped>
.header-container {
  z-index: 999;
}
.view-container {
  padding-bottom: 0;
  height: 100%!important;
}
.titles, .msgs {
  list-style: none;
}
.col-xs-4 {
  position: static;
  padding: 0;
}
.titles li {
  height: 43px;
  background-color: #f2f2f2;
  line-height: 43px;
  text-align: center;
  /*font-weight: bolder;*/
}
.titles {
  position: fixed;
  width: 100%;
}
/*.titles li:nth-child(2) {
  padding-right: 15px;
}
.titles li:nth-child(3) {
padding-right: 25px;
}*/
.msgs li {
  height: 49px;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  line-height: 49px;
  text-align: center;
  color: black;
}
.msgs li:first-child {
  padding: 0;
}
.msg-box {
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: scroll;
  margin-top: 43px;
  padding-bottom: 10px;
}
</style>
<style >
.vux-swiper {
  height: 100%!important;
}
</style>
