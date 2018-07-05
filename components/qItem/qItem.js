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
    qIsPlay: false,
    eIsPlay:false,
    qsv: 0,
    esv:0,
    qcTime: '00:00',
    qdTime: '00:00',
    ecTime: '00:00',
    edTime: '00:00'
  },

  ready: function () {
    // 如果是音频类型这执行这个
    let item = this.properties.item;
    if (item.question_media_type == 2) this.audioq = this.initAudio(item.question_media,'q');
    if (item.question_media_type == 4){
      let  cit = item.question_media.filter(qi=>{
         return qi.type == 2 
      });
      if(cit.length > 0){
        this.audioq = this.initAudio(cit[0].content, 'q');
      }
      //this.audioquestion_mediaq = 
    }
    if ( item.type == 2 ){ // type 2 -> 多题
      if (item.sub_qestions[0].analysis_media_type == 2){
        this.audioe = this.initAudio(item.sub_qestions[0].analysis, 'e');
      }
      this.setData({
        sqInfo: item.sub_qestions[0]
      });
    }else{
        // this.audioe = this.initAudio('', 'e');
      if(item.analysis_media_type == 2){
        this.audioe = this.initAudio(item.analysis, 'e');
      }        
      this.setData({
        sqInfo: item
      });
    }
    
    // console.log(makeWXDom(htmlString));

  },
  detached: function () {
    this.audio = null;
  },

  /**
   * 组件的方法列表
   * 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
   */
  methods: {
    initAudio:function(asrc,type){
      let audio = wx.createInnerAudioContext();
      audio.src =  asrc;
      audio.onPlay((e) => {
        console.log('开始播放', e)
      })
      audio.onTimeUpdate((e) => {
        this.onTimeUpdate(type);
      });
      audio.onWaiting(this.onWaiting)
      audio.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
      audio.onEnded(()=>{
        this[type+'IsPlay'] = false;
        audio.seek(0);
        if(type == 'q'){
          this.setData({
            qIsPlay: false,
            qcTime: '00:00',
            qsv: 0
          });
        }
        if(type == 'e') {
          this.setData({
            eIsPlay: false,
            ecTime: '00:00',
            esv: 0
          });
        }

        console.log("this.audio.onEnded--------------------------------->");
      });
      // this.properties.src
      this[type + 'IsPlay'] = false; 
      return audio
    },
    onPlay: function (e) {
      let type = e.target.dataset.type;
      if (this.data[type + 'IsPlay']){
        this['audio'+type].pause();
        if (type == 'e') this.setData({ eIsPlay: false });
        if (type == 'q') this.setData({ qIsPlay: false });
      }else{
        this['audio'+type].play();
        if (type == 'e') this.setData({ eIsPlay: true });
        if (type == 'q') this.setData({ qIsPlay: true });
      }
    },
    onTimeUpdate: function (type) {
      let curp = this['audio'+type].currentTime / this['audio'+type].duration;
      curp = curp.toFixed(5) * 100
      console.log("curp--------------->", curp);
      let cTime = this.transTime(this['audio'+type].currentTime);
      let dTime = this.transTime(this['audio'+type].duration);
      if (!this[type+'IsChange']) {
        if (type == 'e'){
          this.setData({
            esv: curp,
            ecTime: cTime,
            edTime: dTime,
          })
        }
        if (type == 'q'){
          this.setData({
            qsv: curp,
            qcTime: cTime,
            qdTime: dTime,
          })
        }    
      }
    },
    eChange: function (e) {
      this.eIsChange = true;
    },
    qChange: function (e) {
      this.qIsChange = true;
    },

    qChangeEnd: function (e) {
      let x = e.detail.value;
      console.log("changeValue---------------->", x, this.audioq.paused);
      x = x / 100 * this.audioq.duration;
      this.audioq.startTime = x;
      this.qIsChange = false;
      if (!this.audioq.paused) this.audioq.play();
    },
    eChangeEnd: function (e) {
      let x = e.detail.value;
      console.log("changeValue---------------->", x, this.audioe.paused);
      x = x / 100 * this.audioe.duration;
      this.audioe.startTime = x;
      this.eIsChange = false;
      if (!this.audioe.paused) this.audioe.play();
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
      let myEventDetail = {sonIndex: detail.current} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项 changeSonIndex
      let sqInfo = this.properties.item.sub_qestions[detail.current];
      if (sqInfo.analysis_media_type == 2) this.audioe.src = sqInfo.analysis;
      this.setData({
        sqInfo,
        eIsPlay: false,
        ecTime: '00:00',
        edTime: '00:00',
        esv: 0
      });
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