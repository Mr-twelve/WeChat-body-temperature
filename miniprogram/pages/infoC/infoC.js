const db = wx.cloud.database()
const _ = db.command
const dayjs = require('dayjs');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: "隔离病毒，但绝不隔离爱",
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20 // 时间间隔
  },
  onShow: function() {
    var that = this;
    var length = that.data.text.length * that.data.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt(); // 第一个字消失后立即从右边出现
  },

  scrolltxt: function() {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function() {
        var maxscrollwidth = length + that.data.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        } else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    } else {
      that.setData({
        marquee_margin: "1000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      optionsid: options
    })
    this.getonload(options)
  },
  getonload: function(options) {
    console.log(options.id)
    var self = this
    const db = wx.cloud.database()
    db.collection('z-RJXY').doc(options.id).get().then(res => {
      db.collection('banji').where({
        banji: res.data.banji,
        xueyuan: res.data.xueyuan
      }).get().then(getbanjipeople => {
        if (getbanjipeople.data.length == 0) {
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'get-field',
            // 传递给云函数的event参数
            data: {
              jihe: 'student',
              where: {
                banji: res.data.banji,
                xueyuan: res.data.xueyuan
              }
            }
          }).then(getstudent => {
            db.collection('banji').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  banji: res.data.banji,
                  xueyuan: res.data.xueyuan,
                  people: getstudent.result.data
                }
              })
              .then(resss => {
                self.setData({
                  people: getstudent.result.data,
                  student: res.data
                })
                console.log(res)
              })
              .catch(console.error)
          }).catch(err => {

          })
        } else {
          self.setData({
            people: getbanjipeople.data[0].people,
            student: res.data
          })
        }
      })
      console.log(res.data)
    })
  },
  upthistiwen: function(e) {
    var self = this
    wx.getStorage({
      key: 'student',
      success(res) {
        self.setData({
          myxinxi: res.data
        })
        console.log(res.data)
      }
    })
    var people = this.data.people
    var title = this.data.student.title
    var day = title.charAt(0) + title.charAt(1) + title.charAt(3) + title.charAt(4)
    if (title.charAt(6) == '上') {
      var style = 'ta' + day
    } else {
      var style = 'tb' + day
    }
    var xuehao = people[e.currentTarget.id].xuehao
    var name = people[e.currentTarget.id].name
    var chuang = people[e.currentTarget.id].chuang
    var sushe = people[e.currentTarget.id].sushe
    var sushelou = people[e.currentTarget.id].sushelou
    /* var tell = people[e.currentTarget.id].tell
    var oversushe = sushelou + '-' + sushe + '-' + chuang */
    var tell = ' '
    var oversushe = ' '
    console.log(name)
    console.log(xuehao)
    self.setData({
      tell: tell,
      oversushe: oversushe,
      index: e.currentTarget.id,
      style: style,
      xuehao: xuehao,
      name: name,
      showModal: true
    })
  },
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  formSubmit(e) {
    var self = this
    var myxinxi = this.data.myxinxi
    var index = this.data.index
    var style = this.data.style
    var xuehao = this.data.xuehao
    var name = this.data.name
    var id = this.data.student._id
    console.log(id)
    var tell = this.data.tell
    var oversushe = this.data.oversushe
    var xiuzhengtiwen = e.detail.value.xiuzhengtiwen
    var newpeople = [{
      tell: tell,
      sheshe: oversushe,
      uptiwen: xiuzhengtiwen,
      name: name,
      xuehao: xuehao,
    }]
    if (xiuzhengtiwen > 35 && xiuzhengtiwen < 45) {
      wx.showLoading({
        mask: true,
        title: '更改中...',
      })
      self.setData({
        showModal: false
      });
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'xiuzheng-tiwen',
        // 传递给云函数的event参数
        data: {
          where: {
            xuehao: xuehao,
            name: name,
          },
          updata: {
            [style]: xiuzhengtiwen
          }
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: 'tiwen-add',
          data: {
            xueyuan: 'z-RJXY',
            id: id,
            newpeople: newpeople
          },
          success: res => {
            if (xiuzhengtiwen > 37.3 && self.data.student.style == '1') {
              db.collection('YS').add({
                  // data 字段表示需新增的 JSON 数据
                  data: {
                    tell: tell,
                    oversushe: oversushe,
                    nianji: myxinxi.nianji,
                    banji: myxinxi.banji,
                    xueyuanC: myxinxi.xueyuanC,
                    xueyuan: myxinxi.xueyuan,
                    day: dayjs().format('MMDD'),
                    time1: dayjs().format('HH:mm'),
                    endtiwen: xiuzhengtiwen,
                    endtime: dayjs().format('HH:mm'),
                    uptiwen: xiuzhengtiwen,
                    style: true,
                    uptiwen2: '',
                    style2: false,
                    name: name,
                    xuehao: xuehao,
                  }
                })
                .then(res => {
                  self.setData({
                    showModal: false,
                  })
                  self.getonload(self.data.optionsid)
                  wx.hideLoading()
                })
                .catch(console.error)
            } else if (xiuzhengtiwen > 37.3 && self.data.student.style == '2') {
              db.collection('YS').add({
                  // data 字段表示需新增的 JSON 数据
                  data: {
                    tell: tell,
                    oversushe: oversushe,
                    nianji: myxinxi.nianji,
                    banji: myxinxi.banji,
                    xueyuanC: myxinxi.xueyuanC,
                    xueyuan: myxinxi.xueyuan,
                    day: dayjs().format('MMDD'),
                    time1: dayjs().format('HH:mm'),
                    endtiwen: xiuzhengtiwen,
                    endtime: dayjs().format('HH:mm'),
                    uptiwen: xiuzhengtiwen,
                    style: true,
                    uptiwen2: '',
                    style2: false,
                    name: name,
                    xuehao: xuehao,
                  }
                })
                .then(res => {
                  self.setData({
                    showModal: false,
                  })
                  self.getonload(self.data.optionsid)
                  wx.hideLoading()
                })
                .catch(console.error)
            } else {
              self.setData({
                showModal: false,
              })
              self.getonload(self.data.optionsid)
              wx.hideLoading()
            }
          }
        })
      }).catch(err => {

      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入正确体温',
      })
    }
  }

})