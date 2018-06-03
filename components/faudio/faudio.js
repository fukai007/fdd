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
    sliderValue:0
  },
  /*
      created 得不到 properties 的 src的值 - 2018-06-01 16:13
      src  不能是本地文件
  */
  ready:function(){
    this.audio = wx.createInnerAudioContext();
    this.audio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
;
    this.audio.onPlay(() => {
      console.log('开始播放')
    })
    this.audio.onTimeUpdate(()=> {
      console.log("offTimeUpdate--currentTime---duration---------->", this.audio.currentTime, this.audio.duration);
      this.onTimeUpdate();
    });


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
      if (!this.isChange) {
        this.setData({
          sliderValue: curp
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
    }
  }
})
