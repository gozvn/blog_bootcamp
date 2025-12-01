'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Comment.belongsTo(models.Post, { as: 'post', foreignKey: 'post_id' });
      Comment.hasMany(models.Comment, { as: 'replies', foreignKey: 'parent_id' });
      Comment.belongsTo(models.Comment, { as: 'parent', foreignKey: 'parent_id' });
    }
  }
  Comment.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'comments',
    sequelize,
    modelName: 'Comment',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Comment;
};