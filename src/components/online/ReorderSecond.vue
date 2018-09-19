<template>
  <div class="order-second">
    <div class="money">
      <span class="money-title">投资金额（万元）</span>
      <input type="text" class="money-inp" v-model="money" @keyup="yanzheng" :placeholder="minMoney"><span v-show="wanShow">万元</span>
      <i class="icon iconfont cuo shu" v-show="isOk === 0">&#xe615;</i>
      <i class="icon iconfont dui shu" v-show="isOk === 1">&#xe60b;</i>
    </div>
    <!-- <div class="date">
      <group>
        <datetime
          title="产品期限"
          year-row="{value}年"
          month-row="{value}月"
          day-row="{value}日" confirm-text="确认"
          cancel-text="取消" ></datetime>
      </group>
    </div> -->
    <div class="sure-order">
      <validator name="validationCh">
        <input type="checkbox" :checked="check" name="name" v-validate:agreement="{ required: true }" @mouseup="change"><span @click="agreeShow">   同意风险揭示书内容</span>
        <i class="icon iconfont dui" v-show="$validationCh.agreement.valid">&#xe60b;</i>
        <i class="icon iconfont cuo" v-show="!$validationCh.agreement.valid && hasCheck">&#xe615;</i>
      </validator>
      <button type="button" class="yes-order" @click="order">确定预约</button>
    </div>
  </div>
</template>

<script>
import api from '../../api'
// import Group from 'vux/src/components/group'
// import Datetime from 'vux/src/components/datetime'
export default {
  components: {
    // Group,
    // Datetime
  },
  props: {
  },
  ready () {
    this.lists = api.get('productDate')
    this.minMoney = '最低限额' + this.lists.minPrice + '万元'
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ActivityPage!',
      money: '',
      lists: {},
      minMoney: '',
      check: false,
      isOk: -1,
      hasCheck: false,
      wanShow: false,
      agreements: '<h1>用户风险揭示书内容</h1>'
    }
  },
  methods: {
    agreeShow: function () {
      this.$dispatch('agreementShow', this.lists.riskInfo)
    },
    yanzheng: function () {
      if (this.money != '') {
        this.wanShow = true
      } else {
        this.wanShow = false
      }
      if (parseInt(this.money) >= parseInt(this.lists.minPrice)) {
        this.isOk = 1
      } else {
        this.isOk = 0
      }
      // console.log(this.money)
      // console.log(this.isOk)
    },
    order: function () {
      this.hasCheck = true
      if (this.isOk === -1) {
        this.isOk = 0
      }
      var myDate = new Date()
      var nowDate = myDate.toLocaleDateString().replace(/\//g, '-') + ' ' + myDate.getHours() + ':' + myDate.getMinutes()
      console.log(nowDate)
      var me = this
      if (this.isOk === 1 && this.$validationCh.agreement.valid) {
        api.orderProduct(this.lists.productID, '', '', this.money, nowDate, function (res) {
          console.log(res)
          if (res.result === 1) {
            me.$dispatch('alertShow', '预订成功', '提示', '返回首页', '/ostone-home')
            // me.$router.go('/ostone-home')
          } else {
            me.$dispatch('alertShow', res.message, '提示', '重新预订')
          }
        })
      }
    },
    change: function () {
      this.hasCheck = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.money {
  height: 44px;
  background-color: #fff;
  line-height: 44px;
  padding-left: 15px;
  position: relative;
  padding-right: 20px;
}
.money-title {
  /*margin-right: 5px;*/
  font-size: 14px;
}
.money-inp {
  border: none;
  outline: none;
  text-align: right;
  display: inline-block;
  width: 120px;
}
.sure-order {
  padding: 20px 15px;
}
.yes-order {
  width: 100%;
  display: block;
  margin: 0 auto;
  color: #fff;
  font-size: 14px;
  border: none;
  outline: none;
  height: 40px;
  line-height: 40px;
  margin-top: 20px;
  background-color: #e84a3e;
  border-radius: 5px;
}
.shu {
  position: absolute;
  right: 10px;
  top: 0px;
}
.cuo {
  font-size: 12px;
  color: #f00;
}
.dui {
  font-size: 12px;
  color: green;
}
.right {
  color: green;
}
.wrong {
  color: #f00;
}
</style>
<style media="screen">
.weui_cell_bd > p {
  font-size: 16px;
}
</style>
