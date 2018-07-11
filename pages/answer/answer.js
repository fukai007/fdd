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
// import {qoInfo} from '../../utils/testdata'; - 测试数据
import { Observable, Subject } from '../../utils/Rx.js';
import rxwx from '../../utils/RxWx.js'; 
var app = getApp();
//console.log(qoInfo);

Page({

  /**
   * 页面的初始数据
   */
  data: {
      qlist:[],//答题数据
      isHelp:false,//是否显示帮助解析页面
      curPage:0,//当前答题位置
      sonIndex:0,//当前子题位置
      isCollection:false,//是否收藏
      isShowPayLayer:false,//是否显示支付弹层,
      isShowFastSelectPage:false //是否显示快速选择浮层-2018-07-11 10:57
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("answer--------->into-onLoad--options----------------->",options);
    let apiName = app.endPoints.getQuestion;
    let po = {};


    if (options.tagType){//从收藏页面跳转过来的 -2018-06-22 09:56
        apiName = app.endPoints.getCollectionQuestion
        po.tag_id = options.tagId //题的ID
        po.type = options.tagType  //错题还是主动收藏的
    }else{ //从列表页面跳过来的
        po.tag_id = options.aid;
    }

    app.fetchData(apiName,po).then(qoInfo=>{
      console.log("apiName---------------------->"+apiName, qoInfo)
      this.original_ql = qoInfo.question;
      let canQuestionList  = qoInfo.question || [];
      // if (qoInfo.is_payment){ //支付过了-2018年06月19日17:15
      //   canQuestionList = qoInfo.question;
      // }else{//未支付
      //   canQuestionList = qoInfo.question.slice(0, qoInfo.free_question_num + 1)
      // }    

      this.setData({ 
        qlist: canQuestionList,
        // free_question_num: qoInfo.free_question_num,
        maxPage: qoInfo.question.length,
        allqf: qoInfo.all_question_fee,
        tp:qoInfo.tag_price,
        fast_select_page: qoInfo.fast_select_page
      })
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
        console.log("answer------onHide---------------------------------------------------------->");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      console.log("answer------onUnload---------------------------------------------------------->");
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
  /*
    @purpose 保存当前子题目 - 已完成
    @createTime 2018-06-15
    @author miles_fk
  */
  changeSonIndex: function (e) {
    let sonIndex = e.detail.sonIndex;
    console.log("answer---------------------------changeSonIndex--------------------------->", e);
    let qindex = this.data.curPage;
    let qlist = this.data.qlist;
    let curq = qlist[qindex]; //获得当前大题对象-2018年06月19日11:18
    curq.curSonIndex = sonIndex; // 设置大题的当前小题-2018年06月19日11:17
    this.setData({ sonIndex, qlist });
  },
  /*
  @purpose 根据 
  @createTime 2018-06-16
  @author miles_fk
*/
  changePage: function () {
    if(this.data.isHelp){
      this.setData({ isHelp:false});
    }
    isHelp: false
  }, 
  /*
    @purpose 切换大题的页面
    @createTime 2018-06-19 
    @author miles_fk
    TODO  支付操作
  */
  endChangePage:function(e){
    console.log("answer----endChangePage----------------------------------------->",e);
    let nextPage = e.detail.current || e.target.dataset.pageindex;
    nextPage = nextPage || 0;
    let curPage = this.data.curPage || 0;
    
    if (nextPage != curPage ){
      //isHelp
      setTimeout(() => { this.setData({ 'curPage': nextPage})  },400);
      
    }

  },
  /*
    @purpose 检查题目
    @createTime 2018-06-15
    @author miles_fk
    TODO  支付操作
  */
  checkAnswer:function(e){
    console.log("answer----checkAnswer----------------------------------------->", e);
    // TODO 判断是否为免费答题页 - 2018-06-15 13:40:29
    let answer = e.detail; //拿到选择的结果;
    let qindex = this.data.curPage ;
    let is_payment =  false;
    let { curPage, sonIndex} = this.data;
    if (this.original_ql[curPage].type == 2){
      is_payment = this.original_ql[curPage].sub_qestions[sonIndex].is_payment
    }else{
      is_payment = this.original_ql[curPage].is_payment
    }
    //TODO 增加 是否支付的判断 
    //if (qindex > this.data.free_question_num - 1){ //大于免费题目
      // 显示支付页面
    if (is_payment == false) {
        this.setData({ isShowPayLayer: true}) //显示付费浮层
        return ;
      }
    //}

    this.doCheck(answer);
  },
  /*
      @purpose  检查结果
          1. 获得当前答题
          2. 如果有子题判断子题
          3. 设置数据
      @author miles_fk
      @createTime 2018-06-15 13:48
  */
  doCheck:function(answer){
    let qlist = this.data.qlist; //获得答题列表
    let qindex = this.data.curPage ;
    let curq = qlist[qindex]; //获得当前大题对象
    let oindex = answer.index;
    let sqIndex = this.data.sonIndex; //如果有子题对象，则取到子题;
    let aid = answer.aid; //获得 题目ID ；
    var answerPage = this;

    let question_id = curq.id //后台需要的题ID,默认给答题的ID
    let option_id ="";
    if (curq.type == 2 ) {//多题  curq.length
      if (curq.sub_qestions[sqIndex].is_answer_check) return  //如果答过了就不能再答了-2018-06-16 09:56:02

      curq.sub_qestions[sqIndex].is_answer_check = true;
      curq.sub_qestions[sqIndex].options[oindex].is_my_select= true;

      option_id = curq.sub_qestions[sqIndex].options[oindex].id;//保存选项的ID后台需要-2018-06-19 17:53
      question_id = curq.sub_qestions[sqIndex].id; // 保存子题的ID后台需要-2018-06-19 17:53
    }else{//一个题
      if (curq.is_answer_check)  return ;//如果答过了就不能再答了-2018-06-16 09:56:02
      curq.is_answer_check = true; //设置为答过
      curq.options[oindex].is_my_select= true;
      option_id = curq.options[oindex].id;//保存选项的ID后台需要-2018-06-19 17:53
    }
    //app.fetchData(app);
    app.fetchData(app.endPoints.answerQuestion,{
      question_id, option_id
    }).then(()=>{
      answerPage.setData({ qlist });
    })
  },
 
  /*
    @purpose 是否收藏 - 已完成
    @createTime 2018-06-15
    @author miles_fk
    //TODO 调用  collection 接口  @parm[question_id  和 status]
        

  */
  onCollect:function(){
    let curPage = this.data.curPage;
    let sonIndex = this.data.sonIndex;
    let curQItem = this.data.qlist[curPage];
    let question_id = curQItem.id;
    let status = true;
    var answerPage = this;

    //设置 收藏状态
    if (curQItem.type == 2){ //如果有子问题-2018-06-15 16:18
      question_id = curQItem.sub_qestions[sonIndex].id;
      let is_collection = curQItem.sub_qestions[sonIndex].is_collection || false;
      curQItem.sub_qestions[sonIndex].is_collection = !is_collection;
      status = !is_collection; //更新后台收藏状态-2018-06-19 18:08
    }else{
      let is_collection = curQItem.is_collection || false;
      curQItem.is_collection = !is_collection;
      status = !is_collection; //更新后台收藏状态-2018-06-19 18:08
    }
    app.fetchData(app.endPoints.collection,{
      question_id, status
    }).then((data)=>{
      if (data.result){
        wx.showToast({title:"收藏成功",icon:"none"})
      }else{
        wx.showToast({ title:"收藏失败", icon: "none" })
      }
      answerPage.setData({ qlist: this.data.qlist })
    })
  },
  /*
    @purpose 是否显示解释页面
    @createTime 2018-06-16
    @author miles_fk
  */
  onShowExplain:function(){
    let nextIsHelp = !(this.data.isHelp);
    let curPage = this.data.curPage;
    let sonIndex = this.data.sonIndex;
    let curQItem = this.data.qlist[curPage];    
    if (curQItem.type == 2){
      curQItem = curQItem.sub_qestions[sonIndex];
    }
    
    if (curQItem.is_payment){
      this.setData({
        isHelp: nextIsHelp
      });
    }
  },
  /*
    @purpose 答题付款 
    @createTime 2018-06-16
    @author miles_fk
  */
  onPayForQuestion:function(e){
    console.log("onPayForQuestion----------into---------------------------->");
    let isPayFull = e.currentTarget.dataset.ispayfull;

    let answerPage = this;
    app.fetchDataForRx(app.endPoints.saveOrder,{
      tag_id: answerPage.options.aid,
      is_purchase_all:isPayFull
    }).switchMap(saveOrderInfo=>{
      return rxwx.requestPayment(saveOrderInfo.pay_order_detail)
    }).subscribe(
      function(e){
        console.log("requestPayment-----------ok------------>",e);
        
        //支付后更新支付状态和题目

        for (let findex = 0; findex < answerPage.original_ql.length;findex++){
          let bigQuestion = answerPage.original_ql[findex];

          if (bigQuestion.type == 2) { //有子题则重置子题的 is_payment - 2018-07-03 16:50
            let sonQuestionList = answerPage.original_ql[findex];
            for (let sindex = 0; sindex < answerPage.original_ql.length; sindex++){
              let sonQestionItem = sonQuestionList.sub_qestions[sindex];
              sonQestionItem.is_payment = true
            }
          }else{
            bigQuestion.is_payment = true
          }
        }
        answerPage.setData({
          qlist: answerPage.original_ql,
        });
      },function(e){
        console.log("requestPayment-----------fail------------>", e);
        answerPage.setData({
          isShowPayLayer: false
        });
      },function(){
        console.log("requestPayment-----------complete------------>");
        answerPage.setData({
          isShowPayLayer: false
        });
      }
    )
  },
  /*
    @purpose 关闭支付浮层 
    @createTime 2018-06-16
    @author miles_fk
  */
  onPayClose:function(){
    this.setData({
      isShowPayLayer:false
    });
  },
  /*
    @purpose 是否显示快速选择大题Page浮层 
    @createTime 2018-06-16
    @author miles_fk
  */
  onShowFastSelectPage:function(){
    let isShowFastSelectPage = !this.data.isShowFastSelectPage;
    this.setData({isShowFastSelectPage});
  }
})