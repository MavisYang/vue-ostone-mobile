<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
  </div> -->
  <div class="view-container">
    <div class="page">
      <div class="lis" v-for="list in lists">
        <h1>{{list.name}}</h1>
        <span class="list-value">{{list.value}}</span>
      </div>
    </div>
  </div>
</div>
</div>
</template>
<script>
import api from '../api'
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
    // var productId = this.$route.params.productID // 获取产品ID
    var current = PathMap.search(currentPath)
    // console.log(productId)
    this.testGet()
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
        { name: '产品名称', value: '' },
        { name: '业务类型', value: '' },
        { name: '申请日期', value: '' },
        { name: '申请份额（份）', value: '' },
        { name: '申请金额（万元）', value: '' },
        { name: '确认份额（份）', value: '' },
        { name: '确认金额（万元）', value: '' },
        { name: '确认净值（元）', value: '' },
        { name: '确认日期', value: '' },
        { name: '交易状态', value: '' }
      ]
    }
  },
  methods: {
    testGet: function (productId) {
      var me = this
      // console.log(0)
      // api.getTradeList('userMobile', 'passWord', 'openId', function (result) {
        // console.log(result.data)
        // console.log(productId)
        var data = api.get('tradeMsg')
        // for (var key in data) {
          // if (data.pruductID === productId) {
            console.log(data)
            me.lists[0].value = data.cpmc
            me.lists[1].value = data.ywlx
            me.lists[2].value = data.sqrq
            me.lists[3].value = data.sqfe
            me.lists[4].value = data.sqje
            me.lists[5].value = data.qrfe
            me.lists[6].value = data.qrje
            me.lists[7].value = data.qrjz
            me.lists[8].value = data.qrrq
            me.lists[9].value = data.jyzt
            // me.lists[7].value = data.relatingCard
          // }
        // }
        // me.$dispatch('loading-end', 'loading')
      // })
    }
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
  /*width: 100%;*/
  height: 100%!important;
}
.page {
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  /*padding-top: 10px;*/
  background-color: #fff;
  padding-left: 15px;
  padding-bottom: 10px;
}
.lis {
  padding-right: 15px;
  width: 100%;
  min-height: 40px;
  overflow: hidden;
  border-bottom: 1px solid #eee;
  overflow: hidden;

}
.lis h1 {
  float: left;
  margin: 0;
  font-size: 14px;
  line-height: 40px;
  font-weight: normal;
}
.lis span {
  float: right;
  font-size: 14px;
  line-height: 40px;
  display: block;
  color: #ababab;

}
.lis:first-child span {
  width: 218px;
  text-align: right;
  /*white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;*/
}
</style>
