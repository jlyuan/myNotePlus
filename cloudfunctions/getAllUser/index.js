// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 1. 获取数据库引用
  const db = cloud.database();
  // 2. 获取集合引用
  const userCollention = db.collection('note_user');
  const wxContext = cloud.getWXContext();
  var data = [];
  await userCollention.get().then(res=>{
    data = res.data;
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    data:data
  }
  
}