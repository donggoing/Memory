<template>
  <!-- <div :style="love_style"> -->
  <div style="width:100%;height:100%;position:absolute;top:0">
    <div  id="LoveContainer"></div>
    <div  id="Container" class="modal show">
      <div style="opacity: .9;width:80%;margin:0 auto;top:24%" class="modal-dialog">
          <div style="opacity:.8;display:block" class="modal-content">
              <div class="modal-header" style="display:block">
                  <h1 style="color: #A94442;font-family:'JournalRegular', Arial, sans-serif;font-size: 4.5rem;display:block"
                      class="text-center">the time we together</h1>
                  <p class="text-center middle-title" style="font-size:1.6rem">CYD ❤ XLL</p>
                  <p class="text-center small-title">LOVING ON THE WAY</p>
              </div>
              <div style="line-height: 1.5rem;font-family: 'JournalRegular', Arial, sans-serif;font-size: 2rem;"
                  class="modal-body text-center">
                  <p><span id="day" class="time-font"></span><span style="color:#A94442">/</span><span id="hour"
                          class="time-font"></span><span style="color:#A94442">/</span><span id="minute"
                          class="time-font"></span><span style="color:#A94442">/</span><span id="second"
                          class="time-font"></span></p>
                  <p>days/hours/min/sec</p>
                  <p id="say" style="color:#A94442;font-size: 35px" class="text-center"></p>
              </div>
          </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>

const countTime = require('../javascripts/count-time');

import('../javascripts/jquery.backstretch.min');

export default {
  name: 'Love',
  data() {
    return {
      imgs_url: [],
      imgs_words: [],
      // index: -1,
      love_style: {
        backgroundImage: 'url()',
      },
      timer: null,
    };
  },
  created() {
    // 设置起始日期
    countTime('2020/07/20 15:28', 'day', 'hour', 'minute', 'second');
    const days = $('#day').text();
    // 设置标题
    if (parseInt(days / 365, 10) !== 0) {
      $(document).attr('title', `C❤X 在一起${parseInt(days / 365, 10)}年,感谢相伴。`);
    } else if (parseInt(days / 30, 10) !== 0) {
      $(document).attr('title', `C❤X 在一起${parseInt(days / 30, 10)}个月,感谢相伴。`);
    } else {
      $(document).attr('title', `C❤X 在一起${days}天,感谢相伴。`);
    }
    // const headers = {
    //   Authorization: localStorage.getItem('cx_secret_'),
    // };

    this.$http.get('/love-record/imgs_name').then((data) => {
      // console.log(data);
      this.imgs_url = data.data;
      // let result = data.data.map((img)=>{
      //  return {
      //    url:`${this.image_prefix}/${img}`,
      //    scale:'fit'
      //    };
      // });

      // console.log(result)
      // $('#LoveContainer').backstretch(result, {
      // 1000;
      // });
    });


    // 异步获取所有语句;
    this.$http.get('/love-record/imgs_words').then((data) => {
      console.log(data);
      this.imgs_words = data.data;
      data = data.data;
      let index = 0;
      $('#LoveContainer').css('background-image', `url(${this.imgs_url[(index) % data.length]})`);
      $('#say').text(data[(index++) % data.length]);
      // let randomtime=(Math.random()*6+8)*1000;;
      this.timer = setInterval(() => {
        $('#LoveContainer').animate({ opacity: '1' }, 1000);
        $('#LoveContainer').animate({ opacity: '0' }, 9000);
        $('#LoveContainer').css('background-image', `url(${this.imgs_url[(index) % data.length]})`);
        // $('#LoveContainer').animate({opacity:"0"},6000);
        // $('#LoveContainer').backstretch('next');
        $('#say').hide();
        $('#say').text(data[(index++) % data.length]);
        $('#say').fadeToggle();
        $('#carousel').carousel('next');
        // randomtime = (Math.random()*6+8)*1000;
      }, 10000);
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    // $('#app').css('background-color', '#fff');
  },
};
</script>

<style>
 @font-face {
      font-family: 'JournalRegular';
      src: url('../fonts/journal-webfont.eot');
      src: url('../fonts/journal-webfont_162a16fe.eot') format('embedded-opentype'),
      url('../fonts/journal-webfont.woff') format('woff'),
      url('../fonts/journal-webfont.ttf') format('truetype'),
      url('../fonts/journal-webfont.svg') format('svg');
      font-weight: normal;
      font-style: normal;
  }

  /* 让模态框显示 */
 .modal {
    display: block;
  }

  #LoveContainer{
    width:100%;
    height:100%;
    position: absolute;
    background-size:contain !important;
    opacity:1;
    top:0;
  }

  /* 如果不使用vue的transition的话可以不设置 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .15s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .carousel-fade .carousel-inner .item {
      opacity: 0;
      -webkit-transition-property: opacity;
      -moz-transition-property: opacity;
      -ms-transition-property: opacity;
      -o-transition-property: opacity;
      transition-property: opacity;
  }

  .carousel-fade .carousel-inner .active {
      opacity: 1;
  }

  .carousel-fade .carousel-inner .active.left,
  .carousel-fade .carousel-inner .active.right {
      left: 0;
      opacity: 0;
  }

  .carousel-fade .carousel-inner .next.left,
  .carousel-fade .carousel-inner .prev.right {
      opacity: 1;
  }

  .carousel-position {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
  }

  .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      opacity: .3;
      background-color: black;
  }

  .front {
      border: 5px solid red;
      width: 100%;
      height: 100%;
  }

  .container {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 3;
  }

  .small-title {
      color: gray;
      line-height: 0.5rem;
      font-size: 10px;
      display: block;
  }

  .modal-content {
      background: #040404;
  }

  .time-font {
      color: #fff;
  }

</style>
