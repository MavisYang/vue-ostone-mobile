<template>
  <div class="page">
    <scroller lock-x height="100%" scrollbar-y use-pullup  @pullup:loading="loadMore" @pulldown:loading="refresh" :pullup-status.sync="pullupStatus" v-ref:scroller>
      <div class="page1">
        <div class="trade-box" v-for="msg in myMsg" @click="toThisMsg(msg)">
          <div class="left">
            <h1>{{msg.cpmc}}</h1>
            <p>
              <span class="tip1">{{msg.ywlx}}</span>
              <span class="tip2">{{msg.qrrq}}</span>
            </p>
          </div>
          <div class="right">
            <i class="icon iconfont">&#xe602;</i>
          </div>
          <span class="money">{{msg | filterMoney}}</span>
        </div>
        <div class="no-msg" v-if="myMsg.length < 1">
          此时间区间内没有您的交易信息
        </div>
      </div>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="width: 100%; height: 40px; text-align: center;">
        <span v-show="pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="pullupStatus === 'down' || pullupStatus === 'up'" :class="{'rotate': pullupStatus === 'up'}"><i class="icon iconfont">&#xe604;</i></span>
        <span v-show="pullupStatus === 'loading'"><spinner type="lines"></spinner></span>
      </div>
    </scroller>

  </div>
</template>

<script>
import api from '../../api'
import PathMap from '../../PathMap'
import Scroller from 'vux/src/components/scroller'
import Spinner from 'vux/src/components/spinner'
import Vue from 'vue'
export default {
  components: {
    Scroller,
    Spinner
  },
  ready () {
    var me = this
    me.startDate = api.get('startDate')
    me.endDate = api.get('endDate')
    // console.log(me.startDate, me.endDate)
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
  methods: {
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
        me.myMsg = []
        me.pageIndex = 0
      }
      me.pageIndex++
      api.getTradeList(me.startDate, me.endDate, me.pageIndex, function (result) {
        if (result.success) {
          console.log(result)
          me.myMsg = me.myMsg.concat(result.data)
          me.pageIndex = result.pageIndex
          // if (me.myMsg.length === 0) {
          //   me.$dispatch('alertShow', '此时间段内没有您的交易信息', '提示', '重新查询', '/trade-home/tradesearch-page')
          //   // me.$router.go('/trade-home/tradesearch-page')
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
        me.$dispatch('loading-end', 'loading')
      })
    },
    toThisMsg: function (msg) {
      var me = this
      api.set('tradeMsg', msg)
      me.$router.go('/thistrade-home')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      myMsg: [],
      startDate: '',
      endDate: '',
      pageIndex: 1,
      pullupStatus: 'default'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    /*padding-top: 10px;*/
    background-color: #f2f2f2;
  }
  .trade-box {
    width: 100%;
    /*height: 70px;*/
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 15px;
    margin-bottom: 10px;
    overflow: hidden;
    position: relative;
    padding-bottom: 5px;
  }
  .left {
    float: left;
    width: 70%;
    height: 100%;
    padding-top: 15px;
    overflow: hidden;
  }
  .left h1 {
    color: black;
    font-size: 14px;
    margin: 0;
    font-weight: normal;
    /*text-align: right;*/
    /*white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;*/
  }
  .left span {
    color: #ababab;
    font-size: 13px;
  }
  .left .tip1 {
    float: left;
    color: #e84a3e;
  }
  .left .tip2 {
    float: left;
    margin-left: 20px;
  }
  .right {
    float: right;
    width: 29%;
    height: 100%;
    padding-top: 27px;
    display: block;
    /*overflow: hidden;*/
  }
  .right span {
    height: 15px;
    line-height: 15px;
    display: block;
    color: #e84a3e;
  }
  .right i {
    height: 15px;
    line-height: 15px;
    font-size: 14px;
    display: block;
    margin-left: 5px;
    float: right;
  }
  .money {
    height: 15px;
    line-height: 15px;
    display: block;
    color: #e84a3e;
    position: absolute;
    bottom: 8px;
    right: 20px;
  }
  .no-msg {
    text-align: center;
  }
</style>
