// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const recordsColl = db.collection('note_records');
  let sign = event.sign;
  let havaData = []
  await recordsColl.where({
    dataTime:event.dataTime,
    userId:event.userId,
    taskName:event.taskName,
  }).get().then(res=>{
    havaData = res.data;
  });
  if(sign == "in"){
    // 签到处理
    if(havaData.length>0){
      return {
        success:false,
        message:"你也签到,你该签退了"
      }
    }else{
      let resp = {}
      await recordsColl.add({data:event}).then(res=>{
        res.success = true;
        resp = res;
      })
      return resp;
    }
  }else{
    // 签退处理
    let resp = {};
    await recordsColl.where({
      dataTime:event.dataTime,
      userId:event.userId,
      taskName:event.taskName,
    }).update({data:event}).then(res=>{
      resp = res;
    });
    return {
      success: resp.stats.updated>0,
      stats: resp.stats
    }
  }
}