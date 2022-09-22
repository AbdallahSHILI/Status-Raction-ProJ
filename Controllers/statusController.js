const User = require("../Models/userModel");
const Status = require("../Models/statusModel");
const Reaction = require("../Models/statusModel");
const Comment = require("../Models/commentModel");

// Create new status by current client
exports.postStatus = async (req, res, next) => {
  try {
    const status = await Status.create(req.body);
    if (status) {
      await Status.findByIdAndUpdate(status.id, {
        $push: { UserID: req.user.id },
      });
      return res.status(201).json({
        status: "Success",
        data: {
          status,
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

exports.commentOneStatus = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is a status
    let status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if the status was open
    if (status.Condition == "open") {
      // Create an comment
      const comment = await Comment.create(req.body);
      console.log(comment);
      await Comment.findByIdAndUpdate(comment.id, {
        $push: {
          UserID: req.user.id,
          StatusID: req.params.idStatus,
        },
      });
      await Status.findByIdAndUpdate(req.params.idStatus, {
        $push: { Comments: comment.id },
      });
      return res.status(200).json({
        status: "Success",
        data: {
          currentUser,
        },
      });
    }
    return res.status(404).json({
      status: "This status has been closed !! ",
      err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.updateOneStatus = async (req, res, next) => {
  try {
    // Test if there is an status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if current user was the owner of Status
    if (status.UserID == req.user.id) {
      // Update new changes
      let doc = await Status.findByIdAndUpdate(req.params.idStatus, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({
        status: "Success",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the responsible to this status",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

//get all reactions of an status by current client and admin
exports.findAllReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    if (status.UserID == req.user.id || req.user.Role == "admin") {
      let reactions = status.Reaction;
      // Test if List of reaction is an empty List
      if (!reactions.length) {
        return res
          .status(400)
          .send({ message: "There is no reaction in this post !! " });
      }
      return res.status(200).json({
        status: "Success",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the responsible of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

// change the  status condition by current client
exports.closeOneStatus = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is a status
    let status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !!",
      });
    }
    // Test if the current client is the responsible to the status
    if (status.UserID != currentUser.id) {
      return res.status(400).send({
        message: "You are not the responsible to this status !! ",
      });
    }
    // Test if the status is already close
    if (status.Condition == "open") {
      // change the  status's condition to be an close status
      status.Condition = "close";
      //save the last changes
      status.save();
    }
    return res.status(400).send({
      message: "That status is already close !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

//get one status by current user and admin
exports.getOneStatusById = async (req, res) => {
  try {
    // Test if there is an status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if current client is the responsible of the status
    if (status.UserID == req.user.id || req.user.Role == "admin") {
      return res.status(200).json({
        status: "Success",
        data: {
          status,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the responsible to this status",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.updateOneComment = async (req, res, next) => {
  try {
    // Test if there is an comment
    const comment = await Comment.findById(req.params.idComment);
    if (!comment) {
      return res.status(400).send({
        message: "No comment with that id !! ",
      });
    }
    // Test if current user was the owner of comment
    if (comment.UserID == req.user.id) {
      // Update new changes
      let doc = await Comment.findByIdAndUpdate(
        req.params.idComment,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "Success",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the responsible to this comment !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.deleteOneStatus = async (req, res, next) => {
  try {
    // Test if there is a status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    currentUser = req.user;
    if (status.UserID == currentUser.id) {
      if (status.Invisible == false) {
        status.Invisible = true;
        //save the last changes
        status.save();
        return res.status(200).json({
          status: "Success",
          data: null,
        });
      }
      return res.status(400).send({
        message: "this Post is already deleted !!  ",
      });
    }
    const lngList = status.Comments.length;
    for (i = 0; i < lngList; i++) {
      const CommentSelected = await Comment.findById(status.Comments[i]);
      const doc = await Comment.findByIdAndDelete(CommentSelected.id);
      if (doc) {
        return res.status(200).json({
          status: "Success",
          data: null,
        });
      }
    }
    const lngListReaction = status.Reactions.length;
    for (i = 0; i < lngListReaction; i++) {
      const Reaction = await Reaction.findByIdAndDelete(status.Reactions[i]);
    }
    currentUser.MyStatus = currentUser.MyStatus.filter(
      (e) => e._id != req.params.idStatus
    );
    let user = await User.findByIdAndUpdate(currentUser.id, currentUser, {
      new: true,
      runValidators: true,
    });

    return res.status(404).json({
      status: "You are not the responsible to this comment !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.deleteOneComment = async (req, res, next) => {
  try {
    // Test if there is a status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if there is a comment
    const comment = await Comment.findById(req.params.idComment);
    if (!comment) {
      return res.status(400).send({
        message: "No Comment with that id !! ",
      });
    }
    currentUser = req.user;
    if (comment.UserID == currentUser.id) {
      //Filter the id of comment from the List of comments in status
      status.Comments = status.Comments.filter(
        (e) => e._id != req.params.idComment
      );
      let stat = await Status.findByIdAndUpdate(req.params.idStatus, status, {
        new: true,
        runValidators: true,
      });
      const doc = await Comment.findByIdAndDelete(req.params.idComment);
      if (doc) {
        return res.status(200).json({
          status: "Success",
          data: null,
        });
      }
      return res.status(200).json({
        status: "Success",
        data: null,
      });
    }
    return res.status(400).send({
      message: "You are not the responsible to this comment !!  ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.updateOneReaction = async (req, res, next) => {
  try {
    // Test if there is a status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if there is a reaction
    const reaction = await Reaction.findById(req.params.idReaction);
    if (!reaction) {
      return res.status(400).send({
        message: "No Reaction with that id !! ",
      });
    }
    if (req.user.id == reaction.UserID) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.idReaction, req.body, {
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
        status: "No doc with that id !!",
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

exports.deleteOneReaction = async (req, res, next) => {
  try {
    // Test if there is a status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if there is a reaction
    const reaction = await Reaction.findById(req.params.idReaction);
    if (!reaction) {
      return res.status(400).send({
        message: "No Reaction with that id !! ",
      });
    }
    currentUser = req.user;
    if (reaction.UserID == currentUser.id) {
      status.Reaction.id = status.Reaction.id.filter(
        (e) => e._id != req.params.idReaction
      );
    }
    // Find react and delete it
    const doc = await Reaction.findByIdAndDelete(req.params.idReaction);
    if (doc) {
      return res.status(200).json({
        status: "Success",
        data: null,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

// Delete one post for admin
exports.deleteOneStatusAdmin = async (req, res, next) => {
  try {
    // Find status and delete it
    const doc = await Status.findByIdAndDelete(req.params.idStatus);
    if (!doc) {
      return res.status(400).json({
        status: "No status with that id !!",
      });
    }
    return res.status(200).json({
      status: "Status deleted successfully !! ",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    // Test if there is a status
    const status = await Status.findById(req.params.idStatus);
    if (status.UserID == req.user.id || req.user.Role == "admin") {
      let comments = status.Comments;
      if (comments.length == 0) {
        return res.status(400).send({ message: "There is no comments !! " });
      }
      return res.status(200).json({
        status: "Success",
        comments,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the responsible to this status !!" });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get one status by admin
exports.getOneStatusForAdmin = async (req, res) => {
  try {
    // Test if there is an status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    return res.status(200).json({
      status: "Success",
      data: {
        status,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      data: err,
    });
  }
};

//get all like reactions of an status by current client
exports.findAllLikeReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Like",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Like reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get all love reactions of an status by current client  and admin
exports.findAllLoveReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Love",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Love reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get all haha reactions of an status by current client  and admin
exports.findAllHahaReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Haha",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Haha reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get all sad reactions of an status by current client  and admin
exports.findAllSadReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Sad",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Sad reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get all celebrate reactions of an status by current client  and admin
exports.findAllCelebrateReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Celebrate",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Celebrate reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get all support reactions of an status by current client and admin
exports.findAllSupportReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Support",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Support reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

//get all curious reactions of an status by current client and admin
exports.findAllCuriousReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    // find the reactions
    const reactions = await Reaction.find({
      react: "Curious",
      StatusID: req.params.idStatus,
    });
    // Test if List of reaction is an empty List
    if (!reactions) {
      return res
        .status(400)
        .send({ message: "There is no Curious reaction in this post !! " });
    }
    return res.status(200).json({
      status: "Success",
      reactions,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

// List of Status made by current client
exports.findAllStatus = async (req, res) => {
  try {
    let status = req.user.MyStatus;
    // Test if List of status is an empty List
    if (!status.length) {
      return res
        .status(400)
        .send({ message: "You don't have any status now !! " });
    }
    return res.status(200).json({
      status: "Success",
      status,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};

// List of Status made by user for admin
exports.findAllStatusAdmin = async (req, res) => {
  try {
    // Test if there is a user
    const user = await User.findById(req.params.idUser);
    let Status = user.MyStatus;
    if (!Status.length) {
      return res.status(400).send({ message: "There is no status !! " });
    }
    return res.status(200).json({
      status: "Success",
      Status,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Failed",
      err,
    });
  }
};
