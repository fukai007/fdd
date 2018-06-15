/*
    1. 完成选择后保存本地状态 -2018-06-15 14:29

    // TODO  -2018-06-15 17:06
        1. 增加授权页面 如果未授权则截取可以答题的数据源
        2. 支付套餐需要弹层
        3. 对错的UI提示
        4. 答题页面调用真是数据接口
        5. 解析题如果展示
*/
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
      curPage:0,
      sonIndex:0,
      isCollection:false
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
      curPage: e.detail.current
    })
  },
  //TODO 检查接口 - 2018-06-14 22:18
  checkAnswer:function(e){
    console.log("answer----checkAnswer----------------------------------------->", e);
    // TODO 判断是否为免费答题页 - 2018-06-15 13:40:29
    let answer = e.detail; //拿到选择的结果;
    let qindex = this.data.curPage ;
    if (qindex> this.data.free_question_num){

    }else{
      this.doCheck(answer);
    }
  },
  /*
      @purpose  检查结果
          // 获得当前答题
          // 如果有子题判断子题
          // 设置数据
      @author miles_fk
      @createTime 2018-06-15 13:48
  */
  doCheck:function(answer){
    let qlist = this.data.qlist; //获得答题列表
    let qindex = this.data.curPage ;
    let curq = qlist[qindex]; //获得当前大题对象
    let oindex = answer.index;
    let sqIndex = answer.sqIndex; //如果有子题对象，则取到子题;
    let aid = answer.aid; //获得 题目ID ；

    if (curq.length > 1){//多题
      curq.sub_qestions[sqIndex].isAnswerCheck = true;
      curq.sub_qestions[sqIndex].options[oindex].isMySelect = true;
    }else{//一个题
      curq.isAnswerCheck = true; //设置为答过
      curq.options[oindex].isMySelect = true;
    }
    //app.fetchData(app);
    this.setData({qlist})

  },
  //TODO 保存当前子题目 - 2018-06-14 22:18
  changeSonIndex:function(e){
    let sonIndex = e.detail.sonIndex;
    console.log("answer---------------------------changeSonIndex--------------------------->",e);
    this.setData({sonIndex})
  },
  onCollect:function(){
    let curPage = this.data.curPage;
    let sonIndex = this.data.sonIndex;
    let curQItem = this.data.qlist[curPage];
    let aid = curQItem.id;

    //设置 收藏状态
    if (curQItem.length > 1){ //如果有子问题-2018-06-15 16:18
      aid = curQItem.sub_qestions[sonIndex].id;
      let is_collection = curQItem.sub_qestions[sonIndex].is_collection || 0;
      curQItem.sub_qestions[sonIndex].is_collection = !is_collection;
    }else{
      let is_collection = curQItem.is_collection || 0;
      curQItem.is_collection = !is_collection;
    }

    this.setData({qlist:this.data.qlist})
  }
})