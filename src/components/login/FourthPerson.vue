<template>
  <div class="fourth-person">
    <process :index="index"></process>
    <div class="ques-box">
      <div class="every-question" v-for="list in lists" v-show="questionsIndex === $index">
        <group  :title="list.idx + '、' + list.questionName">
          <radio :options="list.chooses" :value.sync="list.wholeAnswer" @change="answerShow(list)"></radio>
        </group>
        <div class="shangyi">
          <x-button :text="'上一题'" type="primary" @click="prevQuestion(list)" :mini="true"  :disabled="questionsIndex === 0"></x-button>
          <x-button :text="'下一题'" type="primary" @click="nextQuestion(list)" :mini="true"  :disabled="questionsIndex === 11"></x-button>
        </div>
      </div>
    </div>
    <div class="next-btn">
      <x-button :text="'下一步'"  @click="goToNext" type="primary" ></x-button>
      <x-button :text="'返回上一步'"  @click="goToPrev" type="primary"></x-button>
    </div>
    <confirm :show.sync="confirmShow" confirm-text="继续作答" cancel-text="确定" title="提示" @on-confirm="doNothing" @on-cancel="doSomething">
      <p style="text-align:center;">{{confirmText}}</p>
    </confirm>
  </div>
</template>

<script>
import Process from './process'
import XButton from 'vux/src/components/x-button'
import Group from 'vux/src/components/group'
import Radio from 'vux/src/components/radio'
import Checklist from 'vux/src/components/checklist'
import Confirm from 'vux/src/components/confirm'
export default {
  props: {
    lists: Array
  },
  components: {
    Process,
    XButton,
    Checklist,
    Group,
    Radio,
    Confirm
  },
  ready () {
  },
  methods: {
    doNothing: function () {
      this.confirmShow = false
    },
    doSomething: function () {
      var answers = ''
      this.RISKSCORE = 0
      for (var key in this.lists) {
        // console.log(this.lists[key].answer)
        answers += this.lists[key].answer
        this.RISKSCORE += parseInt(this.lists[key].grade)
      }
      if (this.RISKSCORE >= 0 && this.RISKSCORE <= 25) {
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
      this.$dispatch('toNext', this.index, this.RISKSCORE, this.gradeStyle, answers)
    },
    prevQuestion: function (list) {
      this.questionsIndex = parseInt(list.idx) - 2
    },
    nextQuestion: function (list) {
      this.questionsIndex = parseInt(list.idx)
    },
    goToPrev: function () {
      this.$dispatch('toPrev', this.index)
    },
    goToNext: function () {
      this.goNext = true
      this.noComplate = []
      for (var i in this.lists) {
        if (this.lists[i].grade === 0) {
          this.noComplate.push(this.lists[i].idx)
          this.goNext = false
        }
      }
      // this.goNext = true
      if (this.goNext) {
        // console.log(0)
        var answers = ''
        this.RISKSCORE = 0
        for (var key in this.lists) {
          // console.log(this.lists[key].answer)
          answers += this.lists[key].answer
          this.RISKSCORE += parseInt(this.lists[key].grade)
        }
        if (this.RISKSCORE >= 0 && this.RISKSCORE <= 25) {
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
        this.$dispatch('toNext', this.index, this.RISKSCORE, this.gradeStyle, answers)
      } else {
        var alertTxt = '您的第'
        for (var a in this.noComplate) {
          alertTxt += this.noComplate[a] + ' '
        }
        alertTxt += '道题还没有答,确定调到下一步吗？'
        this.confirmShow = true
        this.confirmText = alertTxt
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
      // console.log(list.answer)
      var me = this
      var a = parseInt(list.idx)
      setTimeout(function () {
        if (a === 12) {
          me.questionsIndex = 11
        } else {
          me.questionsIndex = a
        }
      }, 1000)
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      index: 3,
      RISKSCORE: 0,
      goNext: false,
      btnStyle: 'warn',
      noComplate: [],
      questionsIndex: 0,
      gradeStyle: '',
      confirmShow: false,
      confirmText: ''
      // lists: [
      //   {
      //     idx: 1,
      //     questionName: '您的年龄介于',
      //     answer: '',
      //     chooses: [ 'A.18-30岁', 'B.31-50岁', 'C.51-60岁', 'D.60岁以上' ]
      //   }
      // ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fourth-person {
  height: 100%;
  overflow-y: scroll;
}
.ques-box {
  /*height: 330px;*/
  width: 100%;
  overflow: auto;
  margin-top: 30px;
  font-size: 12px;
  background-color: #f0eff5;
}
.questions {
  width: 100%;
  overflow-y: scroll;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 20px;
}
.weui_cells_radio {
  background-color: #f0eff5!important;
}
.shangyi .weui_btn {
  width: auto!important;
  float: right;
  display: block;
  margin-top: 0px!important;
  margin-bottom: 30px;
  margin-right: 45px;
  margin-left: 45px;
  background-color: #4B8BF5!important;
}
.shangyi .weui_btn_disabled {
  background-color: #ccc!important;
}
.shangyi .weui_btn:first-child {
  float: left;
}
.shangyi {
  width: 100%;
  /*padding: 0 30px;*/
  margin-top: 30px;
}
.next-btn {
  margin-top: 30px;
}
</style>
<style media="screen">
.weui_cells_title {
  background-color: #f0eff5;
  margin: 0!important;
  padding-top: 10px;
  padding-bottom: 10px;
}
.weui_cells:before {
  height: 0!important;
  color: #f0eff5!important;
  opacity: 0;
}
.weui_cell_bd > p {
    font-size: 14px;
    margin-right: 20px;
}
</style>
