// 只是测试用
var urlencode = require('urlencode');
const { getDownloadUrl } = require('../method/_qiniu.js');
const seq = require('../method/db')
var initModels = require("../model/init-models");

var models = initModels(seq);


models.diaries.findAll({
    where:{
        'is_del':false
    },
    include:[
        {
            association: models.diaries.belongsToMany(models.images,{ through:models.diary_media,otherKey:"img_id", foreignKey:"dia_id"}),
            // required: false,
            where:{
                'is_del':false
            }
        },
        {
            association: models.diaries.belongsTo(models.categories,{as:'category',foreignKey:'categoryId'}),
        }
    ]
}).then(results=>{
        results = results.map(result=>{
            dataValues = result.dataValues;
            dataValues.MediaChildren=dataValues.images.map(image=>{
                image.dataValues.Qnurl = getDownloadUrl(urlencode(image.name)+"?imageView2/0/interlace/1/q/50|imageslim");
                image.dataValues.mediaType = image.diary_media.type
                delete image.diary_media;
                return image.dataValues;
            })
            dataValues.categoryName = dataValues.category.name
            dataValues.categoryId = dataValues.category.id
            dataValues.colorHex = dataValues.category.colorHex
            delete dataValues.images
            delete dataValues.category
            return dataValues
        })
        console.log(results)
    },
    err=>console.log(err)
    )

