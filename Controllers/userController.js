const factoryOne = require("./factoryOne");
const User = require("../models/UserModel");

//get current user using the getUserByID
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.findAllClients = async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await User.find({ role: client });
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.findAllAdmins = async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await User.find({ role: admin });
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.findOne = async (req, res, next) => {
  try {
    // Test if there is a document
    let doc = await User.findById(req.params.id);
    if (!doc) {
      return "No doc with that id !! ";
    }
    return res.status(200).json({
      status: "succès",
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user.id == req.params.id) {
      // Update new changes
      let doc = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      // Test if document was update successfuly
      if (doc) {
        return res.status(200).json({
          status: "succès",
          data: {
            doc,
          },
        });
      }
      return res.status(404).json({
        status: "No doc with that id !!",
      });
    }
    return res.status(404).json({
      status: "You don't have the permission to do this action !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.deleteOneUser = async (req, res, next) => {
  try {
    // Find user and delete it
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc)
      return res.status(400).json({
        status: "No user with that id !!",
      });
    return res.status(200).json({
      status: "succès",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getUserByIdForClient = async (req, res, next) => {
  try {
    // Test if there is an employee
    const user = await User.findById(req.params.idUser);
    if (user.Friends.includes(req.user.id)) {
      return res.status(200).json({
        status: "succès",
        data: {
          user,
        },
      });
    }
    return res.status(404).json({
      status: "You are not friend with that person !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// Send a request to a specific client by current client
exports.sendInvitation = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is an user
    let user = await User.findById(req.params.idUser);
    if (!user) {
      return res.status(400).send({
        message: "No user with that id !! ",
      });
    }
    // Test if the profile of user was open
    if (user.Profile == "Open") {
      // Test if the current user send a request
      if (user.RequestsSend.includes(req.params.idUser)) {
        return res.status(400).send({
          message: "You already send a request to this person !! ",
        });
      }
      // Add the id of current user to profile of specific user
      await User.findByIdAndUpdate(req.params.idUser, {
        $push: {
          Requests: currentUser.id,
        },
      });
      //Add the id of specific user to the request send of  current client
      await User.findByIdAndUpdate(currentUser.id, {
        $push: {
          RequestsSend: req.params.idUser,
        },
      });
      return res.status(200).json({
        status: "succès",
        data: {
          currentUser,
        },
      });
    }
    return res.status(404).json({
      status: "You can't send request to this person !! ",
      err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Cancel request for a current client
exports.cancelRequest = async (req, res) => {
  try {
    let userToEdit = req.user;
    // Test if there is a user
    let user = await User.findById(req.params.idUser);
    if (!user) {
      return res.status(400).send({
        message: "No user with that id !! ",
      });
    }
    // Test if the current user send a request
    if (user.Requests.includes(req.user.idUser)) {
      user.Requests = user.Requests.filter((e) => e._id != userToEdit.id);
      userToEdit.RequestsSend = userToEdit.RequestsSend.filter(
        (e) => e._id != req.params.idUser
      );
      // Update all the last changes on user
      let doc = await User.findByIdAndUpdate(req.params.idUser, user, {
        new: true,
        runValidators: true,
      });

      // Update all the last changes on the current client
      let user = await User.findByIdAndUpdate(userToEdit.id, userToEdit, {
        new: true,
        runValidators: true,
      });
      if (user) {
        return res.status(200).json({
          status: "Your request was canceled",
          data: {
            user,
          },
        });
      }
    }
    return res.status(400).send({
      message: "You don't send any request to this person !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Accept an invitation by current client
exports.AcceptRequestFriend = async (req, res) => {
  try {
    // Test if there is a user
    let user = await User.findById(req.params.idUser);
    if (!user) {
      return res.status(400).send({
        message: "No user with that id !!",
      });
    }
    if (user.Friends.includes(req.user.id)) {
      return res.status(400).send({
        message: "You alreadu friend with that user !! ",
      });
    }
    user.RequestsSend = user.RequestsSend.filter((e) => e._id != req.user.id);
    req.user.Requests = user.Requests.filter((e) => e._id != req.params.idUser);
    req.user.save();
    user.save();
    await User.findByIdAndUpdate(req.params.idUser, {
      $push: { Friends: req.user.id },
    });
    //save the last changes
    return res.status(200).send({
      status: "succès",
      data: {
        user,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

exports.FriendRequest = async (req, res, next) => {
  try {
    // Test if there is a document
    request = req.user.Requests;
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      request,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllSendRequest = async (req, res, next) => {
  try {
    requests = req.user.RequestsSend;
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      requests,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllFriends = async (req, res, next) => {
  try {
    friends = req.user.Friends;
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      friends,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllFriendsAdmin = async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await User.findById(req.params.idUser);
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      doc,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
