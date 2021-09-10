<template>
    <div class="header"  @mouseover='hd_style.opacity=0.7' @mouseout='hd_style.opacity=0' :style='hd_style'>
        <div class="header-right">
            <div class="header-user-con">
                <!-- <div class="btn-album" @click="$router.push('/Album')">
                    <el-tooltip effect="dark" :content="`相册`" placement="bottom">
                        <i class="el-icon-menu"></i>
                    </el-tooltip>
                </div> -->
                <router-link :to="{path:'/Diary'}" class="btn-diary">
                  <el-tooltip effect="dark" :content="`爱的日志`" placement="bottom">
                        <!-- <i class="el-icon-rank"></i> -->
                    <i class="el-icon-document"></i>
                  </el-tooltip>
                </router-link>
                <router-link :to="{path:'/'}" class="btn-love">
                  <el-tooltip effect="dark" :content="`Love`" placement="bottom">
                        <!-- <i class="el-icon-rank"></i> -->
                    <i>❤</i>
                  </el-tooltip>
                </router-link>
                <router-link :to="{path:'/NewImg'}" class="btn-newimg">
                  <el-tooltip effect="dark" :content="`新记忆`" placement="bottom">
                        <!-- <i class="el-icon-rank"></i> -->
                    <i class="el-icon-plus"></i>
                  </el-tooltip>
                </router-link>
                <router-link :to="{path:'/Album'}" class="btn-album">
                  <el-tooltip effect="dark" :content="`相册`" placement="bottom">
                        <!-- <i class="el-icon-rank"></i> -->
                    <i class="el-icon-menu"></i>
                  </el-tooltip>
                </router-link>
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>

                <!-- 用户头像 -->
                <!-- <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div> -->
                <!-- 用户名下拉菜单 -->
                <!-- <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
            </div>
        </div>
    </div>
</template>
<script>
import bus from './/bus';

export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: 'anonym',
      message: 2,
      hd_style: { opacity: 0.8 },
    };
  },
  computed: {
    username() {
      const username = localStorage.getItem('username');
      return username || this.name;
    },
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === 'logout') {
        localStorage.removeItem('usertype');
        localStorage.removeItem('username');
        this.$message.success('成功退出');
        this.$router.push('/login');
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      const element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      }
      this.fullscreen = !this.fullscreen;
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    background-color: #fff;
    z-index: 99999;
    /* opacity:.72; */
    /* color: #fff; */
}
el-tooltip{
  z-index:100000;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    font-size: 0.85em;
    width: 50%;
    margin-left:2%;
    line-height: 10%;
}
.header-right {
    float: right;
    padding-right: 10px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
/* .el-icon-menu{
  width: 34px;
  height: 34px;
} */
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 25px;
}

.btn-diary,.btn-love,.btn-newimg,.btn-album{
  margin-right: 10px;
}

.btn-love:visited {TEXT-DECORATION: none}
.btn-love:hover {TEXT-DECORATION: underline}
.btn-love:link {TEXT-DECORATION: none}

.btn-diary,
.btn-love,
.btn-newimg,
.btn-album,
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
