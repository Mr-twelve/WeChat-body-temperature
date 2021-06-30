const db = wx.cloud.database()
Page({
  data: {
    tiaokuan: false
  },
 /*  onShow(e) {
    var self = this
    wx.showLoading({
      title: '请稍后...',
    })


    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log('onCheckForUpdate====', res)
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        console.log('res.hasUpdate====')
        updateManager.onUpdateReady(function () {
          wx.hideLoading()
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，将重启更新应用',
            success: function (res) {
              console.log('success====', res)
              // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              } else {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          })
        })
      } else {
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            self.setData({
              openid: res.result.openid
            })
            db.collection('student').where({
              _openid: res.result.openid
            }).get({
              success: function (take) {
                if (take.data.length != 0) {
                  wx.setStorage({
                    key: "student",
                    data: take.data[0],
                    success(e) {
                      switch (take.data[0].QX) {
                        case "0":
                          wx.navigateTo({
                            url: '../form/form',
                          })
                          break;
                        case "9":
                          wx.navigateTo({
                            url: '../form/form',
                          })
                          break;
                        case "1":
                          wx.navigateTo({
                            url: '../infoA/infoA',
                          })
                          break;
                        case "2":
                          wx.navigateTo({
                            url: '../detail/detail',
                          })
                          break;
                        default:
                          wx.navigateTo({
                            url: '../infoAX/infoAX',
                          })
                          break;
                      }
                      wx.hideLoading()
                    }
                  })
                } else {
                  wx.hideLoading()
                }
              }
            })
          },
        })
      }
    })
  }, */
  radioChange(e) {
    if (e.detail.value[0] == 'tiaokuan') {
      this.setData({
        tiaokuan: true
      })
    } else {
      this.setData({
        tiaokuan: false
      })
    }
  },
  formSubmit: function (e) {
    var openid = this.data.openid
    console.log(e.detail.value)
    if (e.detail.value.xuehao.length != 0) {
      if (e.detail.value.mima.length != 0) {
        if (this.data.tiaokuan) {
          wx.showLoading({
            title: '登陆中...',
          })
          db.collection('student').where({
            xuehao: e.detail.value.xuehao,
            mima: e.detail.value.mima
          }).get({
            success: function (take) {
              console.log(take)
              if (take.data.length != 0) {
                wx.cloud.callFunction({
                  // 要调用的云函数名称
                  name: 'addopenid',
                  // 传递给云函数的参数
                  data: {
                    id: take.data[0]._id,
                    openid: openid
                  },
                  success: res => {
                    wx.setStorage({
                      key: "student",
                      data: take.data[0],
                      success(e) {
                        wx.hideLoading()
                        switch (take.data[0].QX) {
                          case "0":
                            wx.navigateTo({
                              url: '../form/form',
                            })
                            break;
                          case "9":
                            wx.navigateTo({
                              url: '../form/form',
                            })
                            break;
                          case "1":
                            wx.navigateTo({
                              url: '../infoA/infoA',
                            })
                            break;
                          case "2":
                            wx.navigateTo({
                              url: '../detail/detail',
                            })
                            break;
                          case "13":
                          case "14":
                          case "15":
                          case "16":
                          case "17":
                          case "18":
                          case "19":
                            wx.navigateTo({
                              url: '../infoAX/infoAX',
                            })
                            break;
                        }
                      }
                    })
                  },
                })

              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '请检查学号与密码',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '请阅读并同意《相关条款》',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '请输入密码',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确学号',
        icon: 'none'
      })
    }

  },
  gotoA: function () {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },

  gotoB: function () {
    wx.navigateTo({
      url: '../infoA/infoA',
    })
  },

  gotoC: function () {
    wx.navigateTo({
      url: '../form/form',
    })
  },

  tiaokuan: function () {
    wx.navigateTo({
      url: '../tiaokuan/tiaokuan',
    })
  }


});