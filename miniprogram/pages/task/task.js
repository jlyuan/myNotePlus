// pages/task/task.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    userName:"",
    taskName:"",
    taskDesc:"",
    activeTasks:[],
    noActiveTasks:[]
  },
  setTaskName:function(e){
    this.setData({
      taskName:e.detail
    })
  },
  setTaskDesc:function(e){
    this.setData({
      taskDesc:e.detail
    })
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
      this.queryTask();
    }
  },
  // 添加任务
  addTaskHander:function(){
    if(!this.data.userId){
      wx.showToast({
        icon:"none",
        title: '未登录，请到首页登录注册',
      })
      return 0;
    }
    if(!this.data.taskName){
      wx.showToast({
        icon:"none",
        title: '请填写任务名称',
      })
      return false;
    }
    var task = {
      userId:this.data.userId,
      taskName:this.data.taskName,
      taskDesc:this.data.taskDesc,
      isActive:true
    }
    console.log(task)
    wx.showLoading();
    wx.cloud.callFunction({name:"noteAddTask",data:task}).then(resp=>{
      wx.hideLoading()
      var res = resp.result || {};
      if(res.success){
        wx.showToast({
          title:"添加任务ok"
        })
        this.data.activeTasks.push(task);
        this.setData({
          activeTasks:this.data.activeTasks
        })
        console.log(this.data.activeTasks)
      }else{
        wx.showToast({
          icon:"none",
          title:res.message
        })
      }
    })
  },
  // 查询任务
  queryTask:function(){
    let data = {
      userId:this.data.userId,
    }
    wx.cloud.callFunction({name:"noteTaskQuery",data:data}).then(res=>{
      console.log(res)
      let taskList = res.result.data || [];
      let activeTasks = [];
      let noActiveTasks = [];
      taskList.forEach(item=>{
        if(item.isActive){
          activeTasks.push(item)
        }else{
          noActiveTasks.push(item)
        }
      })
      this.setData({
        activeTasks,
        noActiveTasks
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
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.name){
      this.setData({
        userId:userInfo._id,
        userName:userInfo.name
      });
    this.queryTask();
  }
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