
Page({

  data: {
    lookindex:'xxx'
  },

  onLoad: function (options) {
    var self=this
    wx.getStorage({
      key: 'student',
      success(res) {
        console.log(res)
        wx.cloud.callFunction({
          name: 'get',
          data: {
            jihe: 'student',
            where: {
              banji:res.data.banji
            }
          }
        }).then(getres => {
          self.setData({
            xueyuanC:res.data.xueyuanC,
            banji:res.data.banji,
            getstudent:getres.result.data
          })
          console.log(getres)
        }).catch(err => {

        })
      }
    })
  },
  lookthis(e){
    console.log(e.currentTarget.id)
    var lookindex=this.data.lookindex
    if(lookindex!=e.currentTarget.id){
      this.setData({
        lookindex:e.currentTarget.id
      })
    }else{
      this.setData({
        lookindex:'xxx'
      })
    }
  },
})