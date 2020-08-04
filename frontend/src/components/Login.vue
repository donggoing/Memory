<template>

  <div style="background: #58666b">
      <div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" class="modal">
          <div style="margin-top: 13%;" class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 id="myModalLabel" class="modal-title">Sign Up Admin System</h4>
                  </div>
                  <div class="modal-body">
                      <form><label for="username">username: </label><input id="username" type="text" placehol
                              der="input your username" name="username" class="form-control"><label
                              for="password">password: </label><input id="password" type="password"
                              placeholder="input your password" name="password" class="form-control"></form>
                  </div>
                  <div class="modal-footer"><button id="reset" type="button" @click='reset' class="btn btn-default">reset</button><button
                          id="login" type="button" @click='login' class="btn btn-success">sign in</button></div>
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
    $(() => {
      $('#myModal').modal({
        backdrop: false,
      });
    });
  },
  methods: {
    login() {
      this.$http.post('/admin', {
        username: sha256($('#username').val()),
        password: sha256($('#password').val()),
      }).then((data) => {
        data = data.data;
        if (data.success) {
          localStorage.setItem('cx_secret_', data.token);
          // this.$store.commit('addToken', data.token);
          window.location.href = '/';
        } else {
          console.log('账号、密码错误，请重新输入!');
          this.$message('账号、密码错误，请重新输入!');
        }
      },
      (err) => {
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
