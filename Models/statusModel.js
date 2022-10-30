const mongoose = require("mongoose");
const validator = require("validator");

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
  Reaction: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Reaction",
    },
  ],
  WhoReact: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  Invisible: {
    type: Boolean,
    default: false,
    select: true,
  },
});

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
