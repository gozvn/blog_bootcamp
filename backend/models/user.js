'use strict';
const { post } = require('index');
const {
  Model
} = require('sequelize');
const language = require('./language');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post,{ foreignKey: 'user_id' });
      User.belongsTo(models.Language,{ foreignKey: 'lang_id'});
      User.hasMany(models.Comment, { foreignKey: 'user_id' });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    lang_id : DataTypes.INTEGER,
    role: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'users',
    sequelize,
    modelName: 'User',
    createdAt: 'created_at', // ánh xạ
    updatedAt: 'updated_at' // ánh xạ
  });
  return User;
};