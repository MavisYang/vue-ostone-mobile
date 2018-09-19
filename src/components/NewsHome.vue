<template>
<!-- app -->
<div class="home">
<!-- <div class="header-container">
  <x-header :left-options="{backText: '返回', showBack: true}">{{title}}</x-header>
</div> -->
<div class="view-container" style="height: 100%">
  <div class="activity-infor">
    <div class="activity-box">
      <img :src="activityInfor.imgPath" class="acty-img" />
      <div class="right">
        <h1>{{activityInfor.activityName}}</h1>
      </div>
    </div>
    <div class="activity-other-infor">
      <div class="activity-time infor-box">
        <i class="iconfont">&#xe617;</i>
        <span>{{activityInfor.startTime}}</span>
      </div>
      <!-- <div class="activity-address infor-box">
        <i class="iconfont">&#xe618;</i>
        <span>{{activityInfor.address}}</span>
      </div> -->
      <!-- <div class="activity-people-counts infor-box">
        <i class="iconfont">&#xe619;</i>
        <span>限额{{activityInfor.maxAmount}}名/已报名{{activityInfor.curAmount}}人</span>
      </div> -->
    </div>
    <div class="activity-words">
      <div class="activity-words-title">
        简介
      </div>
      <div class="activity-words-content">
        <p>
        {{{activityInfor.simpleIntroduce}}}
        </p>
      </div>
    </div>
    <!-- <x-button :text="btnName" :class="isDisabled? 'isDisabled':''" :disabled="isDisabled" @click="signUp" ></x-button> -->
  </div>
</div>
</div>
</template>
<script>
import XButton from 'vux/src/components/x-button'
import {Tabbar, TabbarItem} from 'vux/src/components/tabbar'
import api from '../api'
import XHeader from 'vux/src/components/x-header'
import Swiper from 'vux/src/components/swiper'
import SwiperItem from 'vux/src/components/swiper-item'
import ReorderFirst from './online/ReorderFirst'
import ReorderSecond from './online/ReorderSecond'
import Vue from 'vue'
import PathMap from '../PathMap'
export default {
  // props: {
  //   lists: Array
  // },
  components: {
    XButton,
    Tabbar,
    TabbarItem,
    XHeader,
    ReorderFirst,
    ReorderSecond,
    Swiper,
    SwiperItem
  },
  ready () {
    var me = this
    var activityId = this.$route.params.activityID // 获取活动ID
    // console.log(activityId)
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    this.testGet(activityId)
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
  events: {
    'atOnceOrder': function () {
      this.slideIndex = 1
    }
  },
  data () {
    return {
      btnName: '立即报名',
      isDisabled: true,
      index: 0,
      direction: 'forward',
      title: '',
      slideIndex: 0,
      activityInfor: {
        // activityID: 1,
        // imgPath: '../../../static/images/houdong.jpg',
        // name: 'little shop of curios 新天地的奇异小店',
        // time: '2016-09-01 至 2016-09-01',
        // address: '锦绣路1001号行政文化中心世纪公园',
        // peopleCounts: '限额20名/已报名4人',
        // abstract: '蜡笔小新要来上海了！全球首站SHINCHAN RUN欢乐。风靡全球的蜡笔小新全球首次公开SHINCHANRUN 咯！YOLORUN作为主办方结合动漫与跑步与一体的嘉年华派对10月首站在上海开跑SHINCHAN RUN将原作中熟悉的人物及春日部场景还原现实。让参与者亲临蜡笔小新的童趣SHINCHAN RUN同时将展出25年经典漫画、动画、电影海报等蜡笔小新也将现身活动现场与每一位参与者狂欢。'
      }
    }
  },
  methods: {
    testGet: function (activityId) {
      console.log(activityId)
      var me = this
      var now = Date.now()
      api.getOneActivityInfor(activityId, function (result) {
        console.log(result)
        // console.log(activityId)
        var userId = window.G.user.id
        // var userId = 'xiaoshan'
        me.activityInfor = result.data[0]
        me.activityInfor.imgPath = api.getRoot() + 'upload/' + me.activityInfor.imgPath
        for (var key in me.activityInfor.users) {
          if (userId === me.activityInfor.users[key]) {
            me.btnName = '已报名'
            me.isDisabled = true
            return
          }
        }
        var oDate = new Date(me.activityInfor.startTime.substring(0, 10))
        if (oDate.getTime() >= now) {
          if (me.activityInfor.curAmount === me.activityInfor.maxAmount) {
            me.btnName = '名额已满'
            me.isDisabled = true
            return
          } else {
            me.btnName = '立即报名'
            me.isDisabled = false
          }
        } else {
          me.btnName = '已结束'
          me.isDisabled = true
        }
      })
    },
    signUp: function () {
      var userId = window.G.user.id
      // var userId = 'xiaoshan'
      var me = this
      api.signUp(me.activityInfor._id, userId, function (result) {
        if (result.success === 1) {
          me.activityInfor.curAmount = String(parseInt(me.activityInfor.curAmount) + 1)
          me.btnName = '已报名'
          me.isDisabled = true
        } else {
          me.activityInfor.curAmount = me.activityInfor.maxAmount
          me.btnName = '名额已满'
          me.isDisabled = true
        }
      })
    }
    // testPost: function () {
    //   api.testPost('userMobile', 'passWord', 'openId', function (result) {
    //     console.log(result)
    //   })
    // }

  }
}
</script>

<style scoped>
.isDisabled {
  background-color: #CDCCD4!important;
}
.header-container {
  z-index: 999;
}
.view-container {
  padding-bottom: 0;
  height: 100%!important;
  /*overflow-y: scroll;*/
}
.activity-infor {
  height: 100%;
  overflow-y: scroll;
  background-color: #f0eff5;
}
.activity-box {
  width: 100%;
  height: 126px;
  padding: 10px;
  background: #fff;
  /*margin-top: 6px;*/
}
.acty-img {
  display: block;
  width: 103px;
  height: 105px;
  float: left;
}
.right {
  float: left;
  width: calc(100% - 103px);
  font-size: 12px;
  padding-left: 10px;
}
.right h1 {
  font-size: 14px;
  font-weight: normal;
  margin: 12px 0;
}
.activity-other-infor {
  background-color: white;
  margin-top: 10px;
  padding-left: 15px;
}
.infor-box {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #dcdcdc;
  padding-left: 10px;
  font-size: 12px;
}
.infor-box:last-child {
  border: none;
}
.infor-box i {
  font-size: 20px;
  color: #adadad;
  display: inline-block;
  margin-right: 5px;
}
.activity-words {
  background-color: white;
  margin-top: 10px;
  padding-left: 15px;
  margin-bottom: 10px;
}
.activity-words-title {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dcdcdc;
  padding-left: 5px;
}
.activity-words-content {
  font-size: 12px;
  padding: 5px 20px 10px 5px;
  word-break:break-all; /*支持IE，chrome，FF不支持*/
　　word-wrap:break-word;/*支持IE，chrome，FF*/
overflow: hidden;
}
.activity-words-content > p > p > img {
	display: inline-block;
	max-width: 320px!important;
}
</style>
<style >
.vux-swiper {
  height: 100%!important;
}
.weui_btn {
  width: 90%!important;
}
</style>
