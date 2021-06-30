const db = wx.cloud.database()
const _ = db.command
const dayjs = require('dayjs');
Page({

  data: {
    dataxueyuan: ['nxy', 'dwkjxy', 'lxy', 'yyxy', 'zyhjxy', 'gxy', 'jjglxy', 'spkxygcxy', 'wlxy', 'smkxxy', 'ggglxy', 'mapjyzx', 'xxkxygcxy', 'rjxy', 'cxjsxy', 'tyxy', 'mkszyxy', 'sxzzlljxyjb', 'zbxy', 'dwyxy', 'cykxy'],
    sum: 0,
    nxy: 0,
    dwkjxy: 0,
    lxy: 0,
    yyxy: 0,
    zyhjxy: 0,
    gxy: 0,
    jjglxy: 0,
    spkxygcxy: 0,
    wlxy: 0,
    smkxxy: 0,
    ggglxy: 0,
    mapjyzx: 0,
    xxkxygcxy: 0,
    rjxy: 0,
    cxjsxy: 0,
    tyxy: 0,
    mkszyxy: 0,
    sxzzlljxyjb: 0,

    zbxy: 0,
    dwyxy: 0,
    cykxy: 0,

    text: "点击彩色方块可查看各学院异常学生名录，点击表单下载链接即可下载异常学生名录",
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 40 // 时间间隔
  },


  onLoad: function(options) {
    wx.showLoading({
      mask: true,
      title: '获取数据中...',
    })
    var self = this
    db.collection('TJ').doc('dDHECVF2k4f0waMgGrNyWMLxorabrcQ9O9fNF0J0QMw1s8sn').get().then(res => {
      db.collection('YS').where({
        day: dayjs().format('MMDD')
      }).count().then(rees => {
        var a = 'ta' + dayjs().format('MMDD')
        var b = 'tb' + dayjs().format('MMDD')
        db.collection('student').where({
          [a]: _.exists(true),
          /* nianji: self.data.nianji, */
          /* xueyuan: self.data.xueyuan, */
        }).count().then(resa => {
          db.collection('student').where({
            [b]: _.exists(true),
            /* nianji: self.data.nianji, */
            /* xueyuan: self.data.xueyuan, */
          }).count().then(resb => {
            self.setData({
              todaypeople: rees.total,
              total: res.data,
              tapeople: resa.total,
              tbpeople: resb.total,
            })
            self.totalceliangpeople()
            wx.hideLoading()
          })
        })
      })
    })
  },
  totalceliangpeople(e) {
    var self = this
    var dataxueyuan = this.data.dataxueyuan
    var a = 'ta' + dayjs().format('MMDD')
    var b = 'tb' + dayjs().format('MMDD')
    dataxueyuan.forEach(function (item, index) {
      db.collection('student').where({
        name: _.exists(true),
        [a]: _.exists(true),
        xueyuan: item, 
      }).count().then(resa => {
        db.collection('student').where({
          name: _.exists(true),
          [b]: _.exists(true),
          xueyuan: item, 
        }).count().then(resb => {
            db.collection('student').where({
              name: _.exists(true),
              [a]: _.exists(false),
              xueyuan: item,
            }).count().then(noresa => {
              db.collection('student').where({
                name: _.exists(true),
                [b]: _.exists(false),
                xueyuan: item,
              }).count().then(noresb => {
                self.setData({
                  [item + 'tapeople']: resa.total,
                  [item + 'tbpeople']: resb.total,
                  [item + 'notapeople']: noresa.total,
                  [item + 'notbpeople']: noresb.total,
                })
                wx.hideLoading()
              })
            })
        })
      })
    })
  },
  golook(e) {
    wx.setStorage({
      key: "student",
      data: {
        xueyuan: e.currentTarget.id,
        QX: '2'
      },
      success(e) {
        wx.navigateTo({
          url: '../infoA/infoA',
        })
      }
    })
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
  getget(e) {
    wx.showLoading({
      title: '导出中...',
    })
    var self = this
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'get',
      // 传递给云函数的event参数
      data: {
        jihe: 'YS',
        where: {
          day: dayjs().format('MMDD'),
        }
      }
    }).then(res => {
      self.savaExcel(res.result.data)
    }).catch(err => {

    })
  },
  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(userdata) {
    let that = this
    wx.cloud.callFunction({
      name: "Excel",
      data: {
        name: dayjs().format('MMDD') + '异常人数汇总',
        userdata: userdata
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
        console.log("保存失败", res)
      }
    })
  },
  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
        wx.hideLoading()
        wx.showToast({
          title: '导出成功',
        })
      },
      fail: err => {
        wx.hideLoading()
        self.setData({
          temp: res.fileList[0].tempFileURL
        })
      }
    })
  },
  fuzhi(e) {
    var self = this
    wx.setClipboardData({
      data: self.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()

    //统计数据
    var self = this
    var sum = 0
    var dataxueyuan = this.data.dataxueyuan
    var day = dayjs().format('MMDD')
    dataxueyuan.forEach(function(item, index) {
      console.log(item)
      db.collection('YS').where({
        day: day,
        xueyuan: item
      }).count().then(res => {
        sum += res.total
        self.setData({
          sum: sum,
          [item]: res.total
        })
      })
    })
    //上传数据
    setTimeout(function () {
      wx.cloud.callFunction({
        name: 'up-todady',
        data: {
          time: dayjs().format('MM-DD HH:mm'),
          sum: self.data.sum,
          nxy: self.data.nxy,
          dwkjxy: self.data.dwkjxy,
          lxy: self.data.lxy,
          yyxy: self.data.yyxy,
          zyhjxy: self.data.zyhjxy,
          gxy: self.data.gxy,
          jjglxy: self.data.jjglxy,
          spkxygcxy: self.data.spkxygcxy,
          wlxy: self.data.wlxy,
          smkxxy: self.data.smkxxy,
          ggglxy: self.data.ggglxy,
          mapjyzx: self.data.mapjyzx,
          xxkxygcxy: self.data.xxkxygcxy,
          rjxy: self.data.rjxy,
          cxjsxy: self.data.cxjsxy,
          tyxy: self.data.tyxy,
          mkszyxy: self.data.mkszyxy,
          sxzzlljxyjb: self.data.sxzzlljxyjb,
          zbxy: self.data.zbxy,
          dwyxy: self.data.dwyxy,
          cykxy: self.data.cykxy,
        },
        success: res => {
          db.collection('TJ').doc('dDHECVF2k4f0waMgGrNyWMLxorabrcQ9O9fNF0J0QMw1s8sn').get().then(restj => {
            db.collection('YS').where({
              day: dayjs().format('MMDD')
            }).count().then(rees => {
              self.setData({
                fileUrl:'',
                todaypeople: rees.total,
                total: restj.data
              })
              self.totalceliangpeople()
              wx.hideNavigationBarLoading()
              wx.stopPullDownRefresh()
            })
          })
        },
        fail: err => { },
        complete: () => { }
      })
    }, 1000)
  },
});