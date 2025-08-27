const db = require("../models/index");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

// Hàm băm mật khẩu
let hashUserPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

// Hàm tạo user mới
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Nếu password gửi lên là mảng thì lấy phần tử đầu tiên
      const rawPassword = Array.isArray(data.password)
        ? data.password[0]
        : data.password;

      const hashedPassword = await hashUserPassword(rawPassword);

      await db.User.create({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });

      resolve(" User created successfully!");
    } catch (e) {
      console.error("Error in createNewUser:", e);
      reject(e); // reject để Promise hoạt động đúng
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
};
