<template>
  <div class="products">
    <div class="product-li" v-for="data in datas" @click="loading">
      <h1 class="title">{{data.productName}}</h1>
      <div class="msg">
        <div class="col-xs-4 profit">
          <h2>{{data.predictYearProfit}}</h2>
          <span>{{profit}}</span>
        </div>
        <div class="col-xs-4 timeline">
          <div>
            <h2>{{data.deadLine}}</h2>
            <span>{{data.qxlx === 1?'天':'个月'}}</span>
          </div>
          <span class="price">{{data.minPrice}}万</span>起投
        </div>
        <div class="col-xs-4 order"><div class="box" @click="goToOrder(data)"><span>{{order}}</span></div></div>
        <div class="clearfix"> </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: Array
  },
  ready () {
    var user = window.G.user
    if (!user) {
      this.$router.go('/login-home/login-page')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ActivityPage!',
      profit: '业绩比较基准',
      timeline: '期限',
      order: '立即预约'
    }
  },
  methods: {
    loading: function () {
      // this.$dispatch('loading-start', '正在获取信息')
      // setTimeout(function () {
      //   this.$dispatch('loading-end', 'loading')
      // }, 1000)
    },
    goToOrder: function (data) {
      this.$dispatch('confirmTip', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clearfix {
  clear: both;
}
.products {
  color: #000;
  background: #F2F2F2;
  font-size: 12px;
  margin-top: 40px;
  margin-bottom: 57px;
}
.product-li {
  background: #fff;
  margin-bottom: 10px;
  height: 105px;
  padding-left: 15px;
}
.title {
  margin: 0;
  font-size: 12px;
  /*padding: 10px 5px;*/
  height: 35px;
  border-bottom: 1px solid #e2e2e2;
  line-height: 35px;
  font-weight: bold;
  /*超出部分省略号*/
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  /*color: #e84a3e;*/
}
.profit h2 {
  font-weight: normal;
}
.msg {
  padding-top: 12px;
}
.col-xs-4 {
  height: 50px;
  padding: 0;
}
.timeline {
  padding-top: 7px;
  text-align: center;
  color: #999999;
}
.order {
  padding: 17px 8px 0 20px;
  font-size: 12px;
}
.order .box{
  /*background: #868686;*/
  /*border-radius: 10px;*/
  padding: 5px 10px;
  /*s*/
  background-color: #e84a3e;
  text-align: center;

}
.box span {
  color: #fff;
}
/*.box h3 {
  color: #A9A9A9;
  font-size: 12px;
}*/
/*s*/
.product-li .msg .profit h2 {
  color: #e84a3e;
  font-size: 20px;
}
.product-li .msg .profit span {
  color: #999999;
  font-size: 12px;
}
.product-li .msg .timeline h2 {
  /*color: #e84a3e;*/
  font-size: 16px;
  display: inline-block;
  color: #e84a3e;
  font-weight: normal;
}
.product-li .msg .timeline span {
  /*color: #999999;*/
  font-size: 12px;
}
.price {
  color: #e84a3e;
}
</style>
