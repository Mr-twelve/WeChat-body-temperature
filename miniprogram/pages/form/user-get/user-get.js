const db = wx.cloud.database()
Page({

  data: {
    daodataiguday: "点击选择日期",
    daodataigutime: "点击选择时间",
    fanxiaostyle: [],
    checkbox_hc: false,
    checkbox_fj: false,
    checkbox_zj: false,
    checkbox_qc: false,
  },
  onLoad: function (options) {
    var self = this
    db.collection('util').doc('42c9a7b15e7c34eb000d09dd1d75f201').get().then(res => {
      self.setData({
        text: res.data.text,
        yesno: res.data.yesno,
        textyesno: res.data.textyesno
      })
    })
    self.onloading()
  },
  onloading: function (options) {
    var self = this
    wx.getStorage({
      key: 'student',
      success(res) {
        console.log(res)
        if (res.data.jinqigoout && res.data.location && res.data.myhealth && res.data.familyhealth && res.data.shifazhan && res.data.zhongzhuanzhan && res.data.zhongdianzhan && res.data.zuihoucheci && res.data.daodataiguday && res.data.daodataigutime && res.data.daodadidian && res.data.fanxiaostyle) {
          var have = true
        } else {
          var have = false
        }
        if (res.data.daodataiguday) {
          self.setData({
            daodataiguday: res.data.daodataiguday,
          })
        }
        if (res.data.daodataigutime) {
          self.setData({
            daodataigutime: res.data.daodataigutime,
          })
        }
        console.log(res.data.daodadidian)
        if (res.data.daodadidian) {
          self.setData({
            daodadidian: res.data.daodadidian,
          })
        }
        console.log(res.data.fanxiaostyle)
        if(res.data.fanxiaostyle.indexOf("自驾")>=0){
          self.setData({
            checkbox_zj: true,
          })
        }
        if(res.data.fanxiaostyle.indexOf("火车")>=0){
          self.setData({
            checkbox_hc: true,
          })
        }
        if(res.data.fanxiaostyle.indexOf("飞机")>=0){
          self.setData({
            checkbox_fj: true,
          })
        }
        if(res.data.fanxiaostyle.indexOf("汽车")>=0){
          self.setData({
            checkbox_qc: true,
          })
        }

        self.setData({
          shifazhan: res.data.shifazhan,
          zhongzhuanzhan: res.data.zhongzhuanzhan,
          zhongdianzhan: res.data.zhongdianzhan,
          zuihoucheci: res.data.zuihoucheci,
          fanxiaostyle: res.data.fanxiaostyle,
          // daytozdztime: res.data.daytozdztime,
          // daytozdz: res.data.daytozdz,
          jinqigoout: res.data.jinqigoout,
          have: have,
          jinqigoout: res.data.jinqigoout,
          location: res.data.location,
          myhealth: res.data.myhealth,
          familyhealth: res.data.familyhealth,
          // goschool: res.data.goschool,
          student: res.data
        })
      }
    })
  },
  formSubmit(e) {
    var self = this
    var have = this.data.have


    var shifazhan = e.detail.value.shifazhan
    console.log(shifazhan)
    var zhongzhuanzhan = e.detail.value.zhongzhuanzhan
    var zhongdianzhan = e.detail.value.zhongdianzhan
    var zuihoucheci = e.detail.value.zuihoucheci
    var daodataiguday = this.data.daodataiguday
    var daodataigutime = this.data.daodataigutime
    var daodadidian = this.data.daodadidian
    var fanxiaostyle = this.data.fanxiaostyle.toString()
    console.log(zhongzhuanzhan)
    console.log(zhongdianzhan)
    console.log(zuihoucheci)
    console.log(daodataiguday)
    console.log(daodataigutime)
    console.log(daodadidian)
    console.log(fanxiaostyle)

    if (fanxiaostyle != '' && shifazhan != '' && zhongzhuanzhan != '' && zhongdianzhan != '' && zuihoucheci != '' && daodataiguday != '点击选择日期' && daodataigutime != '点击选择时间' && daodadidian != '') {
      console.log("xxxxx")
      if (have) {
        wx.showModal({
          title: '提示',
          content: '您已提交过是否再次提交更改信息',
          success(modalres) {
            if (modalres.confirm) {
              console.log(shifazhan)
              // var daytozdztime = e.detail.value.daytozdztime
              // var daytozdz = e.detail.value.daytozdz
              var jinqigoout = e.detail.value.jinqigoout
              var location = e.detail.value.location
              var myhealth = e.detail.value.myhealth
              var familyhealth = e.detail.value.familyhealth
              // var goschool = e.detail.value.goschool
              var id = self.data.student._id
              var student = self.data.setudent
              if (location != '' && myhealth != '' && familyhealth != '' && jinqigoout != '') {
                wx.showLoading({
                  mask: true,
                  title: '上传中..',
                })
                wx.cloud.callFunction({
                  name: 'up-first',
                  data: {
                    id: id,
                    // daytozdztime: daytozdztime,
                    // daytozdz: daytozdz,
                    jinqigoout: jinqigoout,
                    location: location,
                    myhealth: myhealth,
                    familyhealth: familyhealth,
                    // goschool: goschool,
                    shifazhan: shifazhan,
                    zhongzhuanzhan: zhongzhuanzhan,
                    zhongdianzhan: zhongdianzhan,
                    zuihoucheci: zuihoucheci,
                    daodataiguday: daodataiguday,
                    daodataigutime: daodataigutime,
                    daodadidian: daodadidian,
                    fanxiaostyle: fanxiaostyle,

                  },
                  success: res => {
                    db.collection('student').doc(id).get().then(res => {
                      wx.setStorage({
                        key: "student",
                        data: res.data,
                        success(e) {
                          wx.hideLoading()
                          wx.showModal({
                            title: '提示',
                            content: '您的信息保存成功',
                            showCancel: false,
                            success(res) {
                              if (res.confirm) {
                                self.onloading()
                                /* wx.reLaunch({
                                  url: '../../form/form',
                                }) */
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          })
                        }
                      })
                    })
                  },
                  fail: err => {
                    wx.showModal({
                      title: '警告',
                      content: '上传失败，请重新上传',
                      success(res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  },
                  complete: () => {}
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '请填写全部内容',
                })
              }

            } else if (modalres.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        // var daytozdztime = e.detail.value.daytozdztime
        // var daytozdz = e.detail.value.daytozdz
        var jinqigoout = e.detail.value.jinqigoout
        var location = e.detail.value.location
        var myhealth = e.detail.value.myhealth
        var familyhealth = e.detail.value.familyhealth
        // var goschool = e.detail.value.goschool
        var id = self.data.student._id
        var student = self.data.setudent
        if (location != '' && myhealth != '' && familyhealth != '' && jinqigoout != '') {
          wx.showLoading({
            mask: true,
            title: '上传中..',
          })
          wx.cloud.callFunction({
            name: 'up-first',
            data: {
              id: id,

              jinqigoout: jinqigoout,
              location: location,
              myhealth: myhealth,
              familyhealth: familyhealth,

              shifazhan: shifazhan,
              zhongzhuanzhan: zhongzhuanzhan,
              zhongdianzhan: zhongdianzhan,
              zuihoucheci: zuihoucheci,
              daodataiguday: daodataiguday,
              daodataigutime: daodataigutime,
              daodadidian: daodadidian,
              fanxiaostyle: fanxiaostyle,

            },
            success: res => {
              db.collection('student').doc(id).get().then(res => {
                wx.setStorage({
                  key: "student",
                  data: res.data,
                  success(e) {
                    wx.hideLoading()
                    wx.showModal({
                      title: '提示',
                      content: '您的信息保存成功',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          self.onloading()
                          /* wx.reLaunch({
                            url: '../../form/form',
                          }) */
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                })
              })
            },
            fail: err => {
              wx.showModal({
                title: '警告',
                content: '上传失败，请重新上传',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            },
            complete: () => {}
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '请填写全部内容',
          })
        }
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请填写全部内容',
      })
    }
  },
  radioChange(e) {
    this.setData({
      daodadidian: e.detail.value
    })
    console.log(e.detail.value)
  },
  checkboxChange(e) {
    this.setData({
      fanxiaostyle: e.detail.value
    })
    console.log(e.detail.value)
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      daodataiguday: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      daodataigutime: e.detail.value
    })
  },
})