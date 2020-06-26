// miniprogram/pages/mySpace/mySpace.js
import {utils} from '../../tools/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    spaceDatas:[],
    pageIndex:0,
    pageSize:8,
    userId:"",
    userName:"",
    hasMore:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.name){
      this.setData({
        userId:userInfo._id,
        userName:userInfo.name
      });
      this.querySpace(0);
    }
  },
  querySpace:function(index){
    let data = {
      userId:this.data.userId,
      skip:index*this.data.pageSize,
      pageSize:this.data.pageSize
    }
    let _this = this;
    wx.cloud.callFunction({name:"noteSayQuery",data:data}).then(res=>{
      let sayList = res.result.data || [];
      if(index != 0){
        sayList = this.data.spaceDatas.concat(sayList); 
      }
      _this.setData({
        spaceDatas:sayList,
        hasMore:res.result.data && res.result.data.length == 0 ?true:false,
      })
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
  bindFormSubmit: function(e) {
    let content = e.detail.value.textarea;
    if(!content){
      return 0;
    }
    var nowDate = new Date();
    let data = {
      userId:this.data.userId,
      content:content,
      time:utils.dateFormat('YYYY-mm-dd HH:MM:SS', nowDate),
      times:nowDate.getTime()
    }
    console.log(data)
    let _this = this;
    wx.showLoading();
    wx.cloud.callFunction({name:"notePublishSay",data:data}).then(resp=>{
      wx.hideLoading()
      var res = resp.result || {};
      if(res.success){
        wx.showToast({
          title:"发布ok"
        });
        _this.setData({
          content:"",
          pageIndex:0
        });
        _this.querySpace(0);
      }else{
        wx.showToast({
          icon:"none",
          title:res.message || '发布失败'
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
  // 删除 说说
  delSay:function(e){
    console.log(e.target.dataset)
    let data = {
      id:e.target.dataset.id
    }
    let _this = this;
    wx.showModal({
      content: '你确认删除吗？',
      success (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.cloud.callFunction({name:"noteSayDel",data:data}).then(res=>{
            wx.hideLoading()
            let result = res.result;
            if(result.stats.removed>0){
              wx.showToast({
                icon:"none",
                title:'删除成功'
              })
              let datas = _this.data.spaceDatas;
              datas.some(function(item,index){
                if(item._id == data.id){
                  datas.splice(index,1)
                  return true;
                }
              })
              _this.setData(
                {
                  spaceDatas:datas
                }
              )
            }else{
              wx.showToast({
                icon:"none",
                title:'删除失败'
              })
            }
            console.log(res)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasMore){
      return 0;
    }
    var index = this.data.pageIndex + 1;
    this.setData({
      pageIndex:index
    });
    this.querySpace(index);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})