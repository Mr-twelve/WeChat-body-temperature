const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  var dataxueyuan=['nxy', 'dwkjxy', 'lxy', 'yyxy', 'zyhjxy', 'gxy', 'jjglxy', 'spkxygcxy', 'wlxy', 'smkxxy', 'ggglxy', 'mapjyzx', 'xxkxygcxy', 'rjxy', 'cxjsxy', 'tyxy', 'mkszyxy', 'sxzzlljxyjb', 'zbxy', 'dwyxy', 'cykxy'],
  var sum= 0,
  var nxy= 0,
  var dwkjxy= 0,
  var lxy= 0,
  var yyxy= 0,
  var zyhjxy= 0,
  var gxy= 0,
  var jjglxy= 0,
  var spkxygcxy= 0,
  var wlxy= 0,
  var smkxxy= 0,
  var ggglxy= 0,
  var mapjyzx= 0,
  var xxkxygcxy= 0,
  var rjxy= 0,
  var cxjsxy= 0,
  var tyxy= 0,
  var mkszyxy= 0,
  var sxzzlljxyjb= 0,

  var zbxy= 0,
  var dwyxy= 0,
  var cykxy= 0,
  var day = '0' + (new Date().getMonth() + 1) + new Date().getDate()

  dataxueyuan.forEach(function (item, index) {
    console.log(item)
    await db.collection('YS').where({
      day: day,
      xueyuan: item
    }).count().then(res => {
      console.log(res)
      sum += res.total
      self.setData({
        sum: sum,
        [item]: res.total
      })
    })
  })
  
  try {
    return await db.collection('todos').where({
        done: false
      })
      .update({
        data: {
          progress: _.inc(10)
        },
      })
  } catch (e) {
    console.error(e)
  }
}