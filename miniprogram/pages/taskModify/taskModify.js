// pages/taskModify/taskModify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let argData = {
      userId:options.userId,
      taskName:options.taskName
    }
    this.queryTask(argData);
  },
    // 查询任务
    queryTask:function(data){
      wx.cloud.callFunction({name:"noteTaskQuery",data:data}).then(res=>{
        console.log(res)
        let task = res.result.data && res.result.data[0] || {};
        this.setData({
          task
        })
      })
    },
    modifyTaskHander:function(){
      let task = this.data.task;
      let data = {
        userId:task.userId,
        taskName:task.taskName,
        destTime:task.destTime,
        taskDesc:task.taskDesc,
        isActive:task.isActive
      }
      wx.showLoading();
      wx.cloud.callFunction({name:"noteTaskModify",data:data}).then(resp=>{
        wx.hideLoading();
        let res = resp.result || {};
        if(res.success){
          wx.showToast({
            title: '修改任务ok',
          });
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/task/task',
            })
          },2000)
        }else{
          wx.showToast({
            icon:"none",
            title: '修改任务失败',
          })
        }
      })
    },
    setTaskName:function(e){
      this.data.task.taskName = e.detail;
      this.setData({
        task:this.data.task
      })
    },
    setTaskDestTime:function(e){
      this.data.task.destTime = e.detail;
      this.setData({
        task:this.data.task
      })
    },
    setTaskDesc:function(e){
      this.data.task.taskDesc = e.detail;
      this.setData({
        task:this.data.task
      })
    },
    onChange:function(e){
      this.data.task.isActive = e.detail;
      this.setData({
        task:this.data.task
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