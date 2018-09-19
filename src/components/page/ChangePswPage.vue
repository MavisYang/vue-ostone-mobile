<template>
  <div class="page">
    <validator name="validation7">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="oldPassword" class="form-control" placeholder="输入您的旧密码" ><br />
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="newPassword" class="form-control" v-validate:password="{ password: true }" placeholder="设置您的新密码" @keyup="haswrite(passWord, 0)"><br />
        <i class="icon iconfont right" v-show="$validation7.password.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation7.password.valid && hasWrite[0]">&#xe615;</i>
      </div>
      <p class="tip-word">
        <span>
          <i class="icon iconfont" v-else>&#xe615;</i>
          密码为6-20位，需数字与字母组合
        </span>
      </p>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="newPassword2" class="form-control" v-validate:password2="{ required: true }" placeholder="再次输入新密码" @keyup="haswrite(passWord2, 1)"><br />
        <i class="icon iconfont right" v-show="newPassword2 === newPassword && !$validation7.password2.required">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="newPassword2 !== newPassword && hasWrite[1]">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'提交新密码'" @click="changePsw" ></x-button>
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
    changePsw: function () {
      var psw = this.$validation7.password.valid
      if (psw && this.newPassword === this.newPassword2) {
        var me = this
        api.updatePassword(this.oldPassword, this.newPassword, function (result) {
          console.log(result)
          if (result.sucess) {
            api.logOut()
            // api.set('myMsg', '')
            api.set('myAccMsg', '')
            me.$dispatch('alertShow', '修改成功', '提示', '重新登录', '/login-home/login-page')
            // me.$router.go('/login-home/login-page')
          } else {
            me.$dispatch('alertShow', result.message, '提示', '重新输入')
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
      hasWrite: [false, false],
      newPassword: '',
      newPassword2: '',
      oldPassword: ''
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

</style>
