<template>
<!-- app -->
<div class="home">
<!-- <div class="header-container">
  <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
</div> -->
<div class="view-container" style="">
  <swiper :show-dots="false" :index.sync="slideIndex" style="height:100%" height="100%" :prevent-slide="true">
    <swiper-item >
      <reorder-first></reorder-first>
    </swiper-item>
    <swiper-item>
      <reorder-second></reorder-second>
    </swiper-item>
  </swiper>
</div>
</div>
</template>
<script>
// import {Tabbar, TabbarItem} from 'vux/src/components/tabbar'
// import api from '../api'
import XHeader from 'vux/src/components/x-header'
import Swiper from 'vux/src/components/swiper'
import SwiperItem from 'vux/src/components/swiper-item'
import ReorderFirst from './online/ReorderFirst'
import ReorderSecond from './online/ReorderSecond'
import Vue from 'vue'
import PathMap from '../PathMap'
export default {
  components: {
    // Tabbar,
    // TabbarItem,
    XHeader,
    ReorderFirst,
    ReorderSecond,
    Swiper,
    SwiperItem
  },
  ready () {
    var me = this
    // var productId = this.$route.params.productID // 获取产品ID
    // console.log(productId)
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
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
    // this.thisDatas = api.get('productDate')
  },
  events: {
    'atOnceOrder': function () {
      this.slideIndex = 1
    }
  },
  data () {
    return {
      index: 0,
      direction: 'forward',
      title: '',
      slideIndex: 0,
      thisDatas: {}
    }
  },
  methods: {
    // testGet: function (productId) {
    //   var me = this
    //   api.testGet('userMobile', 'passWord', 'openId', function (result) {
    //     // console.log(result)
    //     // console.log(productId)
    //     for (var key in result.datas) {
    //       if (result.datas[key].pruductID === productId) {
    //         me.thisDatas = result.datas[key]
    //         me.title = result.datas[key].productName
    //       }
    //     }
    //     me.$dispatch('loading-end', 'loading')
    //   })
    // },
    // testPost: function () {
    //   api.testPost('userMobile', 'passWord', 'openId', function (result) {
    //     console.log(result)
    //   })
    // }
  }
}
</script>

<style scoped>
/*.header-container {
  z-index: 999;
}*/
.home {
  /*height: 600px;*/
  background-color: #F1EFF6;
}
.view-container {
  padding-bottom: 0;
  /*height: 600px;*/
  height: 100%!important;
}

</style>
<style >
.vux-swiper {
  height: 100%!important;
}
</style>
