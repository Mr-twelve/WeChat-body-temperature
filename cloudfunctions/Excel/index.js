const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event)
  try {
    let {
      userdata
    } = event
    console.log('123')
    //1,定义excel表格名
    let dataCVS = event.name + '.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['日期', '学院', '班级', '学号', '姓名', '宿舍', '体温', '电话', '上传时间', ];
    alldata.push(row);
    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].day);
      arr.push(userdata[key].xueyuanC);
      arr.push(userdata[key].banji);
      arr.push(userdata[key].xuehao);
      arr.push(userdata[key].name);
      arr.push(userdata[key].sheshe);
      arr.push(userdata[key].endtiwen);
      arr.push(userdata[key].tell);
      arr.push(userdata[key].endtime);


      alldata.push(arr)
    }
    console.log(alldata)
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }
}