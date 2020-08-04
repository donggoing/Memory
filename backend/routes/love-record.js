var express = require('express');
var file = require('../method/file.js')
var config = require('../config.json')
var UUID = require('uuid');
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');

var router = express.Router();

/* 获取所有语句 */
router.get('/imgs_words', function (req, res) {
    return file.read().then((records)=>{
        res.json(records['images_words']);
    },(err)=>{
        return res.status(500).json({
            success:false,
            msg:err
        })
    })
})

/* 获取所有图片名 */
router.get('/imgs_name', function (req, res) {
    return file.read().then((records)=>{
        let prefix = '/images/love-record/'
        res.json(records['images_name'].map(file=>prefix+file));
    },(err)=>{
        return res.status(500).json({
            success:false,
            msg:err
        })
    })
});

router.get('/imgs',(req,res)=>{
    let group = req.query.group ? req.query.group : 0;
    let groupSize = req.query.groupSize ? req.query.groupSize : 10;
    let start = group*groupSize;
    let end = start+groupSize; 
    return file.read().then((records)=>{
        if(start>=records.current){
            return res.json({
                'final':true
            })
        }
        let prefix = '/images/love-record/'
        let img_index = records["images_index"].slice(start,end);
        let src =  records['images_name'].slice(start,end).map(file=>config.remote + prefix + file);
        let info = records['images_words'].slice(start,end);
        let time = records['images_time'].slice(start,end);
        let result = src.map((value,index)=>{
            return {
                'index':img_index,
                'src': value,
                'href' : value,
                'info' : info[index],
                'uploadTime': time[index]
            }
        })
        result['final'] = end >= records['current']-1
        res.json(result);
    },(err)=>{
        return res.status(500).json({
            success:false,
            msg:err
        })
    })
})

router.patch('/img',(req,res)=>{
    const {img_index,description} = req.body;
    if(!img_index || !description){
       return res.status(400).json({
            success:false,
            msg:"Lack of index or description"
        })
    }
    return file.update(img_index, description).then(
        (result)=>{
            return res.status(200).json({success:true})
        },
        (err)=>{
            return res.status(400).json({
                success:false,
                msg:"Update failed"
            })
        }
    )

})

/* Love Record */
/* 上传*/
router.post('/img', function (req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: path.join(__dirname,'../public/images/love-record/')
    });
    var max = 0;
    var newFileName,originalFilename,description;
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
            return res.status(400).json({
                success:false,
                msg:err
            })
        } else {
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            description = fields.description[0];
            originalFilename = inputFile.originalFilename

            return file.read().then((records)=>{
                newFileName = `${UUID.v1()}.${originalFilename.split('.')[1]}`;
                var dstPath = path.join(__dirname,'../public/images/love-record/' + newFileName);
                return fs.rename(uploadedPath, dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                        return res.status(500).json({
                            success:false,
                            msg:err
                        })
                    } else {
                        console.log('rename ok');
                        //写入says信息
                        file.append({'name':newFileName,'words':description});
                        return res.json({success:true})
                    }
            
                });
            },(err)=>{
                return res.status(500).json({
                    success:false,
                    msg:err
                })
            })
        }

    });
});

module.exports = router;