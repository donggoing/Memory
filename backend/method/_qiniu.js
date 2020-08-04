var qiniu = require('qiniu');
var config = require('../config.json')

var mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
var qnconfig = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, qnconfig);
var privateBucketDomain = config.privateBucketDomain;
var deadline = parseInt(Date.now() / 1000) + 24*3600; // 24小时过期
var options = {
    scope: config.bucket,
    // expires: 7200
};
var putPolicy = new qiniu.rs.PutPolicy(options);

getUploadToken = function(){
    return putPolicy.uploadToken(mac);
}

getDownloadUrl = function(key){
   return bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
}


exports.getUploadToken = getUploadToken;
exports.getDownloadUrl = getDownloadUrl;