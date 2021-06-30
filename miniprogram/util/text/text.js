const dayjs = require('dayjs');
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xuehao: [
      "20170100209",
      "20170101329",
      "20170100317",
      "20170100621",
      "20170100910",
      "20170101202",
      "20170302733",
      "20170302802",
      "20170303518",
      "20170403837",
      "20170403748",
      "20170404322",
      "20170807423",
      "20170707114",
      "20170707218",
      "20170706510",
      "20170908202",
      "20170908218",
      "20171310809",
      "20171310605",
      "20171311042",
      "20151310526",
      "20171008718",
      "20171008703",
      "20171008827",
      "20171209723",
      "20171209711",
      "20171209708",
      "20171209726",
      "20171209719",
      "20171209634",
      "20171209644",
      "20171209629",
      "20171209628",
      "20171209833",
      "20171209810",
      "20171209830",
      "20171209837",
      "20171209811",
      "20171209835",
      "20171209808",
      "20171209915",
      "20171209916",
      "20171209902",
      "20171209910",
      "20171209913",
      "20171209926",
      "20171209925",
      "20171210008",
      "20171210027",
      "20171210004",
      "20171210012",
      "20171210032",
      "20171210006",
      "20171210144",
      "20171210128",
      "20171210143",
      "20171210126",
      "20171713117",

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    /*  db.collection('banji').aggregate()
       .match({
         xueyuan: 'yyxy'
       })
       .project({
         banji: 1
       })
       .sort({
         xueyuan: -1,
       })
       .limit(9999)
       .end({
         success: function (math) {
           console.log(math)
         }
       }) */

    const date1 = dayjs().format('YYYY-MM-DD')
    var nowtaday = '0725'
    const date2 = '2020-07-25'
    var tiwenday = []
    if (nowtaday > '0320') {
      for (var i = 1; i <= 100; i++) {
        var a = dayjs().add(25, 'day').subtract(i, 'day').format('YYYY-MM-DD');
        var mo = dayjs().add(25, 'day').subtract(i, 'day').format('MM');
        var da = dayjs().add(25, 'day').subtract(i, 'day').format('DD');
        var usa = 'ta' + mo + da
        var usb = 'tb' + mo + da
        tiwenday.push( 'arr.push(userdata[key].'+usa+');')
        tiwenday.push( 'arr.push(userdata[key].'+usb+');')
       /*  tiwenday.push( mo + '月' + da + '日上午')
        tiwenday.push( mo + '月' + da + '日下午') */
        console.log(tiwenday)
        if (a == date2) {
          break;
        }
      }
    }
  },

  chaxunrs(e) {
    console.log(e)
    var self = this
    var id0 = []
    var id1 = []
    db.collection('student').aggregate()

      .project({
        aStrIndex: $.indexOfBytes(['$banji', '返校'])
      })
      /* .group({
        _id: '$aStrIndex',
        num: $.sum(1)
      }) */
      .limit(99999)
      .end({
        success: function (math) {
          console.log(math)
          math.list.forEach(function (item, index) {

            if (item.aStrIndex == 9) {
              console.log(item)
            }

          })
        }
      })
  },
  formSubmit(e) {
    wx.showLoading({
      title: '导出中...',
    })
    var self = this
    self.setData({
      xueyuanC: e.detail.value.inputxueyuan
    })

    console.log(e.detail.value.inputxueyuan)
    wx.cloud.callFunction({
      name: "get-field-div",
      data: {
        jihe: 'student',
        /* inputxueyuan: e.detail.value.inputxueyuan, */
        divfield: {
          xueyuanC: true,
          xuehao: true,
          name: true,
          banji: true,
          sushelou: true,
          sushe: true,
          chuang: true,
          location: true,
          goschool: true,
          daytozdz: true,
          daytozdztime: true,
          tell: true,
          myhealth: true,
          familyhealth: true,
          jinqigoout: true,

          ta0413: true,
          tb0413: true,
          ta0412: true,
          tb0412: true,
          ta0411: true,
          tb0411: true,
          ta0410: true,
          tb0410: true,
          ta0409: true,
          tb0409: true,
          ta0408: true,
          tb0408: true,
          ta0407: true,
          tb0407: true,
          ta0406: true,
          tb0406: true,
          ta0405: true,
          tb0405: true,
          ta0404: true,
          tb0404: true,
          ta0403: true,
          tb0403: true,
          ta0402: true,
          tb0402: true,
          ta0401: true,
          tb0401: true,
          ta0331: true,
          tb0331: true,
          ta0330: true,
          tb0330: true,
          ta0329: true,
          tb0329: true,
          ta0328: true,
          tb0328: true,
          ta0327: true,
          tb0327: true,
          ta0326: true,
          tb0326: true,
          /*  ta0325: true,
           tb0325: true,
           ta0324: true,
           tb0324: true,
           ta0323: true,
           tb0323: true,
           ta0322: true,
           tb0322: true,
           ta0321: true,
           tb0321: true,
           ta0320: true,
           tb0320: true,  */
        }
      },
      success(res) {
        console.log("保存成功", res)
        self.savaExcel(res.result.data)
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
  savaExcel(userdata) {
    let that = this
    console.log(userdata)
    wx.cloud.callFunction({
      name: "Excel-tunxin-new",
      data: {
        name: that.data.xueyuanC + new Date().getDay() + new Date().getHours() + new Date().getMinutes(),
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
  },

  // ------------审核通过
  formSubmittongguo(e) {
    wx.showLoading({
      title: '导出中...',
    })
    var self = this
    self.setData({
      xueyuanC: e.detail.value.inputxueyuan
    })

    console.log(e.detail.value.inputxueyuan)
    wx.cloud.callFunction({
      name: "get-field-div-two",
      data: {
        jihe: 'student',
        inputxueyuan: e.detail.value.inputxueyuan,
        divfield: {
          xueyuanC: true,
          xuehao: true,
          name: true,
          banji: true,
          sushelou: true,
          sushe: true,
          chuang: true,
          location: true,
          goschool: true,
          daytozdz: true,
          daytozdztime: true,
          tell: true,
          myhealth: true,
          familyhealth: true,
          jinqigoout: true,
        }
      },
      success(res) {
        console.log("保存成功", res)
        self.savaExcel2(res.result.data)
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
  savaExcel2(userdata) {
    let that = this
    console.log(userdata)
    wx.cloud.callFunction({
      name: "Excel-tunxin-new",
      data: {
        name: that.data.xueyuanC + new Date().getDay() + new Date().getHours() + new Date().getMinutes(),
        userdata: userdata
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl2(res.result.fileID)
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
  getFileUrl2(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl2: res.fileList[0].tempFileURL
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
  fuzhi2(e) {
    var self = this
    wx.setClipboardData({
      data: self.data.fileUrl2,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },

  // ------------
  gengaibanji(e) {
    var self = this
    var xuehao = this.data.xuehao

    xuehao.forEach(function (item, index) {
      console.log('[' + index + ']' + item)
      const db = wx.cloud.database()
      db.collection('student').where({
        xuehao: item
      }).get().then(res => {
        console.log(res.data[0].banji)
        console.log(res.data[0]._id)
        wx.cloud.callFunction({
          name: 'fanxiaobanjigengai',
          data: {
            id: res.data[0]._id,
            banji: '返校' + res.data[0].banji
          }
        }).then(res => {
          console.log(res)
          console.log('[' + index + ']' + item + '!!!!!')
        }).catch(err => {

        })
      })
    })
  },
  jiaoyan(e) {
    var self = this
    var xuehao = this.data.xuehao

    xuehao.forEach(function (item, index) {
      console.log('[' + index + ']' + item)
      const db = wx.cloud.database()
      db.collection('student').where({
        xuehao: item,
        fanxiaobiaojiSSS: _.exists(false),
      }).get().then(res => {
        if (res.data.length != 0) {
          console.log(res.data[0].banji)
          console.log(res.data[0]._id)
          wx.cloud.callFunction({
            name: 'fanxiaobanjigengai',
            data: {
              id: res.data[0]._id,
              banji: '返校' + res.data[0].banji
            }
          }).then(res => {
            console.log(res)
            console.log('[' + index + ']' + item + '!!!!!')
          }).catch(err => {

          })
        } else {}
      })
    })
  },
  removeyunhanshu(e) {
    wx.cloud.callFunction({
      name: 'REMOVE',
      data: {
        jihe: 'YS'
      }
    }).then(res => {
      console.log(res)

    }).catch(err => {
      console.log(err)
    })
  }
})