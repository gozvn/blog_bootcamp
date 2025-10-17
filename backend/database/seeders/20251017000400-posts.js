'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', [
      {
        id: 1,
        thumbnail: 'tech_post.jpg',
        title: 'The Future of AI in 2025',
        content: 'Artificial Intelligence continues to evolve rapidly...',
        user_id: 1, // admin
        status: 'published',
        featured: true,
        lang_id: 2, // English
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        thumbnail: 'travel_post.jpg',
        title: 'Exploring Vietnam: Top 10 Destinations',
        content: 'From Ha Long Bay to Da Lat, Vietnam offers...',
        user_id: 2, // editor
        status: 'published',
        featured: false,
        lang_id: 1, // Vietnamese
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        thumbnail: 'food_post.jpg',
        title: 'Japanese Street Food You Must Try',
        content: 'Takoyaki, Yakitori, and more delicious treats...',
        user_id: 3, // user
        status: 'draft',
        featured: false,
        lang_id: 2, // Japanese
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
