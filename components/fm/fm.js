// components/fm/fm.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      isIndex:Boolean,
      isFavorite: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {}
  },
  ready:function(){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    this.animation = animation;
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*显示浮动菜单*/
    onShowFull:function(){
      if(!this.doingShowFull){
        this.doingShowFull = true;

        if(this.isFull){
          this.animation.left('-260rpx').step();
          this.isFull = false;
        }else{
          this.animation.left(0).step();
          this.isFull = true;
        }

        this.setData({
          animationData: this.animation.export()
        })

        this.doingShowFull = false;

        if (this.isFull){
          setTimeout(function () {
            this.animation.left('-260rpx').step()
            this.setData({
              animationData: this.animation.export()
            })
            this.doingShowFull = false;
            this.isFull = false;
          }.bind(this), 2000)
        }
      }

    },
    toIndex:function(){
      console.log(this.properties)
      if (this.properties.isIndex) return ;
      else{
        app.toPage('index', {},'rel')
      }
    },
    toFavorite:function(){
      console.log(this.properties)
      if (this.properties.isFavorite) return;
      else {
        app.toPage('collect')
      }
    }    
  }
})
