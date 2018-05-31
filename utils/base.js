module.exports = {
  onShareAppMessage: function () {
    let imageUrl = 'https://wxapp.haizeihuang.com/wannengdequan_php/images/share.png';
    let title = '不要钱，答题就拿走，挑战吧';
    let path = 'pages/index/index?';
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (res) { },
      fail: function (res) { }
    }
  }
}