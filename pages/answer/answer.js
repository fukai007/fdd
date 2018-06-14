// pages/answer/answer.js
import {qoInfo} from '../../utils/testdata';
console.log(qoInfo);
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isDoubt:false,
      qlist:[],
      isHelp:false,
      curPage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("answer--------->into-onLoad--options----------------->",options);
    let aid = options.aid;
    app.fetchData(app.endPoints.getQuestion,{tag_id: aid}).then(data=>{
      console.log("app.endPoints.getQuestion----------->", data)
    }); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      //TODO  调用接口
      this.setData({
        qlist: qoInfo.question,
        maxPage: qoInfo.question.length
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  endChangePage:function(e){
    console.log("answer----endChangePage----------------------------------------->",e);
    this.setData({
      curPage: e.detail.current+1
    })
  },
  //TODO 检查接口 - 2018-06-14 22:18
  checkAnswer:function(){},
  //TODO 保存当前子题目 - 2018-06-14 22:18
  changeSonIndex:function(){}
})