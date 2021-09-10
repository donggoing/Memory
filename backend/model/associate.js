const seq = require('../method/db')
var initModels = require("../model/init-models");
var models = initModels(seq);

exports.n1_cmt_img = models.images.hasMany(models.comments,{as:'comments',foreignKey:'img_id'})
exports.n1_dia_cat = models.diaries.belongsTo(models.categories,{as:'category',foreignKey:'categoryId'})
exports.nm_dia_img = models.diaries.belongsToMany(models.images,{ through:models.diary_media,otherKey:"img_id", foreignKey:"dia_id"})