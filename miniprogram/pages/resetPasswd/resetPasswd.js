// pages/register/register.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      name:"",
      passwd:"",
      mobile:""
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
  setUserMobile:function(e){
    this.setData({
        mobile:e.detail
    })
  },
  // 表单校验
  validateForm(){
    if(!this.data.name || !this.data.passwd){
      wx.showToast({
        title: '请填写完整信息',
      })
      return false;
    }
    if(this.data.passwd.length<6){
      wx.showToast({
        title: '密码不得少于6位',
      })
      return false;
    }
    if(!(/^1[3456789]\d{9}$/.test(this.data.mobile))){ 
      wx.showToast({
        title: '手机号码有误，请重填',
      }) 
      return false; 
  } 
    return true;
  },
  // 重置密码
  resetPasswdHander(){
    if(!this.validateForm()){
      return 0;
    }
    var user = {
      name:this.data.name,
      passwd:this.data.passwd,
      mobile:this.data.mobile
    }
    wx.showLoading();
    wx.cloud.callFunction({
      name:"noteResetPasswd",
      data:user
    }).then(resp=>{
      wx.hideLoading()
      var res = resp.result || {};
      console.log(res)
      if(res.success){
        wx.showToast({
          title:'重置密码ok'
        });
        // 回到login
        setTimeout(function(){
          wx.navigateTo({
            url: '/pages/login/login',
          })
        },2000)
      }else{
        wx.showToast({
          icon:"none",
          title:'重置密码失败，请输入正确的用户名和手机号'
        })
      }
    })
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