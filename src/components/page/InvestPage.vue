<template>
  <div class="page">
    <div class="invest-box" v-for="invest in investMsg" @click="gotoInvestMsg(invest.productID)">
      <span class="from-left">{{invest.productName}}资产<h1>111111</h1></span>
      <i class="icon iconfont from-right">&#xe602;</i>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import PathMap from '../../PathMap'
import Vue from 'vue'
export default {
  components: {
  },
  ready () {
    var me = this
    me.$dispatch('loading-start', '正在加载数据..')
    this.testGet()
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
    testGet: function () {
      var me = this
      // console.log(0)
      api.getMyInvestInfo('userMobile', 'passWord', 'openId', function (result) {
        // console.log(result)
        me.investMsg = result.data
        console.log(me.investMsg)
        me.$dispatch('loading-end', 'loading')
      })
    },
    gotoInvestMsg: function (productID) {
      this.$dispatch('gotoInvestMsg', productID)
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      investMsg: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .invest-box {
    width: 100%;
    height: 70px;
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
    width: 50%;
    font-size: 12px;
    color: #888;
  }
  .from-right {
    display: block;
    float: right;
    height: 25px;
    line-height: 25px;
    margin-top: 8px;
  }
</style>
