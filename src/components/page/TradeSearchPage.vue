<template>
  <div class="page">
    <div class="date">
      <group>
        <datetime title="开始日期" :value.sync="beginDate" :placeholder="beginDate" confirm-text="确认" cancel-text="取消" :max-year=2016 @change="beginBand"></datetime>
      </group>
    </div>
    <div class="date">
      <group>
        <datetime title="结束日期" :value.sync="endDate" :placeholder="endDate" confirm-text="确认" cancel-text="取消" @change="endBand"></datetime>
      </group>
    </div>
    <div class="search-btn">
      <x-button :text="'查询'" @click="search" ></x-button>
    </div>
    <div class="search-btn">
      <x-button :text="'返回'" @click="goMain"></x-button>
    </div>
  </div>
</template>

<script>
// import PathMap from '../../PathMap'
// import Vue from 'vue'
import api from '../../api'
import Group from 'vux/src/components/group'
import Datetime from 'vux/src/components/datetime'
import XButton from 'vux/src/components/x-button'
export default {
  components: {
    Group,
    Datetime,
    XButton
  },
  ready () {
    // var userid = window.G.user
    // if (!userid) {
    //   this.$dispatch('alertShow', '没有您的信息，请先登录', '提示', '前去登录', '/login-home/login-page')
    //   return
    // }
  },
  methods: {
    search: function () {
      var begin = parseInt(this.beginDate)
      var end = parseInt(this.endDate)
      if (begin > end) {
        this.$dispatch('alertShow', '开始日期不能大于结束日期哦', '提示', '重新选择')
      } else {
        // console.log(this.beginDate.toString(), this.endDate.toString())
        api.set('startDate', this.beginDate + '')
        api.set('endDate', this.endDate + '')
        this.$dispatch('search-msg')
      }
    },
    beginBand: function (val) {
      this.beginDate = val.replace('-', '')
      // console.log(val)
      var me = this
      window.setTimeout(function () {
        var begin = parseInt(me.beginDate)
        var end = parseInt(me.endDate)
        if (begin > end) {
          me.$dispatch('alertShow', '开始日期不能大于结束日期哦', '提示', '重新选择')
        }
        // console.log(begin, end)
      }, 100)
    },
    endBand: function (val) {
      this.endDate = val.replace('-', '')
      var me = this
      window.setTimeout(function () {
        var begin = parseInt(me.beginDate)
        var end = parseInt(me.endDate)
        if (begin > end) {
          me.$dispatch('alertShow', '开始日期不能大于结束日期哦', '提示', '重新选择')
        }
        // console.log(begin, end)
      }, 100)
      // console.log(val)
    },
    goMain: function () {
      // console.log(0)
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
      myMsg: {},
      beginDate: '20150228',
      endDate: '20170808'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    overflow-y: hidden;
  }
  .date {
    height: 45px;
    font-size: 14px;
  }
  .search-btn {
    padding: 0 15px;
    margin-top: 20px;
  }
  .weui_btn {
    background: #e84a3e;
    color: #fff;
  }
</style>
<style>
.weui_cell_bd > p {
  font-size: 14px;
}
.weui_cell_ft {
  font-size: 14px;
}
.weui_cells > a {
  text-decoration: none;
}
</style>
