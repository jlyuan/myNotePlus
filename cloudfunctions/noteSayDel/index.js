// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const recordsColl = db.collection('note_space');
  var resp ;
  await recordsColl.doc(event.id).remove().then(res=>{
    resp = res;
  });
  return resp
}