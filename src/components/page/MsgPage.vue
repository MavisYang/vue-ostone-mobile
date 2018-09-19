<template>
  <div class="page">
    <div class="tab-box">
      <nobr>
        <div class="tab-item" v-for="item in tabList" :class="tabIdx === item.index?'on':''" @click="changeClass(item)">
          {{item.name}}
        </div>
      </nobr>
    </div>
    <div class="title-box" v-for="list in lists" @click="goToMsgInfo(list.infoID)">
      <h1>{{list.title}}</h1>
      <span>{{list.infoDate}}</span>
    </div>
    <div class="no-msg" v-if="lists.length < 1">
      暂无信息
    </div>
  </div>
</template>

<script>
import api from '../../api'
import PathMap from '../../PathMap'
// import Vue from 'vue'
export default {
  components: {
  },
  ready () {
    // var userid = window.G.user
    // if (!userid) {
    //   this.$dispatch('alertShow', '没有您的信息，请先登录', '提示', '前去登录', '/login-home/login-page')
    //   return
    // }
    // 是否签约客户认证
    var me = this
    var canRead = api.get('myAccMsg').cerified
    if (!canRead) {
      me.$dispatch('alertShow', '没有您的购买信息', '提示', '随便看看', '/ostone-home')
      return
    }
    me.$dispatch('loading-start', '正在加载数据...')
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(current)
    // me.testGet()
    if (current) {
      me.index = current.weight
      me.title = current.title
    }
    this.$router.ostonehome = me
    this.$router.afterEach(function (transition) {
      var end = PathMap.search(transition.to.path)
      me.index = end.weight
    })
    var classID = api.get('messageClassID') || 1
    this.tabIdx = classID
    this.getMsg(classID)
  },
  destroyed () {
    delete this.$router.ostonehome
    this.$router.ostonehome = null
  },
  methods: {
    getMsg: function (classID) {
      var me = this
      me.$dispatch('loading-start', '正在加载数据...')
      // console.log(0)
      api.getInfoList(classID, function (result) {
        // me.myMsg = result.data
        if (result.success) {
          console.log(result.data)
          me.lists = result.data
        }
        me.$dispatch('loading-end', 'loading')
      })
    },
    goToMsgInfo: function (infoID) {
      console.log(infoID)
      api.set('infoID', infoID)
      this.$router.go('/msginfo-home')
    },
    changeClass: function (item) {
      api.set('messageClassID', item.index)
      this.tabIdx = item.index
      this.getMsg(item.index)
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ActivityPaga e!',
      lists: [],
      tabIdx: 1,
      tabList: [
        {index: 1, name: '成立公告'},
        {index: 2, name: '合同变更'},
        {index: 3, name: '临时公告'},
        {index: 4, name: '分红公告'},
        {index: 5, name: '清算公告'},
        {index: 6, name: '年报'},
        {index: 7, name: '季报'},
        {index: 8, name: '月报'},
        {index: 9, name: '其他'}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  height: 100%;
  overflow-y: scroll;
  background: #f2f2f2;
}
.tab-box {
  width: 100%;
  overflow-x: scroll;
  border-bottom: 1px solid #ccc;
  background: #fff;
}
.tab-box nobr {
  display: block;
  width: 900px;
}
.tab-item {
  /*width: 80px;*/
  padding: 0 10px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  float: left;
}
.tab-item.on {
  border-bottom: 3px solid #e3463d;
  color: #e3463d;
}
.title-box {
  width: 100%;
  /*height: 80px;*/
  border-bottom: 1px solid #e2e2e2;
  background-color: #fff;
  padding: 10px 15px;
  overflow: hidden;
}
h1 {
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  color: #000;
}
span {
  display: block;
  float: right;
  color: #ababab;
}
.no-msg {
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 14px;
}
</style>
