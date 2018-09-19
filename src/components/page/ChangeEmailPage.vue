<template>
  <div class="page">
    <validator name="validation11">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe61a;</i>
        <input type="text" v-model="email" class="form-control" v-validate:emile="{ emile: true }" placeholder="设置您的新邮箱" @keyup="haswrite"><br />
        <i class="icon iconfont right" v-show="$validation11.emile.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation11.emile.valid && hasWrite">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'提交'" @click="changeEmail" ></x-button>
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
    changeEmail: function () {
      this.hasWrite = true
      var em = this.$validation11.emile.valid
      if (em) {
        var me = this
        api.updateAccountInfo('EMAIL', this.email, function (result) {
          console.log(result)
          if (result.success) {
            me.$dispatch('alertShow', '修改成功', '提示', '确定', '/accsafe-home')
            // me.$router.go('/accsafe-home')
          } else {
            me.$dispatch('alertShow', result.msg, '提示', '重新修改')
          }
        })
      }
    },
    haswrite: function () {
      // if (this.email !== '') {
      this.hasWrite = true
      // }
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'ProductPage!',
      msg: '',
      email: '',
      hasWrite: false
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
.next-btn {
  margin-top: 50px;
}
</style>
