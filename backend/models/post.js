'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thumbnail: DataTypes.STRING(100),
    title: DataTypes.STRING(255),
    content: DataTypes.TEXT('long'),
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    featured: DataTypes.BOOLEAN,
    lang_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};