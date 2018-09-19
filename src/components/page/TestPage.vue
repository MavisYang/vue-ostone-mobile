<template>
  <div class="page">
    <div class="ques-box">
      <group v-for="list in questions" :title="list.idx + '、' + list.questionName">
        <radio :options="list.chooses" :value.sync="list.wholeAnswer" @change="answerShow(list)"></radio>
      </group>
      <div class="tijiao-btn">
        <x-button :text="'提交问卷'" @click="goToResult" ></x-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import questions from '../../questions'
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
    for (var key in me.questions) {
      me.questions[key].wholeAnswer = ''
    }
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
    // },
    goToResult: function () {
      this.goNext = true
      this.noComplate = []
      for (var i in this.questions) {
        if (this.questions[i].grade === 0) {
          this.noComplate.push(this.questions[i].idx)
          this.goNext = false
        }
      }
      if (this.goNext) {
        // console.log(0)
        // var answers = ''
        this.RISKSCORE = 0
        for (var key in this.questions) {
          // console.log(this.questions[key].answer)
          this.RISKSCORE += parseInt(this.questions[key].grade)
          this.rankResult += this.questions[key].answer
        }
        if (this.RISKSCORE > 0 && this.RISKSCORE <= 25) {
          this.gradeStyle = '保守型'
      } else if (this.RISKSCORE > 25 && this.RISKSCORE <= 50) {
          this.gradeStyle = '稳健型'
      } else if (this.RISKSCORE > 50 && this.RISKSCORE <= 75) {
          this.gradeStyle = '平衡型'
        } else if (this.RISKSCORE > 75 && this.RISKSCORE <= 85) {
          this.gradeStyle = '成长型'
        } else if (this.RISKSCORE > 85) {
          this.gradeStyle = '进取型'
        }
        // console.log(this.RISKSCORE)
        // console.log(this.gradeStyle)
        console.log(this.rankResult)
        var me = this
        api.updateRankResult(this.RISKSCORE, this.rankResult, function (result) {
          console.log(result)
          if (result.sucess) {
            api.set('gradeStyle', me.gradeStyle)
            api.set('RISKSCORE', me.RISKSCORE)
            me.$router.go('/investtest-home/testresult-page')
          } else {
            me.$dispatch('alertShow', result.msg, '提示', '重新修改')
          }
        })
      } else {
        var alertTxt = '您的第'
        for (var a in this.noComplate) {
          alertTxt += this.noComplate[a] + ' '
        }
        alertTxt += '道题还没有答'
        this.$dispatch('alertShow', alertTxt, '提示', '继续做答')
      }
    },
    answerShow: function (list) {
      var val = list.wholeAnswer
      list.answer = val.slice(0, 1)
      switch (list.answer) {
        case 'A':
          list.grade = 2
          break
        case 'B':
          list.grade = 4
          break
        case 'C':
          list.grade = 6
          break
        case 'D':
          list.grade = 8
          break
        case 'E':
          list.grade = 10
          break
        default:

      }
      console.log(list.answer)
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      questions: questions,
      RISKSCORE: 0,
      goNext: false,
      btnStyle: 'warn',
      rankResult: '',
      noComplate: [],
      gradeStyle: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    /*padding-top: 10px;*/
    background-color: #f0eff5;
    height: 100%;
    overflow-y: scroll;
  }
  .ques-box {
    height: 100%;
    width: 100%;
    /*overflow-y: scroll;*/
    /*margin-top: 20px;*/
    font-size: 12px;
    font-weight: normal;
    color: black;
  }
  /*.questions {
    width: 100%;
    overflow-y: scroll;
    background-color: #fff;
    padding: 10px;
    margin-bottom: 20px;
  }*/
  .weui_btn {
    background: #888;
    color: #fff;
  }
  .tijiao-btn {
    /*background-color: #fff;*/
    padding: 15px;
  }
</style>
<style>
.weui_cells_title {
  color: black;
}
.weui_cell {
  position: static;
}
</style>
