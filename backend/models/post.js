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
      Post.belongsToMany(models.Category, {
          through : models.PostCategory, foreignKey : 'post_id', as : 'categories'
      });
      Post.belongsToMany(models.Tag, {
          through : models.PostTag, foreignKey : 'post_id', as : 'tags'
      });
      Post.hasMany(models.Comment, { foreignKey: 'post_id'});
      Post.belongsTo(models.User, { foreignKey : 'user_id'});
      Post.belongsTo(models.Language, {foreignKey : 'lang_id'});
    }
  }
  Post.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thumbnail: DataTypes.STRING(100),
    slug: DataTypes.STRING(255),
    title: DataTypes.STRING(255),
    cat_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER,
    content: DataTypes.TEXT('long'),
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    featured: DataTypes.BOOLEAN,
    lang_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'posts',
    sequelize,
    modelName: 'Post',
    timestamps: false,  
    createdAt: 'created_at', // ánh xạ
    updatedAt: 'updated_at', // ánh xạ
  });
  return Post;
};