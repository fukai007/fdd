// components/faudio/faudio.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:String //音频地址

  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlay:false,
    sliderValue:0,
    cTime:'00:00',
    dTime: '00:00'
  },
  /*
      created 得不到 properties 的 src的值 - 2018-06-01 16:13
      src  不能是本地文件
  */
  ready:function(){
    this.audio = wx.createInnerAudioContext();
    this.audio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
;
    this.audio.onPlay((e) => {
      console.log('开始播放',e)
    })
    this.audio.onTimeUpdate((e)=> {
      console.log("offTimeUpdate--currentTime---duration---------->", this.audio.currentTime, this.audio.duration);
      this.onTimeUpdate();
    });
    this.audio.onWaiting(this.onWaiting)
    this.audio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })


 // this.properties.src
    this.isPlay = false; 

  },
  detached:function(){
    this.audio = null;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onPlay:function(){
      if (this.data.isPlay){
        this.audio.pause();
        this.setData({isPlay:false});
      }else{
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
    changeEnd:function(e){
      let x = e.detail.value;
      console.log("changeValue---------------->", x, this.audio.paused);
      x = x / 100 * this.audio.duration;
      this.audio.startTime = x ;
      this.isChange = false;
      if(!this.audio.paused) this.audio.play();
    },
    onWaiting:function(e){
      console.log("onWaiting---------------->",e);
    },
    //转换音频时长显示
    transTime: function (time) {
        let  duration = parseInt(time);
        let  minute = parseInt(duration / 60);
        let  sec = duration % 60 + '';
        let  isM0 = ':';
        if(minute == 0) {
          minute = '00';
        }else if(minute < 10 ){
          minute = '0' + minute;
        }
        if(sec.length == 1) {
          sec = '0' + sec;
        }
        return minute+ isM0 + sec
    }
  }
})
