<template>
  <div class="page">
    <div class="head-bg">
      <div class="div_left">
        <span>非标类持仓份额<br>（份）</span>
        <h1>{{myMsg.fbTotalMoney}}</h1>
      </div>
      <div class="div_right">
        <span>权益类持仓参考市值<br>（万元）</span>
        <h1>{{myMsg.qyTotalMoney}}</h1>
      </div>
    </div>
    <div class="box-one">
      <div class="one box">
        <span>我的账户</span>
        <span>{{myMsg.userName}}</span>
      </div>
      <div class="two box" @click="goCeShi">
        <span>投资风格</span>
        <span class="nexticon"><i class="icon iconfont">&#xe602;</i></span>
        <span class="fengge">{{rankLei}}</span>
      </div>
    </div>
    <div class="box-one">
      <div class="three box" @click="turnToInvest">
        <span>我的投资</span>
        <span><i class="icon iconfont">&#xe602;</i></span>
      </div>
      <div class="four box" @click="turnToTrade(0)">
        <span>交易明细</span>
        <span><i class="icon iconfont">&#xe602;</i></span>
      </div>
      <!-- <div class="four box" @click="turnToTrade(1)">
        <span>分红明细</span>
        <span><i class="icon iconfont">&#xe602;</i></span>
      </div> -->
      <div class="five box" @click="turnToAccountSave">
        <span>账户安全</span>
        <span><i class="icon iconfont">&#xe602;</i></span>
      </div>
      <div class="six box" @click="turnToAddress">
        <span>收货地址</span>
        <span><i class="icon iconfont">&#xe602;</i></span>
      </div>
      <div class="sever box" @click="turnToMall">
        <span>积分商城</span>
        <span><i class="icon iconfont">&#xe602;</i></span>
      </div>
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
    // var userid = window.G.user
    // if (!userid) {
    //   this.$dispatch('alertShow', '没有您的信息，请先登录', '提示', '前去登录', '/login-home/login-page')
    //   return
    // }
    var me = this
    me.$dispatch('loading-start', '正在加载数据..')
    // var myNewMsg = api.get('myMsg')
    this.testGet()
    // console.log(me.myMsg)
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
    goCeShi: function () {
      this.$dispatch('goCeShi')
    },
    testGet: function () {
      var me = this
      // console.log(0)
      api.getMyAccountInfo(function (result) {
        if (result.success) {
          console.log(result)
          api.set('myAccMsg', result.data)
          me.myMsg = result.data
          if (me.myMsg.rankGrade > 0 && me.myMsg.rankGrade <= 25) {
            me.rankLei = '保守型'
        } else if (me.myMsg.rankGrade > 25 && me.myMsg.rankGrade <= 50) {
            me.rankLei = '稳健型'
        } else if (me.myMsg.rankGrade > 50 && me.myMsg.rankGrade <= 75) {
            me.rankLei = '平衡型'
          } else if (me.myMsg.rankGrade > 75 && me.myMsg.rankGrade <= 85) {
            me.rankLei = '成长型'
          } else if (me.myMsg.rankGrade > 85) {
            me.rankLei = '进取型'
          }
        }
        //  else {
        //   if (result.message === 'NEEDLOGIN') {
        //     me.$dispatch('alertShow', '请先登录', '没有您的信息', '马上登录', '/login-home/login-page')
        //     // me.$router.go('/login-home/login-page')
        //   }
        // }
        me.$dispatch('loading-end', 'loading')
      })
    },
    turnToInvest: function () {
      var me = this
      me.$router.go('/invest-home')
    },
    turnToTrade: function (a) {
      var me = this
      if (a === 0) {
        me.$router.go('/trade-home')
      } else {
        me.$router.go('/trade-home/fenhong-page')
      }
    },
    turnToAccountSave: function () {
      var me = this
      me.$router.go('/accsafe-home')
    },
    turnToAddress: function () {
      var me = this
      me.$router.go('/myaddress-home')
    },
    turnToMall: function () {
      var me = this
      me.$router.go('/integral-mall')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      myMsg: {},
      rankLei: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .head-bg {
    height: 105px;
    width: 100%;
    background: url('../../../static/images/head-bg.jpg') no-repeat;
    background-size: 100%;
    text-align: center;
  }
  .head-bg .div_left, .div_right {
    float: left;
    width: 50%;
    height: 100%;
    text-align: center;
  }
  .head-bg span {
    color: #ffabab;
    padding-top: 20px;
    font-size: 16px;
    display: block;
  }
  .head-bg h1 {
    margin: 0;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }
  .box-one {
    background-color: white;
  }
  .box {
    /*width: 100%;*/
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    line-height: 50px;
    padding-right: 15px;
    margin-left: 15px;
    overflow: hidden;
  }
  .box span {
    font-size: 16px;
  }
  /*.box:nth-child(3) {
    border-bottom: none;
    margin-bottom: 20px;
  }*/
  .box span:first-child {
    float: left;
  }
  .box span:last-child {
    float: right;
    color: #ababab;
  }
  .one span:last-child {
    color: #ababab;
    margin-right: 15px;
  }
  .fengge {
    float: right;
    color: #e9746b!important;
    margin-right: 10px;
  }
  .nexticon {
    float: right;
    color: #ababab;
    /*margin-right: 15px;*/
  }
</style>
