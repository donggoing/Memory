var express = require('express');
var file = require('../method/file.js')
var config = require('../config.json');
var urlencode = require('urlencode');
// var sequelize = require('sequelize')
const { getDownloadUrl } = require('../method/_qiniu.js');
const {n1_dia_cat,nm_dia_img} = require('../model/associate')

const sequelize = require('../method/db')
var initModels = require("../model/init-models");
var models = initModels(sequelize);

let Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router = express.Router();
// 获取所有日志类别
router.get('/categories',(req,res)=>{
    return models.categories.findAll({
        include:[
            {
                association: models.categories.hasMany(models.diaries),
                required: false,
                attributes: ["id"],
                where:{
                    "is_del":false
                }
            }
        ],
    }).then(results=>{
            results = results.map(result=>{
                result.dataValues['diaryCount']=result.diaries.length
                delete result.dataValues.diaries
                return result.dataValues
            })
            return res.json({
                code:200,
                msg:'查询成功',
                data:results
            })
            },
            err=> res.status(500).json({
                code:500,
                success:false,
                msg:err
            })
        )
})

// 新建日志类别
router.post('/category',(req,res)=>{
    return models.categories.create({
            name:req.body.name,
            colorHex:req.body.colorHex
        }).then(result=>{
            result.dataValues["diaryCount"] = 0
            return res.json({
                code:200,
                msg:'查询成功',
                data: result.dataValues
            })
            },
            err=> res.status(500).json({
                code:500,
                success:false,
                msg:err
            })
        )
})

// 修改指定日志类别（类别名以及颜色属性）
router.put('/editCategory',(req,res)=>{
    const {id} = req.body;
    patch = {}
    if(req.body.name){
        patch.name = req.body.name
    }
    if(req.body.colorHex){
        patch.colorHex = req.body.colorHex
    }
    if(!id || Object.keys(patch).length===0){
       return res.status(400).json({
            success:false,
            msg:"Lack of index or data"
        })
    }

    return models.categories.update(patch,{
            where:{
                id:id
            }
        }).then(result=>{
            patch.id = id
            return res.json({
                code:200,
                msg:'查询成功',
                data:patch
            })
            },
            err=> res.status(500).json({
                code:500,
                success:false,
                msg:err
            })
        )
})

// 删除指定类别id的日志类别
router.post('/delCategory',(req,res)=>{
    const {id} = req.body;
    if(!id){
        return res.status(400).json({
            code:400,
            success:false,
            msg:"Lack of index"
        })
    }
    models.categories.destroy(
        {
            where:{
                id:id
        }
    }).then(
        result=> res.json({
            code:200,
            success:true,
            result:result
        })
    ,
    err=>{
        console.log(err)
        return res.status(500).json({
            success:false,
            msg:err
        })
    })
})

// 获取所有的日志
router.get('/diaries',(req,res)=>{
    return models.diaries.findAll({
        where:{
            'is_del':false
        },
        include:[
            {
                association: nm_dia_img,
                required: false,
                // limit: 1,
                where:{
                    'is_del':false
                }
            },
            {
                association: n1_dia_cat
            }
        ],
        order:[['id','DESC']]
    }).then(results=>{
            results = results.map(result=>{
                dataValues = result.dataValues;
                dataValues.MediaChildren=dataValues.images.map(image=>{
                    image.dataValues.Qnurl = getDownloadUrl(urlencode(image.name)+"?imageView2/0/interlace/1/q/50|imageslim");
                    image.dataValues.mediaType = image.diary_media.type;
                    image.dataValues.createDate = image.dataValues.time;
                    delete image.dataValues.diary_media;
                    delete image.dataValues.time;
                    return image.dataValues;
                })
                dataValues.categoryName = dataValues.category.name
                dataValues.categoryId = dataValues.category.id
                dataValues.colorHex = dataValues.category.colorHex
                delete dataValues.category
                delete dataValues.images
                return dataValues
            })
            return res.status(200).json({
                code:200,
                msg:'查询成功',
                data:results
            })
            }
    ).catch(
        err=> res.status(500).json({
            code:500,
            success:false,
            msg:err
        })
    )
})

// 获取指定id的日志
router.get('/diary',(req,res)=>{
    let {id,type,categoryId} =  req.query;
    let ops = ["$eq","$lt","$gt"]
    let query = {
        where:{
            'id':id,
            'is_del':false
        },
        include:[
            {
                association: nm_dia_img,
                required: false,
            },
            {
                association: n1_dia_cat
            }
        ]
    }
    if(type==1){
        query.where.id={[Op.lt] : id}
        query.order=[['id','DESC']]
    }
    else if(type==2){
        query.where.id={[Op.gt] : id}
    }
    if(categoryId){
        query.where.categoryId=categoryId
    }
    return models.diaries.findOne(query).then(result=>{
        if(result){
            dataValues = result.dataValues;
            dataValues.MediaChildren=dataValues.images.map(image=>{
                image.dataValues.Qnurl = getDownloadUrl(urlencode(image.name)+"?imageView2/0/interlace/1/q/50|imageslim");
                image.dataValues.mediaType = image.diary_media.type;
                image.dataValues.name = image.originName;
                delete image.dataValues.diary_media;
                return image.dataValues;
            })
            dataValues.categoryName = dataValues.category.name
            dataValues.categoryId = dataValues.category.id
            dataValues.colorHex = dataValues.category.colorHex
            delete dataValues.images
            delete dataValues.category
        }
        return res.json({
            code:200,
            msg:'查询成功',
            data:result
        })
        },
        err=> res.status(500).json({
            code:500,
            success:false,
            msg:err
        })
    )
})

