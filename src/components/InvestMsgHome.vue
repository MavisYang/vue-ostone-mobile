<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
  </div> -->
  <div class="view-container">
    <div class="page">
      <div class="line">
        <span>
          {{datas.cpmc}}
          <template v-if="type === 0">预期收益（元）</template>
          <template v-else>参考市值（元）</template>
         </span>
        <h1>
          <template v-if="type === 0">{{datas.yjsy}}</template>
          <template v-else>{{datas.refValue}}</template>
        </h1>
      </div>
      <div class="lines-box">
        <div class="lines" v-for="list in lists" v-if="list.value !== ''">
          <span class="name">{{list.name}}</span>
          <span class="value">{{list.value}}</span>
        </div>
      </div>
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
    // var productId = this.$route.params.productID // 获取产品ID
    // me.$dispatch('loading-start', '正在加载数据..')
    // this.testGet(productId)
    me.datas = api.get('investData')
    me.type = api.get('investType')
    console.log(me.datas, 'datassssssssssssssssssssss')
    me.lists[0].value = me.datas.zfe
    me.lists[1].value = me.datas.cpqx
    if (me.type === 0) {
      me.lists[2].value = me.datas.yqnhsyl
      me.lists[3].value = me.datas.yjsy
      me.lists[4].value = me.datas.ypcpdqrq
    } else {
      me.lists[5].value = me.datas.refValue
      me.lists[6].value = me.datas.cpjz
      me.lists[7].value = me.datas.jzrq
    }
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
      datas: {},
      type: 0,
      lists: [
        { name: '持仓份额（份）', value: '' },
        { name: '产品期限', value: '' },
        { name: '业绩比较基准', value: '' },
        { name: '预计收益（元）', value: '' },
        { name: '预计到期日期', value: '' },
        { name: '参考市值（元）', value: '' },
        { name: '产品净值（元）', value: '' },
        { name: '净值日期', value: '' }
      ]
    }
  },
  methods: {
    // testGet: function (productId) {
    //   var me = this
    //   // console.log(0)
    //   api.getMyInvestInfo('userMobile', 'passWord', 'openId', function (result) {
    //     // console.log(result.data)
    //     for (var i in result.data) {
    //       if (result.data[i].pruductID === productId) {
    //         console.log(result.data[i])
    //         me.lists[0].value = result.data[i].shareNumber
    //         me.lists[1].value = result.data[i].unitProfit
    //         me.lists[2].value = result.data[i].profitData
    //         me.lists[3].value = result.data[i].openDate
    //         // console.log(me.investMsg.productName)
    //         // console.log(result.data[i].openDate)
    //         me.title = result.data[i].productName
    //       }
    //     }
    //     // console.log(me.investMsg)
    //     me.$dispatch('loading-end', 'loading')
    //   })
    // }
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
.line {
  width: 100%;
  height: 100px;
  background-color: #d43641;
  text-align: center;
  padding-top: 10px;
  margin-bottom: 11px;
}
.line span {
  display: block;
  margin: 0px auto;
  /*margin-bottom: 15px;*/
  padding: 0 15px;
  color: #ffabab;
}
.line h1 {
  margin: 0px;
  font-weight: normal;
  /*font-size: 16px;*/
  color: white;
}
.lines-box {
  background-color: white;
  padding-left: 15px;
}
.lines {
  height: 45px;
  line-height: 45px;
  padding-right: 15px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.name {
  float: left;
  color: #ababab;
}
.value {
  float: right;
}


</style>
