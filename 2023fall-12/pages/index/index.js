// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
  /**
   * 页面的初始数据
   */
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
    mq3: "否",
    fire: "否",
    light: "否",
    licenseCnt: 0,
    license_img: "1234",
    licenseArray: []
  },

  onShow: function () {
    let that = this
    return new Promise(
      resolve => {
        that.houduan()
      }
    )
  },

  //触发事件
  houduan: function () {
    var that = this;
    setInterval(function () {
      wx.request({
        url: 'http://localhost:8080/getData',
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {//成功交互后触发
          console.log(res.data)//打印到控制台
          let mq3Status = (res.data.mq3[0] == "0" ? "否" : "是");
          let lightStatus = (res.data.light[0] == "0" ? "否" : "是");
          let fireStatus = (res.data.fire[0] == "0" ? "否" : "是");
          that.setData({
            temperature: res.data.temperature[0],
            humidity: res.data.humidity[0],
            mq3: mq3Status,
            light: lightStatus,
            fire: fireStatus,
            licenseCnt: res.data.licenses.length,
            license_img: res.data.img[0],
            licenseArray: res.data.licenses
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
          url: 'http://localhost:8080/sendData',
          data: {
            "loc": that.data.region[2],
            "adm": that.data.region[1]
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
        //console.log(res.data)
      }
    })
  },

  getLocationID: function() {
    var that = this
    return new Promise(  //解决异步问题
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
    console.log(e.detail.value);
    console.log(that.data.LEDarray[e.detail.value]);
    return new Promise(
      resolve => {
        wx.request({
          url: 'http://localhost:8080/sendData',
          data: {
            "led": that.data.LEDarray[e.detail.value]
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success() {
            console.log('LED success');
          }
        })
      }
    )
    
  },

  gotoLicense: function() {
    wx.navigateTo({      
      url: '../car-license/license',    //要跳转到的页面路径
    })
    console.log('okok'); 
  },

  onLoad() {
    this.getLocationID().then(result => {
      this.getWeatherInfo()
    })
  }
  
  
})


