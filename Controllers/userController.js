const User = require("../Models/userModel");

//get current user using the getUserByID
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.findAllClients = async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await User.find({ Role: "client" });
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

exports.findAllAdmins = async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await User.find({ Role: "admin" });
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

exports.findOne = async (req, res, next) => {
  try {
    // Test if there is a document
    let doc = await User.findById(req.params.idUser);
    if (!doc) {
      return "No user with that id !! ";
    }
    return res.status(200).json({
      status: "Success",
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

exports.getUserByIdForClient = async (req, res, next) => {
  try {
    // Test if there is an user
    const user = await User.findById(req.params.idUser);
    if (user.Friends.includes(req.user.id)) {
      return res.status(200).json({
        status: "Success",
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
      status: "Failed",
      data: err,
    });
  }
};

exports.FriendRequest = async (req, res, next) => {
  try {
    // Test if there is a document
    request = req.user.Requests;
    console.log(request);
    if (request == 0) {
      return res.status(400).json({
        message: "You don't have any request !! ",
      });
    }
    return res.status(200).json({
      status: "Success",
      result: doc.length,
      request,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
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
      // Test if document was update successfully
      if (doc) {
        return res.status(200).json({
          status: "Success",
          data: {
            doc,
          },
        });
      }
      return res.status(404).json({
        status: "No user with that id !!",
      });
    }
    return res.status(404).json({
      status: "You don't have the permission to do this action !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

// Send a friend request to a specific client by current client
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
        status: "Success",
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
      status: "Failed",
      message: err,
    });
  }
};

// Cancel request for a current client
exports.cancelRequest = async (req, res) => {
  try {
    let CurrentUser = req.user;
    // Test if there is a user
    let user1 = await User.findById(req.params.idUser);
    if (!user1) {
      return res.status(400).send({
        message: "No user with that id !! ",
      });
    }
    // Test if the current user send a request
    if (!user1.Requests.includes(CurrentUser.id)) {
      return res.status(400).send({
        message: "You don't send any request to this person !! ",
      });
    }
    user1.Requests = user1.Requests.filter((e) => e._id != CurrentUser.id);
    // Update all the last changes on user
    let doc = await User.findByIdAndUpdate(req.params.idUser, user1, {
      new: true,
      runValidators: true,
    });
    CurrentUser.RequestsSend = CurrentUser.RequestsSend.filter(
      (e) => e._id != req.params.idUser
    );
    // Update all the last changes on the current client
    let user2 = await User.findByIdAndUpdate(CurrentUser.id, CurrentUser, {
      new: true,
      runValidators: true,
    });
    if (user2) {
      return res.status(200).json({
        status: "Your request was canceled",
        data: {
          user2,
        },
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

// Accept an invitation by current client
exports.AcceptRequestFriend = async (req, res) => {
  try {
    CurrentUser = req.user;
    // Test if there is a user
    let user = await User.findById(req.params.idUser);
    if (!user) {
      return res.status(400).send({
        message: "No user with that id !!",
      });
    }
    if (CurrentUser.Friends.includes(user.id)) {
      return res.status(400).send({
        message: "You already friend with that user !! ",
      });
    }
    user.RequestsSend = user.RequestsSend.filter((e) => e._id != req.user.id);
    let doc1 = await User.findByIdAndUpdate(req.params.idUser, user, {
      new: true,
      runValidators: true,
    });
    console.log(user);
    req.user.Requests = user.Requests.filter((e) => e._id != req.params.idUser);
    let doc2 = await User.findByIdAndUpdate(CurrentUser.id, CurrentUser, {
      new: true,
      runValidators: true,
    });

    await User.findByIdAndUpdate(req.params.idUser, {
      $push: { Friends: req.user.id },
    });
    await User.findByIdAndUpdate(CurrentUser.id, {
      $push: { Friends: req.params.idUser },
    });
    return res.status(200).send({
      status: "Success",
      data: {
        doc1,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getAllSendRequest = async (req, res, next) => {
  try {
    requests = req.user.RequestsSend;
    return res.status(200).json({
      status: "Success",
      result: requests.length,
      requests,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.getAllFriends = async (req, res, next) => {
  try {
    friends = req.user.Friends;
    return res.status(200).json({
      status: "Success",
      result: friends.length,
      friends,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.getAllFriendsAdmin = async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await User.findById(req.params.idUser);
    friends = doc.Friends;
    return res.status(200).json({
      status: "Success",
      result: friends.length,
      friends,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.deleteOneUser = async (req, res, next) => {
  try {
    // Find user and delete it
    const doc = await User.findByIdAndDelete(req.params.idUser);
    if (!doc)
      return res.status(400).json({
        status: "No user with that id !!",
      });
    return res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};
