'use strict';
const {faker} = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    const comments = [];
    for ( let i = 1; i <= 200; i++){
      comments.push ({
        id: i,
        content: faker.lorem.sentences(2),
        parent_id: faker.number.int({min:1,max:50}),
        user_id: faker.number.int({min:1,max:3}),
        post_id: faker.number.int({min:1,max:100}),
        created_at : faker.date.past({years:1}),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('comments', comments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
