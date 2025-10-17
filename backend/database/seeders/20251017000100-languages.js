'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('languages', [
      {
        id: 1,
        lang_code: 'vi',
        lang_name: 'Tiếng Việt',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        lang_code: 'en',
        lang_name: 'English',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('languages', null, {});
  }
};
