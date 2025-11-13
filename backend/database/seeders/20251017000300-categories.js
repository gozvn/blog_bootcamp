'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Technology',
        slug: 'technology',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Travel',
        slug: 'travel',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Food',
        slug: 'food',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Education',
        slug: 'education',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
