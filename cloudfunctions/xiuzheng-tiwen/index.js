const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  console.log(event)
  try {
    return await db.collection('student')
      .where(event.where)
      .update({
        data: event.updata
      })
  } catch (e) {
    console.error(e)
  }
}