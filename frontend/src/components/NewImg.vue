<template>

  <div id="Container">
    <div style="text-align: center;padding: 40px">
        <h1 class="top-h1">Our happiness can be managed ...</h1>
    </div>
    <div class="shadow">
        <div class="config-div panel panel-default">
            <h1 class="config-h1">Loading New Memory</h1>
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
              <input id="say" type="text" v-model="description" name="say" placeholder="Record Our Memory"
                class="form-control block-inline">
              <input type="file" name="inputFile" placeholder="upload img" v-on:change="onFileChange"
                class="form-control block-inline">
              <input type="submit" value="upload" @click="submit"
                class="btn btn-success block-inline">
            <!-- </form> -->
         </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewImg',
  data() {
    return {
      description: null,
      uploadFile: null,
      QiniuData: {
        key: '', // 图片名字处理
        token: '', // 七牛云token
      },
      domain: 'https://upload-z2.qiniup.com', // 七牛云的上传地址（华南区）
      qiniuaddr: 'http://xxxx.com', // 七牛云的图片外链地址
      uploadPicUrl: '', // 提交到后台图片地址
      fileList: [],
    };
  },
  mounted() {

  },
  methods: {
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) { return; }
      this.uploadFile = files[0];
    },
    submit() {
      const requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: localStorage.getItem('cx_secret_'),
        },
      };
      const formData = new FormData();
      formData.append('description', this.description);
      formData.append('file', this.uploadFile);
      this.$http.post('/love-record/img', formData, requestConfig).then(
        (data) => {
          data = data.data;
          this.$message('上传成功');
        }, (err) => {
          this.$message('上传失败');
          console.log(err);
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

.top-h1 {
    font-size:50px;
    color: #4ca;;
    font-family: cursive;
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
