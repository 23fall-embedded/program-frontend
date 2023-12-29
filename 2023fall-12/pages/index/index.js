const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
  data: {
    list: '',
    region: ['山东省', '威海市', '环翠区'],
    now: {
      temp: 0,
      text: '未知',
      vis: 0
    },

    LEDarray: ['off', 'red', 'yellow', 'green', 'all'],
    objectArray: [
      {
        id: 0,
        name: 'off'
      },
      {
        id: 1,
        name: 'red'
      },
      {
        id: 2,
        name: 'yellow'
      },
      {
        id: 3,
        name: 'green'
      },
      {
        id: 4,
        name: 'all'
      }
    ],
    LEDindex: 0,
    temperature: 0,
    humidity: 0,
    mq3: 0,
    fire: "否",
    light: "否",
    licenseCnt: 0,

    alcohol: 999
  },

  onShow: function () {
    let that = this
    return new Promise(
      resolve => {
        that.houduan()
      }
    )
  },

  alcoholChange: function(e) {
    let that = this
    this.setData({
      alcohol: e.detail.value
    })
    console.log(that.data.alcohol)
    wx.request({
      url: 'http://124.70.165.173:8080/sendData',
      data: {
        "alc": that.data.alcohol
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success() {
        console.log('alc');
      },
      fail() {
        console.log('fail')
      }
    })
  },

  houduan: function () {
    var that = this;
    setInterval(function () {
      wx.request({
        url: 'http://124.70.165.173:8080/getData',
        method: 'GET',
        header: {
          'content-type': 'application/json' 
        },
        success: function (res) {
          
          const app = getApp()
          let lightStatus = (res.data.light[0] == "0" ? "否" : "是");
          let fireStatus = (res.data.fire[0] == "0" ? "否" : "是");
          that.setData({
            temperature: res.data.temperature[0],
            humidity: res.data.humidity[0],
            mq3: res.data.mq3[0],
            light: lightStatus,
            fire: fireStatus,
            licenseCnt: app.globalData.licenseCnt
          })
        }
      })
    }, 1000)
    
  },
  regionChange: function (e) {
    let that = this;
    this.setData({region: e.detail.value})
    this.getLocationID().then(result => {
      this.getWeatherInfo()
    })
    return new Promise(
      resolve => {
        wx.request({
          url: 'http://124.70.165.173:8080/sendData',
          data: {
            "loc": that.data.region[2],
            "adm": that.data.region[1],
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success() {
            console.log('Location success');
          }
        })
      }
    )
  },

  getWeatherInfo: function (){
    var that = this
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now',
      data: {
        location: that.data.locationID,
        key: 'b1aa1ec43dd04106bfc66420636d2e5c'
      },
      success: function(res) {
        that.setData({now: res.data.now})
      }
    })
  },

  getLocationID: function() {
    var that = this
    return new Promise( 
      resolve => {
        wx.request({
          url: 'https://geoapi.qweather.com/v2/city/lookup?',
          data: {
            location: that.data.region[2],
            adm: that.data.region[1],  //防止地名重复，引入参数adm
            key: 'b1aa1ec43dd04106bfc66420636d2e5c'
          },
          success: res => {
            that.setData({locationID: res.data.location[0].id})
            return resolve()
          }
        })
      }
    )
    
  },

  LEDChange: function(e) {
    let that = this;
    this.setData({
      LEDindex: e.detail.value
    })
    return new Promise(
      resolve => {
        wx.request({
          url: 'http://124.70.165.173:8080/sendData',
          data: {
            "led": that.data.LEDarray[e.detail.value]
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success() {
            console.log('led');
          }
        })
      }
    )
    
  },

  onLoad() {
    this.getLocationID().then(result => {
      this.getWeatherInfo()
    })
  }
  
  
})


