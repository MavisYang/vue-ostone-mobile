<template>
  <div class="page">
    <validator name="validation13">
      <div class="ipt-box">
        <i class="icon iconfont">&#xe61c;</i>
        <input type="text" v-model="contactName" class="form-control"
        v-validate:name="{ required: true }"
        detect-change="off" detect-blur="on"
        placeholder="姓名"
        @blur="haswrite(contactName, 0)"><br />
        <i class="icon iconfont right" v-if="$validation13.name.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation13.name.valid && hasWrite[0]">&#xe615;</i>
      </div>
      <div class="ipt-box">
        <i class="icon iconfont">&#xe600;</i>
        <input type="text" v-model="contactMobile" class="form-control"
        v-validate:mobile="{ required: true }"
        detect-change="off" detect-blur="on"
        placeholder="联系方式"
        @blur="haswrite(contactMobile, 1)"><br />
        <i class="icon iconfont right" v-if="$validation13.mobile.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation13.mobile.valid && hasWrite[1]">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'提交'" @click="changePsw" ></x-button>
    </div>
  </div>
</template>
<script>
// import api from '../../api'
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
      this.hasWrite[0] = true
      this.hasWrite[1] = true
      var name = this.$validation13.name.valid
      var mobile = this.$validation13.mobile.valid
      if (name && mobile) {
      // this.alertShow = true
        window.alert('go')
        // this.$dispatch('pswToNext', this.index)
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
      // msg: 'ProductPage!',
      msg: '',
      hasWrite: [false, false],
      contactName: '',
      contactMobile: ''
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
  padding-top: 100px;
}
.ipt-box {
  width: 100%;
  height: 50px;
  padding: 10px 15px;
  /*margin: 10px 0;*/
  border-bottom: 1px solid #dedede;
  border-top: 1px solid #dedede;
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
  height: 35px;
  line-height: 40px;
  /*border-radius: 3px;*/
  outline: none;
  border: none;
  padding: 10px;
  font-size: 12px;
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
.next-btn {
  margin-top: 50px;
}
.tip-word {
  width: 100%;
  height: 30px;
  background-color: #f0eff5;
  color: #bbbbbb;
  padding: 0 15px;
}

</style>
