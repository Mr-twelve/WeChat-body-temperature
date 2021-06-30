const db = wx.cloud.database()
Page({

  data: {

  },

  onLoad: function (options) {
    var self = this
    wx.getStorage({
      key: 'student',
      success(res) {
        self.setData({
          student:res.data
        })
      }
    })
  },

  formSubmit (e){
    var location = e.detail.value.location
    var family = e.detail.value.family
    var goschool = e.detail.value.goschool
    var gowuhan = e.detail.value.gowuhan
    var id=this.data.student._id
    var student=this.data.setudent
    if (location != '' && family != '' && gowuhan != '' && goschool != '' ){
      wx.showLoading({
        title: '上传中..',
      })
      wx.cloud.callFunction({
        name: 'up-first',
        data: {
          id: id,
          goschool: goschool,
          location: location,
          family: family,
          gowuhan: gowuhan,
        },
        success: res => {
          db.collection('student').doc(id).get().then(res => {
            wx.setStorage({
              key: "student",
              data: res.data,
              success(e) {
                wx.hideLoading()
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../form/form',
                  })
                }, 1500)
              }
            })
          })    
        },
        fail: err => {
        },
        complete: () => {
        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '请填写全部内容',
      })
    }
  },
})