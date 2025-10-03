const req = require("express/lib/request");
const userService = require("../services/userServices");
const res = require("express/lib/response");

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      error: 1,
      message: "Missing email or password",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.error,
    message: userData.message,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; //ALL, id

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }

  let user = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    user,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.CreateNewUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters !",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let getAllCode=async(req,res)=>{
  try{
    let data=await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  }catch(e){
    console.log('Get all code error:',e);
    return res.status(200).json({
      errCode:-1,
      errMessage:'Error from server'
    })
  }
}
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode:getAllCode
};
