     const db = wx.cloud.database()
const _ = db.command
const dayjs = require('dayjs');
Page({
  data: {
    tiwenday: [],
    usersetting:false,
    tabbarindex: true,
    student: null,
    showModalStatus: false,
    popup: true
  },
  onLoad: function(options) {
    var self=this
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'nowday',
      // 传递给云函数的event参数
      data: {}
    }).then(res => {
      console.log(res.result.time)
      self.setData({
        getfwqday:res.result.time
      }, () => {
        self.getload();
        })
    }).catch(err => {
      
    })
    
  },
  tiwenjisuanday(){
    const date1 = dayjs().format('YYYY-MM-DD')
    var nowtaday = dayjs().format('MMDD')
    const date2 = '2020-05-01'
    var tiwenday = []
    console.log(this.data.student)
    if (nowtaday>'0501') {
      for (var i = 1; i <= 100; i++) {
        var a = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
        var mo = dayjs().subtract(i, 'day').format('MM');
        var da = dayjs().subtract(i, 'day').format('DD');
        var usa = 'ta' + mo + da
        var usb = 'tb' + mo + da
        if(this.data.student[usa]){tiwenday.push({
          a: mo + '月' + da + '日上午',
          b: this.data.student[usa]
        })}
        if(this.data.student[usb]){
          tiwenday.push({
            a: mo + '月' + da + '日下午',
            b: this.data.student[usb]
          })
        }
        /* console.log(tiwenday) */
        if (a == date2) {
          this.setData({
            tiwenday: tiwenday
          })
          break;
        }
      }}
  },
