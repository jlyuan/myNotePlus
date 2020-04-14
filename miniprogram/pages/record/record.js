// pages/record/record.js
import {utils} from '../../tools/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    userName:"",
    records:[],
    show:false,
    currentDate: new Date().getTime(),
    selectedDate:utils.dateFormat('YYYY-mm-dd',new Date()),
    minDate: new Date().getTime(),
    formatter(type, value) {
      return value;
    }
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
      selectedDate:utils.dateFormat('YYYY-mm-dd',new Date(event.detail)),
    });
  },
  selectDate(){
    this.setData({ show: true });
  },
      // 查询记录
      queryRecords:function(){
        if(!this.data.userId){
          wx.showToast({
            title: '你还没有登录',
            icon:"none"
          });
          return 0;
        }
        var nowDate = new Date();
        var data = {
          userId:this.data.userId,
          dataTime:this.data.selectedDate
        };
        wx.cloud.callFunction({name:"noteRecordsQuery",data:data}).then(resp=>{
          let records = resp.result.data || [];
          this.setData({
            records
          })
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
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.name){
      this.setData({
        userName:userInfo.name,
        userId:userInfo._id
      });
      if(this.data.records.length == 0){
        this.queryRecords();
      }
    }
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm:function(){
    this.setData({ show: false });
    this.queryRecords();
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