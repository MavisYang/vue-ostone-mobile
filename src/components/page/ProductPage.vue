<template>
  <div class="page">
    <filter> </filter>
    <scroller height="100%" lock-x scrollbar-y use-pullup use-pulldown @pullup:loading="loadMore" @pulldown:loading="refresh" :pullup-status.sync="pullupStatus" v-ref:scroller>
      <!-- <expert :experts="experts"></expert> -->
      <products :datas="productsDatas"></products>
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="pullupStatus === 'down' || pullupStatus === 'up'" :class="{'rotate': pullupStatus === 'up'}"><i class="icon iconfont">&#xe604;</i></span>
        <span v-show="pullupStatus === 'loading'"><spinner type="lines"></spinner></span>
      </div>
    </scroller>
    <div class="black-bg" v-show="isShow"></div>
    <confirm :cancel-text="cancelText" title="" :confirm-text="confirmText" :show.sync="confirmShow" @on-confirm="confirmYes">
      <p style="text-align:center;">
        本项目所需风险承受能力为<span class="risk">{{riskLevel}}</span> 以上，已超出您的风险承受能力
        <span class="risk">{{gradeStyle}}</span>，若您继续投资，则视为您已充分认识并愿意承担本项目可能存在的风险。
      </p>
    </confirm>
  </div>
</template>

<script>
import api from '../../api'
import Products from '../online/Products'
import Filter from '../online/Filter'
import Confirm from 'vux/src/components/confirm'
import Scroller from 'vux/src/components/scroller'
import Spinner from 'vux/src/components/spinner'
export default {
  components: {
    Products,
    Filter,
    Scroller,
    Spinner,
    Confirm
  },
  ready () {
    // 预存量
    api.set('select0', '')
    api.set('select1', '')
    api.set('select2', '')
    api.set('select3', '')
    this.$dispatch('loading-start', '正在获取信息')
    api.getMyAccountInfo(function (res) {
      console.log(res)
      if (res.success) {
        api.set('myAccMsg', res.data)
        console.log(api.get('myAccMsg'))
      }
    })
    this.fetchExperts(true)
    // this.testGet()
  },
  events: {
    'showFilters': function (current) {
      if (current === -1) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    'getSelect': function (idx, onIdx) {
      // idx代表不同的方向
      // onIdx代表该方向下的不同选项
      // console.log('select' + idx)
      api.set('select' + idx, onIdx)
      this.productsDatas = []
      this.lastStore = []
      this.pageIndex = 0
      this.pageNo = 0
      this.fetchExperts(true)
    },
    'confirmTip': function (data) {
      this.riskLevel = data.riskLevel
      this.productDate = data
      // 获取产品的风险等级
      switch (this.riskLevel) {
        case '低风险':
          this.productGradeId = 0
          break
        case '中低风险':
          this.productGradeId = 1
          break
        case '中风险':
          this.productGradeId = 2
          break
        case '中高风险':
          this.productGradeId = 3
          break
        case '高风险':
          this.productGradeId = 4
          break
        default:

      }
      // 获取我的投资风格、承受的风险等级
      var RISKSCORE = api.get('myAccMsg').rankGrade
      if (RISKSCORE > 0 && RISKSCORE <= 25) {
        this.gradeStyle = '保守型'
        this.myGradeId = 0
    } else if (RISKSCORE > 25 && RISKSCORE <= 50) {
        this.gradeStyle = '稳健型'
        this.myGradeId = 1
    } else if (RISKSCORE > 50 && RISKSCORE <= 75) {
        this.gradeStyle = '平衡型'
        this.myGradeId = 2
      } else if (RISKSCORE > 75 && RISKSCORE <= 85) {
        this.gradeStyle = '成长型'
        this.myGradeId = 3
      } else if (RISKSCORE > 85) {
        this.gradeStyle = '进取型'
        this.myGradeId = 4
      }
      api.set('myGradeStyle', this.gradeStyle)
      if (this.myGradeId < this.productGradeId) {
        this.confirmShow = true
        api.set('hasOverRisk', true)
      } else {
        api.set('hasOverRisk', false)
        api.set('productDate', this.productDate)
        this.$router.go('/reorder-home/')
      }
    }
  },
  methods: {
    loadMore (uuid) {
      this.fetchExperts(false, uuid)
    },
    refresh (uuid) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$broadcast('pulldown:reset', uuid)
        })
      }, 2000)
    },
    fetchExperts: function (first, uuid) {
      var me = this
      me.pageIndex = this.pageNo + 1
      var firstIdx = api.get('select0')
      var secondIdx = api.get('select1')
      var thirdIdx = api.get('select2')
      var fourIdx = api.get('select3')
      console.log(firstIdx, secondIdx, thirdIdx, fourIdx)
      api.selectProduct(firstIdx, secondIdx, thirdIdx, fourIdx, me.pageIndex, me.pageSize, function (res) {
        me.$dispatch('loading-end', 'loading')
        console.log(res)
        if (res.success) {
          console.log(res)
          if (res.data.length === me.pageSize) {
            me.pageNo = me.pageIndex
            me.productsDatas = me.lastStore.concat(res.data)
            me.lastStore = me.productsDatas
          } else {
            me.productsDatas = me.lastStore.concat(res.data)
          }
          me.$nextTick(() => {
            // 调整滚动条
            if (first) {
              me.$refs.scroller.reset()
            } else {
              me.$broadcast('pullup:reset', uuid)
              me.pullupStatus = 'default'
            }
          })
        }
      })
    },
    confirmYes: function () {
      // console.log(this.productDate)
      var me = this
      api.set('productDate', this.productDate)
      me.$router.go('/reorder-home/')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      isShow: false,
      confirmShow: false,
      cancelText: '取消',
      confirmText: '确定',
      riskLevel: '高风险型', // 产品的风险等级类型
      gradeStyle: '稳健型', // 我的投资风格
      myGradeId: 0, // 我的投资风险承受等级
      productGradeId: 0, // 产品的风险等级
      productsDatas: [],
      pageNo: 0,
      pageIndex: 0,
      pageSize: 5,
      lastStore: [],
      pullupStatus: 'default',
      productDate: {} // 点击的产品详情object
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  background-color: #f0eff5;
  overflow-y: hidden;
  height: 100%;
}
h1 {
  color: #42b983;
}
.black-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: .6;
  z-index: 2;
  top: 0;
}
.filter {
  z-index: 3;
}
.risk {
  color: #e84a3e;
}
</style>
<style >
.weui_dialog_ft {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px
}
.weui_dialog_ft:after {
  border-top: none !important;
}
.weui_dialog_confirm .weui_dialog_ft a {
  color: white;
  border-radius: 5px;
}
.weui_dialog_confirm .weui_dialog_ft a:first-child {
  background-color: #c0b7b6;
  margin-right: 20px;
}
.weui_dialog_confirm .weui_dialog_ft a:last-child {
  background-color: #e84a3e;
}
.xs-container {
  height: calc(100% - 40px)!important;
}
/*#vux-scroller-sob7e {
  height: 600px;
}*/
/*#vux-scroller-bpxsf {
  margin-top: 40px;
}*/
</style>
