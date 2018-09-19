<template>
    <div class="shopping-cart">
      <div class="page scroll">
        <div class="switch">
            已加入的积分商品
        </div>
        <div class="shopping-cart-body">
            <div class="body-li" v-for="item in list" @click="choose(item, $index)">
                <div class="zero-column column">
                    <div class="circular" v-show="item.state !== '已下架'">
                        <i class="iconfont icon-yuandian" v-show="item.isChoose && item.state !== '已下架'"></i>
                    </div>
                </div>
                <div class="first-column column" @click="goInfoPage(item)">
                    <img :src="item.imgSrc" :class="item.state === '已下架'?'img-gray':''">
                </div>
                <div class="second-column column">
                    <div class="name">
                        {{item.name}}
                    </div>
                    <div class="num">
                        数量:<span>{{item.surplus}}</span>份
                    </div>
                    <!-- <div class="time">
                        {{item.time}}
                    </div>
                    <div class="dingdan">
                        订单号:<span>{{item.orderNumber}}</span>
                    </div> -->
                    <div class="icon-pic">
                        <img src="../../../static/images/integral.png" :class="item.state === '已下架'?'img-gray':''">
                    </div>
                    <div class="shuzi" :class="item.state === '已下架'?'gray2':''">
                        {{item.price}}
                    </div>
                </div>
                <div class="three-column column">
                    <div class="sign" :class="item.state === '已下架'?'gray':''">
                        {{item.state}}
                    </div>
                    <div class="btn" v-show="item.state === '已下架'" @click="deleteGoods(item.itemId)">
                        删除
                    </div>
                    <!-- <div class="icon-pic">
                        <img src="../../../static/images/integral.png" :class="item.state === '已下架'?'img-gray':''">
                    </div>
                    <div class="shuzi" :class="item.state === '已下架'?'gray2':''">
                        {{item.price}}
                    </div> -->
                </div>
                <div style="clear:both;"></div>
            </div>
            <div style="clear:both;text-align: center;padding: 5px 0;font-size: 10px;color: #ccc;" v-show="list.length !== 0">数据已全部加载</div>
        </div>
        </div>
        <div class="shopping-cart-footer">
            <div class="all-choose" @click='chooseAll()'>
                <div class="circular">
                    <i class="iconfont icon-yuandian" v-show="isChooseAll"></i>
                </div>
                <div class="label">
                    全选
                </div>
            </div>
            <div class="suoming">
                <span>已选择</span><span class="shopping-num">{{shoppingNum}}</span><span>个商品</span>
            </div>
            <div class="delete-btn" :class="itemIds.length === 0? 'gray':''" @click="deleteChoose">
                删除
            </div>
            <div class="exchange-btn" :class="itemIds.length === 0? 'gray':''" @click="exchange">
                立即兑换
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../api'
export default {
    components: {
    },
    data () {
        return {
            integralNum: 0,
            itemIds: [],
            overdue: [],
            cartIds: [],
            list: [],
            chooseList: [],
            hasSet: false, // 是否设置了ischoose
            isChooseAll: false, // 是否全选
            shoppingNum: 0 // 已选择商品的数量
        }
    },
    events: {
      'reload-list': function () {
        this.integralNum = 0
        this.itemIds = []
        this.cartIds = []
        this.list = []
        this.chooseList = []
        this.hasSet = false
        this.isChooseAll = false
        this.shoppingNum = 0
        this.getShopCartList()
      },
      'delete-goods': function (sign) {
        if (sign === 'deleteGoods') {
            this.deleteShopCart(this.overdue)
        } else if (sign === 'deleteChoose') {
            this.deleteShopCart(this.itemIds)
        }
      }
    },
    created () {
        this.getShopCartList()
    },
    watch: {
        list: function (nval, oval) {
            if (this.hasSet) {
                var total = this.list.length
                var num1 = 0
                var num2 = 0
                var num3 = 0
                var shopItems = []
                var shopItems2 = []
                for (var i = 0; i < total; i++) {
                    if (this.list[i].state === '已下架') {
                        num1 += 1
                    } else if (this.list[i].isChoose) {
                        num2 += 1
                        num3 += this.list[i].price * this.list[i].surplus
                        // console.log(this.list[i].cartId, '99999999')
                        shopItems.push(this.list[i].cartId)
                        shopItems2.push(this.list[i].itemId)
                    }
                }
                this.integralNum = num3
                this.shoppingNum = num2
                this.cartIds = shopItems
                this.itemIds = shopItems2
                // console.log(this.itemIds, '000000000000')
                if (num2 + num1 === total && total !== 0) {
                    this.isChooseAll = true
                } else {
                    this.isChooseAll = false
                }
                // console.log(this.isChooseAll, '是否全选')
            }
        }
    },
    methods: {
        goInfoPage (item) {
            if (item.state === '未兑换') {
                this.$router.go('/info-home/goods-details?itemId=' + item.itemId)
            }
        },
        deleteGoods (overId) {
            this.overdue = []
            this.overdue.push(overId)
            this.$dispatch('confirmShow', '是否删除失效积分商品？', '', 'deleteGoods')
        },
        deleteChoose () {
            if (this.itemIds.length !== 0) {
                this.$dispatch('confirmShow', '是否删除已选中的积分商品？', '', 'deleteChoose')
            } else {
                this.$dispatch('toast', 'warn', '你还未选择任何积分商品')
            }
        },
        getShopCartList () {
            this.$dispatch('loading-start')
            var me = this
            api.getShopCartList(function (res) {
                console.log(res, '购物车列表')
                if (res.success) {
                    me.list = res.data.map(function (item) {
                        return {
                            cartId: item._id,
                            itemId: item.itemId,
                            imgSrc: item.item.mainImg1 || '',
                            name: item.item.title,
                            surplus: item.num,
                            // time: '2017-02-18 12:25:26',
                            // orderNumber: 'xxxxxxxxxxxxxxx',
                            state: parseInt(item.item.status) === 1 ? '未兑换' : '已下架',
                            price: (item.item && item.item.specs && item.item.specs[0]) ? item.item.specs[0].price : '不明',
                            isChoose: false
                        }
                    })
                    me.hasSet = true
                    me.isChooseAll = false
                    me.$dispatch('loading-end')
                } else {
                  me.integralNum = 0
                  me.itemIds = []
                  me.cartIds = []
                  me.list = []
                  me.chooseList = []
                  me.hasSet = false
                  me.isChooseAll = false
                  me.shoppingNum = 0
                  me.$dispatch('loading-end')
                }
            })
        },
        choose: function (item, index) {
            if (item.state === '未兑换') {
                if (item.isChoose) {
                    item.isChoose = false
                } else {
                    item.isChoose = true
                }
                this.list.$set(index, item)
            }
        },
        chooseAll: function () {
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].isChoose = true
                this.list.$set(i, this.list[i])
            }
            this.isChooseAll = true
        },
        // 删除购物车
        deleteShopCart (arr) {
            if (arr.length !== 0) {
                console.log(arr, '77777777')
                api.deleteShopCart(arr, (res) => {
                    console.log(res, '删除结果')
                    if (res.success) {
                        this.getShopCartList()
                    } else {
                        this.$dispatch('toast','warn', '删除失败')
                    }
                })
            } else {
                this.$dispatch('toast', 'warn', '你还未选择任何积分商品')
            }
        },
        // 立即兑换
        exchange () {
            if (this.cartIds.length !== 0) {
                // console.log(this.cartIds, '111111')
                this.$dispatch('check-address', this.cartIds, this.shoppingNum, this.integralNum)
            } else {
                this.$dispatch('toast', 'warn', '你还未选择任何积分商品')
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.page {
  width: 100%;
  height: 100%;
}
.scroll {
  overflow-x: hidden;
  overflow-y: scroll;
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
}
.shopping-cart {
  width: 100%;
  height: 100%;
    background-color: #f6f6f6;
    padding-bottom: 54px;
    .switch {
        width: 100%;
        background-color: #fff;
        font-size: 14px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #515151;
    }
    .shopping-cart-body {
        // border-top: 1px solid #f1ecec;
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        .body-li {
            box-sizing: border-box;
            margin: 12px 0 0;
            padding:12px 0 12px 6px;
            width: 100%;
            height: 97px;
            color: #000;
            background-color: #fff;
            position: relative;
            .zero-column {
                width: 16px;
                margin-right: 8px;
                height: 100%;
                .circular {
                    // margin: 0px 0 0;
                    display: block;
                    float: left;
                    width: 16px;
                    height: 16px;
                    border-radius: 10px;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    // left: 0;
                    // right: 0;
                    margin: auto;
                    border: 1px solid #ccc;
                    text-align: center;
                    line-height: 14px;
                    color: #f8665b;
                    i {
                        // margin: 0 0 0 0.5px;
                        font-size: 12px;
position: absolute;
margin: auto;
left: 0;
right: 0;
bottom: 0;
top: 0;
                        // font-size: 12px;
                    }
                }
            }
            .first-column {
                float: left;
                width: 68px;
                margin-right: 12px;
                img {
                    width: 68px;
                    height: 68px;
                }
            }
            .second-column {
                width: 45%;
                float: left;
                text-align: left;
                font-size: 12px;
                color: #666;
                line-height: 24px; //原：18
                .name {
                    width: 100%;
                    display:block;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    font-size: 14px;
                    text-align: left;
                    color: #000;
                }
                .icon-pic {
                    float:left;
                    width: 12px;
                    // height: 18px;
                    // background-color: #e8eae9;
                    margin:0 auto 5px;
                    img {
                        width: 100%;
                        height: auto;
                    }
                }
                .shuzi {
                    float:left;
                    font-size: 14px; // 原：12
                    color: #f8665b;
                    text-align: center;
                    // font-weight: bold;

                }
            }
            .three-column {
                float: right;
                .sign {
                    width:57px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    background-color: #f8665b;
                    color: #fff;
                    font-size: 12px;
                    border-radius: 8px 0 0 8px;
                }
                .btn {
                    width: 40px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    background-color: #f8665b;
                    // background-color: #d2d2d2;
                    border-radius: 2px;
                    color: #fff;
                    margin:12px auto;
                    font-size: 12px;
                }
                // .icon-pic {
                //     width: 18px;
                //     height: 18px;
                //     // background-color: #e8eae9;
                //     margin:18px auto 5px;
                //     img {
                //         width: 100%;
                //         height: auto;
                //     }
                // }
                // .shuzi {
                //     font-size: 12px;
                //     color: #f8665b;
                //     // font-weight: bold;
                //
                // }
            }
        }

    }
    .shopping-cart-footer {
        height: 42px;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px -1px 10px #ddd;
        position: absolute;
        box-sizing: border-box;
        bottom: 0;
        padding-left: 18px;
        line-height: 42px;
        font-size: 14px;
        .all-choose {
            .circular {
                // margin: 0px 0 0;
                display: block;
                float: left;
                width: 16px;
                height: 16px;
                border-radius: 10px;
                position: absolute;
                top: 0;
                bottom: 0;
                // left: 0;
                // right: 0;
                margin: auto;
                border: 1px solid #ccc;
                text-align: center;
                line-height: 14px;
                color: #f8665b;
                i {
                    // margin: 0 0 0 0.5px;
                    // font-size: 12px;
                    font-size: 12px;
                    position: absolute;
                    margin: auto;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    top: 0;
                }
            }
            .label {
                float: left;
                margin: 0px 12px 0 20px;
                font-size: 14px;
            }
        }
        .suoming {
            .shopping-num {
                color: #f8665b;
            }
        }
        .delete-btn {
            width: 60px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background-color: #f8665b;
            border-radius: 2px;
            color: #fff;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 82px;
            margin:auto;
        }
        .exchange-btn {
            width: 60px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background-color: #f8665b;
            border-radius: 2px;
            color: #fff;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 12px;
            margin:auto;
        }
    }
    .column {
        float: left;
        text-align: center;
        height: 100%;
        overflow: hidden;
    }
    .gray {
        background-color: #d2d2d2!important;
    }
    .gray2 {
        color: #d2d2d2!important;
    }
    .img-gray {
        -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
        filter: grayscale(100%);
    }
}
</style>
