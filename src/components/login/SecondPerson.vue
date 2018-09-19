<template>
  <div class="second-person">
    <process :index="index"></process>
    <!-- <div class="form-div">
      <group>
        <x-input title="姓名" :type="'text'" :show-clear=false placeholder="用户姓名"></x-input>
      </group>
    </div> -->
    <validator name="validation2">
      <div class="form-div">
        姓名
        <input type="text" v-model="mainMsg.userName"
          class="form-control"
          detect-change="off" detect-blur="on"
          v-validate:name="{ required: true }"
          placeholder="用户姓名" @blur="haswrite(0)">
        <i class="icon iconfont right" v-if="$validation2.name.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation2.name.valid && hasWrite[0]">&#xe615;</i>
      </div>
      <!-- <div class="form-div select">
        <group>
          <selector placeholder="请选择证件类型" :value="zhengType" title="证件" :options="idTypes" @on-change="hasSelect"></selector>
          <i class="icon iconfont right" v-if="mainMsg.idType !== -1 ">&#xe60b;</i>
          <i class="icon iconfont wrong" v-show="mainMsg.idType === -1 && hasSelection">&#xe615;</i>
        </group>
      </div> -->
      <div class="form-div">
        身份证号
        <input type="text" v-model="mainMsg.userID"
        class="form-control"
        v-validate:idcode="{ required: true }"
        detect-change="off" detect-blur="on"
        placeholder="身份证号" @blur="haswrite(1)"><br />
        <i class="icon iconfont right" v-if="$validation2.idcode.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation2.idcode.valid && hasWrite[1]">&#xe615;</i>
      </div>
      <div class="form-div">
        手机
        <input type="text" v-model="usermobile"
        class="form-control"
        v-validate:phone="{ phone: true }" placeholder="银行预留手机号码"
        @keyup="haswrite(2)">
        <i class="icon iconfont right" v-if="$validation2.phone.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation2.phone.valid && hasWrite[2]">&#xe615;</i>
      </div>
      <div class="form-div">
        邮箱
        <input type="text" v-model="mainMsg.email"
        class="form-control"
        v-validate:email="{ emile: true }" placeholder="邮箱"
        @blur="haswrite(3)">
        <i class="icon iconfont right" v-if="$validation2.email.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation2.email.valid && hasWrite[3]">&#xe615;</i>
      </div>
      <div class="form-div ka">
        卡号
        <input type="text" v-model="mainMsg.bankCode"
        class="form-control"
        detect-change="off" detect-blur="on"
        v-validate:bankcode="{ required: true }"
        placeholder="用户银行卡号" @blur="haswrite(4)"><br />
        <i class="icon iconfont right" v-if="$validation2.bankcode.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation2.bankcode.valid && hasWrite[4]">&#xe615;</i>
      </div>
    </validator>
    <!-- <div class="form-div">
      <group>
        <x-input title="号码" :type="'password'" :show-clear=false placeholder="证件号码"></x-input>
      </group>
    </div>
    <div class="form-div">
      <group>
        <x-input title="手机" :value.sync="userMobile" :show-clear=false ></x-input>
      </group>
    </div>
    <div class="form-div">
      <group>
        <x-input title="卡号" :show-clear=false placeholder="用户银行卡号"></x-input>
      </group>
    </div> -->
    <div class="next-btn">
      <x-button :text="'下一步'" @click="goToNext" ></x-button>
      <x-button :text="'返回上一步'" @click="goToPrev" ></x-button>
    </div>
  </div>
</template>

