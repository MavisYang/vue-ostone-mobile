<template>
    <div class="has-exchanged">
        <div class="switch">
            <tab default-color="#000" active-color="#f8665b" :line-width="1">
                <tab-item @click="handler(1)" :selected="tabIndex === 1">全部</tab-item>
                <tab-item @click="handler(2)" :selected="tabIndex === 2">待发货</tab-item>
                <tab-item @click="handler(3)" :selected="tabIndex === 3">已发货</tab-item>
            </tab>
        </div>
        <scroller v-ref:scroller height="100%" lock-x use-pullup @pullup:loading="loadMore" :pullup-status.sync="pullupStatus">
        <div class="has-exchanged-body">
            <div class="body-li nothing" v-if="!showList.length">
                暂无数据
            </div>
            <div class="body-li" v-else v-for="item in showList" @click="goPage(item._id)">
                <div class="first-column column">
                    <img :src="item.items[0].mainImg1">
                </div>
                <div class="second-column column">
                    <!-- <div class="name">
                        积分商品名称
                    </div> -->
                    <!-- <div class="dingdan">
                        订单号:<span>{{item._id}}</span>
                    </div> -->
                    <div class="num">
                        数量:<span>{{item.totalNum}}</span>份
                    </div>
                    <div class="time">
                        {{item.createDatetime | format}}
                    </div>
                </div>
                <div class="three-column column">
                    <div class="sign" :class="{'has-finish': item.status === 3, 'wait-get': item.status === 2, 'wait-send': item.status === 1, 'reject': item.status === 4,}">
                        {{item.status | shop-status}}
                    </div>
                    <div class="icon-pic">
                        <img src="../../../static/images/integral.png">
                    </div>
                    <div class="shuzi">
                        {{item.totalPrice}}
                    </div>
                </div>
                <div style="clear:both"></div>
            </div>
            <div class="has-over" v-show="isLast && showList.length">
                数据已全部加载
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
import { Tab, TabItem } from 'vux/src/components/tab'
import Scroller from 'vux/src/components/scroller'
import Spinner from 'vux/src/components/spinner'
import api from '../../api'
export default {
    components: {
        Tab,
        TabItem,
        Spinner,
        Scroller
    },
    data () {
        return {
            isLast: false,
            tabIndex: 1,
            pullupStatus: 'default',
            orderStatus: [],
            pageNo: 1,
            pageSize: 10,
            showList: [],
            lastStore: []
        }
    },
    created () {
        this.getList()
    },
    methods: {
        goPage (orderId) {
            this.$router.go('/info-home/order-info?orderId=' + orderId)
        },
        handler (val) {
            this.pageNo = 1
            this.lastStore = []
            this.$refs.scroller._xscroll.scrollTop(0)
            switch (val) {
                case 1:
                    this.orderStatus = []
                    break
                case 2:
                    this.orderStatus = [1]
                    break
                case 3:
                    this.orderStatus = [2, 3, 4]
                    break
            }
            this.getList()
        },
        getList (uuid) {
            var me = this
            this.isLast = false // 加载动画进行中不显示'数据已全部加载'
            this.$dispatch('loading-start')
            api.getShopOrderList(this.orderStatus, this.pageNo, this.pageSize, function (result) {
                console.log(result)
                if (result.data.length >= me.pageSize) {
                    me.showList = me.lastStore.concat(result.data)
                    me.lastStore = me.showList
                    me.isLast = false
                } else {
                    me.showList = me.lastStore.concat(result.data)
                    me.pageNo = me.pageNo - 1
                    me.isLast = true
                }
                // console.log(me.showList, 'showlist')
                me.$nextTick(() => {
                    me.$dispatch('loading-end')
                    me.$broadcast('pullup:reset', uuid)
                    me.pullupStatus = 'default'
                    me.$refs.scroller.reset()
                })
            })
        },
        loadMore (uuid) {
            this.pageNo += 1
            this.getList(uuid)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.has-exchanged {
    background-color: #f6f6f6;
    width: 100%;
    height: 100%;
    // -webkit-overflow-scrolling : touch;
    // overflow-scrolling : touch;
    .switch {
        width: 100%;
        background-color: #eee;
        font-size: 14px;
        position: absolute;
        top: 0;
        z-index: 999;
    }
    .has-exchanged-body {
        // border-top: 1px solid #f1ecec;
        width: 100%;
        box-sizing: border-box;
        padding: 44px 12px 0;
        .body-li {
            box-sizing: border-box;
            margin: 12px 0 0;
            padding:12px 0 12px 12px;
            width: 100%;
            color: #000;
            background-color: #fff;
            .first-column {
                float: left;
                width: 68px;
                margin-right: 12px;
                img {
                    width: 100%;
                    height: 68px;
                }
            }
            .second-column {
                float: left;
                text-align: left;
                font-size: 12px;
                color: #666;
                line-height: 24px;
                padding: 12px 0;
                .name {
                    font-size: 14px;
                    color: #000;
                }
            }
            .three-column {
                float: right;
                .sign {
                    width:57px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    color: #fff;
                    font-size: 12px;
                    border-radius: 8px 0 0 8px;
                }
                .icon-pic {
                    width: 16px;
                    height: 16px;
                    // background-color: #e8eae9;
                    margin:18px auto 5px;
                    img {
                        width: 100%;
                        height: auto;
                        float: left;
                    }
                }
                .shuzi {
                    font-size: 12px;
                    color: #f8665b;
                    // font-weight: bold;

                }
            }
        }

    }
    .has-over {
        text-align: center;
        /* background: #fff; */
        padding: 5px 0;
        font-size: 10px;
        color: #ccc;
    }
    .column {
        float: left;
        text-align: center;
        height: 100%;
        overflow: hidden;
    }
    // 待发货
    .wait-send {
        background-color: #14cc7c;
    }
    // 待收货
    .wait-get {
        background-color: #f8665b;
    }
    // 已完成
    .has-finish{
        background-color: #678be3;
    }
    // 未收货
    .reject {
        background-color: #678be3;
    }
    .nothing {
        height: 94px;
        font-size: 16px;
        color: #ccc!important;
        line-height: 70px;
        text-align: center;
    }
}
</style>
<style media="screen">
.has-exchanged .xs-container {
  height: auto!important;
}
</style>
