'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comments', [
      {
        id: 1,
        content: 'Great article! Very informative.',
        user_id: 2, // editor
        post_id: 1, // AI post
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        content: 'I’ve been to Da Lat — truly beautiful!',
        user_id: 3, // user
        post_id: 2, // Travel post
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        content: 'Takoyaki is my favorite street food!',
        user_id: 1, // admin
        post_id: 3, // Food post
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