////////////////////////////////////////////////////////////////////////////////
  getload: function(options) {
    var self = this
    var getfwqday=self.data.getfwqday
    wx.getStorage({
      key: 'student',
      success(res) {
        /* if (!res.data.location) {
          wx.redirectTo({
            url: '../first/first'
          })
        } */
        var xueyuan = 'z-RJXY'
        db.collection('z-RJXY').where({
          xueyuan: res.data.xueyuan,
          banji: res.data.banji
        }).count().then(countres => {
          /* console.log(countres.total) */
          if (countres.total > 20) {
            db.collection('z-RJXY').where({
                xueyuan: res.data.xueyuan,
                banji: res.data.banji
              }).skip(countres.total - 20)
              .get({
                success: function(open) {
                  self.setData({
                    //time: dayjs().format('MM-DD HH:mm'),
                    time:getfwqday,
                    myxuehao: res.data.xuehao,
                    totalpeople: 54,
                    xueyuan: xueyuan,
                    student: res.data,
                    tiwen: open.data.reverse(),
                  })
                  self.tiwenjisuanday()
                  wx.hideNavigationBarLoading()
                  wx.stopPullDownRefresh()
                  wx.hideLoading()
                }
              })
          } else {
            db.collection('z-RJXY').where({
              xueyuan: res.data.xueyuan,
              banji: res.data.banji
            }).get({
              success: function(open) {
                self.setData({
                  time: dayjs().format('MM-DD HH:mm'),
                  myxuehao: res.data.xuehao,
                  totalpeople: 54,
                  xueyuan: xueyuan,
                  student: res.data,
                  tiwen: open.data.reverse(),
                })
                self.tiwenjisuanday()
                wx.hideNavigationBarLoading()
                wx.stopPullDownRefresh()
                wx.hideLoading()
              }
            })
          }
        })
      }
    })
  },
  powerDrawer: function(e) {
    this.setData({
      fabuday: this.data.tiwen[e.currentTarget.id].day,
      index: e.currentTarget.id,
      style: this.data.tiwen[e.currentTarget.id].style,
      id: this.data.tiwen[e.currentTarget.id]._id
    })
    this.util()
  },
  util: function() {
    this.setData({
      showModalStatus: true
    });
  },
  closeDrawer(e) {
    this.setData({
      showModalStatus: false
    });
  },


  goto: function() {
    var self = this
    var date1 = dayjs().format('MM')
    var date2 = dayjs().format('DD')
    var time1 = dayjs().format('HH')
    var time2 = dayjs().format('mm')
    var xueyuan = this.data.xueyuan
    var student = this.data.student
    var totalpeople = this.data.totalpeople
    var endtime = dayjs().add(2, 'hour').format('MM-DD HH:mm');
    console.log(endtime)
    if (time1 < 12) {
      var style = '1'
      var title = date1 + '月' + date2 + '日上午健康汇报'
    } else {
      var style = '2'
      var title = date1 + '月' + date2 + '日下午健康汇报'
    }
    wx.showModal({
      title: '发起【' + title + '】',
      content: '统计时间为2小时，到时自动截止',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后...',
          })
          db.collection(xueyuan).add({
            data: {
              day: date1 + date2,
              xueyuan: student.xueyuan,
              style: style,
              totalpeople: totalpeople,
              banji: student.banji,
              title: title,
              starttime: date1 + '-' + date2 + ' ' + time1 + '：' + time2,
              endtime: endtime,
              people: []
            },
            success: function(res) {
              wx.hideLoading()
              self.getload();
            },
            fail: console.error,
            complete: console.log
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  formSubmit: function(e) {
    wx.showLoading({
      mask: true,
      title: '提交中...',
    })
    var fabuday = this.data.fabuday
    if (fabuday.length<2){
      fabuday = dayjs().format('MMDD')
    }
    var self = this
    var style = this.data.style
    var student = this.data.student
    var xueyuan = this.data.xueyuan
    var index = this.data.index
    var tiwen = this.data.tiwen
    var id = this.data.id
    const uptiwen = e.detail.value.uptiwen
    if (uptiwen > 30 && uptiwen < 45) {
      var newpeople = [{
        uptiwen: uptiwen,
        name: student.name,
        xuehao: student.xuehao,
        sheshe: student.sushelou + '-' + student.sushe + '-' + student.chuang,
        tell: student.tell
      }]
      tiwen[index].people.push({
        uptiwen: uptiwen,
        name: student.name,
        xuehao: student.xuehao,
        sheshe: student.sushelou + '-' + student.sushe + '-' + student.chuang,
        tell: student.tell
      })
      console.log(tiwen)
      wx.getStorage({
        key: 'student',
        success(res) {
          console.log(res.data)
          if (style == '1') {
            var x = 'ta' + fabuday
            var ys = {
              nianji: res.data.nianji,
              banji: res.data.banji,
              xueyuanC: res.data.xueyuanC,
              xueyuan: res.data.xueyuan,
              day: dayjs().format('MMDD'),
              time1: dayjs().format('HH:mm'),
              endtiwen: uptiwen,
              endtime: dayjs().format('HH:mm'),
              uptiwen: uptiwen,
              style: true,
              uptiwen2: '',
              style2: false,
              name: res.data.name,
              xuehao: res.data.xuehao,
              sheshe: res.data.sushelou + '-' + res.data.sushe + '-' + res.data.chuang,
              tell: res.data.tell
            }
          } else {
            var x = 'tb' + fabuday
            var ys = {
              nianji: res.data.nianji,
              banji: res.data.banji,
              xueyuanC: res.data.xueyuanC,
              xueyuan: res.data.xueyuan,
              day: dayjs().format('MMDD'),
              time2: dayjs().format('HH:mm'),
              endtiwen: uptiwen,
              endtime: dayjs().format('HH:mm'),
              uptiwen2: uptiwen,
              style2: true,
              uptiwen: '',
              style: false,
              name: res.data.name,
              xuehao: res.data.xuehao,
              sheshe: res.data.sushelou + '-' + res.data.sushe + '-' + res.data.chuang,
              tell: res.data.tell
            }
          }
          
          
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'stuednt-uptiwen',
            // 传递给云函数的event参数
            data: {
              myid: res.data._id,
              x: x,
              id: id,
              newpeople: newpeople,
              ys: ys,
              uptiwen: uptiwen,
            }
          }).then(res => {
            self.setData({
              tiwen: tiwen,
              showModalStatus: false
            });
            wx.hideLoading()
            wx.showToast({
              mask: true,
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }).catch(err => {

          })
        }
      })
    } else {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '请输入正确体温',
      })
    }
  },

  remove(e) {
    var index = e.currentTarget.id
    var id = this.data.tiwen[e.currentTarget.id]._id
    var title = this.data.tiwen[e.currentTarget.id].title
    var xiangqin = this.data.tiwen[e.currentTarget.id]
    var xueyuan = this.data.xueyuan
    var self = this
    self.setData({
      showModalStatus: false
    })
    wx.showModal({
      title: '提示',
      content: '确定删除' + title + '的记录？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: '删除中...',
          })
          console.log(e)
          wx.cloud.callFunction({
            name: 'tiwen-remove',
            data: {
              xiangqin: xiangqin,
              xueyuan: xueyuan,
              id: id
            },
            success: res => {
              self.setData({
                showModalStatus: false
              })
              self.getload();
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  myclass: function(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../infoC/infoC?id=' + e.currentTarget.id,
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.getload();
  },
  showPopup() {
    this.setData({
      popup: false
    });
  },
  hidePopup(flag = true) {
    this.setData({
      "popup": flag
    });
  },
  tabbartrue() {
    this.setData({
      tabbarindex: true
    })
  },
  tabbarfalse() {
    this.setData({
      tabbarindex: false
    })
  },
  setting(e){
    this.setData({
      usersetting:!this.data.usersetting
    })
  },
  setusermima(e){
    wx.navigateTo({
      url: 'user-seting-mima/user-seting-mima',
    })
  },
  userifgoschool(e) {
    wx.navigateTo({
      url: 'user-get/user-get',
    })
  },
  lookuserifgoschool(e) {
    /* wx.showToast({
      icon:'none',
      title: '请等待功能开通',
    }) */
    wx.navigateTo({
      url: 'look-user-get/look-user-get',
    })
  },
  pizhunuserifgoschool(e) {
    wx.navigateTo({
      url: 'pizhunuserifgoschool/pizhunuserifgoschool',
    })
  },

})