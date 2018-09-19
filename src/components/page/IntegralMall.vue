<template>
    <div class="integral-mall">
        <scroller v-ref:scroller :height="autoHeight" lock-x use-pullup @pullup:loading="loadMore" :pullup-status.sync="pullupStatus">
            <div class="">
        <div class="integral-mall-head">
            <swiper :interval="1500" :list="list" auto style="width:100%;margin:0 auto;" :aspect-ratio="148/320" :show-desc-mask="false" dots-class="custom-bottom" dots-position="center">
            </swiper>
        </div>
        <div class="integral-mall-neck">
            <span class="sp-1" @click="goInfo('/info-home/shopping-cart')">
                <div class="sp-div">
                    <img src="../../../static/images/shopping-cart.png">
                </div>
                <span class="sp-2">积分购物车</span>
            </span>
            <span class="sp-1">
                <div class="sp-div">
                    <img src="../../../static/images/integral.png">
                </div>
                <span class="sp-2">我的积分:</span>
                <span class="sp-3">{{point}}</span>
            </span>
            <span class="sp-1" @click="goInfo('/info-home/has-exchanged')">
                <div class="sp-div">
                    <img src="../../../static/images/has-exchanged.png">
                </div>
                <span class="sp-2">已兑换</span>
            </span>
        </div>
        <div class="integral-mall-body">
            <div class="integral-mall-body-content">
                <div class="body-li" v-for="item in showList" @click="goInfo('/info-home/goods-details?itemId=' + item._id )">
                    <div class="body-li-top">
                        <img :src="item.mainImg1" />
                    </div>
                    <div class="body-li-bottom">
                        <div class="left">
                            <div class="name">
                                {{item.title}}
                            </div>
                            <!-- 剩余量 -->
                            <div class="surplus">
                                <span>剩余数量</span>
                                <span>{{item.specs[0].stock}}</span>份
                            </div>
                        </div>
                        <div class="right">
                            <div class="name">
                                <img src="../../../static/images/integral.png">
                            </div>
                            <div class="surplus">
                                {{item.specs[0].price}}
                            </div>
                        </div>
                        <div style="clear:both"></div>
                    </div>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>
        </div>
        <!--pullup slot-->
        <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
            <span v-show="pullupStatus === 'default'"></span>
            <span class="pullup-arrow up-down" v-show="pullupStatus === 'down' || pullupStatus === 'up'"><span class="iconfont icon-pullup"></span></span>
            <span v-show="pullupStatus === 'loading'"><spinner type="lines"></spinner></span>
        </div>
    </scroller>
    </div>
