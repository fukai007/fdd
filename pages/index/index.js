// pages/index/index.js
import { indexData} from '../../utils/testdata.js';
import { makeHour} from '../../utils/time.js';
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexData: [],
    ts:"sss\nccs\n",
    isShowTip:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.fetchData(app.endPoints.getTopTag).then(data=>{
      console.log("index------------getTopTag--------->", data)
      this.setData({
        indexData: data.tag
      })
    })

    let curTime = (new Date()).getTime();
    let h48Time = makeHour(48);

    
    //设置 启动时间 方便判断48小时问题-2018-07-23 16:31
    try {
      //wx.setStorageSync('key', 'value')
      //var value = wx.getStorageSync('key')
      let openStartTime = wx.getStorageSync('openStartTime') || 0;
      if(openStartTime){
        let dvTime = curTime - openStartTime; // difference value 差值
        if (dvTime > h48Time ){
          wx.setStorageSync('openStartTime', curTime)
          this.setData({
            //TODO 开启 温馨提示框
            isShowTip:true
          })
        }
      }

    } catch (e) {
    }

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
  toSql:function(e){
    let id = e.currentTarget.dataset.id;
    app.toPage('sql', { id }, 'to');
  },
  toAnswer:function(){
    app.toPage('answer',{}, 'to');
  },
  onCloseTip:function(){
    this.setData({
      isShowTip:false
    });
  }
})