'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('UserToken', {
    user_id: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  }, {
    tableName: 'user_tokens',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  UserToken.associate = (models) => {
    UserToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserToken;
};
