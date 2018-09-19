<template>
  <div class="page">
    <tab class="tab" active-color="#c32b38" :line-width="3" @on-index-change="indexChange">
         <tab-item :selected="index === $index" v-for="item in tabs" >
         {{item.name}}
         </tab-item>
     </tab>
     <div class="swiper-container">
       <swiper :show-dots="false" :index.sync="index" height="100%" :prevent-slide="true">
           <swiper-item>
             <activity-list></activity-list>
           </swiper-item>
           <swiper-item>
             <news-list></news-list>
           </swiper-item>
       </swiper>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import {Tab, TabItem} from 'vux/src/components/tab'
import Swiper from 'vux/src/components/swiper'
import SwiperItem from 'vux/src/components/swiper-item'
import ActivityList from '../online/ActivityList'
import NewsList from '../online/NewsList'
export default {
  components: {
    ActivityList,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    NewsList
  },
  ready () {
    this.$dispatch('loading-start', '正在加载数据..')
    this.getDate('activity')
    this.getDate('news')
  },
  methods: {
    getDate: function (msgLei) {
      // console.log(111);
      var me = this
      var now = Date.now()
      api.getActivityInfor(msgLei, function (result) {
        me.$dispatch('loading-end', 'loading')
        console.log(result)
        // console.log(activityId)
        me.listsCopy = result.data
        // me.listsCopy = []
        if (me.listsCopy.length > 0) {
          me.tipshow = false
        } else {
          me.tipshow = true
        }
        // console.log(me.listsCopy)
        // 冒泡算法
        // for (var i = 0; i < me.lists.length - 1; i++) {
        //   for (var j = 0; j < me.lists.length - i - 1; j++) {
        //     var oDate1 = new Date(me.lists[j].startTime)
        //     var oDate2 = new Date(me.lists[j + 1].startTime)
        //     if (oDate1.getTime() < oDate2.getTime()) {
        //       var temp = me.lists[j]
        //       me.lists[j] = me.lists[j + 1]
        //       me.lists[j + 1] = temp
        //     }
        //   }
        // }
        // 数组sort（）
        me.listsCopy.sort(function (a, b) {
          var str1 = a.startTime.substring(0, 10)
          var str2 = b.startTime.substring(0, 10)
          var oDate1 = new Date(str1).getTime()
          // console.log(a.startTime.substring(0, 10))
          var oDate2 = new Date(str2).getTime()
          // console.log(b.startTime.substring(0, 10))
          return oDate2 - oDate1
        })
        me.lists = JSON.parse(JSON.stringify(me.listsCopy))
        // console.log(me.lists)
        for (var k = 0; k < me.lists.length; k++) {
          me.lists[k].imgPath = api.getRoot() + 'upload/' + me.lists[k].imgPath
          var oDate = new Date(me.lists[k].startTime.substring(0, 10))
          if (msgLei === 'activity') {
	          if (oDate.getTime() + 57600000 >= now) {
	            me.listsStatus[k] = true
	            me.lists[k].startTime = me.lists[k].startTime + '开始'
	          } else {
	            // console.log(oDate)
	            // console.log(oDate.getTime())
	            // console.log(now)
	            me.listsStatus[k] = false
	            me.lists[k].startTime = '已结束'
	          }
          }
        }
        if (msgLei === 'activity') {
          me.$broadcast('activityList', me.lists)
        } else {
          me.$broadcast('newsList', me.lists)
        }
        // console.log(me.listsCopy)
        // console.log(me.lists)
        // for (var key in me.listsCopy) {
        //   if (me.listsCopy[key]._id === me.clickId) {
        //     console.log(1)
        //     console.log(me.listsCopy[key].startTime)
        //     me.$dispatch('toActivity', me.listsCopy[key], me.listsStatus[key])
        //   }
        // }
      })
    },
    indexChange: function (index) {
      this.index = index
    }
    // turnToAct: function (id) {
    //   this.$dispatch('toActivity', id)
    // }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      lists: [],
      tipshow: false,
      listsCopy: [],
      listsStatus: [],
      isOn: false, // 高亮
      tabs: [
        { name: '活动预告' },
        { name: '活动回顾' }
      ],
      index: 0,
      clickId: ''// 记录点击的活动id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  height: 100%;
  background-color: #f2f2f2;
}
.activity-box {
  width: 100%;
  height: 126px;
  padding: 10px;
  background: #fff;
  margin-top: 6px;
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
  color: #555;
}
.right h1 {
  font-size: 14px;
  font-weight: normal;
  margin: 0 0 25px;
  height: 44px;
}
.right span {
  display: block;
  font-size: 12px;
}
.address {
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.overdue {
  color: #aaa;
}
.overdue .right {
  color: #aaa;
}
.no-tips {
  text-align: center;
  margin-top: 200px;
}
.swiper-container {
  height: calc(100% - 50px)!important;
}
.vux-slider {
  height: 100%;
}
</style>
