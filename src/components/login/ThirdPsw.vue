<template>
  <div class="third-psw">
    <validator name="validation6">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="password" class="form-control" v-validate:password="{ password: true }" placeholder="设置您的登录密码" @keyup="haswrite(passWord, 0)"><br />
        <i class="icon iconfont right" v-show="$validation6.password.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation6.password.valid && hasWrite[0]">&#xe615;</i>
      </div>
      <p class="tip-word">
        <span>
          <i class="icon iconfont" v-else>&#xe615;</i>
          密码为6-20位，需数字与字母组合
        </span>
      </p>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="password2" class="form-control" v-validate:password2="{ required: true }" placeholder="再次输入新密码" @keyup="haswrite(passWord2, 1)"><br />
        <i class="icon iconfont right" v-show="password2 === password && !$validation6.password2.required">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="password2 !== password && hasWrite[1]">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'提交新密码'" @click="goToNext" ></x-button>
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
  props: {
    mobile: String,
    token: String
  },
  methods: {
    goToNext: function () {
      var psw = this.$validation6.password.valid
      if (psw && this.password2 === this.password) {
        var me = this
        api.resetPassword(this.mobile, this.token, this.password, function (result) {
          console.log(result)
          if (result.sucess) {
            me.$dispatch('alertShow', '修改成功', '提示', '马上登录', '/login-home/login-page')
            // me.$dispatch('goLogin')
          } else {
            me.$dispatch('alertShow', result.message, '提示', '重新修改')
            me.$dispatch('pswToNext', -1)
          }
        })
        // this.$dispatch('pswToNext', this.index)
      }
    },
    haswrite: function (val, idx) {
      this.hasWrite.$set(idx, true)
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      index: 1,
      userMobile: '18311119999',
      userName: '',
      userID: '',
      password: '',
      password2: '',
      hasWrite: [false, false],
      isDisabled: false,
      btnText: '获取',
      alertShow: false,
      value: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.form-div {
  width: 100%;
  height: 42px;
  background: #fff;
  font-size: 12px;
  position: relative;
}*/
/*.form-div:first-child {*/
  /*margin-top: 20px;*/
/*}*/
/*.form-div > input {
  border: none;
  outline: none;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  padding: 10px;
}
.form-div > span {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}
.weui_btn {
  background: #888;
  color: #fff;
}
.icon {
  position: absolute;
  left: 15px;
  top: 9px;
  z-index: 1;
  color: #999;
}
.get-code {
  position: absolute;
  right: 40px;
  top: 10px;
  padding: 2px 20px;
  height: 24px;
  border: 1px solid #999;
  outline: none;
  background: none;
}
.weui_cells {
  margin-top: 0!important;
}
.next-btn {
  width: 100%;
  padding: 0 20px;
  margin-top: 30px;
}
.title {
  font-size: 12px;
  padding: 5px 10px;
  color: #888;
}
.name-icon {
  font-size: 18px;
}
.circle {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 1px solid #888;
  color: #888;
  border-radius: 50%;
  text-align: center;
  line-height: 15px;
  margin-right: 5px;
}*/
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
</style>
<style>

</style>
