'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Post, {
          through : models.PostTag, foreignKey : 'tag_id', as : 'posts'
        });
    }
  }
  Tag.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(100),
    slug: DataTypes.STRING(100),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'tags',
    sequelize,
    modelName: 'Tag',
    createdAt: 'created_at', // ánh xạ
    updatedAt: 'updated_at', // ánh xạ
  });
  return Tag;
};