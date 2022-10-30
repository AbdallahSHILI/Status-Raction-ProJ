const mongoose = require("mongoose");

//Schema of a message
const messageSchema = new mongoose.Schema({
  Message: {
    type: String,
    required: [true, "Please put your message !! "],
    minlength: 2,
  },
  UserID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Read: {
    type: Boolean,
    default: false,
    select: true,
  },
  CreationDate: {
    type: Date,
    default: Date.now(),
  },
});

//MODEL SCHEMA
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
