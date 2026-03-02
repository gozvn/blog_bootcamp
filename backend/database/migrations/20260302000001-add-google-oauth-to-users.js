'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Thêm cột google_id để lưu Google sub (unique ID từ Google)
        await queryInterface.addColumn('users', 'google_id', {
            type: Sequelize.STRING(255),
            allowNull: true,
            unique: true,
            after: 'id',
        });

        // Thêm cột auth_provider để biết user đăng ký bằng cách nào
        await queryInterface.addColumn('users', 'auth_provider', {
            type: Sequelize.ENUM('local', 'google'),
            allowNull: false,
            defaultValue: 'local',
            after: 'google_id',
        });

        // Sửa password thành nullable (user Google không có password)
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'google_id');
        await queryInterface.removeColumn('users', 'auth_provider');
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.STRING,
            allowNull: false,
        });
    }
};
