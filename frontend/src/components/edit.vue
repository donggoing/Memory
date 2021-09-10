<template lang="jade">
.wuji-container.center-block
  .wuji-header
    el-row(:gutter="20")
      el-col.wuji-back( :span="1.5")
        el-button(@click="goBack" type="normal")
          i.el-icon-back
      el-col.wuji-category(:span="6")
        el-select.category-select(v-model="categoryId", placeholder="请选择分类")
          el-option(
            v-for="item in categoryList",
            :label="item.name",
            :value="item.id",
            :key="item.id"
          )
            span.category-name {{ item.name }}
            span.category-color(
              :style="{ backgroundColor: '#' + (item.colorHex ? item.colorHex : 'transparent') }"
            )
      el-col(:span="9")
        .label 颜色
        el-select.font-select(v-model="fontcolor", placeholder="请选择字体颜色")
          el-option(
            v-for="item in colorList",
            :label="item",
            :key="item",
            :value="item.substr(1)"
          )
            span.font-name {{ item }}
            span.font-color(:style="{ backgroundColor: item }")
      el-col(:span="7")
        .label 字体
        el-slider(
          v-model="fontsize",
          :min="10",
          :max="40",
          :format-tooltip="formatTooltip"
        )
    el-row(:gutter="20")
      //- el-col(:span="5")
      //- 	div.label 是否同步过客
      //- 	el-switch(v-model="isPassby", on-text="", off-text="")
      el-col(:span="7")
        .label(style="padding-top: 5px") 哪呢~
        el-input.location(:title="location" v-model="location") {{ location }}
      el-col(:span="7")
        .label(style="padding-top: 5px") 天气
        el-select.category-select(style="margin-top: 6px;",v-model="weather", placeholder="天气好吗")
          el-option(
            v-for="item in weatherList",
            :label="item.name",
            :value="item.value",
            :key="item.value"
          )
            span.weather-name {{ item.name }}
            span.weather-icon
              img(:src="item.url")
      //- el-col(:span="8")
      //-   el-date-picker(
      //-     style="margin-top: 6px;",
      //-     v-model="createDate",
      //-     type="datetime",
      //-     placeholder="选择创建日期",
      //-     align="right",
      //-     :picker-options="pickerOptions"
      //-   )
  textarea.wuji-content(:contenteditable="true", v-model="content", :style="styleObject")

  //- el-upload.wuji-upload(
  //-   name="MediaChildren",
  //-   :drag="true",
  //-   :action="`localhost`",
  //-   :auto-upload="false",
  //-   :multiple="true",
  //-   list-type="picture",
  //-   accept=".jpg,.png,.gif,.mp4",
  //-   :file-list="fileList",
  //-   :on-success="fileUploadSuccess",
  //-   :on-error="fileUploadError",
  //-   :on-progress="uploadImgToQiniu"
  //- )
  //-   i.el-icon-upload
  //-   .el-upload__text 将文件拖到此处，或<em>点击上传</em>
  //-   .el-upload__tip(slot="tip")
      //- span 默认只能上传jpg/png文件，且不超过500kb，是否上传小视频(暂时没用)&nbsp;
      //- el-switch(v-model="isUploadVideo", on-text="是", off-text="否", :width="50")
  el-button.wuji-submit(
    @click="doSave"
  ){{isCreate ? '记录' : '修改'}}
</template>
<script>
import Api from '../utils/api';
import { fontColor } from '../config/color';
import weather from '../config/weather';
import * as qiniu from 'qiniu-js';

