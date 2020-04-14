// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const userColl = db.collection('note_user');
  // 查询用户
  var haveUserData = [];
  await userColl.where({
    name:event.name,
    passwd:event.passwd
  }).get().then(res=>{
    haveUserData = res.data;
  });
  if(haveUserData.length>0){
    return{
      data:haveUserData,
      success:true,
      message:"ok"
    }
  }else{
    return {
      success:false,
      message:"用户名或者密码错误"
    }
  }
}