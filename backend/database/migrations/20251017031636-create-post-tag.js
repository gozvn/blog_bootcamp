'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts_tags', {
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
    
    await queryInterface.addConstraint('posts_tags', {
      fields: ['post_id', 'tag_id'],
      type: 'primary key',
      name: 'post_tag_pkey'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts_tags');
  }
};