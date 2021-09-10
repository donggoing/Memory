<template lang="jade">
transition(name="fancy", mode="out-in")
  .fancy(v-show="visible")
    #box.box(v-for="(item, index) in list", :index="index", v-show="index === pos")
      transition(name="fancy", mode="out-in")
        .imgs
          img(
            :src="item.src",
            :style="imgStyle",

          )
      .comment-container
        i.el-icon-close(@click="close")
        .desc
          el-input.description(v-model="item.info",id="description", resize="none",type="textarea",size="medium", :rows="4"  )
          el-button(
                type="primary" round
                icon="el-icon-edit"
                style="position: relative;bottom: 10px"
                @click="handleDdit(item)")
            {{"修改"}}
        .comments
          div(style="margin:20px 0; color:gray; border-bottom:2px dotted gray")
            p{{"都说了啥捏~"}}
          .comment(v-if="item.comments && item.comments.length>0" v-for="(comment,index) in item.comments")
            p(style="margin:5px;font-family: fantasy;"){{comment.createDate | date}}
            p(style="margin: 5px;font-family: fantasy;font-size: 15px"){{comment.detail}}
          el-input.newComment(v-model="item.newComment", type="textarea",size="medium", :rows="4" placeholder="想说点啥捏~"  )
          el-button(
            type="primary" round
            icon="el-icon-edit"
            style="position: relative;bottom: 10px"
            @click="handleSubmit(item)"){{"提交"}}

    .pagination
      .prev.step(@click="prev")
      .next.step(@click="next")
    .mask

</template>
<script>
import Browser from '../utils/browser';

