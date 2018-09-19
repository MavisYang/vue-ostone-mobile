<template>
<!-- app -->
<div class="home">
  <!-- <div class="header-container">
    <x-header :left-options="{backText: '返回', showBack: true}">{{title}}<a slot="right" v-link="{ path: '/personal-home' }"><i class="icon iconfont">&#xe611;</i></a></x-header>
  </div> -->
  <div class="view-container">
    <div class="page">
      <div class="add-line" v-for="item in addList">
            <div class="one-line">
                <div class="one">
                    <span class="name">{{item.name}}</span>
                    <span class="mobile">{{item.mobile}}</span>
                </div>
                <div class="two">{{item.addressTxt}}</div>
            </div>
            <div class="two-line">
                <div class="left" @click="checkDefault(item)">
                    <i class="iconfont icon-duihao1" :class="addId === item._id?'on':''"></i>
                    <span>{{addId === item._id?'已设为默认地址':'设为默认地址'}}</span>
                    <div style="clear: both;"></div>
                </div>
                <div class="right" ref="rights">
                    <div class="one" @click="updateLine(item)">
                        <i class="iconfont icon-bianji"></i>
                        <span>编辑</span>
                    </div>
                    <div class="one" @click="deleteLine(item)">
                        <i class="iconfont icon-ttpodicon"></i>
                        <span>删除</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="add-add" @click="addAddress">
            + 新增收货地址
        </div>
        <confirm :show.sync="deleteShow" confirm-text="删除" cancel-text="取消" title="" @on-cancel="cancel" @on-confirm="deleteAdd">
            <p style="text-align:center;">是否删除此地址？</p>
        </confirm>
    </div>
  </div>
</div>
</div>
</template>
<script>
import Confirm from 'vux/src/components/confirm'
import XHeader from 'vux/src/components/x-header'
import PathMap from '../PathMap'
import api from '../api'
import Vue from 'vue'
export default {
  components: {
    XHeader,
    Confirm
  },
  ready () {
    // var userid = window.G.user
    // if (!userid) {
    //   this.$dispatch('alertShow', '没有您的信息，请先登录', '提示', '前去登录', '/login-home/login-page')
    //   return
    // }
    var me = this
    me.$dispatch('loading-start', '正在加载数据..')
    this.testGet()
    var currentPath = window.location.hash.replace('#!', '')
    var current = PathMap.search(currentPath)
    // console.log(currentPath)
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
  },
  destroyed () {
    delete this.$router.loginhome
    this.$router.loginhome = null
  },
  data () {
    return {
      direction: 'forward',
      title: '',
      investMsg: [],
      deleteShow: false,
      addId: 0,
      deleteId: '',
      addList: [
        {name: '张三', mobile: '18320292028', addressTxt: '上海市浦东新区', id: 1, street: 'aaaaaaaaaaa'}
      ]
    }
  },
  methods: {
    testGet: function () {
      var me = this
      // console.log(0)
      api.addressList(function (result) {
        console.log(result)
        if (result.success) {
          me.addList = result.data
          for (var i in me.addList) {
            if (me.addList[i].isDefault) {
                me.addId = me.addList[i]._id
            }
            me.addList[i].addressTxt = ''
            me.addList[i].addressTxt += me.addList[i].province
            me.addList[i].addressTxt += me.addList[i].city
            me.addList[i].addressTxt += me.addList[i].town
            me.addList[i].addressTxt += me.addList[i].street
          }
        }
        console.log(me.addList)
        me.$dispatch('loading-end', 'loading')
      })
    },
    checkDefault: function (item) {
      var isDD
      var me = this
      if (item._id === this.addId) {
        isDD = false
      } else {
        isDD = true
      }
      item.isDefault = isDD
      api.addressUpdate(item, function (res) {
        console.log(res)
        if (res.success) {
          if (isDD) {
            me.$dispatch('toast', 'success', '已设为默认地址')
            me.addId = item._id
          } else {
            me.$dispatch('toast', 'success', '已取消默认地址')
            me.addId = 0
          }
        } else {
          me.$dispatch('toast', 'warn', res.msg)
        }
      })
    },
    updateLine: function (item) {
      this.$dispatch('edit-address', item)
    },
    deleteLine: function (item) {
      this.deleteShow = true
      this.deleteId = item._id
    },
    cancel: function () {
      this.deleteShow = false
    },
    deleteAdd: function () {
      var me = this
      api.addressDelete(this.deleteId, function (res) {
        console.log(res)
        if (res.success) {
          me.$dispatch('toast', 'success', '删除成功')
          me.testGet()
        } else {
          me.$dispatch('toast', 'warn', res.msg)
        }
      })
    },
    addAddress: function () {
      this.$dispatch('add-address', true)
    }
  },
  events: {
    'get-address-list': function () {
      this.testGet()
    }
  }
}
</script>

<style lang="less" scoped>
.view-container {
  padding-bottom: 0;
  height: 100%!important;
}
.page {
  background-color: #f2f2f2;
  .add-line {
        width: 100%;
        background: #fff;
        margin-bottom: 10px;
        overflow: hidden;
        .one-line {
            border-bottom: 1px solid #f1f1f1;
            padding: 10px;
            font-size: 14px;
            color: #000;
            .one {
                height: 20px;
                line-height: 20px;
                span {
                    display: block;
                    float: left;
                    margin-right: 20px;
                }
            }
            .two {
                line-height: 20px;
                width: 100%;
                display:block;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
        }
        .two-line {
            height: 40px;
            line-height: 20px;
            font-size: 14px;
            padding: 10px;
            // background: #f00;
            overflow: hidden;
            box-sizing: border-box;
            position: relative;
            .left {
                // display: block;
                display: inline-block;
                overflow: hidden;
                zoom: 1;
                i {
                  width: 16px;
                  height: 16px;
                  line-height: 16px;
                  display: block;
                  border-radius: 100%;
                  border: 1px solid #d9d9d9;
                  color: #fff;
                  float: left;
                  margin-right: 5px;
                //   margin-top: 2px;
                }
                .on {
                  color: #e84a3e;
                }
                span {
                    float: left;
                    color: #999999;
                }
            }
            .right {
                position: absolute;
                right: 10px;
                // display: block;
                display: inline-block;
                overflow: hidden;
                zoom: 1;
                .one {
                    float: left;
                    margin-left: 10px;
                    color: #999;
                    // overflow: hidden;
                    i {
                        color: #e84a3e;
                        // font-weight: 600;
                    }
                }
            }
        }
    }
    .add-add {
        width: 66%;
        height: 38px;
        border: 1px solid #c1c1c1;
        margin: 20px auto;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
        color: #999;
        margin-bottom: 20px;
    }
}

</style>
