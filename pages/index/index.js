// pages/index/index.js
import { indexData} from '../../utils/testdata.js';
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexData: [],
    ts:"sss\nccs\n"
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
  }
})