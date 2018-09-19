<template>
  <div class="page">
    <validator name="validation8">
      <div class="form-div">
        <group>
          <selector placeholder="请选择证件类型" title="证件" :options="idType"></selector>
        </group>
      </div>
      <div class="form-div">
        号码
        <input type="text" v-model="userID"
          class="form-control"
          v-validate:idcode="{ required: true }"
          detect-change="off" detect-blur="on"
          placeholder="证件号码"
          @blur="haswrite">
        <br />
        <i class="icon iconfont right" v-if="$validation8.idcode.valid">&#xe60b;</i>
        <i class="icon iconfont wrong" v-show="!$validation8.idcode.valid && hasWrite">&#xe615;</i>
      </div>
    </validator>
    <div class="next-btn">
      <x-button :text="'提交'" @click="changePaper" ></x-button>
    </div>
  </div>
</template>
<script>
import Group from 'vux/src/components/group'
import XInput from 'vux/src/components/x-input'
import XButton from 'vux/src/components/x-button'
import Selector from 'vux/src/components/selector'
// import api from '../../api'
export default {
  components: {
    XInput,
    Group,
    XButton,
    Selector
  },
  ready () {
  },
  events: {
  },
  methods: {
    changePaper: function () {
      this.hasWrite = true
      var idcode = this.$validation8.idcode.valid
      if (idcode) {
      // this.alertShow = true
        window.alert('go')
        // this.$dispatch('pswToNext', this.index)
      }
    },
    haswrite: function () {
      if (this.userID !== '') {
        this.hasWrite = true
      }
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      indexMsg: '',
      hasWrite: false,
      userID: '',
      idType: ['身份证', '驾驶证', '护照']
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

.right {
  position: absolute;
  right: 5px;
  top: 0px;
  color: green!important;
  border: none!important;
  /*display: none;*/
}
.wrong {
  position: absolute;
  right: 5px;
  top: 0px;
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
.form-div {
  width: 100%;
  height: 45px;
  background: #fff;
  /*margin-bottom: 20px;*/
  font-size: 14px;
  position: relative;
  line-height: 42px;
  border-bottom: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
  padding: 0 15px;
}
.form-div:last-child {
  border-top: none;
}
.next-btn {
  margin-top: 50px;
}
.form-div > input {
  border: none;
  outline: none;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  padding: 10px;
  width: 80%;
}

.weui_cell_select {
  padding: 0!important;
  font-size: 14px;
}
</style>
<style media="screen">
.weui_cells:before {
  border: none!important;
}
</style>
