<template>
  <div class="page">
    <div class="product-networth" v-for="list in netWorths" @click="toNetWorth(list.productID)">
      <h1 class="title" :class="list.cpzt===1?'red':''">{{list.productName}}</h1>
      <ul>
        <li class="col-xs-4" style="width: 46%">
          <span class="unit">{{list.unitProfit}}</span>
          <span class="little">单位净值</span>
        </li>
        <li class="col-xs-4" style="width: 27%">
          <span class="accu">{{list.accumulatedProfit}}</span>
          <span class="little">累计净值</span>
        </li>
        <li class="col-xs-4" style="width: 27%">
          <span class="prof">{{list.profitDate}}</span>
          <span class="little">净值日期</span>
        </li>
        <div class="clearfix"></div>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../../api'
export default {
  components: {
  },
  ready () {
    this.$dispatch('loading-start', '正在获取信息')
    this.getNetWorth()
  },
  events: {
  },
  methods: {
    getNetWorth: function () {
      var me = this
      api.getMyAccountInfo(function (result) {
        if (result.success) {
          console.log(result)
          api.set('myAccMsg', result.data)
        }
      })
      api.getProductProfitList(function (result) {
        console.log(result)
        if (result.success) {
          me.netWorths = result.data
          for (var key in me.netWorths) {
            var proDate = me.netWorths[key].profitDate + ''
            me.netWorths[key].profitDate = proDate.substring(0, 4) + '/' + proDate.substring(4, 6) + '/' + proDate.substring(6, 8)
          }
        }
        // else {
        //   if (result.message === 'NEEDLOGIN') {
        //     me.$dispatch('alertShow', '请先登录', '没有您的信息', '马上登录', '/login-home/login-page')
        //     // me.$router.go('/login-home/login-page')
        //   }
        // }
        // console.log(me.netWorths)
        me.$dispatch('loading-end', 'loading')
      })
    },
    toNetWorth: function (proId) {
      // console.log(proId)
      var me = this
      // console.log(proId)
      api.set('netWorthProductID', proId)
      me.$router.go('/networth-home')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      netWorths: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.claearfix {
  clear: both;
}
.page {
  width: 100%;
  height: 100%;
  background-color: #F2F2F2;
  overflow-y: scroll;
}
.product-networth {
  width: 100%;
  height: 111px;
  background: #fff;
  /*border-bottom: 1px solid #ccc;*/
  padding-left: 15px;
  margin-bottom: 6px;
  /*padding-right: 15px;*/
}
ul {
  margin-top: 13px;
}
ul li {
  list-style: none;
  padding-left: 0;
}
.col-xs-4:nth-child(2) {
  margin-top: 6px;
  text-align: center;
}
.col-xs-4:nth-child(3) {
  margin-top: 8px;
  text-align: right;
}
.title {
  margin: 0;
  padding: 5px 0;
  font-size: 14px;
  font-weight: normal;
  border-bottom: 1px solid #e2e2e2;
  height: 40px;
  line-height: 40px;
  width: 100%;
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  padding-right: 15px;
}
.red {
    color: #e84a3e;
}
.little {
  font-size: 12px;
  color: #888;
}
.unit {
  font-size: 18px;
  display: block;
  color: #222;
  /*height: 20px;*/
}
.accu {
  color: #e84a3e;
  font-size: 14px;
  display: block;
  /*height: 20px;*/
}
.prof {
  font-size: 12px;
  display: block;
  /*height: 20px;*/
  color: #222;
  /*line-height: 25px;*/
}
</style>
