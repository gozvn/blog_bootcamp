'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('postcategories', {
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
    await queryInterface.addConstraint('postcategories', {
    fields: ['post_id', 'cat_id'],
    type: 'primary key',
    name: 'post_category_pkey'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('postcategories');
  }
};