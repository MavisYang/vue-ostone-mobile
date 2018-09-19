<template>
  <div class="third-person">
    <process :index="index"></process>
    <div class="agment">
      <!-- <pre> -->
      <p>
        根据中国证券监督管理委员会令第105号《私募投资基金监督管理暂行办法》，
        私募基金的合格投资者是指具备相应风险识别能力和风险承担能力，
        投资于单只私募基金的金额不低于100万元且符合下列相关标准的机构和个人：
      </p>
      <p>
        （一）净资产不低于1000万元的机构；
      </p>
      <p>
        （二）金融资产不低于300万元或者最近三年个人年均收入不低于50万元的个人。
      </p>
      <p>
        前款所称金融资产包括银行存款、股票、债券、基金份额、资产管理计划、银行理财产品、信托计划、保险产品、期货权益等。
      </p>
      <!-- </pre> -->
    </div>
    <validator name="validation4">
      <div class="ipt-box2">
        <input type="checkbox" class="check" v-validate:agreement="{ required: true }" @mouseup="change"><span class="agree">特定对象确认</span>
        <i class="icon iconfont right" v-show="$validation4.agreement.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation4.agreement.valid && hasCheck">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'下一步'" @click="goToNext" ></x-button>
      <x-button :text="'返回上一步'" @click="goToPrev" ></x-button>
    </div>
  </div>
</template>

<script>
import Process from './process'
import XButton from 'vux/src/components/x-button'
export default {
  components: {
    Process,
    XButton
  },
  methods: {
    goToPrev: function () {
      this.$dispatch('toPrev', this.index)
    },
    goToNext: function () {
      this.hasCheck = true
      if (this.$validation4.agreement.valid) {
        // console.log(0)
        this.$dispatch('toNext', this.index)
      }
    },
    change: function () {
      this.hasCheck = true
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      index: 2,
      // agment: '项目及交易说明书'
      hasCheck: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.third-person {
  height: 100%;
}
.agment {
  width: 100%;
  height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
  /*background-color: #eee;*/
  padding: 10px;
  border: 1px solid #ddd;
  /*margin-top: 10px;*/
}
.agment h1 {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}
.agment h2 {
  font-size: 14px;
  font-weight: 700;
}
.agment span {
  font-weight: 12px;
  display: block;
}
.ipt-box2 {
  width: 100%;
  height: 50px;
  padding: 10px 15px;
  position: relative;
}
.check, .agree {
  float: left;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.right {
  position: absolute;
  right: 20px;
  top: 10px;
  color: green!important;
  border: none!important;
  /*display: none;*/
}
.wrong {
  position: absolute;
  right: 20px;
  top: 10px;
  border: none!important;
  color: #f00!important;
  /*display: none;*/
}
/*.check-box {
  width: 100%;
  padding: 0 20px;
  height: 20px;
  line-height: 20px;
  margin: 20px 0;
}*/
/*.check-box input {
  float: left;
  height: 20px;
  line-height: 20px;
}
.check-box span {
  font-size: 12px;
  float: left;
  height: 20px;
  line-height: 20px;
}*/
.weui_btn {
  background: #888;
  color: #fff;
}
</style>
