<template>

  <div id="Container">
    <div style="text-align: center;padding: 40px">
        <h1 class="top-h1">Our happiness can be managed ...</h1>
    </div>
    <div class="shadow">
        <div class="config-div panel panel-default" style="position:relative">
            <h1 class="config-h1" >Loading New Memory</h1>
            <!-- <div style="border:none" class="panel panel-default"> -->
                <!-- <div style="background-color:#fff" class="panel-heading config-title">
                    <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Click
                            me to show current Says.</a></h4>
                </div> -->
                <!-- <div id="collapseTwo" class="panel-collapse collapse">
                    <div id="says" class="panel-body"></div>
                </div> -->
            <!-- </div> -->
            <!-- <h2 class="config-h2">Add Item</h2> -->
            <!-- <form> -->
              <el-input id="say" type="text" v-model="description" name="say" placeholder="Record Our Memory"
              class="input"  ></el-input>
              <!-- <el-input type="file" name="inputFile"  accept="image/*" placeholder="upload img" v-on:change="onFileChange"
              class="input"  ></el-input> -->
              <el-upload
                  class="upload-demo"
                  ref="upload"
                  :on-change="addFile"
                  :file-list="fileList"
                  :action="`localhost`"
                  name="Content"
                  :limit="1"
                  :auto-upload="false">

                <el-button slot="trigger" type="success"  style="margin-top:10px;">加载记忆</el-button>
              </el-upload>
              <el-button type="success" @click="uploadImgToQiniu"  style="margin-top:10px;">上传记忆</el-button>
            <!-- </form> -->

         </div>
    </div>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js';

export default {
  name: 'NewImg',
  data() {
    return {
      description: null,
      uploadFile: null,
      qiniutoken: null,
      domain: 'https://upload-z2.qiniup.com', // 七牛云的上传地址（华南区）
      qiniuaddr: 'http://xxxx.com', // 七牛云的图片外链地址
      // uploadPicUrl: '', // 提交到后台图片地址
      imgLoadPercent: 0,
      fileList: null,

    };
  },
  mounted() {
    this.getToken();
  },
  methods: {
    // empty() { return ''; },
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
    addFile(file, filelist) {
      this.uploadFile = filelist[0];
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) { return; }
      this.uploadFile = files[0];
    },
    // submit() {
    //   const requestConfig = {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       // Authorization: localStorage.getItem('cx_secret_'),
    //     },
    //   };
    //   const formData = new FormData();
    //   formData.append('description', this.description);
    //   formData.append('file', this.uploadFile);
    //   this.$http.post('/love-record/img', formData, requestConfig).then(
    //     (data) => {
    //       data = data.data;
    //       this.$message('上传成功');
    //     }, (err) => {
    //       this.$message('上传失败');
    //       console.log(err);
    //     });
    // },
    // submit(result) {

    // },
    // uploadInputchange() {
    //   const file = document.getElementById('uploadFileInput').files[0]; // 选择的图片文件
    //   this.uploadImgToQiniu(file);
    // },
    // 上传图片到七牛
    uploadImgToQiniu() {
      // const axiosInstance = axios.create({ withCredentials: false }); // withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
      // const data = new FormData();
      // data.append('token', this.qiniutoken); // 七牛需要的token，叫后台给，是七牛账号密码等组成的hash
      // data.append('file', this.uploadFilefile);
      // this.$http({
      //   method: 'POST',
      //   url: this.domain, // 上传地址
      //   data,
      //   timeout: 30000, // 超时时间，因为图片上传有可能需要很久
      //   onUploadProgress: (progressEvent) => {
      //     // imgLoadPercent 是上传进度，可以用来添加进度条
      //     this.imgLoadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   },
      // }).then((result) => {
      //   this.qiniuaddr = result.key;
      //   `${this.qiniuaddr}/${response.key}`;
      //   // document.getElementById('uploadFileInput').value = ''; // 上传成功，把input的value设置为空，不然 无法两次选择同一张图片
      //   // 上传成功...  (登录七牛账号，找到七牛给你的 URL地址) 和 data里面的key 拼接成图片下载地址
      // }).catch((err) => {
      //   // 上传失败
      // });

      // const file = evfile.target.files[0]; // Blob 对象，上传的文件
      // const key = file.name; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

      const config = {
        useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        region: qiniu.region.z2, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
      };

      const putExtra = {
        fname: this.uploadFile.name, // 文件原文件名
        params: {}, // 用来放置自定义变量
        mimeType: null, // 用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
      };
      const observable = qiniu.upload(this.uploadFile, null, this.qiniutoken, putExtra, config);
      this.$Progress.start();
      observable.subscribe({
        next: (result) => {
          // 主要用来展示进度
          console.log(result);
          this.$Progress.set(result.total.percent);
        },
        error: (errResult) => {
          // 失败报错信息
          console.log(errResult);
        },
        complete: (result) => {
          // 接收成功后返回的信息
          this.$http.post('/love-record/img', { ...result, originName: this.uploadFile.name, description: this.description }).then(
            (data) => {
              data = data.data;
              this.$Progress.finish();
              this.$message('上传成功');
            }, (err) => {
              this.$message('上传失败');
              this.$Progress.fail();
              console.log(err);
            });
          // console.log(result);
        },
      });
    },
  },
};
</script>


<style scoped>
/* #Container {
    padding: 80px;
    background: #e6e6e6;
    font: 14px cursive, "Lucida Grande", Helvetica, Arial, sans-serif;
} */
#Container{
  margin:0 auto;
  width:60%;
}

a {
    color: #00B7FF;
}

.input{
  margin:10px
}
/* .btn{

  width:20%;
  min-width:100px;
} */


.top-h1 {
    font-size:50px;
    color: #4ca;;
    font-family: cursive;
}

#file-upload-button{
  display:none
}

.config-h1 {
    font-family: cursive;
    border-bottom: solid;
    padding-bottom: 10px;
    margin-bottom: 40px;
}

.config-h2 {
    font-family: cursive;
}

.config-title {
    font-family: cursive;
}

.config-div {
    background: #fff;
    padding: 50px;
}

.say {
    border-bottom: 1px dashed;
}

.block-inline {
    margin-top: 10px;
    margin-bottom: 10px;
    display: block;
    width: 100%;
}

.shadow{
    box-shadow: 5px 5px 60px #d0cece;
}

@media only screen and (max-width: 600px) {
    #Container {width: 95%;}
}


</style>
