var DataTypes = require("sequelize").DataTypes;
var _images = require("./images");
var _diaries = require("./diaries");
var _diary_media = require("./diary_media");
var _categories = require("./categories");
var _comments = require("./comments");


function initModels(sequelize) {
  var images = _images(sequelize, DataTypes);
  var diaries = _diaries(sequelize, DataTypes);
  var diary_media = _diary_media(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);

  return {
    images,
    diaries,
    diary_media,
    categories,
    comments
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
