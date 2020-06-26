// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const spaceColl = db.collection('note_space');
  var resp = {}
  await spaceColl.add({data:event}).then(res=>{
    res.success = true;
    resp = res;
  })
  return resp;
}