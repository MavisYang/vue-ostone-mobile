<template>
  <div class="reorder-first">
    <div class="first-top">
      <div class="title-msg">
        <h1>业绩比较基准</h1>
        <span class="count">{{lists.predictYearProfit}}</span>
        <span class="col-xs-6 one">{{lists.riskLevel}}</span>
        <span class="col-xs-6">{{lists.minPrice}}万起购</span>
      </div>
      <div class="tip-box">
        <div class="title-tip" v-show="hasOverRisk">
          <span class="gantan">!</span><span>当前产品风险大于您的风险评估</span>
        </div>
      </div>
      <div class="title-time">
        <span class="time-name">产品期限</span>
        <span class="time-key">{{lists.deadLine}}{{lists.qxlx === 1?'天':'个月'}}</span>
      </div>
    </div>
    <div class="first-middle">
      <h1 class="product-indec">产品简介</h1>
      <ul class="lis">
        <li><span>产品名称</span><span class="value">{{lists.productName}}</span></li>
        <li><span>产品代码</span><span class="value">{{lists.productCode}}</span></li>
        <li><span>产品状态</span><span class="value">在售</span></li>
        <li><span>管理机构</span><span class="value">{{lists.manager}}</span></li>
        <li><span>开放期</span><span class="value">{{lists.collectDay}}</span></li>
        <li><span>募集行</span><span class="value">{{lists.mjh}}</span></li>
        <li><span>账号名称</span><span class="value">{{lists.zhmc}}</span></li>
        <li><span>募集账号</span><span class="value">{{lists.mjzh}}</span></li>
      </ul>
    </div>
    <button class="order-btn" @click="atOnceOrder">立即预约</button>
  </div>
</template>

<script>
import api from '../../api'
export default {
  // props: {
  //   lists: Object
  // },
  ready () {
    this.lists = api.get('productDate')
    this.hasOverRisk = api.get('hasOverRisk')
    // if (this.lists.deadLine === "") {
    //   this.lists.deadLine = "0"
    // }
    console.log(this.hasOverRisk)
    console.log(this.lists)
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ActivityPage!',
      lists: {},
      hasOverRisk: true
    }
  },
  methods: {
    atOnceOrder: function () {
      this.$dispatch('atOnceOrder', this.lists)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.reorder-first {
  height: 100%;
  background: #F1EFF6;
  overflow-y: scroll;
  padding-bottom: 20px;
}
.first-top {
  height: 180px;
}
.title-msg {
  height: 100px;
  background: #d83844;
  color: #333;
  text-align: center;
}
.title-msg h1 {
  margin: 0;
  padding: 5px 0;
  font-size: 14px;
  color: #ffabab;
}
.title-msg .col-xs-6 {
  color: #ffd2d2;
}
.count {
  color: white;
  font-size: 18px;
  display: block;
  font-weight: bold;
  margin: 5px 0;
}
/*.one {
  border-right: 1px solid #fff;
}*/
.tip-box {
  height: 30px;
  background: #d83844;
}
.title-tip {
  height: 30px;
  text-align: center;
  background: #d64c58;
  line-height: 30px;
  color: #ffd2d2;
  margin-bottom: 10px;
}
.title-tip .gantan {
  display: inline-block;
  width: 17px;
  height: 17px;
  line-height: 17px;
  border: 1px solid #ffd2d2;
  border-radius: 50%;
  color: #ffd2d2;
  margin-right: 5px;
}
.title-time {
  height: 40px;
  line-height: 40px;
  background: #fff;
  padding: 0 10px;
  color: black;
}
.time-name {
  float: left;
}
.time-key {
  float: right;
}
.value {
  display: inline-block;
  width: 230px;
  display:block;
  /*white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;*/
  text-align: right;
}

.first-middle {
  /*height: 250px;*/
  background: #fff;
  margin-top: 10px;
}
.product-indec {
  margin: 0;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #aaa;
  font-weight: normal;
}
.lis {
  list-style: none;
}
.lis > li {
  min-height: 40px;
  line-height: 40px;
  padding: 0 10px;
  overflow: hidden;
  border-bottom: 1px dashed #dbdbdb;
}
.lis > li:last-child {
  border-bottom: none;
}
li > span:first-child {
  float: left;
  color: #ababab;
}
li > span:last-child {
  float: right;
  color: #111;
}

.order-btn {
  width: 90%;
  display: block;
  margin: 0 auto;
  color: #fff;
  font-size: 12px;
  border: none;
  outline: none;
  height: 40px;
  line-height: 40px;
  margin-top: 20px;
  background-color: #e84a3e;
  border-radius: 5px;
}
</style>
