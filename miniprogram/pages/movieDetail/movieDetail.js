// miniprogram/pages/movieDetail/movieDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMovieId:0,
    currentMovieData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentMovieId = options.currentMovieId;
    //获取存储在本地的数据
    var _this = this;
    wx.getStorage({
      key: 'currentMovieId-' + currentMovieId,
      success(res) {
        console.log(res.data)
        _this.setData({
          currentMovieId: currentMovieId,
          currentMovieData: JSON.parse(res.data)
        });
      }
    })
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