// pages/count/count.js
import {
  utils
} from '../../tools/tool.js'
const CHARTS = require('../../tools/wxcharts-min.js');
var dateTime = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [],
    userId: "",
    userName: "",
    selectShowMode: "zxt",
    show: false,
    currentDate: new Date().getTime(),
    startTimeDates: new Date().getTime() - 6*24*60*60*1000,
    selectedStartTimeDate: utils.dateFormat('YYYY-mm-dd', new Date(dateTime.setDate(dateTime.getDate()-6))),
    endTimeDates: new Date().getTime(),
    selectedEndTimeDate: utils.dateFormat('YYYY-mm-dd', new Date()),
    formatter(type, value) {
      return value;
    },
    selectTaskId: "", // 选择的任务id
    isChangeStartTime: false,
    records:[],
    totalTimes:0, //总时长(分钟)
    totalHourTimes:0, //总时长(小时)
    avgTimes:0,
    lineCategories:[], // 折线图x轴
    lineData:[],// 折线图y轴
    destTime:0 // 任务每周目标时长
  },
  onChangeTaskId: function (e) {
    var destTime = 0;
    this.data.tasks.forEach(item=>{
      if(item.taskName == e.detail){
        destTime = item.destTime;
      }
    })
    this.setData({
      selectTaskId: e.detail,
      destTime
    });
  },
  onChangeStartTime: function () {
    this.setData({
      show: true,
      isChangeStartTime: true
    });
  },
  onChangeEndTime: function () {
    this.setData({
      show: true,
      isChangeStartTime: false
    });
  },
  onInput(event) {
    if (this.data.isChangeStartTime) {
      this.setData({
        currentDate: event.detail,
        startTimeDates: event.detail,
        selectedStartTimeDate: utils.dateFormat('YYYY-mm-dd', new Date(event.detail)),
      });
    } else {
      this.setData({
        currentDate: event.detail,
        endTimeDates: event.detail,
        selectedEndTimeDate: utils.dateFormat('YYYY-mm-dd', new Date(event.detail)),
      });
    }

  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onConfirm: function () {
    this.setData({
      show: false
    });
  },
  // onChangeTaskId: function (e) {
  //   this.setData({
  //     selectTaskId: e.detail
  //   });
  // },
  onShowMode: function (e) {
    this.setData({
      selectShowMode: e.detail
    });
      if(this.data.selectShowMode == 'zxt'){
        this.lineShow();
      }
  },
  // 查询任务
  queryTask: function () {
    let data = {
      userId: this.data.userId,
      isActive: true
    }
    wx.cloud.callFunction({
      name: "noteTaskQuery",
      data: data
    }).then(res => {
      let tasks = res.result.data || [];
      this.setData({
        tasks
      });
      if(tasks.length>0){
        this.setData({
          selectTaskId:tasks[0].taskName,
          destTime:tasks[0].destTime || 0
        });
        this.countFn();
      }
    })
  },
  // countFn
  countFn: function () {
    if (!this.data.selectTaskId) {
      wx.showToast({
        icon: "none",
        title: '请选择任务',
      })
      return 0;
    }
    if (this.data.selectedStartTimeDate == this.data.selectedEndTimeDate) {

    } else {
      if (this.data.startTimeDates > this.data.endTimeDates) {
        wx.showToast({
          icon: "none",
          title: '日期范围选择错误',
        })
        return 0;
      }
    }
    let data = {
      userId: this.data.userId,
      taskName: this.data.selectTaskId,
      startTime: new Date(this.data.selectedStartTimeDate + ' 00:00:01').getTime(),
      endTime: new Date(this.data.selectedEndTimeDate + ' 23:59:59').getTime()
    }
    wx.showLoading()
    wx.cloud.callFunction({name:"noteRecordsCount",data:data}).then(resp=>{
      wx.hideLoading();
      let records = resp.result.data || [];
      let totalTimes = 0;
      let avgTimes = 0;
      let totalHourTimes = 0;
      let lineCategories = [];
      let lineData = [];
      if(records.length >0 ){
        records.forEach(item=>{
          totalTimes += item.duration;
          lineCategories.push(item.dataTime);
          lineData.push(item.duration);
        })
        avgTimes = Math.ceil(totalTimes / records.length);
        totalHourTimes = (totalTimes / 60).toFixed(2)
      }

      this.setData({
        records,
        totalTimes,
        avgTimes,
        totalHourTimes,
        lineCategories,
        lineData
      });
      this.lineShow();
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
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.name) {
      this.setData({
        userName: userInfo.name,
        userId: userInfo._id
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
  lineShow: function () {
    let line = {
        canvasId: 'lineGraph', // canvas-id
        type: 'line', // 图表类型，可选值为pie, line, column, area, ring
        categories: this.data.lineCategories,
        series: [{ // 数据列表
            name: '时长分钟',
            data: this.data.lineData
        }],
        yAxis: {
            min: 0 // Y轴起始值
        },
        width: 310,
        height: 200,
        dataLabel: true, // 是否在图表中显示数据内容值
        legend: false, // 是否显示图表下方各类别的标识
        extra: {
            lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
        }
    }
    new CHARTS(line);
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