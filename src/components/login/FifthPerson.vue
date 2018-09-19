<template>
  <div class="fifth-person">
    <process :index="index"></process>
    <div class="baogao-box">
        <h1>{{grade}}</h1>
        <span class="shihe">您的评测结果所得分数为   {{fenshu}}<br>您的投资风格属于  {{grade}}</span>
        <span class="tip">评测结果并不具备全面性及承诺性 理财有风险，投资需谨慎</span>
    </div>
    <div class="next-btn">
      <x-button :text="'返回上一步'"  @click="goToPrev" ></x-button>
      <x-button :text="'开启您的财富之旅'" @click="goToIndex" ></x-button>

    </div>
  </div>
</template>

<script>
import api from '../../api'
import Process from './process'
import XButton from 'vux/src/components/x-button'
export default {
  components: {
    Process,
    XButton
  },
  props: {
    grade: String,
    fenshu: Number,
    mymsg: Object
  },
  methods: {
    goToPrev: function () {
      this.$dispatch('toPrev', this.index)
    },
    goToIndex: function () {
      var me = this
      this.mymsg.openID = window.G.openID
      api.register(this.mymsg, function (result) {
        console.log(result)
        if (result.success) {
          // me.$router.go('/ostone-home')
          window.location.href = '/'
        } else {
          me.$dispatch('toNext', -1)
          me.$dispatch('alertShow', result.message, '提示', '重新填写')
        }
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
      index: 4,
      agment: ''
      // myMsg: mymsg
      // grade: '平衡型',
      // fenshu: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fifth-person {
  height: 100%;
}
.baogao-box {
  width: 100%;
  height: 250px;
  /*overflow-y: scroll;*/
  background-color: #fff;
  padding: 10px;
  /*margin-top: 10px;*/
  text-align: center;
}
.baogao-box h1 {
  font-size: 30px;
  text-align: center;
  font-weight: normal;
}
.baogao-box p {
  font-size: 12px;
  padding: 5px;
  overflow: hidden;
  /*box-shadow: 0px 0px 1px 1px #ccc;*/
  line-height: 20px;
}
.tip {
  display: block;
  font-size: 12px;
  color: #ccc;
  margin-top: 50px;
}
.weui_btn {
  background: #888;
  color: #fff;
}
</style>
