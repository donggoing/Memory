<template>
  <!-- <div :style="love_style"> -->
  <div style="width:100%;height:100%;position:absolute;top:0">
    <div  id="LoveContainer" :style="{backgroundImage:'url('+cur_img.url+')'}"></div>
    <div  id="Container" class="modal show">
      <div style="opacity: .9;width:45%; min-width:400px;max-width:1000px;margin:0 auto;top:24%" class="modal-dialog">
          <div style="opacity:.8;display:block" class="modal-content">
              <div class="modal-header" style="display:block">
                  <h1 style="color: #A94442;font-family:'JournalRegular', Arial, sans-serif;font-size: 5rem;display:block"
                      class="text-center">the time we together</h1>
                  <p class="text-center middle-title" style="font-size:2rem">CYD ❤ XLL</p>
                  <p class="text-center small-title">LOVING ON THE WAY</p>
              </div>
              <div style=" Arial, sans-serif;font-size: 2rem;margin:0"
                  >
                  <p style="color:grey;font-size: 2.6rem;color: #A94442;margin:0">
                    <span >{{until}}</span>
                  </p>
                    <!-- <span style="color:#A94442">/</span><span id="hour"
                          class="time-font"></span><span style="color:#A94442">/</span><span id="minute"
                          class="time-font"></span><span style="color:#A94442">/</span><span id="second"
                          class="time-font"></span></p> -->
                  <p style="font-family: 'JournalRegular';font-size:1.5em">days/hours/min/sec</p>
                  <div >
                    <p id="say" :style="{ 'font-family':'fantasy, emoji, sans-serif','color': '#A94442','font-size': textSize+'px'}" >{{cur_img.desc}}</p></div>
                  <!-- <p id="say" style="color:#A94442;font-size: 1.8em" class="text-center"></p> -->
              </div>
          </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
// import('../stylesheets/bootstrap.min.css');

// import ResizeText from 'vue-resize-text';
import moment from 'moment';

// const momentDurationFormatSetup = require('moment-duration-format');
const countTime = require('../javascripts/count-time');

// import('../javascripts/jquery.backstretch.min');

