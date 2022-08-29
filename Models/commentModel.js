const mongoose = require("mongoose");
const validator = require("validator");

//Schema of comment
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "please enter your comment !! "],
    minlength: 2,
  },
  UserID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  StatusID: {
    type: mongoose.Schema.ObjectId,
    ref: "Status",
  },
  DateCreation: {
    type: Date,
    default: Date.now(),
  },
});

//MODEL SCHEMA
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
