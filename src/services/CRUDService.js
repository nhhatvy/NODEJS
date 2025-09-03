const { get } = require("express/lib/response");
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
      reject(e); // reject để Promise hoạt động đúng
    }
  });
};

let getALLUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e); // reject để Promise hoạt động đúng
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e); // reject để Promise hoạt động đúng
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();

        let allUsers = await db.User.findAll();
        resolve(allUsers); // trả về user sau khi update
      } else {
        resolve({}); // không tìm thấy user
      }
    } catch (e) {
      reject(e); // nhớ reject nếu có lỗi
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getALLUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
};
