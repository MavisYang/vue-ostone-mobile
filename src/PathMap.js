var PathMap = [
  { route: '/login-home', weight: -100, title: '登录' },
  { route: '/login-home/login-page', weight: -6, title: '登录' },
  { route: '/login-home/register-page', weight: -5, title: '注册' },
  { route: '/login-home/password-page', weight: -4, title: '重置登录密码' },
  { route: '/login-home/changepsw-page', weight: 110, title: '' },
  { route: '/login-home/changeaddress-page', weight: 111, title: '' },
  { route: '/login-home/changecontact-page', weight: 112, title: '' },
  { route: '/login-home/changeemail-page', weight: 113, title: '' },
  { route: '/login-home/changepaper-page', weight: 114, title: '' },
  { route: '/login-home/changephone-page', weight: 115, title: '' },
  { route: '/login-home/cerified-page', weight: 116, title: '' },
  { route: '/ostone-home', weight: 0, title: '在线产品' },
  { route: '/ostone-home/product-page', weight: 1, title: '在线产品' },
  { route: '/reorder-home', weight: 20, title: '' },
  { route: '/ostone-home/activity-page', weight: 2, title: '活动中心' },
  { route: '/activity-home', weight: 50, title: '活动中心' },
  { route: '/news-home', weight: 51, title: '活动中心' },
  { route: '/ostone-home/market-page', weight: 3, title: '产品净值' },
  { route: '/networth-home', weight: 60, title: '' },
  { route: '/history-home', weight: 61, title: '历史净值' },
  { route: '/ostone-home/msg-page', weight: 4, title: '信息披露' },
  { route: '/msginfo-home', weight: 65, title: '' },
  { route: '/ostone-home/main-page', weight: 5, title: '我的' },
  { route: '/invest-home', weight: 70, title: '我的投资' },
  { route: '/investmsg-home', weight: 71, title: '' },
  { route: '/trade-home', weight: 72, title: '交易明细' },
  { route: '/trade-home/tradesearch-page', weight: 73, title: '交易明细' },
  { route: '/trade-home/trademsg-page', weight: 74, title: '交易明细' },
  { route: '/thistrade-home', weight: 75, title: '' },
  { route: '/trade-home/fenhong-page', weight: 100, title: '分红明细' },
  { route: '/trade-home/fenhong-info', weight: 101, title: '分红明细' },
  { route: '/accsafe-home', weight: 76, title: '账户安全' },
  { route: '/investtest-home', weight: 77, title: '风险测试' },
  { route: '/investtest-home/begintest-page', weight: 78, title: '风险测试' },
  { route: '/investtest-home/test-page', weight: 79, title: '风险测试' },
  { route: '/investtest-home/testresult-page', weight: 80, title: '' },
  { route: '/myaddress-home', weight: 90, title: '收货地址' },
  { route: '/chart', weight: 1000, title: '' },
  { route: '/integral-mall', weight: 6, title: '积分商城'},
  { route: '/info-home/shopping-cart', weight: 7, title: '积分购物车'},
  { route: '/info-home/goods-details', weight: 7, title: '商品详情'},
  { route: '/info-home/has-exchanged', weight: 7, title: '已兑换'},
  { route: '/info-home/order-info', weight: 8, title: '订单详情'}
]

export default {
  search: function (path) {
    var why = path.indexOf('?')
    if (why > 0) {
      path = path.substring(0, why)
    }
    var find
    PathMap.forEach(function (_path) {
      if (path === _path.route) {
        find = _path
      }
    })
    if (find) {
      return find
    } else {
      PathMap.forEach(function (_path) {
        if (path.indexOf(_path.route) !== -1) {
          find = _path
        }
      })
      return find
    }
  }
}
