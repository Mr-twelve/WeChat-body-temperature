
Page({

  data: {
    lookindex:0
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
  savaExcel(userdata) {
    wx.showLoading({
      title: '导出中...',
    })
    let that = this
    var userdata=that.data.getstudent
    console.log(userdata)
    wx.cloud.callFunction({
      name: "Excel-tunxin-new",
      data: {
        name: that.data.xueyuanC+that.data.banji,
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

})