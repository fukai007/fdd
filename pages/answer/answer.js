// pages/answer/answer.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isDoubt:false
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
    console.log("endChangePage----------------------------------------->",e);
  } 
})