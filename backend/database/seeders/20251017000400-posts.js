'use strict';
const {faker} = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    const post = [];
    for ( let i = 1; i <= 100; i++){
      post.push ({
        id: i,
        thumbnail: 'assets/images/no-image.jpg',
        title: faker.lorem.sentence(6),
        slug : faker.lorem.slug(3),
        content: faker.lorem.paragraph(3),
        user_id: faker.number.int({min:1,max:3}),
        status: faker.helpers.arrayElement(['draft','published']),
        featured: faker.datatype.boolean(),
        lang_id: faker.number.int({min:1,max:2}),
        created_at : faker.date.past({years:1}),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('posts', post, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
