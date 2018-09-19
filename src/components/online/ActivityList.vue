<template>
  <div class="activity-list">
    <div class="no-tips" v-show="tipshow">
      <span>(~>__<~)   活动正在赶来的路上<br/>先去别处看看吧</span>
    </div>
    <div class="activity-box" :class="{'overdue': !listsStatus[$index]}" v-for="list in lists" @click="turnToAct(list._id)">
      <img :src="list.imgPath" class="acty-img" />
      <div class="right">
        <h1>{{list.activityName}}</h1>
        <span>{{list.startTime}}</span>
        <span class="address">{{list.address}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import api from '../../api'
export default {
  props: {
  },
  ready () {
  },
  methods: {
    turnToAct: function (id) {
      this.$dispatch('toActivity', id)
    }
  },
  events: {
    'activityList': function (msg) {
      console.log(msg)
      this.lists = msg
      if (this.lists.length > 0) {
        this.tipshow = false
      } else {
        this.tipshow = true
      }
    }
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
      clickId: ''// 记录点击的活动id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.activity-list {
  height: 100%;
  background-color: #f2f2f2;
  overflow-y: scroll;
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
</style>
