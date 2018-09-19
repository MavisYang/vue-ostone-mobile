<template>
<!-- app -->
<div class="home">
<!-- <div class="header-container">
  <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
</div> -->
  <div class="view-container" style="height: 100%">
    <div class="title" :class="thisDatas.cpzt===1?'red':''">
      {{thisDatas.productName}}
    </div>
    <ul class="list-box">
      <li class="col-xs-4">
        <span>单位净值</span>
        <span class="danwei">{{thisDatas.unitProfit}}</span>
      </li>
      <li class="col-xs-4">
        <span>累计净值</span>
        <span>{{thisDatas.accumulatedProfit}}</span>
      </li>
      <li class="col-xs-4">
        <span>净值日期</span>
        <span>{{thisDatas.profitDate}}</span>
      </li>
    </ul>
    <div class="zoushi">
      <!-- <h1>净值走势</h1> -->
      <span @click="toHistory" class="see-more">查看历史净值</span>
      <div class="chart-container" v-el:chart style="height: 220px;width: 100%"></div>
      <span class="tips">拖动图表上方以查看更多<br/>(可左右拖动，也可两手指放大缩小)</span>
    </div>
    <div class="list" v-for="list in lists">
      <span class="list-left">{{list.name}}</span>
      <span class="list-right">{{list.value}}</span>
    </div>
    <div class="tip-msg" v-if="hasOrder">
      如您想增持此产品份额，请联系您的财富师<br/>或致电客户服务中心热线：021-60431508
    </div>
    <div class="tip-msg" v-else>
      如您对此产品感兴趣，欲了解此产品更多信息<br/>请致电客户服务中心热线：021-60431508
    </div>
  </div>
