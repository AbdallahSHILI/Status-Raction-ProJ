const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const SALT_WORK_FACTOR = 10;

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name "],
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "please enter your email ! "],
    validate: [validator.isEmail, "Please fill a valid email !! "],
  },
  password: {
    type: String,
    required: [true, "please enter your password "],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password !! "],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.MotDePasse;
      },
      message: "Passwords are not the same !!",
    },
  },
  phoneNumber: {
    type: Number,
    required: [true, "please enter your phone number !! "],
    minlength: 8,
  },
  role: {
    type: String,
    default: "client",
    enum: ["admin", "client"],
  },
  Friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  // Status maked by user
  MyStatus: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Status",
    },
  ],
  Requests: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  RequestsSend: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  Profil: {
    type: String,
    default: "Open",
    enum: ["Open", "Close"],
  },
});

//2) validate password
userSchema.methods.validatePassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
