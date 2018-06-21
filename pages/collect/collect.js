// pages/collect/collect.js
import { collect } from '../../utils/testdata';
var app = getApp();

// [错题本 == 2  |  我的收藏 == 1]
var typTag = {
  mySelectFail:'2',
  myCollection:'1'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollection(typTag.mySelectFail); //默认取我的错题本
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
  /**
   * @purpose 获取收藏 or 错题 数据
   * @createTime 2018-06-21 13:51
   * @author miles_fk
   */
  getCollection:function(type){
    let collectPage = this; 
    app.fetchData(app.endPoints.getCollection, {type}).then(data => {
      if (data.tag.length > 0){
        collectPage.setData({
          tagList: data.tag,
          sonData: data.tag[0].third_tag,
          levelIndex: 0,
          curBigType: type
        })
      }else{
        collectPage.setData({
          tagList: [],
          sonData: [],
          levelIndex: 0,
          curBigType: type
        })
      }

    })
  },
  /**
   * @purpose 切换大类型
   * @createTime 2018-06-21 13:51
   * @author miles_fk
   */
  onChangeBigType:function(e){
    let btype = e.currentTarget.dataset.btype;
    this.getCollection(btype);
  },
  /**
   * @purpose 跳转到答题页面
   * @createTime 2018-06-21 13:51
   * @author miles_fk
   */
  toReview: function (e) {
    let sdId = e.currentTarget.dataset.sdid;
    console.log("toReview------------------>", sdId);
  },
  /**
   * @purpose 切换界别标签
   * @createTime 2018-06-21 13:51
   * @author miles_fk
   */
  onChangeLevel: function (e) {
    let levelIndex = e.currentTarget.dataset.levelindex;
    let tagList = this.data.tagList;
    let sonData = tagList[levelIndex].third_tag;
    this.setData({ sonData, levelIndex });
  }
})