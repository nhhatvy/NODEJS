import db from "../models/index";
import bcrypt from "bcryptjs";
import { createNewUser } from "./CRUDService";

const salt = bcrypt.genSaltSync(10);
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

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // User already exist
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          // compare password
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.error = 0;
            userData.message = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.error = 3;
            userData.message = "Wrong password";
          }
        } else {
          userData.error = 2;
          userData.message = "User not found";
        }
      } else {
        // return error
        userData.error = 1;
        userData.message =
          "Your email isn't exist in our system. Please try another email!";
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email }, // fix: dùng đúng biến email
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: { exclude: ["password"] },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let CreateNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage:
            "Your email is already in used, Please try another email !",
        });
      } else {
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
      }

      resolve({
        errCode: 0,
        message: "Ok",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: "User isn't exist ! ",
      });
    }
    // console.log("check : ", foundUser);
    await db.User.destroy({
      where: { id: userId },
    });

    resolve({
      errCode: 0,
      errMessage: "User is deleted ! ",
    });
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters ! ",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();
        // await db.User.save({
        //   firstName : data.firstName,
        //   lastName : data.lastName,
        //   address : data.address,
        // })
        resolve({
          errCode: 0,
          message: "Update the user success ! ",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found",
        });
      }

      let allUsers = await db.User.findAll();
      resolve(allUsers); // trả về user sau khi update
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  CreateNewUser: CreateNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
};
