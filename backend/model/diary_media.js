/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diary_media', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    img_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'images',
        key: 'id'
      }
    },
    dia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diaries',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'diary_media'
  });
};
