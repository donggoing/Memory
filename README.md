# Love Record

功能包括图片管理、瀑布流相册、图片评论、图片主页滚动显示、恋爱计时、背景音乐、日记管理等。

本来因为代码写的有些丑陋加上需要脱敏，不打算继续更新项目了。但是因为有朋友需要，所以更新一下~

首先鸣谢[吾记](https://github.com/xiaobinwu/Wuji)(日记部分进行了借鉴)、[瀑布流实现](https://github.com/lfyfly/vue-waterfall-easy)(美中不足的是不能懒加载)以及[LoveRecord](https://github.com/iamjohnnyzhuang/LoveRecord)(提供了最初的idea以及借鉴了主页风格)。

## 须知

- 需要的资源
    - 首先如果需要公网访问的话需要一台具有公网IP的服务器（可申请阿里云等各云平台的学生优惠）进行部署，且需要安装好mysql(并导入[memory.sql](./memory.sql),创建数据库和表)。
    - 需要注册七牛云并创建用于存储上传的对象存储空间(公开的就行，私有的话后端获取图片链接的[代码](./backend/method/_qiniu.js)需要改一下)。

- 设置项
    - 前端需要设置的只有服务器的地址[frontend/server.json](./frontend/server.json)，如果前后端分离的话则需要确切的http://ip或域名:port；不然的话可以127.0.0.1:port。
    - 后端需要设置的有[backend/config.json](./backend/config.json)以及[backend/method/db.js](./backend/method/db.js)中的信息。

- 个性化设置
    - 音乐播放器现在用的是我的网易云歌单，需要修改的话可在[App.vue](./frontend/src/App.vue)的\<meting-js\>处改成自己的歌单id(在网页版上获取，注意默认的收藏歌单——我最喜欢的音乐好像不行)；
    - 计时起始时间在[backend/routes/love-record.js](backend/routes/love-record.js)的/start接口处修改

另外，还有目前是不区分账号的(两个人用还区分个啥)

## 部署

在上述要求都完成后，实际部署：

在前后端目录下都需要执行：
``` 
npm install
```

- 前后端分离

如果前后端分离部署的话，前后端目录下都执行
```
npm start
```

- 不分离

如果只开后端一个服务的话，则先在前端目录下执行
```
npm run build
```

然后把生成的dist目录下的所有文件拷贝到后端目录的public文件夹下，再在后端目录下执行
```
npm start
```