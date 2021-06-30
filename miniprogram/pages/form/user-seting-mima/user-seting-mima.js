const db = wx.cloud.database()
Page({
  data: {

  },

  onLoad: function(options) {
    var self = this
    wx.getStorage({
      key: 'student',
      success(res) {
        console.log(res)
        self.setData({
          student:res.data
        })
      }
    })
  },
  formSubmit(e){
    var id=this.data.student._id
    var mima=this.data.student.mima
    if (e.detail.value.oldmima == mima){
      if (e.detail.value.newmima.length>5){
        wx.showLoading({
          mask:true,
          title: '请稍后...',
        })
        const _ = db.command
        db.collection('student').doc(id).update({
          data: {
            mima: e.detail.value.newmima
          }
        }).then(res => {
          db.collection('student').where({
            _id: id
          }).get().then(take => {
            wx.setStorage({
              key: "student",
              data: take.data[0],
              success(x) {
                wx.hideLoading()
                wx.showModal({
                  title: '密码修改成功',
                  content: '新密码：' + e.detail.value.newmima,
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '../../form/form',
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }})
          })
          console.log(res)
        }).catch(err => {
          console.error(err)
        })
      }else{
        wx.showToast({
          icon: "none",
          title: '您的密码太短',
        })
      }
    }else{
      wx.showToast({
        icon:"none",
        title: '请输入正确原密码',
      })
    }
    
  }


})