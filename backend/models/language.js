'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Language.hasMany(models.User,{ foreignKey: 'lang_id'});
      Language.hasMany(models.Post,{ foreignKey: 'lang_id'});
    }
  }
  Language.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lang_code: DataTypes.STRING(5),
    lang_name: DataTypes.STRING(50),
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'languages',
    sequelize,
    modelName: 'Language',
  });
  return Language;
};