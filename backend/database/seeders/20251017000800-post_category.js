'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('postcategories', [
      {
        post_id: 1, // The Future of AI in 2025
        cat_id: 1   // Technology
      },
      {
        post_id: 2, // Exploring Vietnam
        cat_id: 2   // Travel
      },
      {
        post_id: 3, // Japanese Street Food
        cat_id: 3   // Food
      },
      {
        post_id: 1,
        cat_id: 4   // Education
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('postcategories', null, {});
  }
};
