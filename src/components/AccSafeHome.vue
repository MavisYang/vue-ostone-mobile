<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}</x-header>
  </div> -->
  <div class="view-container">
    <div class="page">
      <div class="lis" v-for="list in lists" @click="turnToLink(list.id)" v-show="list.isShow">
        <h1>{{list.name}}</h1>
        <span>{{list.value}}<i class="icon iconfont go-next" v-show="list.goOk">&#xe602;</i></span>
      </div>
      <!-- <div class="logout">
        退出登录
      </div> -->
      <div class="btn-box">
        <x-button :text="'返回'"  @click="goToMain" ></x-button>
      </div>
      <div class="btn-box" v-show="outShow">
        <x-button :text="'退出登录'"  @click="logOut" ></x-button>
      </div>
      <actionsheet
        :show.sync="showLogOut"
        @on-click-menu="clickMenus"
        @on-cancel="clickCancel"
        :menus="logoutMenu"
        @on-click-menu="click"
        show-cancel >
      </actionsheet>
      <confirm :show.sync="confirmShow" confirm-text="确定" cancel-text="取消" title="提示" @on-confirm="doSomething" @on-cancel="doNothing">
        <p style="text-align:center;">确定要将用户账号改绑到当前微信号？</p>
      </confirm>
    </div>
  </div>
