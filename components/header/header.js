// components/header/header.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatarUrl: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRule: function () {
      app.toPage('askRule', {}, 'to'); //跳转到规则页面
    }
  }
})
