'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(models.Post, {
         through : models.PostCategory, foreignKey : 'cat_id'
      })
    }
  }
  Category.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cat_name: DataTypes.STRING(255),
    thumbnail: DataTypes.STRING(100),
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'categories',
    sequelize,
    modelName: 'Category',
  });
  return Category;
};