var express = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var file = require('../method/file');
var jwt = require('jsonwebtoken');
var path = require('path');
var sha256 = require('../method/sha256.compress');

var secret = "yd_love_ll";
var router = express.Router();

/* 登录验证，登录成功返回true */
router.post('',async function (req, res) {
    var name = req.body.username;
    var password = req.body.password;
    var config = require('../config.json')
    if (name == sha256(config["username"]) && password == sha256(config["password"] )) {
        req.session.logined = true;
        // let tokenStr = await jwt.sign({"username":name},secret,{expiresIn: "1d"})
        res.json({
            success: true
            // token: tokenStr
        });
    } else {
        res.json({
            success: false
        });
    }
});




module.exports = router;