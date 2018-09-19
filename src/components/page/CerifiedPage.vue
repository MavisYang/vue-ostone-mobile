<template>
  <div class="page">
    <validator name="validation20">
      <div class="ipt-box">
        <i class="icon iconfont ren">&#xe606;</i>
        <input type="text" v-model="userName" class="form-control" readonly="readonly" v-validate:name="{ required: true }" placeholder="输入您的真实姓名" @keyup="haswrite(userName, 0)"><br />
        <i class="icon iconfont right" v-show="$validation20.name.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation20.name.valid && hasWrite[0]">&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe61b;</i>
        <input type="text" v-model="userID" class="form-control" readonly="readonly" v-validate:userid="{ required: true }" placeholder="输入您的证件号码" @keyup="haswrite(userID, 1)"><br />
        <i class="icon iconfont right" v-show="$validation20.userid.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation20.userid.valid && hasWrite[1]">&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe612;</i>
        <input type="text" v-model="bankCode" class="form-control" v-validate:bankcode="{ required: true }" placeholder="输入您购买产品时使用的银行卡号" @keyup="haswrite(bankCode, 2)"><br />
        <i class="icon iconfont right" v-show="$validation20.bankcode.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation20.bankcode.valid && hasWrite[2]">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'签约客户认证'" @click="cerifiedSure" ></x-button>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import Group from 'vux/src/components/group'
import XInput from 'vux/src/components/x-input'
import XButton from 'vux/src/components/x-button'
export default {
  components: {
    XInput,
    Group,
    XButton
  },
  ready () {
    var myMsgg = api.get('myAccMsg')
    this.userName = myMsgg.userName
    this.userID = myMsgg.userID
  },
  events: {
  },
  methods: {
    cerifiedSure: function () {
      var name = this.$validation20.name.valid
      var userid = this.$validation20.userid.valid
      var bankcode = this.$validation20.bankcode.valid
      if (name && userid && bankcode) {
        var me = this
        api.call({apiName: 'checkSignState', userID: this.userID, userName: this.userName, bankCode: this.bankCode}, function (result) {
          console.log(result)
          if (result.success === 1) {
            me.$dispatch('alertShow', '认证成功', '提示', '确定', '/accsafe-home')
          } else {
            me.$dispatch('alertShow', result.message, '提示', '确定')
          }
        })
      }
    },
    haswrite: function (val, idx) {
      if (val !== '') {
        this.hasWrite[idx] = true
      }
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      hasWrite: [false, false, false],
      userName: '',
      userID: '',
      bankCode: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  height: 100%;
  width: 100%;
  overflow-y: inherit;
  background-color: #fff;
}
.ipt-box {
  width: 100%;
  height: 50px;
  padding: 10px 15px;
  /*margin: 10px 0;*/
  border-bottom: 1px solid #dedede;
  position: relative;
}
.ipt-box i {
  display: inline-block;
  border: 1px solid #d7d7d7;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  color: #c32b38;
  float: left;
}
.ipt-box input {
  width: 70%;
  /*margin: 20px 0 0 0;*/
  height: 30px;
  line-height: 30px;
  /*border-radius: 3px;*/
  outline: none;
  border: none;
  padding-left: 10px;
  font-size: 14px;
  display: inline-block;
  float: left;
}
.right {
  position: absolute;
  right: 5px;
  top: 10px;
  color: green!important;
  border: none!important;
  /*display: none;*/
}
.wrong {
  position: absolute;
  right: 5px;
  top: 10px;
  border: none!important;
  color: #f00!important;
  /*display: none;*/
}
.weui_btn_mini {
  position: absolute;
  right: 40px;
  top: 10px;
  height: 30px;
  line-height: 30px;
  border: none;
  outline: none;
  background-color: #ccc!important;
  color: #000!important;
  font-size: 12px;
  padding: 0 10px;
  border-radius: 3px;
  /*display: none;*/
}
.tip-word {
  width: 100%;
  height: 30px;
  background-color: #f0eff5;
  color: #bbbbbb;
  padding: 0 15px;
}
.ren {
  font-size: 20px!important;
}
</style>
