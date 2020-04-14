// miniprogram/pages/test/test.js
const CHARTS = require('../../tools/wxcharts-min.js');
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },
  lineShow: function () {
    var random1 = Math.floor(Math.random() * (500 - 50 + 1) + 50),
        random2 = Math.floor(Math.random() * (800 - 100 + 1) + 100),
        random3 = Math.floor(Math.random() * (1000 - 200 + 1) + 200),
        random4 = Math.floor(Math.random() * (300 - 10 + 1) + 10),
        random5 = Math.floor(Math.random() * (600 - 300 + 1) + 300);

    let line = {
        canvasId: 'lineGraph1', // canvas-id
        type: 'line', // 图表类型，可选值为pie, line, column, area, ring
        categories: ['201708', '201709', '201710', '201711', '201712'],
        series: [{ // 数据列表
            name: ' ',
            data: [random1, random2, random3, random4, random5]
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lineShow()
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
    this.lineShow()
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