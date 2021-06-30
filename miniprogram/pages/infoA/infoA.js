const db = wx.cloud.database()
const _ = db.command
const dayjs = require('dayjs');
Page({

  data: {
    text: "点击彩色方块可查看异常学生名录，点击表单下载链接可下载当日异常学生名录",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 16,
    interval: 40 // 时间间隔
  },
  onShow: function () {
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },

  onLoad: function(options) {
    var self = this
    wx.showLoading({
      mask: true,
      title: '获取数据中...',
    })
    wx.getStorage({
      key: 'student',
      success(res) {
        db.collection('YS').where({
          xueyuan: res.data.xueyuan,
        }).count().then(rxEs => {
          db.collection('YS').where({
            day: dayjs().format('MMDD'),
            xueyuan: res.data.xueyuan,
          }).count().then(reEs => {
            db.collection('TJ').where({
              xueyuan: res.data.xueyuan,
              QX: '1'
            }).get().then(resS => {
              self.setData({
                totalpeople: rxEs.total,   //总人数
                time1: dayjs().format('MM'),
                time2: dayjs().format('DD'),
                date: dayjs().format('MMDD'),
                todaypeople: reEs.total,   //今日人数
                xueyuan: res.data.xueyuan,
                lsjl: resS.data[0].lstj.reverse()
              })
              wx.hideLoading()
            })
          })})
      }
    })
  },
  golook(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../infoB/infoB?day=' + e.currentTarget.id + '&&xueyuan=' + this.data.xueyuan,
    })
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
          xueyuan: self.data.xueyuan,
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
        name: that.data.xueyuan+'历史异常人数汇总',
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
        that.setData({
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
  }


})