// 创建新日志
router.post('/diary',(req,res)=>{
    return sequelize.transaction(function (t) {
        return models.diaries.create(req.body,
            {transaction: t})
        .then(function (result) {
            if(!req.body.medias){
                return Promise.resolve({result,transaction: t});
            }
            medias = req.body.medias;
            medias = medias.map(media=>{
                media['dia_id']=result.id
            })
            return models.diary_media.bulkCreate(medias,{transaction: t})
            })
    }).then(function (result) {
        return res.json({
            code:200,
            msg:'更新成功'
        })
      }).catch(function (err) {
        // 事务已被回滚
        // err 是拒绝 promise 链返回到事务回调的错误
            console.log(err)
            return res.status(500).json({
                code:500,
                success:false,
                msg:err
            })
      });
})

// 修改某个id的日志
router.put('/diary',(req,diariesres)=>{
    const {dia_id} = req.body;
    if(!dia_id){
       return res.status(400).json({
            code:400,
            success:false,
            msg:"Lack of index"
        })
    }
    
    diary_key = ['content','weather','createDate','address','weekday','categoryId','title','fontType','fontsize','fontcolor']
    diary = {}
    try{
        let keys = Object.keys(req.body);
        for(let j = 0,len=diary_key.length; j < len; j++) {
            const k = diary_key[j];
            if(keys.indexOf(k)!==-1)
                diary[k] = req.body[k]
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            code:500,
            success:false,
            msg:err
        })
    }
    return sequelize.transaction(function (t) {
        return models.diaries.update(diary,{
            where:{
            'id':dia_id
        }, transaction: t})
        .then(function (result) {
            if(!req.body.medias){
                return Promise.resolve({result,transaction: t});
            }
            return models.diary_media.destroy({where:{
                dia_id:result_id
            } , transaction: t}).then(des_res=>{
                    medias = req.body.medias;
                    medias = medias.map(media=>{
                        media['dia_id']=result.id
                    })
                    return models.diary_media.bulkCreate(medias,{transaction: t})
                })
            });
      }).then(function (result) {
        return res.json({
            code:200,
            msg:'更新成功'
        })
      }).catch(function (err) {
        // 事务已被回滚
        // err 是拒绝 promise 链返回到事务回调的错误
            console.log(err)
            return res.status(500).json({
                code:500,
                success:false,
                msg:err
            })
      });
})


// router.put('/media',(req,res)=>{
//     const {media_id} = req.body;
//     patch = {}
//     if(req.body.img_id){
//         patch.img_id = req.body.img_id
//     }
//     if(req.body.mediaType){
//         patch.type = req.body.mediaType
//     }
//     if(!media_id || Object.keys(patch).length===0){
//         return res.status(400).json({
//             success:false,
//             msg:"Lack of index or data"
//         })
//     }
//     models.diary_media.update(patch,{
//         where:{
//             id:media_id
//         }
//     }).then(
//         result=> res.status(200).json({success:true})
//     ,
//     err=>{
//         console.log(err)
//         return res.status(500).json({
//             success:false,
//             msg:err
//         })
//     })
// })

// router.post('/delMedia',(req,res)=>{
//     const {media_id} = req.body;
//     if(!media_id){
//         return res.status(400).json({
//             success:false,
//             msg:"Lack of index"
//         })
//     }
//     models.diary_media.destroy({
//         where:{
//             id:media_id
//         }
//     }).then(
//         result=> res.status(200).json({success:true})
//     ,
//     err=>{
//         console.log(err)
//         return res.status(500).json({
//             success:false,
//             msg:err
//         })
//     })
// })

// 删除某个id的日志(假删除)
router.post('/delDiary',(req,res)=>{
    const {dia_id} = req.body;
    if(!dia_id){
       return res.status(400).json({
            code:400,
            success:false,
            msg:"Lack of index"
        })
    }
    return models.diaries.update({
        is_del: true     
        },{
        'where':{
            id:dia_id
        }
        })
        .then(
            result=>{
                return res.json({
                    code:200,
                    msg:'查询成功',
                    data:result
                })
            },
            err=>{
                return res.status(500).json({
                    code:500,
                    success:false,
                    msg:"delete failed.\n"+err
                })
            }
        )
})

module.exports = router;
