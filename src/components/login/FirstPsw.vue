<template>
  <div class="first-psw">
    <validator name="validation5">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe600;</i>
        <input type="text" v-model="userMobile"
          class="form-control"
          v-validate:phone="{ phone: true }"
          placeholder="请输入手机号"
          @keyup="haschange(userMobile, 0)"
        ><br />
        <i class="icon iconfont right"
          v-show="$validation5.phone.valid"
        >&#xe60b;</i>
        <i class="icon iconfont wrong"
          v-show="!$validation5.phone.valid && hasWrite[0]"
        >&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe612;</i>
        <input type="text" v-model="token" class="form-control"
          v-validate:token="{ required: true }"
          placeholder="短信验证码"
          detect-change="off" detect-blur="on"
          @blur="haschange(token, 1)"
        ><br />
        <x-button type="primary" :text="btnText"
          :disabled="isDisabled"
          @click="sendCode"
          :mini="true">
        </x-button>
        <i class="icon iconfont right"
          v-show="rightShow">
          &#xe60b;
        </i>
        <i class="icon iconfont wrong"
          v-show="!rightShow && hasWrite[1]">
          &#xe615;
        </i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont name">&#xe606;</i>
        <input type="text" v-model="userName"
          class="form-control"
          v-validate:name="{ required: true }"
          placeholder="您的真实姓名"
          @keyup="haschange(userName, 2)"
        ><br />
        <i class="icon iconfont right"
          v-show="$validation5.name.valid"
        >&#xe60b;</i>
        <i class="icon iconfont wrong"
          v-show="!$validation5.name.valid && hasWrite[2]"
        >&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe61b;</i>
        <input type="text" v-model="userID"
          class="form-control"
          v-validate:userid="{ required: true }"
          placeholder="与您账户绑定的证件号码"
          @keyup="haschange(userID, 3)"
        ><br />
        <i class="icon iconfont right"
          v-show="$validation5.userid.valid"
        >&#xe60b;</i>
        <i class="icon iconfont wrong"
          v-show="!$validation5.userid.valid && hasWrite[3]"
        >&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'身份验证'" @click="goToNext" ></x-button>
    </div>
    <confirm :show.sync="confirmShow" confirm-text="好" cancel-text="取消" title="确认手机号码" @on-confirm="toSend" @on-cancel="">
      <p style="text-align:center;">{{codeText}}<br/>
        +86 {{userMobile}}
      </p>
    </confirm>
  </div>
</template>

<script>
import api from '../../api'
import Group from 'vux/src/components/group'
import XInput from 'vux/src/components/x-input'
import XButton from 'vux/src/components/x-button'
import Confirm from 'vux/src/components/confirm'
export default {
  components: {
    XInput,
    Group,
    XButton,
    Confirm
  },
  methods: {
    goToNext: function () {
      for (var key in this.hasWrite) {
        this.hasWrite.$set(key, true)
      }
      var phone = this.$validation5.phone.valid
      var name = this.$validation5.name.valid
      var userid = this.$validation5.userid.valid
      if (phone && this.rightShow && name && userid) {
        // -------------------------------------------------------------------------
        var me = this
        api.validToken({userMobile: this.userMobile, token: this.token, userName: this.userName, userID: this.userID}, function (result) {
          console.log(result)
          if (result.success) {
            me.$dispatch('pswToNext', me.index, me.userMobile, me.token)
          } else {
            me.$dispatch('alertShow', result.message, '提示', '重新填写')
          }
        })
      }
    },
    // 点击发送验证码
    sendCode: function () {
      if (this.$validation5.phone.valid) {
        if (this.canVolice) {
          this.codeText = '请注意接听，我们将发送语音验证码到这个号码：'
        } else {
          this.codeText = '我们将发送验证码短信到这个号码：'
        }
        this.confirmShow = true
      }
    },
    toSend: function () {
      // this.btnText = '正在发送'
      const _this = this
      if (this.$validation5.phone.valid) {
        this.isDisabled = true
        this.btnText = '正在发送'
        // console.log(this.mainMsg.userMobile)
        api.sendToken({userMobile: this.userMobile, isRegister: false, isVoice: this.canVolice}, function (result) {
          console.log(result)
          if (result.success) {
            _this.btnText = '发送成功'
            var count = 60
            var timer = window.setInterval(function () {
              if (count < 1) {
                window.clearInterval(timer)
                _this.btnText = '语音验证'
                _this.isDisabled = false
                _this.canVolice = true
                return
              }
              _this.btnText = count + 's后可重新发送'
              count--
            }, 1000)
          } else {
            _this.btnText = '稍后重试'
            _this.$dispatch('alertShow', result.message, '提示', '确定')
          }
        })
      } else {
        this.hasWrite[0] = true
      }
    },
    haschange: function (val, idx) {
      this.hasWrite.$set(idx, true)
      var me = this
      if (idx === 1 ) {
        if (this.token != '') {
          this.rightShow = true
        } else {
          this.rightShow = false
        }

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
      index: 0,
      userMobile: '',
      token: '',
      userName: '',
      userID: '',
      isDisabled: false,
      btnText: '获取验证码',
      canVolice: false,
      confirmShow: false,
      rightShow: false,
      hasWrite: [false, false, false, false],
      value: '',
      codeText: '我们将发送验证码短信到这个号码：'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.form-div {
  width: 100%;
  height: 42px;
  background: #fff;*/
  /*margin-bottom: 20px;*/
  /*font-size: 12px;
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
}*/
/*.form-div > span {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}*/
.weui_btn_mini {
  position: absolute;
  right: 40px;
  top: 10px;
  width: auto!important;
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
}*/
/*.check-box span {
  font-size: 12px;
  float: left;
  height: 20px;
  line-height: 20px;
}*/

/*.weui_btn {
  background: #888;
  color: #fff;
}*/
/*.icon {
  position: absolute;
  left: 15px;
  top: 9px;
  z-index: 1;
  color: #999;
}*/
/*.get-code {
  position: absolute;
  right: 40px;
  top: 10px;
  padding: 2px 20px;
  height: 24px;
  border: 1px solid #999;
  outline: none;
  background: none;
}*/
/*.next-btn {
  width: 100%;
  padding: 0 20px;
  margin-top: 30px!important;
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
.name {
  font-size: 20px!important;
}

</style>
<style>

/*.weui_cells {
  margin-top: 0!important;
}
.vux-no-group-title {
  margin-top: 0!important;
}*/
</style>