export default {
  name: 'diarydedit',
  data() {
    return {
      qiniutoken: null,
      domain: 'https://upload-z2.qiniup.com', // 七牛云的上传地址（华南区）
      doUpload: false,
      isCreate: true,
      categoryList: [],
      colorList: fontColor,
      weatherList: weather,
      categoryId: 1,
      fontsize: 14,
      fontcolor: '000000',
      // isPassby: false,
      weather: 0,
      createDate: new Date(),
      location: '',
      content: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
      // isUploadVideo: false,
      fileList: [],
    };
  },
  created() {
    this.getCategoryList();
    this.init();
  },
  mounted() {
    this.getToken();
    if (this.isCreate) {
      this.getLocation();
    }
  },
  computed: {
    styleObject() {
      return {
        fontSize: `${this.fontsize}px`,
        color: `#${this.fontcolor}`,
      };
    },
    // listType(){
    // 	return this.isUploadVideo ? 'text' : 'picture';
    // }
  },
  methods: {
    goBack() {
      if (!this.isCreate) { this.$router.push({ path: 'detail', query: { id: this.$route.query.id } }); } else this.$router.push({ path: 'Diary' });
    },
    getToken() {
      this.$http.get('/admin/qiniutoken').then(
        (data) => {
          if (data.data.success) {
            this.qiniutoken = data.data.token;
          } else this.$message('Failed to get qiniu token');
        },
        (err) => {
          this.$message('Failed to get qiniu token');
          console.log(err);
        },
      );
    },
    // 文件上传
    fileUploadSuccess(response, file, fileList) {
      console.log('上传成功start');
      console.log(response);
      console.log(file);
      console.log(fileList);
      console.log('上传成功end');
      // 从这里获得每次上传的文件，以及文件列表有哪些上传图片信息
    },
    fileUploadError(err, file, fileList) {
      console.log('上传失败start');
      console.log(err);
      console.log(file);
      console.log(fileList);
      console.log('上传失败end');
    },
    // fileUploadProgress(event, file, fileList){
    // 	console.log("上传过程start");
    // 	console.log(event);
    // 	console.log(file);
    // 	console.log(fileList);
    // 	console.log("上传过程end");
    // },
    uploadImgToQiniu(event, file, fileList) {
      const config = {
        useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        region: qiniu.region.z2, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
      };
      const putExtra = {
        fname: file.name, // 文件原文件名
        params: {}, // 用来放置自定义变量
        mimeType: null, // 用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
      };
      const observables = qiniu.upload(
        file.raw,
        null,
        this.qiniutoken,
        putExtra,
        config,
      );
      // this.$Progress.start();
      observables.subscribe({
        next: (result) => {
          // 主要用来展示进度
          console.log(result);
          // this.$Progress.set(result.total.percent);
        },
        error: (errResult) => {
          // 失败报错信息
          console.log(errResult);
        },
        complete: (result) => {
          // 接收成功后返回的信息
          this.$http
            .post('/love-record/img', {
              ...result,
              originName: file.name,
              description: this.description,
            })
            .then(
              (data) => {
                // data = data.data;
                this.$message(`${file.name}上传成功`);
              },
              (err) => {
                this.$message({ message: `${file.name}上传失败，请联系您男友~`, type: 'error' });
                // this.$Progress.fail();
                // this.fileList.push(this.fileList.shift());
                console.log(err);
              },
            );
          // console.log(result);
        },
      });
    },
    init() {
      if (this.$route.query.id) {
        this.isCreate = false;
      } else {
        return;
      }
      this.getDiaryDetail(this.$route.query.id);
    },
    getDiaryDetail(id) {
      const _self = this;
      // const params = { id };
      // params => 参数
      this.$http.get(`/diary/diary?id=${id}`)
        .then((result) => {
          _self.diary = result.data.data;
          _self.initData(result.data.data);
        })
        .catch((error) => {
          this.$message({ message: error, type: 'error', showClose: true });
        });
    },
    initData(data) {
      this.content = data.content.replace(/<br\/>/g, '\r\n');
      this.categoryId = data.categoryId;
      this.fontsize = data.fontsize ? data.fontsize : this.fonesize;
      this.fontcolor = data.fontcolor ? data.fontcolor : this.fontcolor;
      this.weather = data.weather;
      // this.isPassby = data.isPassby === 0 ? false : true;
      this.location = data.address;
      this.createDate = data.createDate ? data.createDate : new Date();
      // this.createDate = new Date(
      //   date.substr(0, 4),
      //   date.substr(4, 2),
      //   date.substr(6, 2),
      //   date.substr(8, 2),
      //   date.substr(10, 2),
      //   date.substr(12, 2),
      // );
      this.fileList = this.transformImages(data.MediaChildren);
    },
    transformImages(mediaChildren) {
      // 暂时不支持视频文件
      if (mediaChildren.length === 0) {
        return [];
      }
      const arr = [];
      mediaChildren.forEach((item) => {
        if (item.mediaType === 1) {
          arr.push({
            name: item.name,
            url: item.Qnurl,
          });
        }
      });
      return arr;
    },
    doSave() {
      // 保存操作，需要对上传图片进行组装
      // alert('保存')
      const params = {};

      const keys = [
        'weather',
        // 'createDate',
        'address',
        'weekday',
        'categoryId',
        'title',
        'fontType',
        'fontsize',
        'fontcolor',
      ];
      if (this.isCreate) this.diary = {};
      // eslint-disable-next-line no-restricted-syntax
      for (let j = 0, len = keys.length; j < len; j++) {
        const k = keys[j];
        if (this[k] !== this.diary[k]) {
          params[k] = this[k];
        }
      }
      params.createDate = new Date();
      params.content = this.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');


      // if (
      //   (this.isCreate && this.fileList.length !== 0) ||
      //   (!this.isCreate &&
      //     this.diary.MediaChildren.length !== this.fileList.length) ||
      //   this.doUpload
      // ) {
      //   params.medias = this.fileList.map(item => ({
      //     type: 1,
      //     img_id: item.img_id,
      //   }));
      // }
      if (!this.isCreate) {
        params.dia_id = this.$route.query.id;
        this.$http.put('/diary/diary', params)
          .then(result =>
            this.$message({
              message: '修改成功~',
              type: 'success',
              duration: 2000,
            }),
          )
          .catch((err) => {
            console.log(err);
            return this.$message({
              message: '修改失败(；′⌒`)',
              type: 'err',
              duration: 2000,
            });
          });
      } else {
        this.$http.post('/diary/diary', params)
          .then(result =>
            this.$message({
              message: '创建成功~',
              type: 'success',
              duration: 2000,
            }),
          )
          .catch((err) => {
            console.log(err);
            return this.$message({
              message: '创建失败(；′⌒`)',
              type: 'err',
              duration: 2000,
            });
          });
      }
    },

    getLocation() {
      // 动态创建script，实现跨域
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      const _self = this;
      script.type = 'text/javascript';
      script.src =
        'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
      head.appendChild(script);
      // eslint-disable-next-line func-names
      script.onreadystatechange = function () {
        if (!this.readyState ||
          this.readyState === 'loaded' ||
          this.readyState === 'complete'
        ) {
          if (remote_ip_info.ret == 1) {
            _self.location =
              remote_ip_info.province +
              remote_ip_info.city +
              remote_ip_info.district;
          } else {
            _self.location = '获取不到定位';
          }
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);
        }
      };
      script.onload = script.onreadystatechange;
    },
    getCategoryList() {
      const _self = this;
      let params;
      // params => 参数
      Api.getCategoryList(params)
        .then((result) => {
          _self.categoryList = result;
        })
        .catch((error) => {
          this.$message({ message: error, type: 'error', showClose: true });
        });
    },
    formatTooltip(font) {
      return `${font}px`;
    },
  },
  components: {},
};
</script>
<style lang="scss">
@import "../stylesheets/scss/index.scss";
$prefix: 'wuji';
.#{$prefix}-container{
    color: #666;
    width: $container-width;
    .#{$prefix}-header{
    padding: 20px 0 10px 0;
    .el-row{
      margin-bottom: 10px;
    }
    .label, .location{
      float: left;
      color: #666;
      margin-top: 7px;
      margin-right: 5px;
      padding: 0;
      font-size: 1em;
      line-height: 30px;
      font-weight: normal;
    }
    .location{
      width: 140px;
      display: inline-block;
      @extend %ellipsis;
    }
    .category-select{
      // display: block;

    }
    .font-select{
      margin-left: 5px;
      width: 248px;
    }
    .el-slider{
      padding-left: 45px;
    }
    .el-switch__core{
      top: 4px;
    }
    .el-date-editor.el-input{
      width: 210px;
    }
    }
  .#{$prefix}-content{
    overflow: auto;
    padding: 10px;
    outline: none;
    text-align: left;
    background-color: $white;
    border: 1px $gray solid;
    height: 500px;
    width: 100%;
    border-radius: 4px;
    &:focus{
      border: 1px $main solid;
    }
  }
  .#{$prefix}-upload{
    margin: 20px 0;
  }
  .#{$prefix}-submit{
    height: 40px;
    // line-height: 40px;
    text-align: center;
    // display: block;
    color: $white;
    width:100%;
    background-color: $main;
    font-size: $size-h3;
    border-radius: 4px;
    margin-bottom: 50px;
  }
}
.el-scrollbar{
  .category-name,
  .weather-name,
  .font-name{
    float: left;
  }
  .category-color,
  .font-color{
    float: right;
    display: inline-block;
    margin-top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
  }
  .weather-icon{
    float: right;
    img{
      width: 20px;
      height: auto;
    }
  }
}
//reset
.el-upload-dragger{
  width: 900px;
}
.el-select-dropdown__item.selected.hover{
  background-color: $main;
}
.el-slider__button:hover, .el-slider__button.hover, .el-slider__button.dragging {
    transform: scale(1.5);
    background-color: $main;
}
</style>
