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

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
