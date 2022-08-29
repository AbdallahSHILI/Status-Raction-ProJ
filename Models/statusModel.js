const mongoose = require("mongoose");
const validator = require("validator");

// reaction Schema
const reactionSchema = new mongoose.Schema({
  react: {
    type: String,
    enum: ["Like", "Love", "Haha", "Sad", "Celebrate", "Support", "Curious"],
    default: "Like",
  },
  UserID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  StatusID: {
    type: mongoose.Schema.ObjectId,
    ref: "Status",
  },
});

// Status Schema
const statusSchema = new mongoose.Schema({
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
  UserID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  Condition: {
    type: String,
    enum: ["open", "close"],
    default: "open",
  },
  Comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  Reaction: [reactionSchema],
  invisible: {
    type: Boolean,
    default: false,
    select: true,
  },
});

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
