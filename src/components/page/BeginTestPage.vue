<template>
  <div class="page">
    <div class="page-image">
      <img src="../../../static/images/page-image.png" />
    </div>
    <h1>测测我的投资类型</h1>
    <span>同意平台及合作方使用您的信息用于风险测试</span>
    <div class="begin-btn">
      <x-button :text="'开始测试'" @click="goToTest" ></x-button>
    </div>
  </div>
</template>

<script>
// import api from '../../api'
// import PathMap from '../../PathMap'
import XButton from 'vux/src/components/x-button'
// import Vue from 'vue'
export default {
  components: {
    XButton
  },
  ready () {
  },
  methods: {
    goToTest: function () {
      this.$router.go('/investtest-home/test-page')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      myMsg: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    /*padding-top: 10px;*/
    position: relative;
    height: 100%;
    overflow-y: scroll;
  }
  .page-image {
    width: 168px;
    /*position: absolute;*/
    margin: 130px auto 0;
  }
  .page-image img {
    width: 100%;
    height: 100%;
  }
  .weui_btn {
    background: #888;
    color: #fff;
    position: static;
  }
  h2 {
    text-align: center;
    background-color: #eee;
    margin: 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: normal;
  }
  .begin-btn {
    padding: 0 15px;
  }
  h1 {
    margin-bottom: 120px;
    font-size: 16px;
    text-align: center;
    font-weight: normal;
  }
  span {
    display: block;
    text-align: center;
    font-size: 12px;
    color: #ababab;
    margin-bottom: 5px;
  }
  .weui_btn:after {
    width: 0%;
    height: 0%;
  }
</style>
