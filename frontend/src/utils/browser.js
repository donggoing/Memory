/*
 * 判断浏览器 工具
 */

const Browser = {
  isIE9() {
    return !window.atob;
  },
  isIE10() {
    return !document.__proto__;
  },
  isIE() {
    return !!window.ActiveXObject;
  },
  checkVideo() {
    if (document.createElement('video').canPlayType) {
      const vidTest = document.createElement('video');
      oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
      if (!oggTest) {
        h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        if (!h264Test) {
          return false;
        }
        if (h264Test == 'probably') {
          return true;
        }
        return false;
      }
      if (oggTest == 'probably') {
        return true;
      }
      return false;
    }
    return false;
  },
};

module.exports = Browser;
