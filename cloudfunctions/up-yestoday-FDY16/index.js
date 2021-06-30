const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('TJ').where({
      xueyuan: event.xueyuan
    })
      .update({
        data: {
          j16: _.push(event.lstj)
        },
      })
  } catch (e) {
    console.error(e)
  }
}