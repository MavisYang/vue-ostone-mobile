<template>
  <div class="first-person">
    <validator name="validation1">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe600;</i>
        <input type="text" v-model="mainMsg.userMobile" class="form-control" v-validate:phone="{ phone: true }" @keyup="haschange(userMobile, 0)" placeholder="请输入手机号" ><br />
        <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="sendCode" :mini="true"></x-button>
        <i class="icon iconfont right" v-if="$validation1.phone.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-if="!$validation1.phone.valid && hasWrite[0]">&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe612;</i>
        <input type="text" v-model="token" v-validate:token="{ required: true }" placeholder="请输入验证码" detect-change="off" detect-blur="on" @blur="haschange(token, 1)"><br />
        <i class="icon iconfont right" v-show="rightShow">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!rightShow && hasWrite[1]">&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="mainMsg.password" v-validate:password="{ password: true }" placeholder="6位以上字母与数字组合的密码" @keyup="haschange(passWord, 2)"><br />
        <i class="icon iconfont right" v-show="$validation1.password.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation1.password.valid && hasWrite[2]" >&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe607;</i>
        <input type="password" v-model="passWord2" placeholder="再次输入密码" v-validate:password2="{ required: true }" @keyup="haschange(passWord2, 3)"><br />
        <i class="icon iconfont right" v-show="mainMsg.password === passWord2 && !$validation1.password2.required">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="mainMsg.password !== passWord2 && hasWrite[3]">&#xe615;</i>
      </div>
      <div class="ipt-box2">
        <input type="checkbox" class="check" v-validate:agreement="{ required: true }" @mouseup="change"><span class="agree" @click="agreementShow">用户注册协议</span>
        <i class="icon iconfont right" v-show="$validation1.agreement.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation1.agreement.valid && hasCheck">&#xe615;</i>
      </div>
      <x-button :text="'下一步'" @click="goToNext" ></x-button>
      <span class="to-login">已注册用户，请<span @click="goLogin">登录</span></span>
    </validator>
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
  methods: {
    goLogin: function () {
      this.$router.go('/login-home')
    },
    agreementShow: function () {
      this.$dispatch('agreementShow', this.agreements)
    },
    goToNext: function () {
      for (var key in this.hasWrite) {
        this.hasWrite.$set(key, true)
      }
      // console.log(this.hasWrite[0])
      this.hasCheck = true
      var pone = this.$validation1.phone.valid
      var psw = this.$validation1.password.valid
      var chk = this.$validation1.agreement.valid
      if (pone && this.rightShow && psw && this.mainMsg.password === this.passWord2 && chk) {
          this.$dispatch('toNext', this.index, this.mainMsg)
      }
    },
    sendCode: function () {
      const _this = this
      if (this.$validation1.phone.valid) {
        this.isDisabled = true
        this.btnText = '正在发送'
        // console.log(this.mainMsg.userMobile)
        api.sendToken({userMobile: this.mainMsg.userMobile, isRegister: true, isVoice: this.isVolice}, function (result) {
          console.log(result)
          if (result.success) {
            _this.btnText = '发送成功'
            var count = 60
            var timer = window.setInterval(function () {
              if (count < 1) {
                window.clearInterval(timer)
                _this.btnText = '发送语音验证'
                _this.isDisabled = false
                _this.isVolice = true
                return
              }
              _this.btnText = count + 's后重新发送'
              count--
            }, 1000)
          } else {
            _this.btnText = '稍后重试'
            _this.$dispatch('alertShow', result.message, '提示', '确定')
            window.setTimeout(function () {
              _this.btnText = '重新发送'
              _this.isDisabled = false
            }, 5000)
          }
        })
      } else {
        this.hasWrite[0] = true
      }
    },
    change: function () {
      this.hasCheck = true
    },
    haschange: function (val, idx) {
      var me = this
      this.hasWrite.$set(idx, true)
      if (idx === 1) {
        api.validToken({userMobile: this.mainMsg.userMobile, token: this.token}, function (result) {
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
      msg: 'ProductPage!',
      agreeShow: false,
      index: 0,
      mainMsg: {
        userMobile: '',
        password: ''
      },
      // newToken: '1111',
      rightShow: false,
      // wrongShow: false,
      passWord2: '',
      token: '',
      isDisabled: false,
      btnText: '获取验证码',
      isVolice: false,
      hasCheck: false,
      hasWrite: [false, false, false, false],
      value: '',
      agreements: '<h1>东方点石客户服务平台用户服务协议</h1>'
                  + '<h2>一、	言论</h2>'
                  + '<p>您必须对自己在网上的行为承担法律责任。“东方点石客户服务平台”的记录有可能作为您违反法律的证据。根据中华人民共和国《互联网电子公告服务管理规定》第九条，您不得在“东方点石客户服务平台”中发布含有下列内容之一的信息：</p>'
                  + '<span>(1) 反对宪法所确定的基本原则的。</span>'
                  + '<span>(2) 危害国家安全，泄露国家秘密，破坏国家统一的。</span>'
                  + '<span>(3) 颠覆国家政权，推翻社会主义制度的。</span>'
                  + '<span>(4) 损害国家荣誉和利益的。</span>'
                  + '<span>(5) 煽动民族仇恨、民族歧视，破坏民族团结的。</span>'
                  + '<span>(6) 破坏国家宗教政策，宣扬邪教和封建迷信的。</span>'
                  + '<span>(7) 散布谣言，捏造或歪曲事实，扰乱社会秩序，破坏社会稳定的。</span>'
                  + '<span>(8) 散布迷信、淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的。</span>'
                  + '<span>(9) 侮辱或者诽谤他人，侵害他人合法权益的。</span>'
                  + '<span>(10) 进行商业广告行为的。</span>'
                  + '<span>(11) 干扰或混乱网络服务，不遵守所有使用网络服务的网络协议、规定、程序和惯例的。</span>'
                  + '<span>(12) 含有法律、行政法规禁止的其他内容的。</span>'
                  + '<h2>二、 禁止的行为</h2>'
                  + '<p>您在访问“东方点石客户服务平台”时，严禁进行以下活动，否则“东方点石客户服务平台”有权无条件立即中止您的服务：</p>'
                  + '<span>(1) 直接或间接在“东方点石客户服务平台”宣传其它竞争网站或为其它类似竞争网站做广告。</span>'
                  + '<span>(2) 扰乱“东方点石客户服务平台”社区的秩序，在社区中发布与主题无关的广告或无意义的信息。</span>'
                  + '<span>(3) 大量发布相同的问题或回答。</span>'
                  + '<span>(4) 其它可能对“东方点石客户服务平台”不利的行为或违反任何中华人民共和国法律的行为。</span>'
                  + '<h2>三、用户帐号</h2>'
                  + '<p>您一旦注册成功，成为“东方点石客户服务平台”的合法用户，将得到一个密码和用户名，您将对用户名和密码安全负全部责任，而且对以您用户名进行的所有活动和事件负全部责任，您可以随时改变您的密码。若您发现任何非法使用用户帐号或存在安全漏洞的情况，请立即通知“东方点石客户服务平台”管理员；您必须提供真实的个人资料，并且在发生变动时及时地更新您在“东方点石客户服务平台”中的个人资料；您应当同意“东方点石客户服务平台”通过电子邮件不定期向您发送网站更新信息、赞助商广告或其他相关的服务信息。</p>'
                  + '<h2>四、结束服务</h2>'
                  + '<p>您或“东方点石客户服务平台”可随时根据实际情况中断一项或多项网络服务。“东方点石客户服务平台”不需要对您或第三方负责而可以随时中断服务。您对后来的条款修改有异议，或对“东方点石客户服务平台”的服务不满，可以行使如下权利：</p>'
                  + '<span>(1) 停止使用“东方点石客户服务平台”的服务。</span>'
                  + '<span>(2) 提前结束“东方点石客户服务平台”的服务。</span>'
                  + '<p>结束服务后，您使用网络服务的权利马上中止。从那时起，您没有权利，“东方点石客户服务平台”也没有义务传送任何未处理的信息或未完成的服务给您或第三方。</p>'
                  + '<h2>五、有限责任</h2>'
                  + '<p>您个人对网络服务的使用承担风险，“东方点石客户服务平台”对此不作任何类型的担保，不论是明确的或隐含的，但是不对商业性的隐含担保、特定目的和不违反规定的适当担保作限制。“东方点石客户服务平台”不担保服务一定能满足您的要求，也不担保服务不会受中断，对服务的及时性、安全性、出错发生都不作担保。“东方点石客户服务平台”对在“东方点石客户服务平台”上得到的任何商品购物服务或交易进程，不作担保。'
                  + '“东方点石客户服务平台”对任何直接、间接、偶然、特殊及继起的损害不负责任，这些损害包括但不限于：不正当使用网络服务；在网上购买商品或进行同类型服务；在网上进行交易；非法使用网络服务或用户传送的信息有所变动。这些行为都有可能会导致“东方点石客户服务平台”的形象受损，所以“东方点石客户服务平台”事先提出这种损害的可能性。'
                  + '“东方点石客户服务平台”不对您所发布信息的删除或储存失败负责。“东方点石客户服务平台”有判定您的行为是否符合“东方点石客户服务平台”服务条款的要求和精神的保留权利，如果您违背了服务条款的规定，“东方点石客户服务平台”有中断对您提供服务的权利。'
                  + '您同意保障和维护“东方点石客户服务平台”全体成员的利益，负责支付由您使用超出服务范围引起的律师费用，违反服务条款的损害补偿费用等。</p>'
                  + '<h2>六、关于本服务条款</h2>'
                  + '<p>“东方点石客户服务平台”有权在必要时修改本服务条款。服务条款一旦发生变动，将会在重要页面上提示。如果您不同意所改动的内容，您可以主动注销您的用户帐号或者提请“东方点石客户服务平台”工作人员为您注销。如果您继续使用“东方点石客户服务平台”的服务，则视为接受服务条款的变动。“东方点石客户服务平台”保留随时修改或中断服务而不需知照您的权利。“东方点石客户服务平台”行使修改或中断服务的权利，不需对您或第三方负责。</p>'
                  + '<h2>七、法律</h2>'
                  + '<p>“东方点石客户服务平台”服务条款要与中华人民共和国的法律解释相一致，您和“东方点石客户服务平台”一致同意服从高等法院所有管辖。如发生“东方点石客户服务平台”服务条款与中华人民共和国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它条款则依旧保持对用户产生法律效力和影响。</p>'

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.first-person {
  height: 100%;
}
.form-div {
  width: 100%;
  height: 42px;
  background: #fff;
  margin-bottom: 20px;
  font-size: 12px;
}
.form-div:first-child {
  margin-top: 20px;
  position: relative;
}
.form-div > input {
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
.weui_btn_mini {
  position: absolute;
  right: 40px;
  top: 11px;
  width: auto!important;
  height: 27px;
  line-height: 27px;
  border: none;
  outline: none;
  background-color: #ccc!important;
  color: #000!important;
  font-size: 12px!important;
  padding: 0 10px;
  border-radius: 3px;
  /*display: none;*/
}
.check-box {
  width: 100%;
  padding: 0 20px;
  height: 20px;
  line-height: 20px;
  margin: 20px 0;
}
.check-box input {
  float: left;
  height: 20px;
  line-height: 20px;
}
.check-box span {
  font-size: 12px;
  float: left;
  height: 20px;
  line-height: 20px;
}

.weui_btn {
  background: #888;
  color: #fff;
}
.ipt-box {
  width: 100%;
  height: 50px;
  padding: 10px 0;
  /*margin: 10px 0;*/
  border-bottom: 1px solid #dedede;
  position: relative;
}
.ipt-box2 {
  width: 100%;
  height: 50px;
  padding: 10px 0;
  position: relative;
}
.check, .agree {
  float: left;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.agree {
  margin-left: 10px;
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
  width: 80%;
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
.to-login {
  display: block;
  float: right;
  font-size: 12px;
  /*color: green;*/
  margin-top: 20px;
  margin-right: 20px;
}
.to-login span {
  color: green;
}
</style>
<style>
.next-btn {
  width: 100%;
  padding: 0 20px;
  margin-top: 10px;
}
</style>
