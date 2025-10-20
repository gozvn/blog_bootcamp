'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostCategory.init({
    post_id: { type: DataTypes.INTEGER, primaryKey: true },
    cat_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'postcategories',
    sequelize,
    modelName: 'PostCategory',
    timestamps: false,
  });
  return PostCategory;
};