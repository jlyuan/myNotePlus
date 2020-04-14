// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    passwd:"",
    loginFail:false
},
setUserName:function(e){
  this.setData({
      name:e.detail
  })
},
setUserPasswd:function(e){
  this.setData({
      passwd:e.detail
  })
},
// 登录
loginHander:function(){
  if(!this.data.name || !this.data.passwd){
    wx.showToast({
      icon:"none",
      title: '请填写完整信息',
    })
    return false;
  }
  var user = {
    name:this.data.name,
    passwd:this.data.passwd,
  }
  wx.showLoading();
  wx.cloud.callFunction({
    name:"noteLogin",
    data:user
  }).then(resp=>{
    wx.hideLoading()
    var res = resp.result;
    if(res.success){
      wx.showToast({
        title:'登录成功'
      });
      //缓存用户信息
      let userData = res.data[0];
      wx.setStorage({
        data: {
          name:userData.name,
          mobile:userData.mobile,
          _id:userData._id
        },
        key: 'userInfo',
      })
      app.globalData.userId = userData._id;
      app.globalData.userName = userData.name;

      // 回到首页
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
      },2000)
    }else{
      wx.showToast({
        icon:"none",
        title:res.message
      })
    }
  })
},

    // 找回密码
    goResetPasswd:function(){
      wx.navigateTo({
            url: "/pages/resetPasswd/resetPasswd"
      });
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})