'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        cat_name: 'Technology',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        cat_name: 'Travel',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        cat_name: 'Food',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        cat_name: 'Education',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
