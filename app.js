
const SERVER = 'https://www.woniufr.vip';
const fetchErrorInfo = '服务器忙请稍后再试\n谢谢您的理解';
const loaddingInfo = '数据加载中';
import { makePar,extend } from './utils/util';
import { Promise } from './utils/es6-promise.min';
import _ from './utils/underscore.js';
import { addIndex,add} from './utils/ramda.js';
import md5 from './utils/md5.js';
import { Observable, Subject} from './utils/Rx.js';
import rxwx from './utils/RxWx.js'; 

// console.log("Observable-------------------------->",Observable);
// console.log("Subject-------------------------->", Subject);
// console.log("rxwx-------------------------->", rxwx);
// console.log("add-------->", add(1,2));





//app.js
App({
  endPoints:{
    getTopTag:"getTopTag",
    getTag:"getTag",
    getQuestion:"getQuestion",
    answerQuestion:"answerQuestion"
  },
  onLaunch: function (){
    let that = this;
    var isPass = false;
    
    rxwx.getSystemInfo().subscribe(function(systemInfo){
      console.log("systemInfo------------------->", systemInfo);
    });

     let appInit = rxwx.login().switchMap(function(wxLoginInfo){
       that.globalData.code = wxLoginInfo.code;
       console.log(wxLoginInfo.code);
       return rxwx.request({
         url: `${SERVER}/api/mpLogin`,
         data: { code: wxLoginInfo.code},
         method: 'POST',
         header: { 'content-type': 'application/json' },
       })
     })
    .catch(e =>{
      console.error(e);
      isPass = true;
    })
    .subscribe(loginRes => {
      let data = loginRes.data.data;
      console.log("loginRes------------------->", loginRes);
      that.globalData.mp_id = data.mp_id;
      that.globalData.session_key = data.session_key; //存储 微信会话key
      that.globalData.member_id = data.member_id;
      isPass = true;
    })
     while(isPass){}
  },
  globalData: {
    userInfo: {},
  },
  /*
      @purpose  微信登录
      @createTime 2017-09-03 09:14
      @author  miles_fk
  */
  wxLogin: function () {
    var that = this;
    var whiteList = this.globalData.whiteList;
    var wxLoginPromise = new Promise(function (resolve, reject) {

      wx.login({ //微信登录接口-微信提供的  res.code 到后台换取 mp_id, sessionKey, unionId
        success: function (res) {
            console.log("wxLogin------->wx.login----------------->", res);
            //decryptMpCode  解code的 测试  mpLogin
            that.fetchDataBase("mpLogin",{ code: res.code}, function (loginRes) {
              console.log("wxLogin------->wx.login------------mpLogin--loginRes--->", loginRes);
              let data = loginRes;
              that.globalData.mp_id = data.mp_id;
              that.globalData.session_key = data.session_key; //存储 微信会话key
              that.globalData.union_id = data.union_id;  // 微信端用户唯一id
              that.globalData.code = res.code;
              resolve();
            }, function(){
              reject({ isError: true });
            })
        },
        fail: function (e) {
          wx.showToast({ title: e.errMsg || fetchErrorInfo, image: "../../images/error-a.png" });
          reject({ isError: true });
        },
        complete: function (e) { }
      })

    });
    return wxLoginPromise
  },



  /*
    @purpose  请求数据基础包裹请求数据和判断登录
    @createTime 2017-09-03 09:14
    @author  miles_fk
*/
  fetchData: function (endpoint, qo = {noloadding:false}) {
    if (!qo.noloadding) wx.showLoading({ title: loaddingInfo });
    let that = this;

    var fetchDataPromise = new Promise(function (resolve, reject) {
      if (that.globalData.mp_id) { //已登录不需要重新请求 logIn
        qo.mp_id = that.globalData.mp_id;
        that.fetchDataBase(endpoint,qo,resolve,reject);
      } else {
        that.wxLogin().then((value) => { //登录成功执行业务请求接口
          qo.mp_id = that.globalData.mp_id || 0;
          that.fetchDataBase(endpoint,qo,resolve, reject);
        }).catch((err) => {//失败则执行 失败方案
          reject(err)
        })
      } 
    });

    return fetchDataPromise
  },
      /*
      @purpose  请求数据基础函数
      @createTime 2017-09-03 09:14
      @author  miles_fk
      fetchDataBase: (endpoint, qo, okcb, fallcb) 现在不需要 endpoint 根据参数区分
  */
  fetchDataBase: function (endpoint,qo, okcb, fallcb){
    //console.log("fetchDataBase------start----------------->", endpoint,qo);
    var that = this;
    //let nqo = that.makeMd5Par(qo);
    wx.request(
      Object.assign({
        url: `${SERVER}/api/${endpoint}`,
        data: qo,
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: res => {
          wx.hideLoading();
          let code = res.data.errcode;
          //console.log("fetchDataBase--success--------------->", res);
          let rd = res.data.data;

          //TODO 0  为没有错误
          if ((code != void 0) && code == 0) {
            okcb&&okcb(rd);
          } else {
            let errInfo = res.data.errmsg || fetchErrorInfo;
            if (!qo.noloadding) wx.hideLoading();
            wx.showToast({ title: errInfo, image: "../../images/error-a.png" });
            //console.log("fetchDataBase---errInfo----------endpoint------->",qo, errInfo);
            fallcb && fallcb(res.data.data)
          }
        },
        fail: function(res) {
          let errInfo = fetchErrorInfo || res.errMsg;
          if(res.data){
            errInfo = res.data.errMsg ;
          }else{
            wx.showToast({ title: errInfo, image: "../../images/error-a.png" });
          }
        },
        complete:function(e){
            //console.log("fetchDataBase--complete----->");
        }
      })
    )
  },
  /*
    @purpose 基础 跳转函数
    @createTime 2017-09-03 09:14
    @author  miles_fk
    @par
      pageName 跳转地址
      par 携带的参数
      gotoType 调用那个api to --> navigateTo
*/
  toPage: function (pageName, paro, gotoType) {
    if (pageName == "") return;
    let url = "";
    console.log('toPage---paro-------->', paro);
    if (paro) {
      let ps = makePar(paro);
      url = `/pages/${pageName}/${pageName}${ps}`
    } else {
      url = `/pages/${pageName}/${pageName}`
    }

    //console.log('toPage---url-------->',url);

    let rpo = {
      url: url,
      fail: e => console.log("wx.navigate-fail------>", e),
      complete: function (e) {}
    }
    switch (gotoType) {
      case "to":
        wx.navigateTo(rpo)
        break;
      case "rel":
        wx.reLaunch(rpo)
        break;
      default:
        wx.redirectTo(rpo)
    }
  },
})


