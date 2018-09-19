import Vue from 'vue'
var root = '/'
// var root = 'http://192.168.0.112:4001/'
var cdn = 'http://static.leanote.top/app/ostone-mobile/static/js/'
cdn = 'http://wx.static.cosamc.com/static/js/'
var mock = false
window.Vue = Vue
var opt = {
    credentials: true,
    before: function () {
      // window.alert(3)
    }
}
var api = {
  load: function (loadUrl, callback) {
    var loadScript = document.createElement('script')
    loadScript.setAttribute('type', 'text/javascript')
    loadScript.setAttribute('src', cdn + loadUrl)
    document.getElementsByTagName('head')[0].appendChild(loadScript)
    // 判断服务器
    if (navigator.userAgent.indexOf('IE') >= 0) {
      // IE下的事件
      loadScript.onreadystatechange = function () {
        if (loadScript && (loadScript.readyState === 'loaded' || loadScript.readyState === 'complete')) {
          // 表示加载成功
          loadScript.onreadystatechange = null
          callback(loadUrl) // 执行回调
        }
      }
    } else {
      loadScript.onload = function () {
        loadScript.onload = null
        callback(loadUrl)
      }
    }
  },
  require: function (dependencies, callback) {
    var me = this
    var libs = dependencies.join('|') + '|'
    var counter = function (dependency) {
      // console.log(dependency)
      libs = libs.replace(dependency + '|', '').trim()
      if (libs === '') {
        callback()
      }
    }
    dependencies.forEach(function (dependency) {
      me.load(dependency, counter)
    })
  },
  reZoom: function () {
    var curWidth = document.getElementsByTagName('body')[0].clientWidth
    this.zoom = curWidth / 320
    document.getElementById('mobile').style.zoom = this.zoom
    console.log('rezoom ok')
  },
  errorCallback: function () {},
  get: function (key) {
    return Vue.$sessionStorage[key]
  },
  set: function (key, val) {
    Vue.$sessionStorage.$set(key, val)
  },
  _get: function (url, options, successCallback) {
    if (mock) {
      url += '.json'
    }

    // console.log(url, options)
    if (typeof options === 'function') {
      successCallback = options
      Vue.http.get(root + url, opt).then(function (response) {
        var json = response.json()
        successCallback(json)
      }, this.errorCallback)
    } else {
      // console.log(root + url)
      options.credentials = true
      Vue.http.get(root + url, options).then(function (response) {
        var json = response.json()
        window.debugger
        successCallback(json)
      }, this.errorCallback)
    }
  },
  _post: function (url, options, successCallback) {
    // this._(url, options.params, successCallback)
    if (mock) {
      url += '.json'
    }
    if (typeof options === 'function') {
      Vue.http.post(root + url, {}, opt).then(function (response) {
        var json = response.json()
        successCallback(json)
      }, this.errorCallback)
    } else {
      Vue.http.post(root + url, options, opt).then(function (response) {
        var json = response.json()
        successCallback(json)
      }, this.errorCallback)
    }
  },
  // 通用接口工具
  call: function (params, cb) {
    this._post('call', params, cb)
  },
  // 发送验证码   userMobile, isRegister, isVolice
  sendToken: function (params, cb) {
    this._post('sendToken', params, cb)
  },
  // 验证码验证
  validToken: function (params, cb) {
    this._post('validToken', params, cb)
  },
  // 信息验证是否已存在
  checkIsExist: function (params, cb) {
    this._post('checkIsExist', params, cb)
  },
  // 注册
  register: function (params, cb) {
    this._post('register', params, cb)
  },
  // 验证四要素
  verify4Element: function (params, cb) {
    this._post('verify4Element', params, cb)
  },
  // 登录
  login: function (userMobile, password, userType, cb) {
    this._post('login', {
      userMobile: userMobile,
      password: password,
      userType: userType
    }, cb)
  },
  // 注销
  logOut: function (cb) {
    this._post('logOut', cb)
  },
  // 重置密码前的身份验证
  // verifyUser: function (cb) {
  //   this._post('verifyUser', {
  //     userID: userID,
  //     userName: userName
  //   }, cb)
  // },
  // 重置密码
  resetPassword: function (userMobile, token, password, cb) {
    this._post('resetPassword', {
      userMobile: userMobile,
      token: token,
      password: password
    }, cb)
  },
  // 获取产品列表
  getOnlineProductInfo: function (pageIndex, pageSize, cb) {
    this._get('getOnlineProductInfo', {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    }, cb)
  },
  // 条件查询产品列表
  selectProduct: function (investStart, dateScope, riskLevel, profitType, pageIndex, pageSize, cb) {
    this._get('selectProduct', {
      params: {
        investStart: investStart,
        dateScope: dateScope,
        riskLevel: riskLevel,
        profitType: profitType,
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    }, cb)
  },
  // 产品预订接口
  orderProduct: function (cpid, orderPrice, orderCount, orderTotal, orderDate, cb) {
    this._post('orderProduct', {
      cpid: cpid,
      orderPrice: orderPrice,
      orderCount: orderCount,
      orderTotal: orderTotal,
      orderDate: orderDate
    }, cb)
  },
  // 获取市场净值列表
  getProductProfitList: function (cb) {
    this._get('getProductProfitList', cb)
  },
  // 获取产品净值明细
  getProductProfitDetail: function (cpid, cb) {
    this._get('getProductProfitDetail', {
      params: {
        cpid: cpid
      }
    }, cb)
  },
  // 获取我的账户信息
  getMyAccountInfo: function (cb) {
    this._get('getMyAccountInfo', cb)
  },
  // 修改密码
  updatePassword: function (oldPassword, newPassword, cb) {
    this._post('updatePassword', {
      oldPassword: oldPassword,
      newPassword: newPassword
    }, cb)
  },
  // 修改账户信息
  updateAccountInfo: function (item, updateValue, cb) {
    this._post('updateAccountInfo', {
      item: item,
      updateValue: updateValue
    }, cb)
  },
  // 修改风险等级
  updateRankResult: function (rankGrade, rankResult, cb) {
    this._post('updateRankResult', {
      rankGrade: rankGrade,
      rankResult: rankResult
    }, cb)
  },
  // 获取我的投资
  getMyInvestInfo: function (type, pageIndex, cb) {
    this._get('getMyInvestInfo', {
      params: {
        type: type,
        pageIndex: pageIndex || 1,
        pageSize: 6
      }
    }, cb)
  },
  // 改绑微信号
  changeOpenID: function (cb) {
    this._post('changeOpenID', {}, cb)
  },
  // 交易明细查询
  getTradeList: function (startDate, endDate, pageIndex, cb) {
    this._get('getTradeList', {
      params: {
        startDate: startDate,
        endDate: endDate,
        pageIndex: pageIndex || 1,
        pageSize: 6
      }
    }, cb)
  },
  // 分红明细查询
  getShareList: function (pageIndex, cb) {
    this._get('getShareList', {
      params: {
        pageIndex: pageIndex || 1,
        pageSize: 6
      }
    }, cb)
  },
  // 获取所有活动数据
  getActivityInfor: function (section, cb) {
    this._get('activity/list', {params: {section: section}}, cb)
  },
  // 获取某一活动数据
  getOneActivityInfor: function (id, cb) {
    // console.log(id)
    this._get('activity/list', {params: {activityId: id}}, cb)
    // console.log(id)
  },
  getRoot: function () {
    return root
  },
  // 活动报名
  signUp: function (activityId, userId, cb) {
    this._post('activity/updateuser', {
      activityId: activityId,
      userId: userId
    }, cb)
  },
  // 信息披露列表
  getInfoList: function (classID, cb) {
    this._get('getInfoList', {
      params: {
        classID, classID
      }
    }, cb)
  },
  // 信息披露详情
  getInfoDetail: function (infoID, userID, cb) {
    this._get('getInfoDetail', {
      params: {
        userID: userID,
        infoID: infoID
      }
    }, cb)
  },
  //--------------积分商城---------------------------------
  // 获取积分值
  getPointInfo (cb) {
    this._post('user/pointInfo', {}, cb)
  },
  // 获取顶部轮播图
  getShopBannerList (cb) {
    this._post('shop/banner/list', {}, cb)
  },
  // 商品列表
  getShopItemList (pageNo, pageSize, cb) {
    this._post('shop/item/list', {
      pageNo: pageNo,
      pageSize: pageSize
    }, cb)
  },
  // 获取商品详细信息
  getShopItemInfo (itemId, cb) {
    this._post('shop/item/info', {itemId: itemId}, cb)
  },
  // 添加购物车
  addShopCart (itemId, num, cb) {
    this._post('shop/cart/add', {itemId: itemId, num: num}, cb)
  },
  // 已兑换列表
  getShopOrderList (status, pageNo, pageSize, cb) {
    this._post('shop/order/list', {
      status: status,
      pageNo: pageNo,
      pageSize: pageSize
    }, cb)
  },
  //  获取购物车列表
  getShopCartList (cb) {
    this._post('shop/cart/list', {}, cb)
  },
  // 立即兑换
  addShopOrder (itemId, num, cartIds, address, cb) {
      if (itemId) {
          this._post('shop/order/add', {itemId: itemId, num: num, address: address}, cb)
      } else {
          this._post('shop/order/add', {cartIds: cartIds, address: address}, cb)
      }
  },
  // 删除购物车
  deleteShopCart (itemIds, cb) {
      this._post('shop/cart/delete', {itemIds: itemIds}, cb)
  },
  // 获取订单详情
  getShopOrderInfo (orderId, cb) {
      this._post('shop/order/info', {orderId: orderId}, cb)
  },
  // ------------积分商城到此结束---------------------------
  // =================================================地址===========================================
  // 地址列表
  addressList: function (cb) {
    this._get('shop/address/list', {
      params: {}
    }, cb)
  },
  // 添加地址
  addressAdd: function (addressMsg, cb) {
    this._post('shop/address/add', {
      province: addressMsg.province,
      city: addressMsg.city,
      town: addressMsg.town,
      street: addressMsg.street,
      name: addressMsg.name,
      mobile: addressMsg.mobile,
      isDefault: addressMsg.isDefault
    }, cb)
  },
  // 修改地址
  addressUpdate: function (addressMsg, cb) {
    this._post('shop/address/update', {
      _id: addressMsg._id,
      province: addressMsg.province,
      city: addressMsg.city,
      town: addressMsg.town,
      street: addressMsg.street,
      name: addressMsg.name,
      mobile: addressMsg.mobile,
      isDefault: addressMsg.isDefault
    }, cb)
  },
  // 删除地址
  addressDelete: function (_id, cb) {
    this._post('shop/address/delete', {
      _id: _id
    }, cb)
  },
  syncAccount: function (cb, fail) {
    var account = this.get('account')
    account = true
    if (account) {
      cb(account)
    } else {
      var me = this
      this._get('pc/sync/expert', function (res) {
        if (res.success) {
          me.set('expert', res.Expert)
          cb(res.Expert)
        } else if (fail) {
          fail()
        }
      })
    }
  }
}
window.api = api
export default api
