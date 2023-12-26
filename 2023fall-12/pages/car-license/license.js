let interval = null
Page({
  data: {
    license_img: '',
    licenseArray: []
  },

  goback: function() { 
    wx.navigateTo({
      url: '../index/index',
    })
  },

  getImage: function(base64Url) {
    base64Url = base64Url.slice(2)
    base64Url = base64Url.slice(0, -1)
    let base64ImgUrl = "data:image/jpeg;base64," + base64Url
    return base64ImgUrl
  },

  showLicense: function() {
    const that = this
    return function(){
    const app = getApp()
    let img = that.getImage(app.globalData.license_img)
    that.setData({
      license_img: img,
      licenseArray: app.globalData.licenseArray
    })   
    }
  },

  onLoad(options) {
    let that = this
    interval = setInterval(that.showLicense(), 2000)
  },

  onUnload() {
    clearInterval(interval)
    interval = null
  }
})