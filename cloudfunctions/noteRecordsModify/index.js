// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const taskColl = db.collection('note_records');
  var resp = {};
  await taskColl.where({
    _id:event._id
  }).update({data:event.data}).then(res=>{
    resp = res;
  });
  return {
    success: resp.stats.updated>0,
    stats: resp.stats
  }
}