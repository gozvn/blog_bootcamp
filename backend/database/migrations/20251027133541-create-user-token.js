'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_tokens', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // tên bảng users
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    token: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
    type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'refresh' // hoặc 'reset_password', tùy loại token
      },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user_tokens');

  }
};
