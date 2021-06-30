const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
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
    //let row = ['学院', '学号', '姓名', '班级', '楼号', '宿舍', '床位', '家庭住址', "拟乘坐交通工具或返校车次", "拟到达车站", "拟到达时间", '本人联系电话', '本人健康', '家人健康', '近期出行', "04月13日上午", "04月13日下午", "04月12日上午", "04月12日下午", "04月11日上午", "04月11日下午", "04月10日上午", "04月10日下午", "04月09日上午", "04月09日下午", "04月08日上午", "04月08日下午", "04月07日上午", "04月07日下午", "04月06日上午", "04月06日下午", "04月05日上午", "04月05日下午", "04月04日上午", "04月04日下午", "04月03日上午", "04月03日下午", "04月02日上午", "04月02日下午", "04月01日上午", "04月01日下午", "03月31日上午", "03月31日下午", "03月30日上午", "03月30日下午", "03月29日上午", "03月29日下午", "03月28日上午", "03月28日下午", "03月27日上午", "03月27日下午", "03月26日上午", "03月26日下午", "03月25日上午", "03月25日下午", "03月24日上午", "03月24日下午", "03月23日上午", "03月23日下午", "03月22日上午", "03月22日下午", "03月21日上午", "03月21日下午", "03月20日上午", "03月20日下午", ];
    //let row = ['学院', '学号', '姓名', '班级', '楼号', '宿舍', '床位', '家庭住址', "拟乘坐交通工具或返校车次", "拟到达车站", "拟到达时间", '本人联系电话', '本人健康', '家人健康', '近期出行'];
    let row = ['学院', '学号', '姓名', '班级', '楼号', '宿舍', '床位', '本人联系电话',
      '现居住地址', '本人健康', '家人健康', '近期出行', '返校方式', '出发站', '中转站',
      '终点站', '返校最后一程车次', '到达太谷日期', '到达太谷时间', '到达地点到达地点',

      "08月20日上午",
      "08月20日下午",
      "08月19日上午",
      "08月19日下午",
      "08月18日上午",
      "08月18日下午",
      "08月17日上午",
      "08月17日下午",
      "08月16日上午",
      "08月16日下午",
      "08月15日上午",
      "08月15日下午",
      "08月14日上午",
      "08月14日下午",
      "08月13日上午",
      "08月13日下午",
      "08月12日上午",
      "08月12日下午",
      "08月11日上午",
      "08月11日下午",
      "08月10日上午",
      "08月10日下午",
      "08月09日上午",
      "08月09日下午",
      "08月08日上午",
      "08月08日下午",
      "08月07日上午",
      "08月07日下午",
      "08月06日上午",
      "08月06日下午",
      "08月05日上午",
      "08月05日下午",
      "08月04日上午",
      "08月04日下午",
      "08月03日上午",
      "08月03日下午",
      "08月02日上午",
      "08月02日下午",
      "08月01日上午",
      "08月01日下午",
      "07月31日上午",
      "07月31日下午",
      "07月30日上午",
      "07月30日下午",
      "07月29日上午",
      "07月29日下午",
      "07月28日上午",
      "07月28日下午",
      "07月27日上午",
      "07月27日下午",
      "07月26日上午",
      "07月26日下午",
      "07月25日上午",
      "07月25日下午",

    ];
    alldata.push(row);
    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].xueyuanC);
      arr.push(userdata[key].xuehao);
      arr.push(userdata[key].name);
      arr.push(userdata[key].banji);

      arr.push(userdata[key].sushelou);
      arr.push(userdata[key].sushe);
      arr.push(userdata[key].chuang);

      arr.push(userdata[key].tell);
      arr.push(userdata[key].location);
      /* arr.push(userdata[key].goschool);
      arr.push(userdata[key].daytozdz);
      arr.push(userdata[key].daytozdztime); */
      arr.push(userdata[key].myhealth);
      arr.push(userdata[key].familyhealth);
      arr.push(userdata[key].jinqigoout);

      arr.push(userdata[key].fanxiaostyle);
      arr.push(userdata[key].shifazhan);
      arr.push(userdata[key].zhongzhuanzhan);
      arr.push(userdata[key].zhongdianzhan);
      arr.push(userdata[key].zuihoucheci);
      arr.push(userdata[key].daodataiguday);
      arr.push(userdata[key].daodataigutime);
      arr.push(userdata[key].daodadidian);

      arr.push(userdata[key].ta0820);
      arr.push(userdata[key].tb0820);
      arr.push(userdata[key].ta0819);
      arr.push(userdata[key].tb0819);
      arr.push(userdata[key].ta0818);
      arr.push(userdata[key].tb0818);
      arr.push(userdata[key].ta0817);
      arr.push(userdata[key].tb0817);
      arr.push(userdata[key].ta0816);
      arr.push(userdata[key].tb0816);
      arr.push(userdata[key].ta0815);
      arr.push(userdata[key].tb0815);
      arr.push(userdata[key].ta0814);
      arr.push(userdata[key].tb0814);
      arr.push(userdata[key].ta0813);
      arr.push(userdata[key].tb0813);
      arr.push(userdata[key].ta0812);
      arr.push(userdata[key].tb0812);
      arr.push(userdata[key].ta0811);
      arr.push(userdata[key].tb0811);
      arr.push(userdata[key].ta0810);
      arr.push(userdata[key].tb0810);
      arr.push(userdata[key].ta0809);
      arr.push(userdata[key].tb0809);
      arr.push(userdata[key].ta0808);
      arr.push(userdata[key].tb0808);
      arr.push(userdata[key].ta0807);
      arr.push(userdata[key].tb0807);
      arr.push(userdata[key].ta0806);
      arr.push(userdata[key].tb0806);
      arr.push(userdata[key].ta0805);
      arr.push(userdata[key].tb0805);
      arr.push(userdata[key].ta0804);
      arr.push(userdata[key].tb0804);
      arr.push(userdata[key].ta0803);
      arr.push(userdata[key].tb0803);
      arr.push(userdata[key].ta0802);
      arr.push(userdata[key].tb0802);
      arr.push(userdata[key].ta0801);
      arr.push(userdata[key].tb0801);
      arr.push(userdata[key].ta0731);
      arr.push(userdata[key].tb0731);
      arr.push(userdata[key].ta0730);
      arr.push(userdata[key].tb0730);
      arr.push(userdata[key].ta0729);
      arr.push(userdata[key].tb0729);
      arr.push(userdata[key].ta0728);
      arr.push(userdata[key].tb0728);
      arr.push(userdata[key].ta0727);
      arr.push(userdata[key].tb0727);
      arr.push(userdata[key].ta0726);
      arr.push(userdata[key].tb0726);
      arr.push(userdata[key].ta0725);
      arr.push(userdata[key].tb0725);

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