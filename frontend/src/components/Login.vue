<template>

  <div style="width:100%; height:100%;position:absolute;top:0; background: #58666b">
      <div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" class="modal">
          <div style="margin-top: 13%;" class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 id="myModalLabel" class="modal-title">Enter Our Memory</h4>
                  </div>
                  <div class="modal-body">
                      <form>
                        <label for="username">username: </label><input id="username" type="text" placehol
                              der="input your username" name="username" class="form-control">
                        <label for="password">password: </label>
                          <input id="password" type="password"  v-on:keyup.enter="login"
                              placeholder="input your password" name="password" class="form-control">
                      </form>
                  </div>
                  <div class="modal-footer">
                    <button id="reset" type="button" @click='reset' class="btn btn-default">reset</button>
                    <button id="login" type="button" @click='login' class="btn btn-success">sign in</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>


<script>
import '../javascripts/sha256.compress';
// import '../javascripts/bootstrap.min';

export default {
  name: 'Login',
  data() {
    return {
    };
  },
  created() {
    // $(() => {
    //   $('#myModal').modal({
    //     backdrop: true,
    //   });
    // });
  },
  methods: {
    login() {
      this.$http.post('/admin', {
        username: sha256($('#username').val()),
        password: sha256($('#password').val()),
      }).then((data) => {
        data = data.data;
        if (data.success) {
          // localStorage.setItem('cx_secret_', data.token);
          // this.$store.commit('addToken', data.token);
          // window.location.href = '/';
          this.$router.push('/');
        } else {
          console.log('账号、密码错误，请重新输入哟~');
          this.$message('账号、密码错误，请重新输入哟~');
        }
      },
      (err) => {
        this.$message('后台错误，请联系你男朋友~');
        console.log(err);
      },
      );
    },
    reset() {
      $('#username').val('');
      $('#password').val('');
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
}
.modal-content {
  position: fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  width: 50%;
  height: 50%;
  margin:auto;
}
</style>
