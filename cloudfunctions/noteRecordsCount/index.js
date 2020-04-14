// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const recordsColl = db.collection('note_records');
    let resp ;
    await recordsColl.where({
      userId:event.userId,
      taskName:event.taskName,
      dataTimes:_.lte(event.endTime).and(_.gte(event.startTime))
    }).get().then(res=>{
      resp = res;
    });
    return resp
}