export default {
  name: 'fancyBox',
  filters: {
    date(dateStr, format = 'yyyy-MM-dd hh:mm:ss') {
      const dateTime = new Date(dateStr);
      const z = {
        y: dateTime.getFullYear(),
        M: dateTime.getMonth() + 1,
        d: dateTime.getDate(),
        h: dateTime.getHours(),
        m: dateTime.getMinutes(),
        s: dateTime.getSeconds(),
      };
      return format.replace(/(y+|M+|d+|h+|m+|s+)/g, v => ((v.length > 1 ? '0' : '') + eval(`z.${v.slice(-1)}`)).slice(-(v.length > 2 ? v.length : 2)));
      // return `${date.substr(0, 10)} ${date.substr(11, 2)}:${date.substr(14, 2)}`;
    },
  },
  props: {
    list: {
      type: Array,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isie: Browser.isIE(),
      winWidth: this.isie
        ? document.documentElement.clientWidth
        : window.innerWidth,
      winHeight: this.isie
        ? document.documentElement.clientHeight
        : window.innerHeight,
      paginationTop: 0,
      pos: this.position,
    };
  },
  mounted() {
    this.init();
    window.addEventListener('keyup', this.handleKeyup);
    // window.addEventListener('scroll',this.handleScroll)
  },
  computed: {
    imgStyle() {
      return {
        maxHeight: `${this.winHeight}px`,
        maxWidth: `${this.winWidth - 200}px`,
      };
    },
  },
  watch: {
    position(val) {
      this.pos = val;
    },
  },
  methods: {
    handleKeyup(event) {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if (!e) return;
      const { key, keyCode } = e;
      if (keyCode === 27) this.close();
      else if (document.activeElement.id != 'description') {
        if (keyCode === 37) this.prev();
        else if (keyCode === 39) this.next();
      }
      // console.log(keyCode);
      // console.log(key);
    },
    handleDdit(item) {
      const _self = this;
      this.$http.patch(
        '/love-record/img',
        { img_index: item.index, description: item.info },
      ).then((data) => {
        data = data.data;
        if (data.success) {
          _self.$message({ message: '成功修改', duration: 3000 });
          // TODO 索引修改
          // this.imgsArr[this.editing.arrInd].info = this.editing.description;
          // this.editObj.info =
          // this.editVisible = false;
        }
      }, (err) => {
        _self.$message({ message: '修改失败', type: 'error', duration: 3000 });
      });
    },
    handleSubmit(item) {
      this.$http.post(
        '/love-record/comment',
        { img_index: item.index, detail: item.newComment },
      ).then((data) => {
        data = data.data;
        if (data.success) {
          this.$message({ message: '成功啦~' });
          item.newComment = '';
          item.comments = item.comments.concat(data.result);
          // TODO 索引修改
          // this.imgsArr[this.editing.arrInd].info = this.editing.description;
          // this.editObj.info =
          // this.editVisible = false;
        }
      }, (err) => {
        console.log(err);
        this.$message({ message: '评论失败', type: 'error' });
      });
    },
    init() {
      window.a = this;
      const _self = this;
      this.box = document.getElementById('box');
      window.onresize = () => {
        _self.winWidth = _self.isie
          ? document.documentElement.clientWidth
          : window.innerWidth;
        _self.winHeight = _self.isie
          ? document.documentElement.clientHeight
          : window.innerHeight;
      };
    },
    close() {
      this.$emit('close');
    },
    prev() {
      if (this.pos == 0) {
        return;
      }
      this.pos--;
    },
    next() {
      const index = this.pos;
      if (this.pos == this.list.length - 1) {
        this.$parent.getData();
        this.$message({ message: '当前图片已显示完毕，正在尝试加载更多图片~' });
        return;
      }
      this.pos++;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
@import "../stylesheets/scss/_variables.scss";
@import "../stylesheets/scss/_transition.scss";
@mixin position($position){
  position: $position;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.fancy{
  @include position(fixed);
  z-index: 999;
  .box{
    @include position(fixed);
    z-index: 1001;
    .imgs{
        position: absolute;
        margin: auto;
        top: 0;
        left:0;
        bottom:0;
        height:100%;
        width:70%;
      img{
        @include position(absolute);
        // position: absolute;
        margin: auto;
        max-width: 100% !important;
        // width: 100%;
        // top: 0;
        // left:0;
        // bottom:0;
        // height:auto;
        // width:70%;
      }
    }
    .comment-container{
      position: absolute;
      margin: auto;
      overflow-y:scroll;
      // top: 100px;
      display:block;
      right:0;
      bottom:0;
      height:100%;
      width:30%;
      background:white;
      .desc{
          position:relative;
          float:left;
          // top:70px;
          width:100%;
          // margin:5px;
          min-height:100px;
          margin-top: 70px;
          // border: 2px solid red;
        .description{
          // position:relative;
          // float:left;
          // top:100px;
          width:75%;
          margin:5px;
          height:100px
        }
      }
      .comments{
        position:relative;
        float:left;
        // margin-top:5px;
        width:100%;
        // border: 2px solid black;
        // height:100%;
        .comment{
          text-align: left;
          width:100%;
          margin:5px;
          border-bottom: 1px solid gray;
          // height:100px
          min-height:35px;
        }
        .newComment{
          width:75%;
          margin:5px;
          margin-top:10px;
          height:100px
        }
      }
    }
  }
  .mask{
    @include position(fixed);
    z-index: 1000;
    background-color: rgba(0,0,0,.9);
  }
  .pagination{
    position: absolute;
    top: 50%;
    left:35%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70px;
    z-index: 1003;
    .step{
      background: url(../images/banner_arrow.png) no-repeat;
      width: 70px;
        height: 70px;
        cursor: pointer;
    }
    .next{
      margin-right: 20px;
      float: right;
      background-position: left bottom;
    }
    .prev{
      float: left;
      margin-left: 20px;
      background-position: left top;
    }
  }
  .el-icon-close{
    position: absolute;
    right: 35px;
    top: 70px;
    font-size: 20px;
    color: $gray;
    z-index: 99900;
    cursor: pointer;
  }
}
</style>