</template>
<script>
import API from '../../api'
import Swiper from 'vux/src/components/swiper'
import Scroller from 'vux/src/components/scroller'
import Spinner from 'vux/src/components/spinner'
export default {
    components: {
        Scroller,
        Spinner,
        Swiper
    },
    data () {
        return {
            list: [],
            autoHeight: '100%',
            pullupStatus: 'default',
            pageNo: 1,
            pageSize: 10,
            pageTotal: 0,
            showList: [],
            lastStore: [],
            point: 0
        }
    },
    created () {
        this.getPointInfo()
        this.getShopBannerList()
        this.getList(true)
    },
    methods: {
        getPointInfo: function () {
          var me = this
          API.getPointInfo(function (res) {
            if (res.success) {
              me.point = res.data.point
            } else {
              console.log('获取积分信息失败')
            }
          })
        },
        goInfo: function (router) {
            this.$router.go(router)
        },
        getShopBannerList () {
            API.getShopBannerList((res) => {
              console.log(res, '轮播数据')
                if (res.success) {
                    this.list = res.data.map(function (item) {
                      return {
                          img: item.img,
                          url: item.link
                      }
                    })
                    console.log(this.list)
                }
            })
        },
        getList: function (first, uuid) {
          var me = this
          me.$dispatch('loading-start')
          var height
          var needScroll = true
          if (first) {
            me.pageNo = 0
            me.lastStore = []
            needScroll = false
          }
          me.pageNo += 1
          API.getShopItemList(this.pageNo, this.pageSize, function (result) {
            console.log(result, '商城列表数据')
            if (result.success) {
              if (result.data.length >= me.pageSize) {
                height = me.$refs.scroller._xscroll.content.offsetHeight
                me.showList = me.lastStore.concat(result.data)
                me.lastStore = me.showList
              } else {
                needScroll = false
                me.showList = me.lastStore.concat(result.data)
                me.pageNo = me.pageNo - 1
              }
              me.$nextTick(() => {
                me.$broadcast('pullup:reset', uuid)
                me.pullupStatus = 'default'
                me.$refs.scroller.reset()
              })
              if (needScroll) {
                me.$refs.scroller._xscroll.scrollTop(height - 60, 800)
              }
              me.pageTotal = Math.ceil(result.pageInfo.total / result.pageInfo.pageSize)
              me.$dispatch('loading-end')
            }
          })
        },
        loadMore (uuid) {
          console.log('suiming')
          this.getList(false, uuid)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.integral-mall {
    background-color: #f3f2f2;
    // padding-bottom: 10px;
    width: 100%;
    height: 100%;
    .integral-mall-head {
        width: 100%;
        height: 160px;
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
        }

    }
    .integral-mall-neck {
        width: 100%;
        height: 44px;
        padding: 6px 0 0;
        line-height: 44px;
        background-color: #fff;
        box-sizing: content-box;
        .sp-div {
            display: block;
            margin: 0 auto;
            width: 18.5px;
            height: 18.5px;
            // background-color: #ccc;
            img {
                width: 100%;
                height: auto;
                float: left;
            }
        }
        .sp-1:first-child {
            float: left;
            // color: #f8aa35;
            border-right: 1px solid #eee;
        }
        .sp-1:last-child {
            float: right;
            border-left: 1px solid #eee;
            .sp-div {
                width: 24px;
            }

        }
        .sp-1 {
            display: inline-block;
            width: 33.1%;
            text-align: center;
            line-height: 23px;
            color: #999;
            .sp-2 {
                font-size: 12px;
            }
            .sp-3 {
                font-size: 12px;
                // color: #f8aa35;
            }
        }
    }
    .integral-mall-body {
        width: 100%;
        height: 100%;
        .integral-mall-body-content {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .body-li:nth-child(2n + 1){
                float: left;
                margin: 12px 5px 0 10px;
            }
            .body-li:nth-child(2n){
                float: right;
                margin: 12px 10px 0 5px;
            }
            .body-li {
                background-color: #fff;
                height: 100%;
                display: inline-block;
                width: 144.5px;
                box-sizing: border-box;
                text-align: center;
                color: #000;
                padding-bottom: 4px;
                .body-li-top {
                    margin: 0 auto 6px;
                    width: 100%;
                    height: 144.5px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .body-li-bottom {
                    box-sizing: border-box;
                    width: 100%;
                    padding: 0 8px;
                    text-align: center;
                    // margin-bottom: 21px;
                    font-size: 14px;
                    .left {
                        width: 80%;
                        float: left;
                        text-align: left;
                        line-height: 25px;
                        .name {
                            width: 100%;
                            display:block;
                            white-space:nowrap;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            font-size: 14px;
                            text-align: left;
                        }
                        .surplus {
                            font-size: 12px;
                            span:last-child {
                                color: #f8665b;
                            }
                        }
                    }
                    .right {
                        width: 20%;
                        float: right;
                        text-align: center;
                        line-height: 30px;
                        padding-top: 2px;
                        .name {
                            width: 19px;
                            height: 19px;
                            // background-color: #ccc;
                            margin: 0 auto;
                            img {
                                width: 100%;
                                height: auto;
                            }
                        }
                        .surplus {
                            font-size: 12px;
                            color: #f8665b;
                        }
                    }
                }
            }
        }
    }
}
</style>
<style media="screen">
.integral-mall .vux-slider > .vux-indicator > a > .vux-icon-dot {
    background-color: #928e88!important;
}
.integral-mall .vux-slider > .vux-indicator > a > .vux-icon-dot.active {
    background-color: #f8665b!important;
}
.integral-mall .xs-container {
  height: auto!important;
}
.integral-mall .vux-swiper {
  height: 148px!important;
}
.integral-mall .vux-swiper-desc {
    display: none;
}
</style>
