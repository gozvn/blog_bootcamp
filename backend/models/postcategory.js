'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class postCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  postCategory.init({
    post_id: { type: DataTypes.INTEGER, primaryKey: true },
    cat_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'postCategory',
  });
  return postCategory;
};