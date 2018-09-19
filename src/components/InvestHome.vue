<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
  </div> -->
  <div class="view-container">
    <tab class="tab" active-color="#c32b38" :line-width="3">
       <tab-item :selected="index === item.index" v-for="item in tabs" @click="indexChange(item.index)">
       {{item.name}}
       </tab-item>
   </tab>
    <scroller lock-x height="-100" scrollbar-y use-pullup @pullup:loading="loadMore" @pulldown:loading="refresh" :pullup-status.sync="pullupStatus" v-ref:scroller>
      <div class="page1">
        <div class="invest-box" v-for="invest in investMsg" @click="gotoInvestMsg(invest)">
          <span class="from-left">{{invest.cpmc}}<h1>持仓份额：{{invest.zfe}}份</h1></span>
          <i class="icon iconfont from-right">&#xe602;</i>
        </div>
        <div class="no-msg" v-if="investMsg.length < 1">
          <template v-if="type === 0">
            没有您非标类的投资信息
          </template>
          <template v-else>
            没有您权益类的投资信息
          </template>
        </div>
      </div>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="width: 100%; height: 40px; text-align: center;">
        <span v-show="pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="pullupStatus === 'down' || pullupStatus === 'up'" :class="{'rotate': pullupStatus === 'up'}"><i class="icon iconfont">&#xe604;</i></span>
        <span v-show="pullupStatus === 'loading'"><spinner type="lines"></spinner></span>
      </div>
    </scroller>
  </div>
</div>
</div>
</template>
<script>
import XHeader from 'vux/src/components/x-header'
import Scroller from 'vux/src/components/scroller'
import {Tab, TabItem} from 'vux/src/components/tab'
import Spinner from 'vux/src/components/spinner'
import PathMap from '../PathMap'
import api from '../api'
import Vue from 'vue'
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    Scroller,
    Spinner
  },
  ready () {
    // var userid = window.G.user
    // if (!userid) {
    //   this.$dispatch('alertShow', '没有您的信息，请先登录', '提示', '前去登录', '/login-home/login-page')
    //   return
    // }
    var me = this
    me.$dispatch('loading-start', '正在加载数据..')
    this.testGet(true)
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
      investMsg: [
        {}
      ],
      index: 0,
      tabs: [
        { name: '非标类', index: 0 },
        { name: '权益类', index: 1 }
      ],
      pageIndex: 1,
      pullupStatus: 'default',
      type: 0
    }
  },
  methods: {
    indexChange: function (val) {
      console.log(val)
      this.index = val
      this.type = val
      this.investMsg = []
      this.testGet(true)
    },
    loadMore: function (uuid) {
      this.testGet(false, uuid)
    },
    refresh (uuid) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$broadcast('pulldown:reset', uuid)
        })
      }, 2000)
    },
    testGet: function (first, uuid) {
      var me = this
      if (first) {
        this.investMsg = []
        this.pageIndex = 0
      }
      this.pageIndex++
      console.log(0)
      api.getMyInvestInfo(this.type, this.pageIndex, function (result) {
        console.log(result, 'result')
        me.$dispatch('loading-end', 'loading')
        if (result.success) {
          me.investMsg = me.investMsg.concat(result.data)
          me.pageIndex = result.pageIndex
          // if (me.investMsg.length === 0) {
          //   me.$dispatch('alertShow', '没有您的投资信息', '提示', '确定', '/ostone-home/main-page')
          //   // me.$router.go('/ostone-home/main-page')
          // }
        }
        me.$nextTick(() => {
          // 调整滚动条
          if (first) {
            me.$refs.scroller.reset()
          } else {
            me.$broadcast('pullup:reset', uuid)
            me.pullupStatus = 'default'
          }
        })
        // console.log(me.investMsg)
      })
    },
    gotoInvestMsg: function (invest) {
      // console.log(invest.pruductID)
      api.set('investData', invest)
      api.set('investType', this.type)
      var me = this
      me.$router.go('/investmsg-home')
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
  overflow-y: hidden;
  background-color: #f2f2f2;
}
.page1 {
}
.invest-box {
  width: 100%;
  /*height: 70px;*/
  margin-bottom: 10px;
  overflow: hidden;
  background: #fff;
  padding: 15px;
  cursor: pointer;
}
.from-left h1 {
  margin: 0;
  height: 25px;
  line-height: 25px;
  font-size: 15px;
  font-weight: normal;
  color: #000;
}
.from-left {
  display: block;
  float: left;
  width: 85%;
  font-size: 12px;
  color: #888;
  /*white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;*/
}
.from-right {
  display: block;
  float: right;
  height: 25px;
  line-height: 25px;
  margin-top: 8px;
  color: #ababab;
}
.no-msg {
  text-align: center;
}
</style>
