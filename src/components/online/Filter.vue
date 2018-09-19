<template>
  <div class="filter">
    <ul class="first">
      <li v-for="list in lists" class="col-xs-3" :class="{'on': $index === currentIndex}" @click.stop="show($index)"><span class="title">{{list.title}}</span><i class="icon iconfont sanjiao">&#xe616;</i>
        <div class="filter-box">
          <ul class="second">
            <li v-for="filter in list.childFilter" @click.stop="xuanZhong($index, list)" :class="{'xuanzhong': $index === list.onMe}"><span>{{filter.filter}}</span><i class="icon iconfont">&#xe60b;</i></li>
          </ul>
          <button @click="select(list)">{{sure}}</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    // 一级li控制事件
    show: function ($index) {
      if (this.currentIndex === $index) {
        this.currentIndex = -1
      } else {
        this.currentIndex = $index
      }
      this.$dispatch('showFilters', this.currentIndex)
    },
    // 二级li控制事件
    xuanZhong: function ($index, list) {
      // console.log($index)
      if ($index === 0) {
        list.onMe = $index
        list.title = list.titleBei
      } else if (list.onMe === $index) {
        list.onMe = -1
        list.title = list.titleBei
      } else {
        list.onMe = $index
        list.title = list.childFilter[$index].filter
      }
      if (list.childFilter[$index].idx === 0) {
        list.onIndex = ''
      } else {
        list.onIndex = list.childFilter[$index].idx
      }
      // console.log(list.onIndex)
    },
    select: function (list) {
      // console.log(list.listId, list.onIndex)
      switch (list.listId) {
        case 0:
          this.$dispatch('getSelect', 0, list.onIndex)
          break
        case 1:
          this.$dispatch('getSelect', 1, list.onIndex)
          break
        case 2:
          this.$dispatch('getSelect', 2, list.onIndex)
          break
        case 3:
          this.$dispatch('getSelect', 3, list.onIndex)
          break
        default:
      }
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      sure: '确定',
      currentIndex: -1,
      lists: [
        {
          listId: 0,
          title: '投资起点',
          onMe: -1, // 对勾是否显示
          titleBei: '投资起点',
          onIndex: 0,
          childFilter: [
            { filter: '全部', idx: 0 },
            { filter: '100万-300万', idx: 1 },
            { filter: '300以上', idx: 2 }
          ]
        },
        {
          listId: 1,
          title: '产品期限',
          onMe: -1, // 对勾是否显示
          titleBei: '产品期限',
          onIndex: 0,
          childFilter: [
            { filter: '全部', idx: 0 },
            { filter: '3-6个月', idx: 1 },
            { filter: '6-12个月', idx: 2 },
            { filter: '12-24个月', idx: 3 },
            { filter: '24-36个月', idx: 4 },
            { filter: '大于36个月', idx: 5 }
          ]
        },
        {
          listId: 2,
          title: '风险级别',
          onMe: -1, // 对勾是否显示
          titleBei: '风险级别',
          onIndex: 0,
          childFilter: [
            { filter: '全部', idx: 0 },
            { filter: '低风险', idx: 1 },
            { filter: '中低风险', idx: 2 },
            { filter: '中风险', idx: 3 },
            { filter: '中高风险', idx: 4 },
            { filter: '高风险', idx: 5 }
          ]
        },
        {
          listId: 3,
          title: '收益类型',
          onMe: -1, // 对勾是否显示
          titleBei: '收益类型',
          onIndex: 0,
          childFilter: [
            { filter: '全部', idx: 0 },
            { filter: '非标类', idx: 1 },
            { filter: '权益类', idx: 2 }
          ]
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filter {
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0;
  height: 40px;
  font-size: 12px;
  background-color: #fff;
  border-bottom: 1px solid #e2e2e2;
  z-index: 9999;
  box-shadow: 1px 1px 10px 1px #e2e2e2;
}
.first, .first li {
  position: static;
}
.first > li {
  list-style: none;
  margin-top: 5px;
  height: 30px;
  line-height: 30px;
  border-right: 1px solid #e3e3e3;
  cursor: pointer;
}
.first > li > i {
  transition: all 0.5s;
  transform: rotate(180deg);
}
ul li:last-child {
  border-right: none;
}
.col-xs-3 {
  padding: 0;
  text-align: center;
  padding-left: 5px;
}
.title {
  width: 50px;
  margin: 0;
  display:inline-block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  float: left;
}
.sanjiao {
  float: left;
  display: inline-block;
  height: 30px;
  line-height: 30px;
}
.filter-box {
  width: 100%;
  background-color: #fff;
  position: absolute;
  left: 0;
  top: 40px;
  display: none;
  z-index: 999;
}
.second {
  width: 100%;
  padding: 0;
  list-style: none;
}
.second > li {
  padding-left: 10px;
  width: 100%;
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #e3e3e3;
}
.second > li:last-child {
  border-bottom: none;
}
.filter-box button {
  background-color: #e84a3e;
  width: 100%;
  display: block;
  color: white;
  font-size: 16px;
  border: none;
  outline: none;
  height: 40px;
}
.second > li {
  color: #000;
}
.second > li > span {
  float: left;
  font-size: 14px;
}
.second > li > i {
  float: right;
  font-size: 12px;
  color: #f00;
  display: none;
  margin-right: 10px;
}

.xuanzhong {
  color: #f00!important;
}
.xuanzhong > i {
  display: inline-block!important;
}

.first > .on {
  color: #f00;
}
.on > i {

  transform: rotate(360deg)!important;
}
.on > .filter-box {
  display: block;
}

</style>