<script>
// import api from '../../api'
import Group from 'vux/src/components/group'
import XInput from 'vux/src/components/x-input'
import XButton from 'vux/src/components/x-button'
import Selector from 'vux/src/components/selector'
import Process from './process'
export default {
  components: {
    XInput,
    Group,
    XButton,
    Selector,
    Process
  },
  // computed: {
  //   um: function () {
  //     console.log('wowowowwo')
  //     return this.userMobile
  //   }
  // },
  props: {
    usermobile: String
  },
  ready () {
    // this.userMobile = this.userPhone
    // console.log(this.userMobile)
  },
  methods: {
    goToPrev: function () {
      this.$dispatch('toPrev', this.index)
    },
    goToNext: function () {
      // console.log(0)
      this.hasSelection = true
      for (var key in this.hasWrite) {
        this.hasWrite.$set(key, true)
      }
      var name = this.$validation2.name.valid
      // var name = true
      var usid = this.$validation2.idcode.valid
      var pone = this.$validation2.phone.valid
      var bkd = this.$validation2.bankcode.valid
      var eml = this.$validation2.email.valid
      if (name && usid && pone && eml && bkd) {
        // ------------------------------------------------------
        if (this.hasClick) {
            return
        }
        this.hasClick = true
        var me = this
        api.checkIsExist ({paramName: 'USERID', paramValue: this.mainMsg.userID}, function (res) {
          console.log(res)
          if (res.success) {
            me.$dispatch('alertShow', '您的证件号码已经注册，请前往登录', '提示', '确定')
            setTimeout(function () {
                me.hasClick = false
            }, 2000)
          } else {
            api.verify4Element({userID: me.mainMsg.userID, userMobile: me.usermobile, userName: me.mainMsg.userName, bankCode: me.mainMsg.bankCode}, function (result) {
                if (result.success) {
                    me.$dispatch('toNext', me.index, me.mainMsg)
                } else {
                    me.$dispatch('alertShow', result.message, '提示', '确定')
                    setTimeout(function () {
                      me.hasClick = false
                    }, 2000)
                }
            })
          }
        })
      }
    },
    haswrite: function (idx) {
      this.hasWrite.$set(idx, true)
    },
    hasSelect: function (val) {
      this.hasSelection = true
      // console.log(val)
      if (val === '身份证') {
        this.mainMsg.idType = 0
      } else if (val === '驾驶证') {
        this.mainMsg.idType = 1
      } else if (val === '护照') {
        this.mainMsg.idType = 2
      } else {
        this.mainMsg.idType = -1
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
      index: 1,
      mainMsg: {
        userName: '',
        userID: '',
        bankCode: '',
        idType: -1,
        email: ''
      },
      // userMobile: '18311110000',
      idTypes: ['身份证', '驾驶证', '护照'],
      zhengType: '',
      hasWrite: [false, false, false, false, false],
      hasSelection: false,
      hasClick: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.second-person {
  height: 100%;
}
.form-div {
  width: 100%;
  height: 42px;
  background: #fff;
  /*margin-bottom: 20px;*/
  font-size: 14px;
  position: relative;
  line-height: 42px;
  border-top: 1px solid #d9d9d9;
  padding: 0 15px;
}
.form-div:nth-child(3) {
  padding: 0;
  padding-left: 15px;
}
.ka {
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 40px;
}
/*.form-div:first-child {
  margin-top: 20px;
  position: relative;
}*/
.form-div > input {
  border: none;
  outline: none;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding-left: 10px;
  width: 80%;
}
.form-div > span {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
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
.next-btn {
  width: 100%;
  padding: 0 20px;
}
.weui_btn {
  background: #888;
  color: #fff;
}

.weui_cell {
  padding: 10px 15px!important;
  font-size: 14px;
}
.weui_cell::before {
  border: none!important;
}
.weui_cell_select {
  padding: 0 15px!important;
}

.right {
  position: absolute;
  right: 15px;
  top: 0px;
  color: green!important;
  border: none!important;
  /*display: none;*/
}
.wrong {
  position: absolute;
  right: 15px;
  top: 0px;
  border: none!important;
  color: #f00!important;
  /*display: none;*/
}
.select .right, .select .wrong {
  right: 25px;
  top: 10px;
}
.phone {
    width: 50%!important;
}
</style>
<style media="screen">
.weui_cells {
  margin-top: 0!important;
}
.vux-no-group-title {
  margin-top: 0!important;
}
.weui_select {
  padding-left: 50px!important;
}
</style>
