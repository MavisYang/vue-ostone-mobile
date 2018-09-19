<template>
  <div class="page">
    <div class="page-image">
      <img src="../../../static/images/page-image.png" />
    </div>
    <div class="baogao-box">
        <h1>{{grade}}</h1>
        <span class="shihe">您的评测结果所得分数为   {{fenshu}}<br>您的投资风格属于  {{grade}}</span>
        <span class="tip">评测结果并不具备全面性及承诺性 理财有风险，投资需谨慎</span>
        <x-button :text="'返回'" @click="goAccPage" ></x-button>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import PathMap from '../../PathMap'
import Group from 'vux/src/components/group'
import Radio from 'vux/src/components/radio'
import XButton from 'vux/src/components/x-button'
import Vue from 'vue'
export default {
  components: {
    Group,
    Radio,
    XButton
  },
  ready () {
    var me = this
    // console.log(me.startDate, me.endDate)
    // me.$dispatch('loading-start', '正在加载数据..')
    // this.testGet()
    me.grade = api.get('gradeStyle')
    me.fenshu = api.get('RISKSCORE')
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(currentPath)
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    this.$router.beforeEach(function (transition) {
      if (transition.from.path && transition.to.path) {
        var start = PathMap.search(transition.from.path)
        var end = PathMap.search(transition.to.path)
        me.direction = (end.weight > start.weight) ? 'forward' : 'backword'
        // console.log(start, end, me.direction)
        me.title = end.title
      }
      Vue.nextTick(function () {
        // 确保direction生效
        transition.next()
      })
    })
    this.$router.afterEach(function (transition) {
      var end = PathMap.search(transition.to.path)
      me.index = end.weight
    })
  },
  methods: {
    // testGet: function () {
    //   var me = this
    //   // console.log(0)
    //   api.getQuestions('userMobile', 'passWord', 'openId', function (result) {
    //     // me.myMsg = result.data
    //     console.log(result.questions)
    //     me.questions = result.questions
    //     me.$dispatch('loading-end', 'loading')
    //   })
    // }
    goAccPage: function () {
      this.$router.go('/ostone-home/main-page')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      grade: '平衡型',
      suit: '项目主导级为3星以上',
      fenshu: 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    /*padding-top: 10px;*/
    background-color: #fff;
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
    font-size: 26px;
    text-align: center;
    font-weight: normal;
    margin: 0;
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
    margin-top: 25px;
    margin-bottom: 20px;
  }
</style>
<style>

</style>