</div>
</template>
<script>
import api from '../api'
import Vue from 'vue'
import Chart from './online/Chart'
import {Tabbar, TabbarItem} from 'vux/src/components/tabbar'
import XHeader from 'vux/src/components/x-header'
import PathMap from '../PathMap'
export default {
  components: {
    Tabbar,
    TabbarItem,
    XHeader,
    Chart
  },
  ready () {
    var me = this
    me.$dispatch('loading-start', '正在加载数据')
    var productId = api.get('netWorthProductID')// 获取产品ID
    console.log(productId)
    // this.productID = productId
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    me.testGet(productId)
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
      hasOrder: true,
      index: 0,
      direction: 'forward',
      title: '',
      slideIndex: 0,
      // productID: 0,
      thisDatas: {},
      lists: [
        { name: '赎回费率', value: '' },
        // { name: '认购追加起点（万元）', value: '' },
        { name: '认购-申购费率', value: '' },
        { name: '认购-申购起点（万元）', value: '' },
        { name: '封闭期', value: '' },
        // { name: '预警线', value: '' },
        // { name: '止损线', value: '' }
        // { name: '申购起点（万元）', value: '' },
        // { name: '申购费率', value: '' },
      ]
    }
  },
  methods: {
    testGet: function (productId) {
      var me = this
      console.log(productId)
      api.getProductProfitDetail(productId, function (result) {
        console.log(result)
        me.$dispatch('loading-end', 'loading')
        // console.log(productId)
        if (result.data.hasBuy) {
          me.hasOrder = true
        } else {
          me.hasOrder = false
        }
        console.log(result.data.hasBuy, me.hasOrder)
        var proDate = result.data.profitDate + ''
        result.data.profitDate = proDate.substring(0, 4) + '/' + proDate.substring(4, 6) + '/' + proDate.substring(6, 8)
        for (var key in result.data.historyProfit) {
          var proD = result.data.historyProfit[key].profitDate + ''
          result.data.historyProfit[key].profitDate = proD.substring(0, 4) + '/' + proD.substring(4, 6) + '/' + proD.substring(6, 8)
        }
        me.thisDatas = result.data
        me.lists[0].value = me.thisDatas.redeemRate
        me.lists[1].value = me.thisDatas.subcribeRate
        me.lists[2].value = me.thisDatas.subcribeMinPirce
        me.lists[3].value = me.thisDatas.closeDuration
        // me.lists[1].value = me.thisDatas.subscribeMinPrice
        // me.lists[6].value = me.thisDatas.subscribeRate
        // me.lists[7].value = me.thisDatas.closeDuration
        // me.lists[8].value = me.thisDatas.closeDuration
        // console.log(me.thisDatas.historyProfit)
        api.set('historyData', result.data.historyProfit)
        console.log(result.data.historyProfit)
        // me.$broadcast('xuanran', result.data.historyProfit)
        api.require(['echarts.all.min.js'], function () {
          var myChart = window.echarts.init(me.$els.chart)
          var date = []
          var data = []
          var historyData = result.data.historyProfit
          for (var i in historyData) {
            var proDate = historyData[i].profitDate
            // console.log(proDate)
            // proDate.substring(0, 4) + '/' + proDate.substring(4, 6) + '/' + proDate.substring(6, 8)
            date.push(proDate)
            data.push(historyData[i].accumulatedProfit)
          }
          date.reverse()
          data.reverse()
          // console.log(date)
          // console.log(data)
          var option = {
            tooltip: {
              trigger: 'axis',
              position: function (pt) {
                return ['30%', '0px']
              }
            },
            title: {
              left: 'left',
              text: '净值走势'
            },
            legend: {
              top: 'bottom',
              data: ['意向']
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: date
            },
            yAxis: {
              type: 'value',
              boundaryGap: [0, '1%'],
              min: 'dataMin'
            },
            dataZoom: [{
              type: 'inside',
              start: 0,
              end: 100
            }, {
              start: 0.0000,
              end: 10.0000,
              // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '10%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }],
            series: [
              {
                name: '累计净值',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                  normal: {
                    color: 'rgb(255, 70, 131)'
                  }
                },
                areaStyle: {
                  normal: {
                    // color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //   offset: 0,
                    //   color: 'rgb(255, 158, 68)'
                    // }, {
                    //   offset: 1,
                    //   color: 'rgb(255, 70, 131)'
                    // }])
                    color: 'rgba(255, 255, 255, 0)'
                  }
                },
                data: data
              }
            ]
          }
          myChart.setOption(option)
        })
        // console.log(api.get('historyData'))

      })
    },
    toHistory: function () {
      // window.alert(0)
      var me = this
      me.$router.go('/history-home')
    }
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
  overflow-y: scroll;
  overflow-x: hidden;
}
.title {
  text-align: center;
  font-size: 14px;
  padding: 5px 0px;
  min-height: 32.67px;
  color: #000;
  font-weight: bold;
  border-bottom: 1px solid #e2e2e2;
}
.red {
    color: #e84a3e;
}
.list-box {
  width: 100%;
  height: 70px;
  list-style: none;
  background-color: #fff;
  /*margin-bottom: 10px;*/
  padding-top: 10px;
  border-bottom: 1px solid #d6d5da;
}
ul li {
  padding: 0;
  text-align: center;
  border-right: 1px solid #e9e9e9;
}
ul li:last-child {
  border-right: none;
}
li span {
  display: block;
}
.danwei {
  color: #dc3945;
}
/*走势*/
.zoushi {
  width: 100%;
  height: 270px;
  background-color: #F2F2F2;
  padding: 10px 15px;
  margin-bottom: 10px;
  position: relative;
}
.zoushi h1 {
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  float: left;
}
.zoushi .see-more {
  float: right;
  font-size: 14px;
  position: absolute;
  right: 15px;
  top: 13px;
  color: #1e74d4;
  z-index: 33;
}
.zoushi .tips {
  font-size: 12px;
  position: absolute;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  color: #999;
  bottom: 5px;
  z-index: 33;
}
.list {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #e2e2e2;
  padding: 0 15px;
}
.list-left {
  float: left;
}
.list-right {
  float: right;
}
.tip-msg {
  text-align: center;
  bottom: 10px;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
<style >
.vux-swiper {
  height: 100%!important;
}
</style>
