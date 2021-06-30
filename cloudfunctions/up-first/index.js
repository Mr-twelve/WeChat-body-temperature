const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('student').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        // daytozdztime: event.daytozdztime,
        // daytozdz: event.daytozdz,
        jinqigoout: event.jinqigoout,
        location: event.location,
        myhealth: event.myhealth,
        familyhealth: event.familyhealth,
        // goschool: event.goschool,

        shifazhan:  event.shifazhan,
        zhongzhuanzhan:  event.zhongzhuanzhan,
        zhongdianzhan:  event.zhongdianzhan,
        zuihoucheci:  event.zuihoucheci,
        daodataiguday:  event.daodataiguday,
        daodataigutime: event. daodataigutime,
        daodadidian:  event.daodadidian,
        fanxiaostyle:  event.fanxiaostyle,
      }
    })
  } catch (e) {
    console.error(e)
  }
}