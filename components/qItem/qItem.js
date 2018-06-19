// components/qitem/qitem.js
import html from '../../utils/htmlparser';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object,
    index:Number,
    isHelp: {
      type: Boolean,
      observer: function (newVal, oldVal) { }
    },
    curPage:{
      type:Number,
      observer: function (newVal, oldVal) { 
          //TODO  如果当前页不是本页则暂停音频 - 2018-06-14 21:39
      }

    }
  },

  /**
   * 组件的初始数据
   * question_type = {0=文字 1=图片 2=音频 3=视频}
   */
  data: {
    question_type:2,
    isPlay: false,
    sliderValue: 0,
    cTime: '00:00',
    dTime: '00:00'
  },

  ready: function () {
    // 如果是音频类型这执行这个
    let item = this.properties.item;
    if (item.question_media_type == 2) this.initAudio(item.question_media);
    // console.log(makeWXDom(htmlString));

  },
  detached: function () {
    this.audio = null;
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initAudio:function(asrc){
      this.audio = wx.createInnerAudioContext();
      this.audio.src = asrc;
      this.audio.onPlay((e) => {
        console.log('开始播放', e)
      })
      this.audio.onTimeUpdate((e) => {
        console.log("offTimeUpdate--currentTime---duration---------->", this.audio.currentTime, this.audio.duration);
        this.onTimeUpdate();
      });
      this.audio.onWaiting(this.onWaiting)
      this.audio.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
      this.audio.onEnded(()=>{
        this.isPlay = false;
        this.audio.seek(0);
        this.setData({
          isPlay:false,
          cTime:'00:00',
          sliderValue:0
        });
        console.log("this.audio.onEnded--------------------------------->");
      });
      // this.properties.src
      this.isPlay = false; 
    },
    onPlay: function () {
      if (this.data.isPlay) {
        this.audio.pause();
        this.setData({ isPlay: false });
      } else {
        this.audio.play();

        this.setData({ isPlay: true });
      }
    },
    onTimeUpdate: function () {
      let curp = this.audio.currentTime / this.audio.duration;
      curp = curp.toFixed(5) * 100
      console.log("curp--------------->", curp);
      let cTime = this.transTime(this.audio.currentTime);
      let dTime = this.transTime(this.audio.duration);
      if (!this.isChange) {
        this.setData({
          sliderValue: curp,
          cTime: cTime,
          dTime: dTime,
        })
      }
    },
    change: function (e) {
      this.isChange = true;
    },
    changeEnd: function (e) {
      let x = e.detail.value;
      console.log("changeValue---------------->", x, this.audio.paused);
      x = x / 100 * this.audio.duration;
      this.audio.startTime = x;
      this.isChange = false;
      if (!this.audio.paused) this.audio.play();
    },
    onWaiting: function (e) {
      console.log("onWaiting---------------->", e);
    },
    //转换音频时长显示
    transTime: function (time) {
      let duration = parseInt(time);
      let minute = parseInt(duration / 60);
      let sec = duration % 60 + '';
      let isM0 = ':';
      if (minute == 0) {
        minute = '00';
      } else if (minute < 10) {
        minute = '0' + minute;
      }
      if (sec.length == 1) {
        sec = '0' + sec;
      }
      return minute + isM0 + sec
    },
    checkAnswer:function(e){
      //TODO 根据 qoption 去检查答案 |  更新本地问题状态 | 请求服务器记录选择
      let sq = e.target.dataset.qoption;
      let aid = e.target.dataset.aid;
      let index = e.target.dataset.index;
      let sqindex = e.target.dataset.sqindex || 0;

      sq.aid = this.properties.item.id //存储父ID;
      sq.index  = index;
      sq.sqIndex = sqindex;

      let myEventDetail = sq // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项

      this.triggerEvent('checkAnswer', myEventDetail, myEventOption)
      console.log("checkAnswer------------------->",sq);
    },
    endChangePage:function(e){
      let detail = e.detail;
      //changeSonIndex 
      let myEventDetail = { sonIndex: detail.current} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项 changeSonIndex
      this.triggerEvent('changeSonIndex', myEventDetail, myEventOption)
    }
  }
})






// var htmlString = '<p>heloo</p ><p><strong>how are you?</strong></p ><p>well<br/>what is time now?</p ><p><strong>10 AM</strong></p >'

// var makeWXDom = res => {
//   var results = ''
//   var content = []
//   var skipThis = false
//   html.HTMLParser(res, {
//     start: function (tag, attrs, unary) {
//       if (tag == 'img') {
//         if (skipThis) {
//           return
//         }
//         let attr = attrs.filter(d => d.name == 'src')[0]
//         if (attr) content.push({
//           type: 'image',
//           value: assets(attr.value)
//         })
//       }
//       if (tag == 'a') {
//         skipThis = true
//       }
//     },
//     end: function (tag) {
//       skipThis = false
//     },
//     chars: function (text) {
//       if (skipThis) {
//         return
//       }
//       content.push({ type: 'text', value: text.replace(/\u00a0/g, " ") })
//     },
//     comment: function (text) {
//     }
//   })
//   //return Object.assign({}, res, { content });
//   return Object.assign({},{content});
// }