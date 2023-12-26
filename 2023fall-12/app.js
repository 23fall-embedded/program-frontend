// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  onShow() {
    var that = this
    setInterval(function () {
      wx.request({
        url: 'http://124.70.165.173:8080/getData',
        method: 'GET',
        header: {
          'content-type': 'application/json' 
        },
        success: function (res) {
          that.globalData.license_img = res.data.img[0]
          that.globalData.licenseArray = res.data.licenses
          that.globalData.licenseCnt = res.data.licenses.length
        }
      })
    }, 1000)
    
  },
  globalData: {
    userInfo: null,
    licensesArray: [],
    license_img: '',
    licenseCnt: 0
  }
})
