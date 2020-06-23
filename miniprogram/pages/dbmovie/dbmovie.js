// miniprogram/pages/dbmovie/dbmovie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot_move:{},
    start:8,
    movies:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      start:8,
      movies:[]
    })
    this.getMovie();
  },
  jsonpDataToJson:function(data) {
    data = data.substring(data.indexOf("(") + 1, data.length - 2)
    let json = JSON.parse(data)
    return json
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //点击图片跳转到电影详情页
  clickToMovieDetail:function(event){
    console.log(event.target.dataset);
    //存储数据到本地
    wx.setStorage({
      key: "currentMovieId-" + event.target.dataset.movie.id ,
      data: JSON.stringify(event.target.dataset)
    });
    //跳转到相应页面
    wx.navigateTo({
      url: "/pages/movieDetail/movieDetail?currentMovieId=" + event.target.dataset.movie.id
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getMovie:function(){
    let _this = this
    wx.request({
      url: 'https://m.douban.com/rexxar/api/v2/movie/suggestion?&&&&',
      data:{
        start:_this.data.start,
        count:10,
        new_struct:1,
        with_review:2,
        for_mobile:1
      },
      success:function(res){
        console.log(res);
        let movies = _this.data.movies.concat(res.data.items);
        _this.setData({
          start:_this.data.start + 8,
          movies:movies
        })

      }
    })
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
    this.getMovie();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})