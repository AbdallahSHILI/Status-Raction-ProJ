const mongoose = require("mongoose");
const validator = require("validator");

// reaction Schema
const reactionSchema = new mongoose.Schema({
  React: {
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
  StatusContent: {
    type: String,
    required: [true, "please enter your post content here !! "],
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
  Invisible: {
    type: Boolean,
    default: false,
    select: true,
  },
});

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
