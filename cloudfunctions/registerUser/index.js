// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const userColl = db.collection('note_user');
  // 查询用户是否被注册
  var haveUserData = [];
  await userColl.where({
    name:event.name
  }).get().then(res=>{
    haveUserData = res.data;
  })
  if(haveUserData.length > 0){
    return {
      success:false,
      message:"该用户名已被注册，请更换"
    }
  }else{
    var resp = {}
    await userColl.add({data:event}).then(res=>{
      res.success = true;
      resp = res;
    })
    return resp;
  }
}