<template lang="jade">
    div.wuji-container.center-block(v-if="diary")
        div.wuji-header
            div.wuji-category
                {{diary.categoryName}}
                div.wuji-page
                    i.el-icon-arrow-left(@click="getDiaryDetail($route.query.id,1)")
                    i.el-icon-arrow-right(@click="getDiaryDetail($route.query.id,2)")
                div.wuji-operate
                    i.el-icon-delete(@click="del")
                    i.el-icon-edit(@click="edit")
                    //- el-popover(ref="popover1", placement="bottom", trigger="hover")
                    //-     i.el-icon-share(slot="reference")
                    //-     share(:description="description", :title="diary.content.substr(0,20) + '...'", :q-code-position="true")
            div.wuji-title
                span.date {{diary.createDate | date}}
                span.time {{diary.createDate | time}}
                span.weekday {{diary | weekday}}
                span.weather
                    img(:src="diary.weather | weather")
                span.address
                    i.fa.fa-map-marker
                    {{diary.address}}
        //- div.wuji-content(:style="styleObject"{{diary.content|process}}
        textarea.wuji-content(:contenteditable="false",readonly, :style="styleObject") {{ diary.content|process }}
        //- div.wuji-other(v-if="diary.MediaChildren.length > 0")
        //-     el-row(:gutter="20")
        //-         el-col.wuji-category(:span="6", v-for="(item, index) in media")
        //-             el-card.card(:body-style="{ padding: '5px' }")
        //-                 div.img-container(@click="showImg(item, index)")
        //-                     template(v-if="(!checkVideo && item.type === 2) || item.type === 1")
        //-                         img(:src="item.url")
        //-                         div.mask(v-if="item.type === 2")
        //-                             i.fa.fa-video-camera
        //-                     template(v-else)
        //-                         video(:src="item.src", controls, preload)
        //-                 div.dec {{item.name}}
        //- fancy-box(:list="mediaImg", :visible="visible", :position="position", @close="closeFancyBox")
