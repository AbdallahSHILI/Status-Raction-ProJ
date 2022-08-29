const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const dotenv = require("dotenv");
require("dotenv").config;

//get token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create and send token => to USE
const createSendToken = (user, statusCode, res) => {
  // 3ayetelha
  const token = signToken(user._id);
  // Remove password from output pour la secrete
  user.password = undefined;
  res.status(statusCode).json({
    status: "succès",
    token,
    data: {
      user,
    },
  });
};

//login
exports.login = async (req, res, next) => {
  try {
    //1)check if email and password exist in req.body
    const { Email, password } = req.body;
    if (!Email || !password) {
      return res.status(404).json({
        status: "echec",
        message: "You must enter an email and password !",
      });
    }
    //2) check if useremail exists && password is correct password exist
    const user = await User.findOne({ Email }).select("+password");
    if (!user || !(await user.validatePassword(password, user.password))) {
      return res.status(401).json({
        status: "echec",
        message: "Invalid email or password ",
      });
    }
    //3) if evrything ok , send token to the client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: "echec",
      message: err,
    });
  }
};

//signup
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      Email: req.body.Email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(404).json({
      status: "echec",
      message: err,
    });
  }
};

//protect routes => authorize just the logged  user
exports.protect = async (req, res, next) => {
  // 1)GETTING TOKEN AND CHECK OF IT'S THERE
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      status: "echec",
      message: "You are not connected ! You need to be connected to acces !! ",
    });
  }
  // 2) VERIFICATION TOKEN
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // 3) IF THE USER STILL EXIST
  const currentUser = await User.findById(decoded.id);
  //decoded.id is the id of the user logged in
  if (!currentUser) {
    return res.status(401).send({
      status: "echec",
      message: "User of this token no longer existe !! ",
    });
  }
  // Grand access to protected route
  req.user = currentUser;
  next();
};

//restrict to admin , client , employee
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: "echec",
        message: "You don't have the permission to do this action !! ",
      });
    }
    next();
  };
};
