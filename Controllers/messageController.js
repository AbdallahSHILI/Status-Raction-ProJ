const Message = require("../Models/messageModel");
const User = require("../Models/userModel");

// Send a message to admin by current customer
exports.sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    if (message) {
      // Push the id of current designer in message
      await Message.findByIdAndUpdate(message.id, {
        $push: { UserID: req.user.id },
      });
      return res.status(201).json({
        status: "Success",
        data: {
          message,
        },
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

// Get all messages for admin
exports.getAllMessages = async (req, res, next) => {
  try {
    // Test if there is messages
    const doc = await Message.find();
    return res.status(200).json({
      status: "Success",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

// Get all unread messages for admin
exports.getAllUnreadMessage = async (req, res, next) => {
  try {
    // Test if there is messages
    const doc = await Message.find({ Read: false });
    return res.status(200).json({
      status: "Success",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

// Get one message for admin
exports.getOneMessage = async (req, res, next) => {
  try {
    // Test if there is an message
    let message = await Message.findById(req.params.idMessage);
    if (!message) {
      return res.status(400).send({
        message: "No message with that id !! ",
      });
    }
    // Change status of message
    message.Read = true;
    //save the last changes
    message.save();
    return res.status(200).json({
      status: "Success",
      data: {
        message,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

// Delete one message for admin
exports.deleteOneMessageAdmin = async (req, res, next) => {
  try {
    // Find message and delete it
    const doc = await Message.findByIdAndDelete(req.params.idMessage);
    if (!doc) {
      return res.status(400).json({
        status: "No message with that id !!",
      });
    }
    return res.status(200).json({
      status: "Message deleted !! ",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};
