//index.js
import {utils} from '../../tools/tool.js'
const app = getApp()
Page({
  data:{
    isLogin:false,
    userName:"",
    userId:"",
    selectTaskId:"",// 选择的任务id
    tasks:[],
    records:[]
  },
  // 登录
  goLogin:function(){
    wx.navigateTo({
          url: "/pages/login/login"
    });
  },
    // 注册
    goRegister:function(){
    wx.navigateTo({
          url: "/pages/register/register"
    });
  },
  onLoad:function(){
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.name){
      this.setData({
        isLogin:true,
        userName:userInfo.name,
        userId:userInfo._id
      });
      this.queryTask();
      this.queryTodayRecords();
    }
  },
  onShow:function(){
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.name){
      this.setData({
        isLogin:true,
        userName:userInfo.name,
        userId:userInfo._id
      });
      this.queryTask();
      this.queryTodayRecords();
    }
  },
  logoutFn:function(){
    wx.clearStorage();
    this.setData({
      isLogin:false
    })
  },
  onChangeTaskId:function(e){
      this.setData({
        selectTaskId: e.detail
      });
  },
    // 查询任务
    queryTask:function(){
      let data = {
        userId:this.data.userId,
        isActive:true
      }
      wx.cloud.callFunction({name:"noteTaskQuery",data:data}).then(res=>{
        console.log(res)
        let tasks = res.result.data || [];
        this.setData({
          tasks
        })
      })
    },
    // 签到处理
    signInFn:function(){
      let _this = this;
      if(!this.data.selectTaskId){
        wx.showToast({
          icon:"none",
          title: '请选择任务',
        })
        return 0;
      }
      var nowDate = new Date();
      var data = {
        userId:this.data.userId,
        userName:this.data.userName,
        taskName:this.data.selectTaskId,
        sign:"in",
        dataTime:utils.dateFormat('YYYY-mm-dd', nowDate),
        dataTimes:nowDate.getTime(),
        startTime:utils.dateFormat('YYYY-mm-dd HH:MM:SS', nowDate),
        startTimes:nowDate.getTime(),
        duration:1 // 签到时设置1分钟，签退在计算修改
      }
      wx.showLoading();
     wx.cloud.callFunction({name:"noteSignHandler",data:data}).then(resp=>{
      wx.hideLoading();
       let res = resp.result;
       if(res.success){
        wx.showToast({title:"签到成功"})
        _this.queryTodayRecords();
       }else{
        wx.showToast({icon:"none", title:res.message})
       }
     })
    },
    // 签退处理
    signOutFn:function(){
      if(!this.data.selectTaskId){
        wx.showToast({
          icon:"none",
          title: '请选择任务',
        })
        return 0;
      }
      let duration = 1;
      let nowDate = new Date();
      let flag = this.data.records.some(item=>{
        if(item.taskName == this.data.selectTaskId){
          duration = Math.ceil((nowDate.getTime() - item.startTimes)/60000);
          return true;
        }
      })
      if(!flag){
        wx.showToast({
          icon:"none",
          title: '该任务还未签到',
        })
        return 0;
      }
      let data ={
        userId:this.data.userId,
        userName:this.data.userName,
        taskName:this.data.selectTaskId,
        sign:"out",
        dataTime:utils.dateFormat('YYYY-mm-dd', nowDate),
        dataTimes:nowDate.getTime(),
        endTime:utils.dateFormat('YYYY-mm-dd HH:MM:SS', nowDate),
        endTimes:nowDate.getTime(),
        duration:duration
      };
      wx.showLoading();
      let _this = this;
      wx.cloud.callFunction({name:"noteSignHandler",data:data}).then(resp=>{
        wx.hideLoading();
        if(resp.result.success){
          wx.showToast({
            title: '签退ok',
          });
          _this.queryTodayRecords();
        }else{
          wx.showToast({
            icon:"none",
            title: '签退失败,稍后重试',
          });
        }
      })
    },
    // 查询今日记录
    queryTodayRecords:function(){
      var nowDate = new Date();
      var data = {
        userId:this.data.userId,
        dataTime:utils.dateFormat('YYYY-mm-dd', nowDate),
      };
      wx.cloud.callFunction({name:"noteRecordsQuery",data:data}).then(resp=>{
        let records = resp.result.data || [];
        this.setData({
          records
        })
      })
    }
  
})
