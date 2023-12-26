let interval = null
// pages/license.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    license_img: '',
    licenseArray: []
  },

  goback: function() {
    // wx.switchTab({
    //   url: '../index/index',
    // })     
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    // this.showLicense()
    interval = setInterval(that.showLicense(), 2000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(interval)
    interval = null
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})