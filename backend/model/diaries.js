/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diaries', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    weekday: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weather: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fontType: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    fontsize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fontcolor: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'diaries',
    classMethods: {
        associate: function (models) {
          models.diaries.belongsToMany(models.images,{ through:models.diary_media,otherKey:"img_id", foreignKey:"dia_id"})
          models.diaries.belongsTo(models.categories,{as:'category',foreignKey:'categoryId'})
        }
    }
  });
};