</div>
</div>
</template>
<script>
import api from '../api'
import XHeader from 'vux/src/components/x-header'
import XButton from 'vux/src/components/x-button'
import Actionsheet from 'vux/src/components/actionsheet'
import Confirm from 'vux/src/components/confirm'
import PathMap from '../PathMap'
import Vue from 'vue'
export default {
  components: {
    XHeader,
    XButton,
    Actionsheet,
    Confirm
  },
  ready () {
    // var userid = window.G.user.id
    // if (userid === '') {
    //   this.$dispatch('alertShow', '没有您的信息，请先登录', '提示', '前去登录', '/login-home/login-page')
    //   return
    // }
    var openId = window.G.openID
    if (openId) {
      this.outShow = false
    } else {
      this.outShow = true
    }
    var me = this
    var currentPath = window.location.hash.replace('#!', '')
    // var productId = this.$route.params.productID // 获取产品ID
    var current = PathMap.search(currentPath)
    // console.log(productId)
    // this.lists[5].value = myMsg.
    this.testGet()
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
    // 我的账户信息
    // var myMsg = api.get('myMsg')
    //
  },
  destroyed () {
    delete this.$router.loginhome
    this.$router.loginhome = null
  },
  data () {
    return {
      direction: 'forward',
      title: '',
      showLogOut: false,
      outShow: false, // 退出按钮是否显示
      logoutMenu: {
        menu1: '确定退出'
      },
      canceText: '取消',
      mymess: {},
      confirmShow: false,
      lists: [
        { name: '登录密码', value: '修改', id: 0, goOk: true, isShow: true },
        { name: '证件号码', value: '', id: 1, goOk: false, isShow: true },
        { name: '手机绑定', value: '', id: 2, goOk: true, isShow: true },
        { name: '电子邮箱', value: '', id: 3, goOk: true, isShow: true },
        { name: '地址', value: '', id: 4, goOk: true, isShow: true },
        { name: '微信绑定', value: '已绑定', id: 5, goOk: false, isShow: true },
        { name: '实名认证', value: '已认证', id: 6, goOk: false, isShow: true },
        { name: '投资风格', value: '', id: 7, goOk: true, isShow: true },
        { name: '签约客户认证', value: '', id: 8, goOk: true, isShow: true }
        // { name: '修改紧急联系人', value: '', id: 9 },
      ]
    }
  },
  methods: {
    doSomething: function () {
      var me = this
      api.changeOpenID(function (res) {
        console.log(res)
        if (res.success) {
          me.$dispatch('alertShow', '修改成功', '提示', '确定')
          window.location.reload()
        } else {
          me.$dispatch('alertShow', res.message, '提示', '确定')
        }
      })
    },
    doNothing: function () {
      this.confirmShow = false
    },
    goToMain: function () {
      this.$router.go('/ostone-home/main-page')
    },
    logOut: function () {
      this.showLogOut = true
    },
    clickMenus: function (key) {
      console.log(key)
      switch (key) {
        case 'menu1':
          // window.alert(0)
          api.logOut()
          window.location.href = '/'
          break;
        default:
      }
    },
    clickCancel: function () {
      this.showLogOut = false
    },
    testGet: function () {
      var me = this
      api.getMyAccountInfo(function (result) {
        console.log(result)
        me.mymess = result.data
        var myMsg = result.data
        // 证件号码
        me.lists[1].value = myMsg.userID.substr(0, 6) + '****' + myMsg.userID.substr(-4, 4)
        // 手机号码
        me.lists[2].value = myMsg.userMobile.substr(0, 3) + '****' + myMsg.userMobile.substr(-4, 4)
        // email
        if (myMsg.email === '') {
          me.lists[3].value = '绑定邮箱'
        } else {
          me.lists[3].value = myMsg.email
        }
        // 地址
        if (myMsg.address === '') {
          me.lists[4].value = '添加地址'
        } else {
          me.lists[4].value = myMsg.address
        }
        // 微信绑定
        var myOpenId = window.G.openID
        var thisOpenId = myMsg.openid
        if (myOpenId) {
          if (myOpenId != thisOpenId) {
            me.lists[5].value = '修改绑定'
            me.lists[5].goOk = true
          } else {
            me.lists[5].value = '已绑定'
            me.lists[5].goOk = false
          }
        } else {
          me.lists[5].isShow = false
        }
        // console.log(me.lists[5].value, myOpenId, thisOpenId)
        // me.lists[4].value = myMsg.address
        // 签约客户认证
        if (myMsg.cerified) {
          me.lists[8].value = '已认证'
          me.lists[8].goOk = false
        } else {
          me.lists[8].value = '未认证'
          me.lists[8].goOk = true
        }
        // 投资风格
        if (myMsg.rankGrade > 0 && myMsg.rankGrade <= 25) {
          me.lists[7].value = '保守型'
      } else if (myMsg.rankGrade > 25 && myMsg.rankGrade <= 50) {
          me.lists[7].value = '稳健型'
      } else if (myMsg.rankGrade > 50 && myMsg.rankGrade <= 75) {
          me.lists[7].value = '平衡型'
        } else if (myMsg.rankGrade > 75 && myMsg.rankGrade <= 85) {
          me.lists[7].value = '成长型'
        } else if (myMsg.rankGrade > 85) {
          me.lists[7].value = '进取型'
        }
        me.$dispatch('loading-end', 'loading')
      })
    },
    turnToLink: function (id) {
      switch (id) {
        case 0:
          var userTp = api.get('myAccMsg').userType
          if (userTp === '0') {
            this.$router.go('/login-home/changepsw-page')
          } else {
            this.$dispatch('alertShow', '您不是个人用户，不可以修改密码。', '提示', '确定')
          }
          break
        // case 1:
        //   this.$router.go('/login-home/changepaper-page')
        //   break
        case 2:
          // window.alert(0)
          this.$dispatch('confirmShow', '确定修改绑定手机号码？', '/login-home/changephone-page')
          // this.$router.go('/login-home/changephone-page')
          break
        case 3:
          // console.log(this.mymess);
          if (this.mymess.email === '') {
            this.$dispatch('confirmShow', '确定绑定邮箱？', '/login-home/changeemail-page')
          } else {
            this.$dispatch('confirmShow', '确定修改邮箱？', '/login-home/changeemail-page')
          }
          // this.$router.go('/login-home/changeemail-page')
          break
        case 4:
          this.$router.go('/login-home/changeaddress-page')
          break
        case 5:
          var myOpenId = window.G.openID
          var thisOpenId = this.mymess.openid
          if (myOpenId && myOpenId != thisOpenId) {
            this.confirmShow = true
          }
          break
        case 7:
          this.$router.go('/investtest-home/begintest-page')
          break
        case 8:
          if (!this.mymess.cerified) {
            this.$router.go('/login-home/cerified-page')
          }
          break
        default:

      }
    }
  },
  events: {
    'search-msg': function (beginDate, endDate) {
      var me = this
      me.$router.go('/trade-home/trademsg-page')
    }
  }
}
</script>

<style scoped>
.view-container {
  padding-bottom: 0;
  height: 100%!important;
}
.btn-box {
  width: 100%;
  margin-top: 20px;
  padding-right: 15px;
}
.page {
  width: 100%;
  overflow: hidden;
  /*padding-top: 10px;*/
  background-color: #fff;
  padding-left: 15px;
}
.lis {
  padding-right: 30px;
  width: 100%;
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #eee;
  overflow: hidden;
}
.lis h1 {
  float: left;
  margin: 0;
  font-size: 14px;
  line-height: 45px;
  font-weight: normal;
}
.lis span {
  float: right;
  font-size: 14px;
  line-height: 45px;
  display: block;
  color: #ababab;
  position: relative;
}
.go-next {
  position: absolute;
  font-size: 12px;
  right: -20px;
  color: #000;
}
</style>
