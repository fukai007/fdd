// components/treeItem/treeItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sonTagData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowSonTree:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setIsShowSonTree:function(){
        let isShowSonTree = this.data.isShowSonTree;
        console.log("treeItem--next--current------------->", isShowSonTree)
        this.setData({
          isShowSonTree: !isShowSonTree
        })
    },
    onToAnswer:function(e){
      let aid = e.currentTarget.dataset.aid;
      let myEventDetail = {aid} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('toAnswer', myEventDetail, myEventOption)
    }
  }
})
