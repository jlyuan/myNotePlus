// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    const taskColl = db.collection('note_task');
      // 查询任务是否存在
  var haveData = [];
  await taskColl.where({
    taskName:event.taskName,
    userId:event.userId
  }).get().then(res=>{
    haveData = res.data;
  });
  if(haveData.length > 0){
    return {
      success:false,
      message:"该任务已存在!!!"
    }
  }else{
    var resp = {}
    await taskColl.add({data:event}).then(res=>{
      res.success = true;
      resp = res;
    })
    return resp;
  }
}