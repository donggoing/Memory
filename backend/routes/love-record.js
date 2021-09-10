var express = require('express');
var file = require('../method/file.js')
var config = require('../config.json');
var urlencode = require('urlencode');
const { getDownloadUrl } = require('../method/_qiniu.js');
const seq = require('../method/db')
var initModels = require("../model/init-models");
const {n1_cmt_img} = require('../model/associate')


var models = initModels(seq);
// var UUID = require('uuid');
// var path = require('path');
// var fs = require('fs');
// var multiparty = require('multiparty');

var router = express.Router();

// router.use(async function(req, res, next){
//     // if (req.method==="OPTIONS")
//     //   return res.send()
//     // let token = req.headers.token;
//     next();
//   })

// 获取在一起的时间用于计时
router.get('/start',function (req, res){
    return res.json({start:'2021-09-10 00:00:00'});
})

/* 获取所有图片链接和语句 */
router.get('/imgs_desc', function (req, res) {
    return models.images.findAll({
            attributes: ['name','desc'],
            where:{is_del:false,forDiary:false}
          }).then(results=>{
            return res.status(200).json(results.map((result)=>{
                return {
                    url: getDownloadUrl(urlencode(result.name)+"?imageView2/0/interlace/1/q/50|imageslim"),
                    desc: result.desc
                }
            }))
            },
            (err)=>{
                return res.status(500).json({
                    success:false,
                    msg:err
                })
            })
})

// /* 获取所有图片下载地址 */
// router.get('/imgs_name', function (req, res) {
//     return file.read().then((records)=>{
//         // let prefix = '/images/love-record/'
//         res.json(records['images_name'].map(file=>getDownloadUrl(urlencode(file))));
//     },(err)=>{
//         return res.status(500).json({
//             success:false,
//             msg:err
//         })
//     })
// });

// 获取所有部分图片链接
router.get('/imgs',(req,res)=>{
    let group =  req.query.group ? parseInt(req.query.group) : 0;
    let groupSize = req.query.groupSize ? parseInt(req.query.groupSize) : 10;
    let justDel = req.query.justDel ? parseInt(req.query.justDel) : 0;
    let start = group*groupSize-justDel;
    let end = start+groupSize; 
    return models.images.findAndCountAll({
        order:[['id','DESC']],
        offset:start,
        limit: groupSize,
        where:{is_del:false,forDiary:false},
        include:[
            {
                association: n1_cmt_img,
                required: false,
                where:{
                    "is_del":false
                }
            }
        ]
    }).then((records)=>{
        if(start>=records.count){
            return res.json({
                'final':true
            })
        }
        let result = records.rows.map((record)=>{
            src = getDownloadUrl(record.name+"?imageView2/0/interlace/1/q/50|imageslim") // 如果不需要压缩图片可以把后面加的那部分去掉
            return {
                'index':record.id,
                'src': src,
                'href' : src,
                'info' : record.desc,
                'uploadTime': record.time,
                'comments': record.comments
            }
        })
        result['final'] = records.count - 1 <= end
        res.json(result);
    },(err)=>{
        return res.status(500).json({
            success:false,
            msg:err
        })
    })
})

// 修改指定图片的描述
router.patch('/img',(req,res)=>{
    const {img_index,description} = req.body;
    if(!img_index || !description){
       return res.status(400).json({
            success:false,
            msg:"Lack of index or description"
        })
    }
    return models.images.update(
        {
            desc: description
        },
        {
            'where':{
                id:img_index
            }
        })
        .then(
            result=>{
                    return res.status(200).json({success:true})
            },
            err=>{
                return res.status(500).json({
                    success:false,
                    msg:"Update failed.\n"+err
                })
            }
        )

})

// 提交对图片的评论（评论可以有多条，但是一张图片的描述只有一条）
router.post('/comment',(req,res)=>{
    const {img_index,detail} = req.body;
    if(!img_index || !detail){
       return res.status(400).json({
            success:false,
            msg:"Lack of index or detail"
        })
    }
    return models.comments.create(
        {
            detail: detail,
            img_id:img_index,
            createDate:new Date()
        })
        .then(
            result=>{
                // result.createDate = new Date(new Date(result.createDate)+ 8 * 60 * 60 * 1000);
                return res.status(200)
                    .json({
                        success:true,
                        result:result
                    })
            },
            err=>{
                return res.status(500).json({
                    success:false,
                    msg:"Update failed.\n"+err
                })
            }
        )

})

/* 
上传图片
key: 前端上传图片到七牛云后返回的key
*/
router.post('/img', function (req, res, next) {
    const data = req.body;
    if(data.key&&data.hash){
        newFileName = data.key;
        return models.images.create({
            name: data.key,
            originName: data.originName,
            desc: data.description
        }).then(
            succ=>{
                return res.status(200).json({success:true});
            },
            err=>{
                console.log(err)
                return res.status(500).json({
                    success:false,
                    msg:err
                })
            }
        )
    }
    else{
        return res.status(400).json({
            success:false,
            msg:err
        })
    }
})

// 删除指定图片
router.post('/delImg',(req,res)=>{
    const {img_index} = req.body;
    if(!img_index){
       return res.status(400).json({
            success:false,
            msg:"Lack of index"
        })
    }
    return models.images.update({
        is_del: true     
        },{
        'where':{
            id:img_index
        }
        })
        .then(
            result=>{
                    return res.status(200).json({success:true})
            },
            err=>{
                return res.status(500).json({
                    success:false,
                    msg:"delete failed.\n"+err
                })
            }
        )

})


// router.post('/img', function (req, res, next) {
//     //生成multiparty对象，并配置上传目标路径
//     var form = new multiparty.Form({
//         uploadDir: path.join(__dirname,'../public/images/love-record/')
//     });
//     var max = 0;
//     var newFileName,originalFilename,description;
//     //上传完成后处理
//     form.parse(req, function (err, fields, files) {
//         var filesTmp = JSON.stringify(files, null, 2);
//         if (err) {
//             console.log('parse error: ' + err);
//             return res.status(400).json({
//                 success:false,
//                 msg:err
//             })
//         } else {
//             var inputFile = files.file[0];
//             var uploadedPath = inputFile.path;
//             description = fields.description[0];
//             originalFilename = inputFile.originalFilename

//             return file.read().then((records)=>{
//                 newFileName = `${UUID.v1()}.${originalFilename.split('.')[1]}`;
//                 var dstPath = path.join(__dirname,'../public/images/love-record/' + newFileName);
//                 return fs.rename(uploadedPath, dstPath, function (err) {
//                     if (err) {
//                         console.log('rename error: ' + err);
//                         return res.status(500).json({
//                             success:false,
//                             msg:err
//                         })
//                     } else {
//                         console.log('rename ok');
//                         //写入says信息
//                         file.append({'name':newFileName,'words':description});
//                         return res.json({success:true})
//                     }
            
//                 });
//             },(err)=>{
//                 return res.status(500).json({
//                     success:false,
//                     msg:err
//                 })
//             })
//         }

//     });
// });

module.exports = router;
