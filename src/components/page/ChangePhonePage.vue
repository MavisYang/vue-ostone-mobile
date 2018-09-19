<template>
  <div class="page">
    <validator name="validation22">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe600;</i>
        <input type="text" v-model="userMobile"
          class="form-control"
          v-validate:phone="{ phone: true }"
          placeholder="请输入手机号"
          @keyup="haschange(userMobile, 0)"
        ><br />
        <i class="icon iconfont right"
          v-show="$validation22.phone.valid"
        >&#xe60b;</i>
        <i class="icon iconfont wrong"
          v-show="!$validation22.phone.valid && hasWrite[0]"
        >&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe603;</i>
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
    </validator>
    <div class="next-btn">
      <x-button :text="'提交'" @click="changePhone" ></x-button>
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
  },
  events: {
  },
  methods: {
    changePhone: function () {
      for (var key in this.hasWrite) {
        this.hasWrite.$set(key, true)
      }
      var phone = this.$validation22.phone.valid
      var me = this
      if (phone) {
        if (this.rightShow) {
          api.updateAccountInfo('USERMOBILE', this.userMobile, function (result) {
            console.log(result)
            if (result.sucess) {
              me.$dispatch('alertShow', '修改成功', '提示', '确定', '/accsafe-home')
              // me.$router.go('/accsafe-home')
            } else {
              me.$dispatch('alertShow', result.msg, '提示', '重新修改')
            }
          })
        } else {
          api.validToken({userMobile: this.userMobile, token: this.token}, function (result) {
            // console.log(result)
            if (result.success) {
              me.rightShow = true
              api.updateAccountInfo('USERMOBILE', me.userMobile, function (result) {
                console.log(result)
                if (result.success) {
                  me.$dispatch('alertShow', '修改成功', '提示', '确定', '/accsafe-home')
                  // me.$router.go('/accsafe-home')
                } else {
                  me.$dispatch('alertShow', result.msg, '提示', '重新修改')
                }
              })
            } else {
              me.rightShow = false
            }
          })
        }

      }
    },
    // 点击发送验证码
    sendCode: function () {
      const _this = this
      if (this.$validation22.phone.valid) {
        this.isDisabled = true
        this.btnText = '正在发送'
        // console.log(this.mainMsg.userMobile)
        api.sendToken({userMobile: this.userMobile}, function (result) {
          console.log(result)
          if (result.success) {
            _this.btnText = '发送成功'
            var count = 60
            var timer = window.setInterval(function () {
              if (count < 1) {
                window.clearInterval(timer)
                _this.btnText = '重新发送'
                _this.isDisabled = false
                return
              }
              _this.btnText = count + 's后重新发送'
              count--
            }, 1000)
          } else {
            _this.btnText = '稍后重试'
          }
        })
      } else {
        this.hasWrite[0] = true
      }
    },
    toSend: function () {
      // this.btnText = '正在发送'
      const _this = this
      if (this.$validation22.phone.valid) {
        this.isDisabled = true
        this.btnText = '正在发送'
        // console.log(this.mainMsg.userMobile)
        api.sendToken(this.userMobile, function (result) {
          console.log(result)
          if (result.success) {
            _this.btnText = '发送成功'
            var count = 60
            var timer = window.setInterval(function () {
              if (count < 1) {
                window.clearInterval(timer)
                _this.btnText = '重新发送'
                _this.isDisabled = false
                return
              }
              _this.btnText = count + 's后重新发送'
              count--
            }, 1000)
          } else {
            _this.btnText = '稍后重试'
          }
        })
      } else {
        this.hasWrite[0] = true
      }
    },
    haschange: function (val, idx) {
      this.hasWrite.$set(idx, true)
      var me = this
      if (idx === 1) {
        api.validToken(this.userMobile, this.token, function (result) {
          console.log(result)
          if (result.success) {
            me.rightShow = true
          } else {
            me.rightShow = false
          }
        })
      }
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'ProductPage!',
      msg: 'ProductPage!',
      index: 0,
      userMobile: '',
      token: '',
      isDisabled: false,
      btnText: '获取验证码',
      confirmShow: false,
      rightShow: false,
      hasWrite: [false, false],
      value: ''
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
  /*padding-top: 100px;*/
}
.ipt-box {
  width: 100%;
  height: 50px;
  padding: 10px 15px;
  /*margin: 10px 0;*/
  border-bottom: 1px solid #dedede;
  /*border-top: 1px solid #dedede;*/
  position: relative;
}
.ipt-box:last-child {
  border-top: none;
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
.next-btn {
  margin-top: 50px;
}
.weui_btn_mini {
  position: absolute;
  right: 40px;
  top: 10px;
  height: 30px;
  width: auto!important;
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