export default {
  name: 'Love',
  // directives: {
  //   ResizeText,
  // },

  computed: {
    textSize: {
      get() {
        const line = parseInt(this.cur_img.desc.length / 25);
        let fontSize = (65 / line - line * 5) * 0.8;
        if (fontSize < 15)fontSize = 15;
        else if (fontSize > 32)fontSize = 32;
        return fontSize;
      },
    },
  },

  data() {
    return {
      until: '',
      sayText: '',
      startTime: '',
      imgs: [],
      cur_img: {
        url: '',
        desc: '',
      },
      // imgs_url: [],
      // imgs_desc: [],
      // index: -1,
      love_style: {
        backgroundImage: 'url()',
      },
      timer: null,
      // textStyle: {
      //   height: '200px',
      //   'font-size': '1rem',
      // },
    };
  },
  async mounted() {
    // 设置起始日期
    // countTime('2020/07/20 15:28', 'day', 'hour', 'minute', 'second');
    const date = await this.$http.get('/love-record/start');
    this.startTime = moment(date.data.start);
    const days = moment().diff(this.startTime, 'day');
    // 设置标题
    if (parseInt(days / 365, 10) !== 0) {
      $(document).attr('title', `C❤X 在一起${parseInt(days / 365, 10)}年,感谢相伴。`);
    } else if (parseInt(days / 30, 10) !== 0) {
      $(document).attr('title', `C❤X 在一起${parseInt(days / 30, 10)}个月,感谢相伴。`);
    } else {
      $(document).attr('title', `C❤X 在一起${days}天,感谢相伴。`);
    }
    const self = this;
    setInterval(() => {
      // this.until = moment.tz(moment() - moment('2020-07-20 15:28'), 'Africa/Abidjan').format('DD天HH时mm分ss秒');
      self.until = moment.duration(moment() - self.startTime, 'ms').format('DD/HH/mm/ss');
 	  }, 1000);
    // const headers = {
    //   Authorization: localStorage.getItem('cx_secret_'),
    // };

    // this.$http.get('/love-record/imgs_name').then((data) => {
    //   // console.log(data);
    //   this.imgs_url = data.data;
    // }, (err) => {
    //   console.log('Fail to get imgs_url');
    // });


    // 异步获取所有语句;
    this.$http.get('/love-record/imgs_desc').then((data) => {
      // console.log(data);
      // const desc = [];
      // const url = [];
      this.imgs = Array.prototype.slice.call(data.data);

      // self.imgs = Array.prototype.forEach.call(data.data, item => ({
      //   desc: item.desc,
      //   url: item.url,
      //   textSize: this.$options.methods.calTextSize(item.desc),
      // }));
      // this.imgs_url = url;
      // this.imgs_desc = desc;
      let index = this.$options.methods.getRndInteger(0, this.imgs.length);
      this.cur_img = this.imgs[index];
      // $('#LoveContainer').css('background-image', `url(${this.imgs_url[index]})`);
      // this.sayText = data[(index++) % data.length];
      const self = this;
      // this.$options.methods.setText.bind(this)(this.imgs_desc[index]);

      // let randomtime=(Math.random()*6+8)*1000;;
      this.timer = setInterval(() => {
        $('#LoveContainer').animate({ opacity: '1' }, 500);
        index = this.$options.methods.getRndInteger(0, this.imgs.length);
        $('#LoveContainer').animate({ opacity: '0.8' }, 8000);
        // $('#LoveContainer').animate({ opacity: '0.5' }, 1000);
        this.cur_img = this.imgs[index];
        // $('#LoveContainer').css('background-image', `url(${this.imgs_url[index]})`);
        // $('#LoveContainer').animate({opacity:"0"},6000);
        // $('#LoveContainer').backstretch('next');

        // self.$options.methods.setText.bind(self)(this.imgs_desc[index]);
        // index = index === 0 ? this.imgs_url.length - 1 : index - 1;
        // $('#carousel').carousel('next');
        // randomtime = (Math.random()*6+8)*1000;
      }, 10000);
    }, (err) => {
      console.log(`Fail to get imgs_description.\nErr:${err}`);
    },
    );
  },
  methods: {
    beforeDestroy() {
      clearInterval(this.timer);
    // $('#app').css('background-color', '#fff');
    },

    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    // calTextSize(text) {
    //   const line = parseInt(text.length / 25);
    //   let fontSize = (60 / line - line * 5) * 0.8;
    //   if (fontSize < 15)fontSize = 15;
    //   else if (fontSize > 32)fontSize = 32;
    // },

    // setText(text) {
    //   // $('#say').hide();
    //   const line = parseInt(text.length / 25);
    //   let fontSize = (60 / line - line * 5) * 0.8;
    //   if (fontSize < 15)fontSize = 15;
    //   else if (fontSize > 32)fontSize = 32;
    //   $('#say').css('font-size', `${fontSize}px`);
    //   this.sayText = text;
    // 最大高度
    // const maxHeight = 100;
    // 初始化文字大小为最小

    // // 循环修改大小直至大于最大高度
    // for (let i = 15; i < 90; i++) {
    //   if ($('#say').height() > maxHeight) {
    //   // 当容器高度大于最大高度的时候，上一个尝试的值就是最佳大小。
    //     $('#say').css('font-size', `${i - 2}px`);
    //     // 结束循环
    //     break;
    //   } else {
    //   // 如果小于最大高度，文字大小加1继续尝试
    //     $('#say').css('font-size', `${i}px`);
    //   }
    // }

    // $('#say').fadeToggle('slow');
    // },
  },
};
</script>

<style scoped>
 @font-face {
      font-family: 'JournalRegular';
      src: url('../fonts/journal-webfont.eot');
      src: url('../fonts/journal-webfont_162a16fe.eot') format('embedded-opentype'),
      url('../fonts/journal-webfont.woff') format('woff'),
      url('../fonts/journal-webfont.ttf') format('truetype'),
      url('../fonts/journal-webfont.svg') format('svg');
      /* font-weight: normal; */
      /* font-style: normal; */
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
      font-size: 1em;
      display: block;
  }

  .modal-content {
      background: #040404;
      position:fixed;
      width:40%;
      height:50%;
      min-width:400px;
      max-width:1000px;
  }

  .time-font {
      color: rgb(240, 231, 231);
      font-size:1.7em;
  }

</style>
