import Vue from 'vue'
import App from './App'
import OStoneHome from './components/OStoneHome'
import LoginHome from './components/LoginHome'
import ReOrderHome from './components/ReOrderHome'
import ActivityHome from './components/ActivityHome'
import NewsHome from './components/NewsHome'
import NetWorthHome from './components/NetWorthHome'
import HistoryHome from './components/HistoryHome'
import InvestHome from './components/InvestHome'
import InvestMsgHome from './components/InvestMsgHome'
import TradeHome from './components/TradeHome'
import ThisTradeHome from './components/ThisTradeHome'
import AccSafeHome from './components/AccSafeHome'
import InvestTestHome from './components/InvestTestHome'
import MsgInfoHome from './components/MsgInfoHome'
import MyAddressHome from './components/MyAddressHome'
// page
import ProductPage from './components/page/ProductPage'
import ActivityPage from './components/page/ActivityPage'
import MarketPage from './components/page/MarketPage'
import LoginPage from './components/page/LoginPage'
import RegisterPage from './components/page/RegisterPage'
import PasswordPage from './components/page/PasswordPage'
import ChangePswPage from './components/page/ChangePswPage'
import ChangeAddressPage from './components/page/ChangeAddressPage'
import ChangeContactPage from './components/page/ChangeContactPage'
import ChangeEmailPage from './components/page/ChangeEmailPage'
import ChangePaperPage from './components/page/ChangePaperPage'
import ChangePhonePage from './components/page/ChangePhonePage'
import CerifiedPage from './components/page/CerifiedPage'
import MainPage from './components/page/MainPage'
import TradeMsgPage from './components/page/TradeMsgPage'
import FenHong from './components/page/Fenhong'
import FenHongInfo from './components/page/FenhongInfo'
import TradeSearchPage from './components/page/TradeSearchPage'
import BeginTestPage from './components/page/BeginTestPage'
import TestPage from './components/page/TestPage0'
import TestResultPage from './components/page/TestResultPage'
import MsgPage from './components/page/MsgPage'
import IntegralMall from './components/page/IntegralMall'
import GoodsDetails from './components/page/GoodsDetails'
import ShoppingCart from './components/page/ShoppingCart'
import HasExchanged from './components/page/HasExchanged'
import OrderInfo from './components/page/OrderInfo'
// import InvestPage from './components/page/InvestPage'

// components
  // products
import Products from './components/online/Products'
import Chart from './components/online/Chart'

import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import VueResource from 'vue-resource'
import VStorage from './VStorage'
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueValidator)
Vue.use(VStorage, {
  storageKeyPrefix: 'ostone-mobile-'
})
Vue.filter('shop-status', function (value) {
    switch (value) {
        case 1:
            return '待发货'
        case 2:
            return '已发货'
        case 3:
            return '已完成'
        case 4:
            return '未收货'
    }
})
Vue.filter('format', function (value) {
  var today = new Date(value)
  var year = today.getFullYear()
  var month = ('0' + (today.getMonth() + 1)).slice(-2)
  var day = ('0' + today.getDate()).slice(-2)
  var hour = today.getHours()
  var minute = today.getMinutes()
  var second = today.getSeconds()
  return year + '-'+ month + '-' + day + ' ' + hour + ':' + minute + ':' + second
})
Vue.filter('filterMoney', function (value) {
  if (value.ywlx === '客户认购' || value.ywlx === '客户申购' || value.ywlx === '申购追加' || value.ywlx === '认购追加') {
    return value.sqje + '（万元）'
  } else if (value.ywlx === '客户赎回' || value.ywlx === '交易兑付' || value.ywlx === '强行赎回') {
    return value.sqfe + '（份）'
  }
})
const router = new VueRouter()
Vue.validator('phone', function (val) {
  return /^1(3|4|5|7|8)\d{9}$/.test(val)
})
Vue.validator('password', function (val) {
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(val)
})
Vue.validator('emile', function (val) {
  return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(val)
})
router.map({
  '/login-home': {
    component: LoginHome,
    subRoutes: {
      '/login-page': {
        component: LoginPage
      },
      '/register-page': {
        component: RegisterPage
      },
      '/password-page': {
        component: PasswordPage
      },
      '/changepsw-page': {
        component: ChangePswPage
      },
      '/changeaddress-page': {
        component: ChangeAddressPage
      },
      '/changecontact-page': {
        component: ChangeContactPage
      },
      '/changeemail-page': {
        component: ChangeEmailPage
      },
      '/changepaper-page': {
        component: ChangePaperPage
      },
      '/changephone-page': {
        component: ChangePhonePage
      },
      '/cerified-page': {
        component: CerifiedPage
      }
    }
  },
  '/reorder-home': {
    component: ReOrderHome
  },
  '/trade-home': {
    component: TradeHome,
    subRoutes: {
      '/trademsg-page': {
        component: TradeMsgPage
      },
      '/tradesearch-page': {
        component: TradeSearchPage
      },
      '/fenhong-page': {
        component: FenHong
      },
      '/fenhong-info': {
        component: FenHongInfo
      }
    }
  },
  '/thistrade-home': {
    component: ThisTradeHome
  },
  '/activity-home/:activityID': {
    component: ActivityHome
  },
  '/news-home/:activityID': {
    component: NewsHome
  },
  '/networth-home': {
    component: NetWorthHome
  },
  '/history-home': {
    component: HistoryHome
  },
  '/investmsg-home': {
    component: InvestMsgHome
  },
  '/msginfo-home': {
    component: MsgInfoHome
  },
  '/invest-home': {
    component: InvestHome
  },
  '/accsafe-home': {
    component: AccSafeHome
  },
  '/myaddress-home': {
    component: MyAddressHome
  },
  '/ostone-home': {
    component: OStoneHome,
    subRoutes: {
      '/product-page': {
        component: ProductPage
      },
      '/activity-page': {
        component: ActivityPage
      },
      '/market-page': {
        component: MarketPage
      },
      '/main-page': {
        component: MainPage
      },
      '/msg-page': {
        component: MsgPage
      }
    }
  },
  '/investtest-home': {
    component: InvestTestHome,
    subRoutes: {
      '/begintest-page': {
        component: BeginTestPage
      },
      'test-page': {
        component: TestPage
      },
      'testresult-page': {
        component: TestResultPage
      }
    }
  },
  '/products': {
    component: Products
  },
  '/chart': {
    component: Chart
  },
  // 积分商城
  '/integral-mall': {
    component: IntegralMall
  },
  // 积分商品详情页
  '/info-home/goods-details': {
    component: GoodsDetails
  },
  // 购物车
  '/info-home/shopping-cart': {
    component: ShoppingCart
  },
  // 已兑换
  '/info-home/has-exchanged': {
    component: HasExchanged
  },
  // 兑换详情
  '/info-home/order-info': {
    component: OrderInfo
  }
})
router.redirect({
  '/': '/ostone-home/product-page',
  '/ostone-home': '/ostone-home/product-page',
  '/login-home': '/login-home/login-page',
  '/trade-home': '/trade-home/tradesearch-page',
  '/investtest-home': '/investtest-home/begintest-page'
})
router.start(App, '#app')
// var user = window.