</template>
<script>
import Vue from 'vue';
// import Api from '../utils/api';
// import obj from '../utils/object';
import weather from '../config/weather';
import weekday from '../config/weekday';
import Browser from '../utils/browser';
import fancyBox from './fancyBox';
// import share from './share';
import { Message, MessageBox, Card, Row, Col, Popover } from 'element-ui';

Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Popover);
export default{
  name: 'diarydetail',
  data() {
    return {
      position: 0,
      visible: false,
      allCategory: this.$route.query.allCategory,
      checkVideo: Browser.checkVideo(),
      description: '吾记，属于你的心灵港湾',
      // preDetailId: null,
      // nextDetailId: null,
      diary: null,
      diaryList: [],
    };
  },
  props: {
  },
  created() {
    this.init();
    // this.diaryList = this.$route.params.diaryList;
    // this.getAdjacentDetail();
  },
  mounted() {
  },
  computed: {
    styleObject() {
      return {
        fontSize: `${this.diary.fontsize}px`,
        color: `#${this.diary.fontcolor}`,
      };
    },
    media() {
      return this.getMediaArr();
    },
    mediaImg() {
      return this.getMediaArr(true);
    },
  },
  watch: {
    $route: 'init',
  },
  methods: {
    init() {
      // if (!this.$route.query.id) this.$router.push({ path: 'Diary' });
      // if (!this.diary) { this.getDiaryDetail(this.$route.query.id); }
      if (this.$route.params.diary !== undefined) {
        this.diary = this.$route.params.diary;
        this.$route.query.id = this.diary.id;
      } else if (this.$route.query.id === undefined) this.$router.push({ path: 'Diary' });
      else this.getDiaryDetail(this.$route.query.id);
    },

    getDiaryDetail(id, type = 0) {
      let url = `/diary/diary?id=${id}&type=${type}`;
      if (this.allCategory == 'false' && type !== 0 && this.diary != null) {
        url += `&categoryId=${this.diary.categoryId}`;
      }
      const _self = this;
      // params = { id };
      // params => 参数
      this.$http.get(url).then((result) => {
        // if(type===0)
        if (type !== 0) {
          if (result.data.data) {
            _self.diary = result.data.data;
            this.$router.push({ name: 'diarydetail', query: { id: _self.diary.id, allCategory: this.allCategory }, params: { diary: _self.diary } });
          } else Message({ message: '暂无内容，期待吧！', type: 'info', showClose: false, duration: 2000 });
        } else _self.diary = result.data.data;
      }).catch((error) => {
        Message({ message: error, type: 'error', showClose: true });
      });
    },
    // // 获取上下篇章
    // getAdjacentDetail() {
    //   /*
    //     异步操作
    //   */
    //   this.preDetailId = 1;
    //   this.nextDetailId = 2;
    // },
    showImg(item, index) {
      if (item.type === 2) {
        return;
      }
      this.position = index;
      this.visible = true;
    },
    getMediaArr(flag) {
      const arr = [];
      const len = this.diary.MediaChildren.length;
      for (let i = len - 1; i >= 0; i--) {
        if (this.diary.MediaChildren[i].mediaType === 2) {
          if (flag) { continue; }
          arr.push({
            type: this.diary.MediaChildren[i].mediaType,
            url: this.diary.MediaChildren[i].videoThumbnail,
            name: this.diary.MediaChildren[i].url,
            src: this.diary.MediaChildren[i].Qnurl,
          });
        } else {
          arr.push({
            type: this.diary.MediaChildren[i].mediaType,
            url: this.diary.MediaChildren[i].Qnurl,
            name: this.diary.MediaChildren[i].url,
          });
        }
      }
      return arr;
    },
    del() {
      MessageBox.confirm('是否确定删除该日记', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post('/diary/delDiary', { dia_id: this.$route.query.id }).then((result) => {
          Message({ message: '删除成功',
            type: 'success',
            showClose: false,
            duration: 1000,
            onClose: () => {
              console.log('已关闭');
              this.$router.push({ path: 'Diary' });
            } });
        }, (err) => {
          Message({ message: err, type: 'error', showClose: true });
        });
      }).catch(() => {
        Message({ message: '已取消删除', type: 'info', showClose: false, duration: 1000 });
      });
    },
    edit() {
      this.$router.push({ path: 'edit', query: { id: this.$route.query.id } });
    },
    closeFancyBox() {
      this.visible = false;
      setTimeout(() => { this.position = 0; }, 800);
    },
  },
  filters: {
    date(date) {
      return date.substr(0, 10);
    },
    time(date) {
      return `${date.substr(11, 2)}:${date.substr(14, 2)}`;
    },
    weekday(item) {
      return weekday[(new Date(item.createDate).getDay() + 6) % 7].name;
    },
    weather(index) {
      return weather[index].url;
    },
    process(content) {
      return content.replace(/<br\/>/g, '\r\n');
    },
  },
  components: {
    fancyBox,
  },
};
</script>
<style lang="scss" scoped>
@import "../stylesheets/scss/index.scss";
  $prefix: 'wuji';
  .#{$prefix}-container{
      width: $container-width;
      margin-bottom: 20px;
      .#{$prefix}-header{
          background-color: $white;
          padding: 0 10px;
          border-bottom: 1px #efefef solid;
          .#{$prefix}-category{
              height: 50px;
              line-height: 50px;
              text-align: center;
              font-size: $size-h2;
              .#{$prefix}-operate,
              .#{$prefix}-page{
                  float: right;
                  font-size: $size-h3;
                  i{
                      color: $main;
                      cursor: pointer;
                  }
                  .el-icon-delete,.el-icon-edit{
                      margin-right: 20px;
                  }
              }
              .#{$prefix}-page{
                  float: left;
                  i{
                      margin-right: 20px;
                  }
              }
          }
          .#{$prefix}-title{
              padding: 10px 0;
              height: 50px;
              line-height: 30px;
              span:not(:last-child){
                  margin-right: 10px;
              }
              .date{
                  font-size: $size-h2;
              }
              .weather{
                  img{
                      width: 30px;
                      height: auto;
                      vertical-align: sub;
                  }
              }
              .address{
                  float: right;
                  i{
                      color: $main;
                      margin-right: 5px;
                      font-size: $size-h2;
                  }
              }
          }
      }
      .#{$prefix}-content{
          overflow: auto;
          padding: 10px 20px;
          outline: none;
          background-color: $white;
          height: 500px;
          width:100%;
          text-align: justify;
          border-bottom: 1px #efefef solid;
      }
      .#{$prefix}-other{
          background-color: $white;
          padding: 20px 0;
          .card{
              margin: auto;
              width: 200px;
              height: 260px;
              .img-container{
                  width: 100%;
                  height: 200px;
                  cursor: pointer;
                  img{
                      // position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      margin: auto;
                      max-height: 100%;
                      max-width: 100%;
                  }
                  .mask{
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      text-align: center;
                      font-size: 28px;
                      background-color: rgba(0,0,0,.5);
                      i{
                          margin-top: 50%;
                      }
                  }
              }
              .dec{
                  margin-top: 10px;
                  overflow: hidden;
                  word-break: break-all;
              }
              video{
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  margin: auto;
                  max-height: 100%;
                  max-width: 100%;
              }
          }
      }
  }

</style>
