<template>
    <div class="goods-details">
    <div class="goods-child">
        <div class="body-li">
            <div class="body-li-top">
                <swiper :list="list" auto loop :interval="15000" style="width:100%;" :aspect-ratio="160/320" :show-desc-mask="false"></swiper>
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
            </div>
        </div>
        <div class="details-div" v-html="item.content"></div>
    </div>
    <div class="footer">
        <div class="reduce-num-btn btn" @click="addOrReduce('reduce')">
            <i class="iconfont icon-jian"></i>
        </div>
        <div class="num">
            {{goodsNum}}
        </div>
        <div class="add-num-btn btn" @click="addOrReduce('add')">
            <i class="iconfont icon-jia"></i>
        </div>
        <div class="exchange-now active"@click="exchange">
            立即兑换
        </div>
        <div class="add-shopping-cart unactive" @click="addShopCart">
            加入购物车
        </div>
    </div>
</div>
</template>

<script>
import Swiper from 'vux/src/components/swiper'
import api from '../../api'
export default {
    components: {
        Swiper
    },
    data () {
        return {
            itemId: '',
            item: {
              specs: [
                {
                  stock: 0
                }
              ]
            },
            goodsNum: 1,
            list: [],
            dianShow: false
        }
    },
    created () {
        this.itemId = this.$route.query.itemId
        this.getShopItemInfo()
    },
    methods: {
        getShopItemInfo () {
            this.$dispatch('loading-start')
            api.getShopItemInfo(this.itemId, (res) => {
                if (res.success) {
                  console.log('积分商品详情', res)
                    this.item = res.data
                    this.list = res.data.imgs.map((item) => (
                        {
                            img: item
                        }
                    ))
                    console.log(this.list)
                    if (this.list.length === 1) {
                        this.dianShow = false
                    } else {
                        this.dianShow = true
                    }
                    // window.alert(this.list.length)
                    // console.log(this.list, this.item, '详情页轮播')
                    this.$dispatch('loading-end')
                }
            })
        },
        addOrReduce (str) {
            if (str === 'add' && this.goodsNum < this.item.specs[0].stock) {
                this.goodsNum ++
            } else if (str === 'reduce' && this.goodsNum > 0) {
                this.goodsNum --
            }
        },
        addShopCart () {
          var me = this
            if (this.goodsNum) {
                api.addShopCart(this.itemId, this.goodsNum, (res) => {
                    if (res.success) {
                        this.$dispatch('toast', 'success', '积分商品已添加成功')
                    }
                })
            } else {
                this.$dispatch('toast', 'warn', '商品数量不能为零')
            }
        },
        // 立即兑换
        exchange () {
            console.log(this.goodsNum)
            if (this.goodsNum !== 0) {
                this.$dispatch('check-address', this.itemId, this.goodsNum, this.goodsNum * this.item.specs[0].price)
            } else {
                this.$dispatch('toast', 'warn', '商品数量不能为零')
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.goods-details {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #f6f6f6;
    color: #000;
    padding: 0 0 50px 0;
    .body-li {
        background-color: #fff;
        width: 100%;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        color: #000;
        padding-bottom: 4px;
        .body-li-top {
            margin: 0 auto 6px;
            width: 100%;
            img {
                width: 100%;
                height: auto;
            }
        }
        .body-li-bottom {
            box-sizing: border-box;
            width: 100%;
            padding: 0 8px;
            text-align: center;
            font-size: 14px;
            .left {
                width: 90%;
                float: left;
                text-align: left;
                line-height: 25px;
                .name {
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
                width: 10%;
                float: right;
                text-align: center;
                line-height: 30px;
                padding-top: 2px;
                .name {
                    width: 19px;
                    height: 19px;
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
    .details-div {
        width: 296px;
        overflow: hidden;
        margin: 12px auto;
        table {
            max-width: 100%!important;
        }
    }

}
.unactive {
    border: 1px solid #f8665b;
    background-color: #fff1e9;
    color: #f8665b;
}
.active {
    background-color: #f8665b;
    color: #fff;
}
.footer {
    width: 100%;
    height: 39px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    box-sizing: border-box;
    padding: 6px 12px 0;
    .btn {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        // line-height: 20px;
        // text-align: center;
        color: #fff;
        float: left;
        position: relative;
        margin-top: 4px;
        i {
            width: 20px;
            height: 20px;
            font-size: 14px;
            text-align: center;
            position: absolute;
            display: inline-block;
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
        }
    }
    .reduce-num-btn {
        background-color: #e1e1e1;
        font-size: 30px;
    }
    .add-num-btn {
        background-color: #f8665b;
        font-size: 24px;
    }
    .num {
        width: 30px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        display: inline-block;
        float: left;
        margin: 4px 2px 0;
        font-size: 18px;
        // background-color: #ccc;
    }
    .add-shopping-cart {
        display: inline-block;
        width: 100px;
        height: 26px;
        box-sizing: border-box;
        line-height: 26px;
        text-align: center;
        border-radius: 2px;
        float: right;
    }
    .exchange-now {
        display: inline-block;
        width: 100px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        border-radius: 2px;
        float: right;
        margin-left: 8px;
    }
}
</style>
<style media="screen">
    .goods-details .vux-slider > .vux-indicator > a > .vux-icon-dot {
        background-color: #928e88!important;
    }
    .goods-details .vux-slider > .vux-indicator > a > .vux-icon-dot.active {
        background-color: #f8665b!important;
    }
    .goods-details .details-div img{
        max-width: 100%;
    }
    .goods-details .vux-swiper {
      height: 320px!important;
    }
    .goods-details .vux-swiper-desc {
        display: none;
    }
    .details-div table {
        max-width: 100%!important;
        width: 100% !important;
        border: 1px solid #ccc;
    }
    .details-div table td, .details-div table th {
        padding: 3px;
    }
</style>
