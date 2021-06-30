const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({
  // 该参数从 wx-server-sdk 1.7.0 开始支持，默认为 true，指定 false 后可使得 doc.get 在找不到记录时不抛出异常
  throwOnNotFound: false,
})
const _ = db.command

exports.main = async(event) => {
  console.log(event)
  try {
    const result = await db.runTransaction(async transaction => {
      /* const aaaRes = await transaction.collection('account').doc('aaa').get()
      const bbbRes = await transaction.collection('account').doc('bbb').get() */
      if (event.uptiwen > 37.3) {
        const upjilu = await transaction.collection('z-RJXY').doc(event.id).update({
          // data 传入需要局部更新的数据
          data: {
            people: _.push(event.newpeople)
          }
        })

        const upmy = await transaction.collection('student').doc(event.myid).update({
          data: {
            [event.x]: event.uptiwen
          }
        })

        const addys = await transaction.collection('YS').add({
          // data 字段表示需新增的 JSON 数据
          data: event.ys
        })

      } else {
        const upjilu = await transaction.collection('z-RJXY').doc(event.id).update({
          // data 传入需要局部更新的数据
          data: {
            people: _.push(event.newpeople)
          }
        })
        const upmy = await transaction.collection('student').doc(event.myid).update({
          data: {
            [event.x]: event.uptiwen
          }
        })
      }
    })

    return {
      success: true,
    }
  } catch (e) {
    console.error(`transaction error`, e)

    return {
      success: false,
      error: e
    }
  }
}