'use strict';
const bcrypt = require('bcryptjs'); // ✅ import đúng thư viện
const { bcrypt: bcryptConfig } = require('../../configs/hashing'); // ✅ import config

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Mã hoá password 123456
    const hashedPassword = await bcrypt.hash('123456', bcryptConfig.rounds);

    await queryInterface.bulkInsert('users', [
      {
        avatar: null,
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        avatar: null,
        username: 'moderator',
        password: hashedPassword,
        email: 'mod@example.com',
        role: '2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        avatar: null,
        username: 'user',
        password: hashedPassword,
        email: 'user@example.com',
        role: '3',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        avatar: null,
        username: 'guest',
        password: hashedPassword,
        email: 'guest@example.com',
        role: '4',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};