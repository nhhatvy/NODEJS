"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // đảm bảo bảng Users đã tồn tại và có 2 cột timestamps
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "admin@gmail.com",
          password: "123456", // plaintext password, should be hashed in production
          firstName: "Admin",
          lastName: "123",
          address: "Hà Nội",
          gender: "1",
          typeRole: "ROLE",
          keyRole: "R1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
