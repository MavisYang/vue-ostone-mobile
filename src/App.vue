<template>
  <div id="mobile">
    <div class="app" style="zoom: 1">
      <!-- <div id="nav">
        <a v-link="{path: '/login-home'}">login-home</a>
        <a v-link="{path: '/ostone-home/product-page'}">/ostone-home/product-page</a>
        <a v-link="{path: '/reorder-home'}">reorder-home</a>
        <a v-link="{path: '/chart'}">chart</a> -->

        <!-- <div class=container>
            <rd-button icon=ion-upload></rd-button>
        </div> -->
      <!-- </div> -->
      <router-view :transition="'vux-pop-' + (direction === 'forward' ? ins : 'out')"></router-view>
    </div>
    <loading :show="show" :text="text"></loading>
    <alert :show.sync="alertShow" :title="alertTitle" :button-text="alertBtn" @on-hide="goPage">
      <p style="text-align:center;">{{alertTxt}}</p>
    </alert>
    <popup :show.sync="agreeShow" height="60%">
      <div class="popup1">
        <group>
          <switch title="关闭" :value.sync="agreeShow"></switch>
        </group>
        <div class="agreements">
          {{{agreements}}}
        </div>
      </div>
    </popup>
    <confirm :show.sync="confirmShow" confirm-text="确定" cancel-text="取消" title="提示" @on-confirm="doSomething" @on-cancel="doNothing">
      <p style="text-align:center;">{{confirmText}}</p>
    </confirm>
    <!-- <alert :show.sync="alertShow1" :title="alertTitle1" :button-text="alertBtn1" @on-hide="registerAgain">
      <p style="text-align:center;">{{alertTxt1}}</p>
    </alert> -->
    <toast :show.sync='toastShow' :type="toastType">{{toastText}}</toast>
    <div class="black add-address-bg" v-if="addAddressShow">
      <div class="add-address">
        <i class="iconfont icon-close" @click="closeAddress"></i>
        <div class="tit">{{isAdd?'添加新收货地址':'修改收货地址'}}</div>
        <div class="new-msg-box">
          <input type="text" class="name" v-model="addressMsg.name" placeholder="请输入收货人姓名" @change="judge" @keyup="judge">
          <input type="tel" class="phone" :class="(addressMsg.mobile !== ''&&!isPhone)?'wrong':''" v-model="addressMsg.mobile" placeholder="请输入联系方式" @change="judge" @keyup="judge">
          <div class="address">
            <address title="选择地区" :value.sync="addressPC" :list="addressData" raw-value @on-change="selectAdd"></address>
          </div>
          <input type="text" class="add" v-model="addressMsg.street" placeholder="请填写详细街道地址" @change="judge" @keyup="judge">
        </div>
        <div class="foot-btn">
          <button type="button" class="bao" :class="!canBao?'disable':''" @click="goAddAddress">保存</button>
        </div>
      </div>
    </div>
    <dialog :show.sync="selectAddShow">
      <div class="add-box">
        <div class="tit">
          请选择配送地址
        </div>
        <div class="add-box-box">
            <!-- <scroller lock-x height="100%"> -->
                <div class="add-line">
                    <div class="no-add" v-if="addList.length === 0">
                        您还未添加收货地址
                    </div>
                    <div class="has-add" v-else>
                        <div class="eve-add" v-for="item in addList" @click="checkAdd(item)">
                            <i class="iconfont icon-duihao1" :class="addId === item._id?'on':''"></i>
                            <div class="msg-box">
                                <span class="add-name">{{item.name}}</span>
                                <span class="add-phone">{{item.mobile}}</span>
                                <div style="clear: both"></div>
                                <p>{{item.addressTxt}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="new-add" @click="addAddress">
                        <!-- <i class="iconfont icon-jiahao"></i> -->
                        <span>+去添加收货地址</span>
                    </div>
                </div>
            <!-- </scroller> -->
        </div>
        <div class="bot-line">
          <div class="shu-msg">
            <span class="lf">数量： <span>{{shoppingNum}}</span></span>
            <span class="rg">您将消耗积分：<span><i class="iconfont icon-204"></i>{{integralNum}}</span></span>
          </div>
          <div class="btn-box">
            <button type="button" class="giveup" @click="closeDia">取消</button>
            <button type="button" class="sure" @click="addShopOrder">确定</button>
          </div>
        </div>
      </div>
    </dialog>
    <dialog :show.sync="exchangeSuccess">
      <div class="meili-low">
              <div class="head" style="border:none;">
                  兑换成功
              </div>
              <div class="body">
                  <div class="image">
                      <img src="../static/images/upload-success.png">
                  </div>
                  <div class="btns">
                      <div class="btns-left" @click="closeDia">
                          返回
                      </div>
                      <div class="btns-right" @click="goInfoPage">
                          查看详情
                      </div>
                  </div>
              </div>
          </div>
    </dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import PathMap from './PathMap'
import api from './api'
import alert from 'vux/src/components/alert'
import address from 'vux/src/components/address'
import dialog from 'vux/src/components/dialog'
import Group from 'vux/src/components/group'
import Popup from 'vux/src/components/popup'
import Switch from 'vux/src/components/switch'
import Confirm from 'vux/src/components/confirm'
import addressData from 'vux/src/components/address/list.json'
// import {rdText} from 'radon-ui'
// import rdButton from 'radon-ui/src/components/basic/button'
import loading from 'vux/src/components/loading'
import toast from 'vux/src/components/toast'
export default {
  components: {
    loading,
    dialog,
    alert,
    Group,
    Popup,
    Switch,
    Confirm,
    address,
    toast
    // rdButton
  },
  data () {
    return {
      confirmShow: false,
      confirmText: '',
      nextPage: '',
      direction: 'forward',
      show: false,
      alertShow: false,
      agreeShow: false,
      agreements: '',
      alertTxt: '',
      alertBtn: '继续答题',
      alertTitle: '还有题目没有完成哦',
      thePage: '',
      ins: 'in',
      // alertShow1: false,
      // alertTxt1: '',
      // alertBtn1: '继续答题',
      // alertTitle1: '还有题目没有完成哦',
      text: 'loading',
      addAddressShow: false,
      isAdd: false,
      addressData: addressData,
      addressMsg: {
        name: '',
        mobile: '',
        street: ''
      },
      addressPC: ['广东省', '深圳市', '南山区'],
      toastShow: false,
      toastType: 'success',
      toastText: 'chenggon',
      canBao: false,
      isPhone: false,
      selectAddShow: false,
      addList: [],
      addId: 0,
      myAddress: {},
      isCheck: false,
      test: {
        value: '',
        placeHolder: '请输入',
        state: 'success',
        tip: '',
        inline: true
      },
      goodsId: '',
      cartIds: [],
      integralNum: 0,
      shoppingNum: 0,
      exchangeSuccess: false,
      orderId: ''
    }
  },
  events: {
    'loading-start': function (msg) {
      // 事件回调内的 `this` 自动绑定到注册它的实例上
      this.text = msg
      this.show = true
    },
    'loading-end': function (msg) {
      this.show = false
      this.text = msg
    },
    'toast': function (msg1, msg2) {
      this.toastType = msg1
      this.toastText = msg2
      this.toastShow = true
      var me = this
      setTimeout(function () {
        me.toastShow = false
      }, 1000)
    },
    'alertShow': function (msg, msg1, msg2, msg3) {
      this.alertShow = true
      this.alertTxt = msg
      this.alertTitle = msg1
      this.alertBtn = msg2
      this.thePage = msg3
    },
    'agreementShow': function (msg) {
      this.agreeShow = true
      this.agreements = msg
    },
    'confirmShow': function (msg, msg1, sign) {
      // window.alert(1)
      if (sign) {
        this.confirmShow = true
        this.confirmText = msg
        this.nextPage = sign
      } else {
        this.confirmShow = true
        this.confirmText = msg
        this.nextPage = msg1
      }
    },
    'add-address': function (msg) {
      this.isAdd = true
      this.addressMsg = {
        name: '',
        mobile: '',
        street: ''
      }
      this.addressPC = []
      this.isPhone = false
      this.isCheck = false
      this.canBao = false
      this.addAddressShow = true
    },
    'edit-address': function (item, msg) {
      this.addressPC = []
      this.addressPC.push(item.province)
      this.addressPC.push(item.city)
      this.addressPC.push(item.town)
      this.addressMsg = item
      this.addAddressShow = true
      this.isAdd = false
      this.isCheck = false
      this.judge()
    },
    'check-address': function (msg1, msg2, msg3) {
      if (typeof msg1 === 'string') {
        this.goodsId = msg1
        this.cartIds = []
      } else {
        this.goodsId = ''
        this.cartIds = msg1
      }
      this.shoppingNum = msg2
      this.integralNum = msg3
      this.selectAddShow = true
      this.isCheck = true
      this.addressDioShow()
    }
    // 'alertShow1': function (msg, msg1, msg2) {
    //   this.alertShow1 = true
    //   this.alertTxt1 = msg
    //   this.alertTitle1 = msg1
    //   this.alertBtn1 = msg2
    // }
  },
  methods: {
    jump: function (transition) {
      var me = this
      console.log(transition, me.direction, transition.from.path)
      if (!transition.from.path && transition.to.path === '/ostone-home/product-page') {
        me.ins = ''
        // console.log(0)
      }
      else if (transition.from.path && transition.to.path) {
        me.ins = 'in'
        var start = PathMap.search(transition.from.path)
        var end = PathMap.search(transition.to.path)
        // console.log(0)
        me.direction = (end.weight > start.weight) ? 'forward' : 'backword'
        // console.log(start, end, me.direction)
        if (me.$router.ostonehome) {
          me.$router.ostonehome.direction = me.direction
        }
        if (me.$router.loginhome) {
          me.$router.loginhome.direction = me.direction
        }
      }
      Vue.nextTick(function () {
        // 确保direction生效
        transition.next()
      })
    },
    goPage: function () {
      // window.alert(0)
      this.$router.go(this.thePage)
    },
    doNothing: function () {
      this.confirmShow = false
    },
    doSomething: function () {
      if (this.nextPage.indexOf('/') < 0) {
        this.$broadcast('delete-goods', this.nextPage)
      } else {
        this.$router.go(this.nextPage)
      }
    },
    // ====================================
    checkAdd: function (item) {
      // console.log(index)
      if (item._id === this.addId) {
        this.myAddress = {}
        this.addId = 0
      } else {
        this.myAddress = item
        console.log(item)
        this.addId = item._id
      }
    },
    closeDia: function () {
      this.selectAddShow = false
      this.exchangeSuccess = false
    },
    addAddress: function () {
      this.isAdd = true
      this.addressMsg.name = ''
      this.addressMsg.mobile = ''
      this.addressMsg.street = ''
      this.addressPC = []
      this.addAddressShow = true
    },
    // ===============================================
    judge () {
      this.isPhone = (/^1[34578]\d{9}$/.test(this.addressMsg.mobile))
      console.log(this.isPhone, 'isPhone')
      if (this.addressMsg.name === '' || !this.isPhone || this.addressPC.length === 0 || this.addressMsg.street === '') {
        this.canBao = false
      } else {
        this.canBao = true
      }
      console.log(this.canBao, 'judge', this.addressPC)
    },
    closeAddress: function () {
      this.addAddressShow = false
    },
    goAddAddress: function () {
      if (!this.canBao) {
        return
      }
      var me = this
      console.log(this.addressPC)
      for (var a in me.addressData) {
        if (me.addressPC[0] === me.addressData[a].value) {
          me.addressMsg.province = me.addressData[a].name
        }
      }
      for (var b in me.addressData) {
        if (me.addressPC[1] === me.addressData[b].value) {
          me.addressMsg.city = me.addressData[b].name
        }
      }
      for (var c in me.addressData) {
        if (me.addressPC[2] === me.addressData[c].value) {
          me.addressMsg.town = me.addressData[c].name
        }
      }
      console.log(me.addressMsg)
      if (this.isAdd) {
        api.addressAdd(me.addressMsg, function (res) {
          console.log(res)
          me.addAddressShow = false
          if (res.success) {
            me.$dispatch('toast', 'success', '添加成功')
            if (me.isCheck) {
              me.addAddressShow = false
              me.addId = 0
              me.addressDioShow()
            } else {
              me.$broadcast('get-address-list')
            }
          } else {
            me.$dispatch('toast', 'warn', res.msg)
          }
        })
      } else {
        api.addressUpdate(me.addressMsg, function (res) {
          me.addAddressShow = false
          if (res.success) {
            me.$dispatch('toast', 'success', '修改成功')
            me.$broadcast('get-address-list')
          } else {
            me.$dispatch('toast', 'warn', res.msg)
          }
        })
      }
    },
    addressDioShow () {
      var me = this
      me.$dispatch('loading-start')
      api.addressList(function (res) {
        me.$dispatch('loading-end')
        console.log(res)
        if (res.success) {
          me.addList = res.data
          for (var i in me.addList) {
            if (me.addList[i].isDefault) {
                me.addId = me.addList[i]._id
                me.myAddress = me.addList[i]
            }
            me.addList[i].addressTxt = ''
            me.addList[i].addressTxt += me.addList[i].province
            me.addList[i].addressTxt += me.addList[i].city
            me.addList[i].addressTxt += me.addList[i].town
            me.addList[i].addressTxt += me.addList[i].street
          }
          if (me.addId === 0 && me.addList.length > 0) {
            me.addId = me.addList[0]._id
            me.myAddress = me.addList[0]
          }
          me.addressShow = true
        }
      })
      // this.addressShow = true
    },
    goInfoPage () {
        this.exchangeSuccess = false
        this.$router.go('/info-home/order-info?orderId=' + this.orderId)
    },
    addShopOrder: function () {
        if (this.addId === 0) {
            this.toastType = 'warn'
            this.toastText = '请选择收货地址'
            this.toastShow = true
            var me = this
            setTimeout(function () {
              me.toastShow = false
            }, 1000)
            return
        }
        console.log(this.myAddress, this.addId, 'ggggggg')
        api.addShopOrder(this.goodsId, this.shoppingNum, this.cartIds, {
            province: this.myAddress.province,
            city: this.myAddress.city,
            street: this.myAddress.street,
            town: this.myAddress.town,
            name: this.myAddress.name,
            mobile: this.myAddress.mobile
        }, (res) => {
            console.log(res)
            if (res.success) {
                if (this.cartIds.length !== 0) {
                    this.$broadcast('reload-list')
                }
                this.selectAddShow = false
                this.exchangeSuccess = true
                this.orderId = res.data._id
            } else {
                this.selectAddShow = false
                this.toastType = 'warn'
                this.toastText = res.msg
                this.toastShow = true
                var me = this
                setTimeout(function () {
                  me.toastShow = false
              }, 1500)
            }
        })
    }
    // registerAgain: function () {
    //   var me = this
    //   me.$router.go('/login-home/register-page')
    // }
  },
  ready: function () {
    var me = this
    api.reZoom()
    this.$router.beforeEach(function (transition) {
      var user = window.G.user
      var openId = window.G.openID
      // if (userid === '') {
      //   window.alert('请先登录')
      //   me.$router.go('/login-home')
      //   return
      // }
      // var myMsg = api.get('myMsg')
      // console.log(transition)
      if (!openId && !user && transition.to.path.indexOf('/login-home') === -1) {
        me.$router.go('/login-home')
        // me.jump(transition)
      }
      else {
        if (transition.to.path.indexOf('/login-home') === -1 && !user) {
          // window.alert('请先登录')
          me.$router.go('/login-home/register-page')
        } else {
          if (transition.to.path === '/login-home/changepsw-page' && !user) {
            // window.alert('请先登录')
            me.$router.go('/login-home')
          } else {
            me.jump(transition)
          }
        }
      }
    })
    // me.addressDioShow()
    // me.isCheck = true
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/reset';

html {
  height: 100%;
}
body {
  height: 100%;
  background-color: #fbf9fe;
  font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "Micro Hei", SimSun, "宋体", Heiti, "黑体", sans-serif;
}
.home {
  background-color: #fff;
}
.vux-pop-in-transition,.vux-pop-out-transition {
    width: 100%;
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden
}
.vux-pop-in-enter,.vux-pop-in-leave,.vux-pop-out-enter,.vux-pop-out-leave {
    will-change: transform;
    height: 100%;
    position: absolute;
    left: 0
}

.vux-pop-out-enter {
    -webkit-animation-name: a;
    animation-name: a
}

.vux-pop-out-leave {
    -webkit-animation-name: d;
    animation-name: d
}

.vux-pop-in-enter {
    -webkit-perspective: 1000;
    perspective: 1000;
    -webkit-animation-name: c;
    animation-name: c
}

.vux-pop-in-leave {
    -webkit-animation-name: b;
    animation-name: b
}
@-webkit-keyframes a {
    0% {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@keyframes a {
    0% {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@-webkit-keyframes b {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0)
    }
}

@keyframes b {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0)
    }
}

@-webkit-keyframes c {
    0% {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@keyframes c {
    0% {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@-webkit-keyframes d {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0)
    }
}

@keyframes d {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0)
    }
}
.home {
  height: 100%;
}
.page {
  height: 100%;
  overflow-y: scroll;
}
.header-container {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}
.view-container {
  box-sizing: border-box;
  /*height: 100%;*/
  height: calc(100% - 56px);
  /*padding-bottom: 56px;*/
  -webkit-overflow-scrolling: touch;
  /*padding-top: 45px;*/
  /*background-color: #F1EFF6;*/
}
.app {
  height: 100%;
}
.vux-header-title {
  font-size: 16px!important;
}
.weui_btn {
  background: #e84a3e!important;
  color: #fff!important;
  font-size: 14px!important;
}
.weui_tabbar {
  position: fixed!important;
}
.popup1 {
  height: 100%;
  width: 100%;
}
.agreements {
  width: 100%;
  padding: 10px;
  height: 85%;
  overflow-y: scroll;
}
.agreements h1 {
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  margin: 10px 0;
}
.agreements h2 {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
}
.agreements p {
  font-size: 12px;
  text-indent: 2em;
}
.agreements span {
  display: block;
  font-size: 12px;
  text-indent: 2em;
}
</style>
<style lang="less" media="screen">
.meili-low {
    width: 100%;
    .head {
        font-size: 18px;
        width: 100%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }
    .body {
        .image {
            width: 49.5px;
            height: 49.5px;
            margin: 10px auto;
            img {
                width: 100%;
                height: auto;
            }
        }
        .words {
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            margin:  0 0 15px 0;
            font-size: 14px;
            line-height: 25px;
            span {
                color: #ff7a4b;
            }
        }
        .btns {
            width: 100%;
            height: 30px;
            padding: 0 14px;
            color: #fff;
            line-height: 30px;
            box-sizing: border-box;
            margin: 0 0 15px 0;
            .btns-left {
                float: left;
                height: 100%;
                width: 107px;
                background-color: #d2d2d2;
                text-align: center;
                border-radius: 2px;
            }
            .btns-right {
                float: right;
                height: 100%;
                width: 107px;
                background-color: #f8665b;
                text-align: center;
                border-radius: 2px;
            }
        }
    }
}
.add-address-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  .add-address {
  position: absolute;
  width: 80%;
  margin: auto;
  left: 0;
  right: 0;
  background: #fff;
  // bottom: 0px;
  top: 100px;
  border-radius: 5px;
  text-align: center;
  .icon-close {
    position: absolute;
    top: -40px;
    color: #fff;
    right: 10px;
    font-size: 20px;
    &:after {
      content: '';
      color: #fff;
      width: 0;
      height: 30px;
      border-left: 1px solid #fff;
      position: absolute;
      left: 50%;
      top: 90%;
    }
  }
  .tit {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #d2d2d2;
  }
  .new-msg-box {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    input {
      width: 100%;
      margin-bottom: 10px;
      border: 1px solid #c8c8c8;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .wrong {
        border: 2px solid red;
    }
  }
  .foot-btn {
    width: 100%;
    height: 50px;
    border-top: 1px solid #d2d2d2;
    button {
      width: 80%;
      height: 40px;
      line-height: 40px;
      background: #ff7a4b;
      border: none;
      outline: none;
      margin: 10px auto;
      color: #fff;
      border-radius: 5px;
      font-size: 16px;
    }
    .disable {
        background: #d2d2d2;
    }
    margin-bottom: 10px;
  }
  .address {
    width: 100%;
    margin-bottom: 10px;
    border:  1px solid #c8c8c8;
    height: 35px;
    line-height: 35px;
    overflow: hidden;
    .weui-cell {
      padding: 0 10px!important;
      .weui-label {
        position: absolute;
        left: 0;
        top: 0;
        padding-left: 10px;
      }
      .vux-popup-picker-value {
        position: absolute;
        right: 0;
        top: 0;
        text-align: right;
        font-size: 12px;
        padding-right: 0;
        width: 65%;
        overflow: hidden;
      }
      .weui-cell__hd {
        text-align: left;
        font-size: 14px;
        padding-left: 10px;
      }
      .weui-cell__ft {
        top: 17px;
        right: 5px;
      }
    }
  }
  }
}
.vux-tap-active {
  padding: 0px 10px!important;
  color: #000;
  .weui_cell_ft {
    width: 138px;
    height: 35px;
    overflow: hidden;
  }
}
.weui_toast_success .weui_icon_toast:before {
    content: "\EA08";
    color: #00cc66;
}
.add-box {
  width: 100%;
  height: 100%;
  .tit {
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #d2d2d2;
    padding: 10px 0;
  }
  .add-box-box {
      height: 150px;
      box-sizing: border-box;
  }
  .add-line {
    padding: 0px;
    // padding-top: 10px;
    height: 150px;
    user-select: initial;
    overflow-y: scroll;
    box-sizing: border-box;
    .no-add {
      font-size: 14px;
      margin: 5px 0;
      padding-top: 20px;
    }
    .has-add {
        user-select: initial;
        .eve-add {
            width: 80%;
            margin: 5px auto;
            border: 1px solid #f1f1f1;
            position: relative;
            box-sizing: border-box;
            i {
                width: 16px;
                height: 16px;
                line-height: 16px;
                display: block;
                border-radius: 100%;
                border: 1px solid #f1f1f1;
                color: #fff;
                position: absolute;
                margin: auto;
                top: 0px;
                bottom: 0px;
                left: 5px;
            }
            .on {
                color: #f8665b;
            }
            .msg-box {
                width: 100%;
                height: 100%;
                font-size: 14px;
                overflow: hidden;
                box-sizing: border-box;
                padding: 10px 10px 10px 30px;
                span {
                    display: block;
                    float: left;
                }
                .add-name {
                    font-size: 14px;
                    float: left;
                }
                .add-phone {
                    //   margin-left: 30px;
                    float: right;
                }
                p {
                    display: block;
                    text-align: left;
                    margin: 0;
                    font-size: 12px;
                }
            }
        }
    }
    .new-add {
      width: 80%;
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      border: 1px solid #f1f1f1;
      color: #a1a1a1;
      font-size: 14px;
      margin-top: 10px;
      i {
        color: #d2d2d2;
      }
    }
  }
  .bot-line {
    .shu-msg {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      .lf {
        float: left;
        span {
          color: #f8665b;
        }
      }
      .rg {
        float: right;
        span {
          color: #f8665b;
        }
      }
    }
    .btn-box {
        width: 100%;
      padding: 10px 20px;
      overflow: hidden;
      border-top: 1px solid #d2d2d2;
      box-sizing: border-box;
      button {
        width: 100px;
        height: 30px;
        line-height: 30px;
        outline: none;
        border: none;
        color: #fff;
        border-radius: 3px;
      }
      .giveup {
        float: left;
        background: #d2d2d2;
      }
      .sure {
        float: right;
        background: #f8665b;
      }
    }
  }
}
</style>
