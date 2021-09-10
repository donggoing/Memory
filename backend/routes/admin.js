var express = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var file = require('../method/file');
var jwt = require('jsonwebtoken');
var path = require('path');
var sha256 = require('../method/sha256.compress');
var myqiniu = require('../method/_qiniu');
var config = require('../config.json');
var router = express.Router();

/* 登录验证，登录成功返回true */
router.post('/',function (req, res) {
    var name = req.body.username;
    var password = req.body.password;
    if (name == sha256(config["username"]) && password == sha256(config["password"] )) {
        req.session.logined = true;
        // let tokenStr = await jwt.sign({"username":name},secret,{expiresIn: "1d"})
        return res.json({
            success: true
            // token: tokenStr
        });
    } else {
        return res.json({
            success: false
        });
    }
});

router.get('/qiniutoken', function (req, res){
    if(!(config.accessKey&&config.secretKey&&config.bucket)){
        res.status(500).json({success:false});
    }
    return res.status(200).json({success:true,token:myqiniu.getUploadToken()});
})


module.exports = router;