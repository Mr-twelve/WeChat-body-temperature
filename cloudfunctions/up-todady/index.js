const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async(event, context) => {
  console.log(event)
  try {
    return await db.collection('TJ').doc('dDHECVF2k4f0waMgGrNyWMLxorabrcQ9O9fNF0J0QMw1s8sn').update({
      // data 传入需要局部更新的数据
      data: {
        time:event.time,
        sum: event.sum,
        nxy: event.nxy,
        dwkjxy: event.dwkjxy,
        lxy: event.lxy,
        yyxy: event.yyxy,
        zyhjxy: event.zyhjxy,
        gxy: event.gxy,
        jjglxy: event.jjglxy,
        spkxygcxy: event.spkxygcxy,
        wlxy: event.wlxy,
        smkxxy: event.smkxxy,
        ggglxy: event.ggglxy,
        mapjyzx: event.mapjyzx,
        xxkxygcxy: event.xxkxygcxy,
        rjxy: event.rjxy,
        cxjsxy: event.cxjsxy,
        tyxy: event.tyxy,
        mkszyxy: event.mkszyxy,
        sxzzlljxyjb: event.sxzzlljxyjb,
        zbxy: event.zbxy,
        dwyxy: event.dwyxy,
        cykxy: event.cykxy,
      }
    })
  } catch (e) {
    console.error(e)
  }
}