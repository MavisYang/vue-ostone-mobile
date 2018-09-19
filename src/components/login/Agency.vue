<template>
  <div class="personal">
    <validator name="validation1">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe600;</i>
        <input type="text" v-model="userMobile" class="form-control" v-validate:message="{ required: true }" placeholder="请输入您的机构证件号码"><br />
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe612;</i>
        <input type="password" v-model="password" v-validate:message="{ required: true, minlength: 4 }" placeholder="请输入密码"><br />
      </div>
      <!-- <span class="forget-pass" @click="toForget">忘记密码</span> -->
      <div class="box">
        <p class="tip-word"><span class="tip-msg" v-show="!loginOk && hasClick"><i class="icon iconfont">&#xe615;</i>{{tipText}}</span></p>
        <x-button :text="'登录'" @click="login" ></x-button>
      </div>
      <!-- <button class="login-btn">登录</button> -->

    </validator>
    <!-- <h1 class="zhuce-tip" >还不是会员，去<span @click="toLogin">注册</span></h1> -->
  </div>
</template>

<script>
import api from '../../api'
import XButton from 'vux/src/components/x-button'
export default {
  components: {
    XButton
  },
  ready () {
  },
  methods: {
    toLogin: function () {
      this.$dispatch('goLogin')
    },
    toForget: function () {
      this.$dispatch('goForget')
    },
    login: function () {
      // this.hasClick = true
      var me = this
      api.login(this.userMobile, this.password, 1, function (result) {
        console.log(result)
        if (result.success) {
          me.loginOk = true
          window.G.user = result.data
          // api.set('myMsg', result.data)
          me.$dispatch('goToIndex')
          // window.alert(0)
        } else {
          me.tipText = result.message
          me.loginOk = false
        }
        me.hasClick = true
      })
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      password: '',
      userMobile: '',
      loginOk: false,
      hasClick: false,
      tipText: '账号或密码不正确，请重新输入'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.personal {
  height: 100%;
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
  overflow-y: scroll;
}
.personal input {
  width: 70%;
  /*margin: 20px 0 0 0;*/
  height: 30px;
  line-height: 30px;
  color: #000;
  /*border-radius: 3px;*/
  outline: none;
  /*background: #f00;*/
  border: none;
  /*padding: 10px;*/
  padding-left: 10px;
  /*padding-bottom: 3px;*/
  font-size: 14px;
  display: inline-block;
  float: left;
  transform: translate3d(0px, 0px, 1px);
}
.ipt-box {
  width: 100%;
  height: 50px;
  padding: 10px 0;
  /*margin: 10px 0;*/
  border-bottom: 1px solid #dedede;
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
.login-btn {
  width: 100%;
  border: none;
  outline: none;
  background: #888;
  height: 30px;
  margin-top: 20px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
}
.forget-pass {
  color: blue;
  float: right;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
}
.zhuce-tip {
  font-size: 12px;
  text-align: center;
  margin-top: 70px;
  cursor: pointer;
}
.zhuce-tip span {
  color: #c32b38;
}
.weui_btn {
  margin-top: 20px;
}
.tip-word {
  width: 100%;
  height: 30px;
  font-size: 12px;
  color: #f00;
}
.tip-msg {
  /*display: none;*/
}
.tip-msg i {
  margin-right: 10px;
}
</style>
