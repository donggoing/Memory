<template lang="html">
  <div id="album">

    <!-- <a id="header" href="https://github.com/lfyfly/vue-waterfall-easy" target="_blank" -->
      <!-- title="github of vue-waterfall-easy">vue-waterfall-easy</a> -->
      <!-- <button :style="{position:'fixed',zIndex:10000}"
      @click="changeImgArr">changeImgArr</button> -->

    <div id="content">
      <vue-waterfall-easy ref="waterfall" :gap="10" :imgWidth="260" :maxCols="5" :imgsArr="imgsArr" @scrollReachBottom="getData"
        @imgError="imgErrorFn">
        <!-- <div slot-scope="props" class="img-info">
          <p class="some-info">第{{props.index+1}}张图片</p>
          <p class="some-info">{{props.value.info}}</p>
        </div> -->
        <div class="content-wrap" slot-scope="props">
            <h1 class="entry"><a :href="props.value.href" class="featured-image">{{props.value.info}}
            <br>
            <span class="view">
                <!-- -view- -->
                <a href="javascript:void(0);" class="edit_icon" @click="showEdit(props)">
                  <i class="el-icon-edit"></i>
                </a>
            </span>
        </a>
            </h1>
        </div>
      </vue-waterfall-easy>
    </div>
      <el-dialog title="你可是在篡改记忆哟" :model="editing" :visible.sync="editVisible" width="80%" id="dia" >
        <el-image :lazy='true' id="edit_img" width="100%" height="100%" style="width:auto;;position:relative;display:block;" :src="editing.imgUrl"></el-image>
        <div>
          <el-input type="textarea" :rows="5" width='30%' v-model="editing.description"></el-input>
          <el-button
              type="text"
              icon="el-icon-edit"
              style="height:30px"
              @click="handleSubmit()"
          >提交</el-button>
        </div>
      </el-dialog>
  </div>

  <!-- //-div(slot="waterfall-head")
  h1 waterfall-head
  h1 waterfall-head
  //- 自定义加载动画
  //-div(slot="loading" slot-scope="{isFirstLoad}")
  div(slot="loading" v-if="isFirstLoad") first-loading...
  div(v-else) loading... -->
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy';

export default {
  name: 'Album',

  data() {
    return {
      imgsArr: [],
      group: 0, // 当前加载的加载图片的次数
      groupSize: 5,
      pullDownDistance: 0,
      showHeader: false,
      editVisible: false,
      editing: {
        imgUrl: '',
        description: '',
        uploadTime: '',
        index: -1,
      },
      editObj: null,
    };
  },
  components: {
    vueWaterfallEasy,
  },

  methods: {
    getData() {
      this.$http.get(`/love-record/imgs?group=${this.group}&groupSize=${this.groupSize}`) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个静态json文件模拟
        .then((res) => {
          this.group++;
          const data = res.data;
          if (data.final) {
            this.$refs.waterfall.waterfallOver();
            return;
          }
          this.imgsArr = this.imgsArr.concat(data);
        });
    },
    showEdit(props) {
      const memory = props.value;
      this.editing.imgUrl = memory.src;
      this.editing.index = memory.index;
      this.editing.description = memory.info;
      this.editing.uploadTime = memory.uploadTime;
      this.editObj = props;
      this.editVisible = true;
    },
    handleSubmit() {
      this.$http.patch(
        '/love-record/img',
        { img_index: this.editing.index, description: this.editing.description },
      ).then((data) => {
        data = data.data;
        if (data.success) {
          this.$message('成功修改');
          this.imgsArr[this.editing.index].info = this.editing.description;
          // this.editObj.info =
          this.editVisible = false;
        }
      }, (err) => {
        this.$message('修改失败');
      });
    },
    // clickFn(event, {
    //   index,
    //   value,
    // }) {
    //   // event.preventDefault()
    //   if (event.target.tagName.toLowerCase() === 'img') {
    //     console.log('img clicked', index, value);
    //   }
    // },
    imgErrorFn(imgItem) {
      console.log('图片加载错误', imgItem);
    },
    // changeImgArr() {
    //   this.$http.get('./static/mock/data-change.json') // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个静态json文件模拟
    //     .then((res) => {
    //       this.imgsArr = res.data;
    //     });
    // },
    pullDownMove(pullDownDistance) {
      // console.log('pullDownDistance', pullDownDistance)
      this.pullDownDistance = pullDownDistance;
    },
    pullDownEnd(pullDownDistance) {
      console.log('pullDownEnd');
      if (this.pullDownDistance > 50) {
        // alert('下拉刷新');
        this.$message('下拉刷新');
      }
      this.pullDownDistance = 0;
    },
  },
  created() {
    this.getData();
    // 删除某个卡片
    // setTimeout(()=>{
    //   this.imgsArr.splice(1,1)
    // },2000)
  },
};

</script>

<style>
* {
  margin: 0;
  padding: 0;
}

a {
  color: #000;
  text-decoration: none;
}
a:active {
  color: #000;
}

html,
body,
#album {
  height: 100%;
}

.edit_icon {
  color: #fff;
}

#dia {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 90%;
  display: flex;
}

.content-wrap {
  padding: 0;
  position: absolute;
  text-align: center;
  width: 100%;
  top: 0;
  bottom: 0;
  display: table-cell;
  vertical-align: middle;
}

#album .el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: 90% !important;
  overflow-y: auto;
  display: inline-block;
  position: relative;
}

.content-wrap h1.entry {
  display: table;
  font-size: 1.2em;
  height: 100%;
  width: 100%;
  margin: 0;
}

.featured-image {
  display: table-cell;
  position: relative;
  transition: opacity 0.25s ease-in-out, background 0.25s ease-in-out;
  -moz-transition: opacity 0.25s ease-in-out, background 0.25s ease-in-out;
  -webkit-transition: opacity 0.25s ease-in-out, background 0.25s ease-in-out;
  vertical-align: middle;
  z-index: 1;
  color: #fff;
  text-decoration: none;
  opacity: 0;
  width: 100%;
  height: auto;
  left: -5px;
  -ms-transition: opacity 0.25s ease-in-out, background 0.25s ease-in-out;
  -o-transition: opacity 0.25s ease-in-out, background 0.25s ease-in-out;
}

.featured-image:hover {
  opacity: 0.9;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
}

#album {
  position: relative;
  background-color: #fff;
}
#album #header {
  display: block;
  text-align: center;
  background: #000;
  color: #cccccc;
  line-height: 32px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  position: fixed;
  z-index: 999;
  width: 100%;
}
#album #content {
  position: absolute;
  top: 20px;
  bottom: 0;
  width: 100%;
}
#album .el-dialog {
  margin-top: 0 !important;
}

#album {
  overflow: auto;
  position: relative;
}
#album .some-info {
  line-height: 1.6;
  text-align: center;
}

</style>
