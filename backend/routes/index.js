var express = require('express');
var router = express.Router();
var path = require('path')

// /* 首页*/
// router.get('/',function (req,res,next) {
//   res.sendFile('../public/index');
// 	// res.render(path.resolve(__dirname,'../views/index.jade'));
// 	// res.sendFile(path.resolve(__dirname,'../views/index.html'));
// });

// /* LoveRecord */
// router.get('/love-record', function(req, res, next) {
// 	res.render(path.resolve(__dirname,'../views/love-record/index.jade'));
// });


// /* 管理员页面 */
// router.get('/admin', function(req, res) {
// 	res.render(path.resolve(__dirname,'../views/admin/login.jade'));
// });

// router.get('/kit',function(req,res){
// 	res.render(path.resolve(__dirname,'../views/super-tool-kit/science.jade'));
// });

module.exports = router;
