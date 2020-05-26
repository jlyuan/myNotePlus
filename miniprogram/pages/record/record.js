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
    },
    show2:false,
    currentDate2: '',
    selectedDate2:'',
  },
  id:"",
  type:"",
  times:"",
  onInput(event) {
    this.setData({
      currentDate: event.detail,
      selectedDate:utils.dateFormat('YYYY-mm-dd',new Date(event.detail)),
    });
  },
  onInput2(event) {
    this.setData({
      currentDate2: event.detail,
      selectedDate2:utils.dateFormat('YYYY-mm-dd',new Date(event.detail)),
    });
  },
  selectDate(){
    this.setData({ show: true });
  },
  modifyTime(event){
  
    console.log(event.target.dataset)
    this.id = event.target.dataset.id;
    this.type = event.target.dataset.type;
    if(event.target.dataset.type == 'start'){
      this.setData({ currentDate2: event.target.dataset.starttimes });
      this.times = event.target.dataset.endtimes;
    }else{
      this.setData({ currentDate2: event.target.dataset.endtimes });
      this.times = event.target.dataset.starttimes;
    }
    this.setData({ show2: true });
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
    this.setData({ show: false,show2: false });
  },
  onConfirm:function(){
    this.setData({ show: false });
    this.queryRecords();
  },
  onConfirm2:function(){
    this.setData({ show2: false });
    var strdate = utils.dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.data.currentDate2));
    console.log(this.data.currentDate2,strdate)
    var data = {
      _id:this.id
    }
    data.data = {}
    if(this.type == "start"){
      data.data.startTimes = this.data.currentDate2;
      data.data.startTime = strdate;
      data.data.duration = Math.ceil((this.times - data.data.startTimes)/60000);
    }else{
      data.data.endTimes = this.data.currentDate2;
      data.data.endTime = strdate;
      data.data.duration = Math.ceil((data.data.endTimes- this.times)/60000);
    }
    if(data.data.duration<0){
      wx.showToast({
        icon:"none",
        title: '选择时间有误',
      });
      return 0;
    }
   
    // console.log(data);
    wx.showLoading();
    wx.cloud.callFunction({name:"noteRecordsModify",data:data}).then(resp=>{
      wx.hideLoading();
      let res = resp.result || {};
      if(res.success){
        wx.showToast({
          title: '修改ok',
        });
        this.queryRecords();
      }else{
        wx.showToast({
          icon:"none",
          title: '修改失败',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})