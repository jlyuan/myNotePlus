// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const taskColl = db.collection('note_task');
    // 查询任务是否存在
    var resp ;
    await taskColl.where(event).get().then(res=>{
      resp = res;
    });
    return resp
}