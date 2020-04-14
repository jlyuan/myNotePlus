// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const userColl = db.collection('note_user');
  var resp = {};
  await userColl.where({
    name:event.name,
    mobile:event.mobile
  }).update({data:{
    passwd:event.passwd
  }}).then(res=>{
    resp = res;
  });
  return {
    success: resp.stats.updated>0,
    stats: resp.stats
  }
}