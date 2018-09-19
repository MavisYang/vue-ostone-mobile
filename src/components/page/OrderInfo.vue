<template>
    <div class="order-info scroll">
        <div class="head-line">
            <div class="biao">
                <img src="../../../static/images/wait-go.png" v-show="orderState === 'wait-go' || orderState === 'going'">
                <img src="../../../static/images/success.png" v-show="orderState === 'success' || orderState === 'fail'">
                <span v-show="orderState === 'wait-go'">待发货</span>
                <span v-show="orderState === 'going'">配送中</span>
                <span v-show="orderState === 'success'">已收货</span>
                <span v-show="orderState === 'fail'">未收货</span>
            </div>
        </div>
        <div class="body-line">
            <div class="fail-words" v-show="orderState === 'fail'">
                <p>很抱歉，此订单作废！</p>
                <p>相应积分已退回至你的积分账户中。</p>
            </div>
            <div class="add-msg">
                <p class="name">订单号: {{orderId}}</p>
                <p class="address" v-show="order.createDatetime">兑换时间: {{order.createDatetime | format}}</p>
            </div>
            <div class="add-msg">
                <p class="pei">配送至：</p>
                <p class="name">{{order.name}} {{order.mobile}}</p>
                <p class="address">{{order.province}} {{order.city}} {{order.street}}</p>
                <p class="name" v-if="orderState !== 'wait-go'">快递公司: {{order.expressName}}</p>
                <p class="address" v-if="orderState !== 'wait-go'">快递单号: {{order.expressNo}}</p>
            </div>
            <p class="tip" v-show="orderState === 'wait-go'">等待快递员取件，预计7天内会送到您的手上</p>
            <p class="tip" v-show="orderState === 'going'">订单正在发货中，预计2-5天内会送到您的手上</p>
            <!-- <p class="tip" style="margin-top: 10px;">如有任何疑问，可拨打客服电话：<span style="color: red"><a href="tel:021-80394676">021-80394676</a></span></p> -->
            <!-- <div class="success-words" v-show="orderState === 'success'">
                <div class="title">
                    商品已送达
                </div>
                <div class="time">
                    送达时间：<span>2017-03-10 12:08:10</span>
                </div>
            </div> -->
            <div class="goods-msg">
                <div class="msg" v-for="item in order.items" @click="goInfoPage(item)">
                    <div class="main-line">
                        <img :src="item.mainImg1">
                        <div class="right-msg">
                            <p class="tit">{{item.title}}</p>
                            <p class="num">数量：{{item.num}}份</p>
                            <div class="money">
                                <div class="integral">
                                    <img src="../../../static/images/integral.png">
                                    <div style="clear: both"></div>
                                </div>
                                <span>{{item.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-msg">
                <p class="name">商品数量: <span style="color: red">{{order.totalNum}}</span></p>
                <p class="address">消耗积分: <span style="color: red">{{order.totalPrice}}</span>积分</p>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../../api'

export default {
    data () {
        return {
            orderId: '',
            orderState: '',
            order: {}
        }
    },
    created () {
        this.orderId = this.$route.query.orderId
        this.getShopOrderInfo()
    },
    methods: {
        goInfoPage (item) {
            if (parseInt(item.status) === 1) {
                this.$router.go('/info-home/goods-details?itemId=' + item.itemId)
            } else {
                this.$dispatch('toast','warn', '此积分商品已下架，无法再次查看详情！')
            }
        },
        getShopOrderInfo () {
            this.$dispatch('loading-start')
            API.getShopOrderInfo(this.orderId, (res) => {
                console.log(res)
                if (res.success) {
                    this.order = res.data
                    this.orderState = this.order.status === 1 ? 'wait-go' : (this.order.status === 2 ? 'going' : (this.order.status === 3 ? 'success' : 'fail'))
                    this.$dispatch('loading-end')
                }
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.scroll {
  overflow-x: hidden;
  overflow-y: scroll;
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
}
.order-info {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    .head-line {
        width: 100%;
        height: 90px;
        background: linear-gradient(#f8665b, #c9343a);
        padding: 20px 0;
        box-sizing: border-box;
        .biao {
            width: 25%;
            margin: 0px auto;
            overflow: hidden;
            img {
                width: 20px;
                margin-top: 14px;
                float: left;
            }
            span {
                color: #fff;
                font-size: 16px;
                line-height: 50px;
                float: left;
                margin-left: 5px;
            }
        }
    }
    .body-line {
        width: 100%;
        .fail-words {
            text-align: center;
            margin: 10px 12px;
            background-color: #fff;
            border-radius: 4px;
            font-size: 14px;
            color: #f8665b;
            line-height: 15px;
            padding: 10px 0;
        }
        .add-msg {
            width: 100%;
            padding: 15px;
            border-bottom: 1px solid #d8d8d8;
            background: #fff;
            box-sizing: border-box;
            p {
                margin: 0;
            }
            .pei {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .name {
                font-size: 14px;
                margin-bottom: 10px;
                color: #666666;
            }
            .address {
                font-size: 14px;
                color: #666666;
            }
        }
        .goods-msg {
            margin-top: 10px;
            margin-bottom: 10px;
            .msg {
                width: 100%;
                height: 103px;
                background: #fff;
                border-bottom: 1px solid #eee;
                .main-line {
                    height: 103px;
                    padding: 15px 10px 0 15px;
                    box-sizing: border-box;
                    img {
                        width: 70px;
                        height: 70px;
                        float: left;
                    }
                    .right-msg {
                        float: left;
                        width: 210px;
                        margin-left: 10px;
                        position: relative;
                        p {
                            margin: 0;
                            font-size: 12px;
                            text-align: left;
                            line-height: 17px;
                            color: #000;
                        }
                        .tit {
                            width: 100%;
                            height: 18px;
                            line-height: 18px;
                            display: block;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            margin: 0;
                            font-size: 14px;
                            font-weight: 400;
                            color: #000;
                            margin-bottom: 30px;
                        }
                        .num {
                            color: #747474;
                        }
                        .order-num {
                            color: #747474;
                        }
                        .money {
                            position: absolute;
                            right: 0px;
                            bottom: 1px;
                            color: #666666;
                            font-size: 12px;
                            text-align: center;
                            .integral {
                                width: 17px;
                                height: auto;
                                margin: 0 auto 5px;
                                img {
                                    width: 100%;
                                    height: auto;
                                }
                            }
                            span {
                                color: #f8665b;
                                font-size: 14px;
                            }
                        }
                    }
                }
                .foot-line {
                    width: 100%;
                    height: 29px;
                    line-height: 29px;
                    p {
                        width: 80%;
                        float: left;
                        color: #000;
                        font-size: 14px;
                        margin: 0;
                        text-align: left;
                        padding-left: 10px;
                        span {
                            color: #ffbe5c;
                            padding: 0 5px;
                        }
                    }
                    i {
                        float: right;
                        margin-right: 10px;
                        width: 20px;
                        height: 20px;
                        display: block;
                        background: #f7f7f7;
                        color: #c8c8c8;
                        border-radius: 100%;
                        line-height: 20px;
                        text-align: center;
                        margin-top: 5px;
                    }
                    .shou {
                        color: #ffbe5c;
                    }
                }
            }
        }
    }
    .tip {
        text-align: center;
        font-size: 12px;
        color: #bbbbbb;
        margin-top: 10px;
        span {
            a {
                color: red;
                text-decoration: none;
            }
        }
    }
    .success-words {
        padding: 10px 10px;
        margin-top: 10px;
        background-color: #fff;
        line-height: 20px;
        .title {
            font-size: 14px;
            font-weight: 600;
        }
        .time {
            font-size: 12px;
            color: #666;
        }
    }
}
</style>
