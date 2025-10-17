'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts_tags', [
      {
        post_id: 1, // The Future of AI in 2025
        tag_id: 1,  // AI
      },
      {
        post_id: 2, // Exploring Vietnam
        tag_id: 2,  // Travel
      },
      {
        post_id: 3, // Japanese Street Food
        tag_id: 3,  // Food
      },
      {
        post_id: 1,
        tag_id: 4,  // Education (AI + Education)
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts_tags', null, {});
  }
};
