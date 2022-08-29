const User = require("../models/userModel");
const Status = require("../models/statusModel");
const Reaction = require("../models/statusModel");
const Comment = require("../models/commentModel");

// Create new status by current client
exports.postStatus = async (req, res, next) => {
  try {
    const status = await Status.create(req.body);
    if (status) {
      await Status.findByIdAndUpdate(status.id, {
        $push: { userID: req.user.id },
      });
      return res.status(201).json({
        status: "succès",
        data: {
          status,
        },
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
    if (status.condition == "open") {
      // Create an comment
      const comment = await Comment.create(req.body);
      await Comment.findByIdAndUpdate(comment.id, {
        $push: {
          UserID: req.user.id,
          StatusID: req.params.idStatus,
        },
      });
      await Status.findByIdAndUpdate(req.params.idStatus, {
        $push: { comments: comment.id },
      });
      return res.status(200).json({
        status: "succès",
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
      status: "échouer",
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
        status: "succès",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the respansble to this status",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

//get all reactions of an status by current client and admin
exports.findAllReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);
    if (status.UserID == req.user.id || req.user.role == "admin") {
      let reactions = status.Reaction;
      // Test if liste of reaction is an empty liste
      if (!reactions.length) {
        return res
          .status(400)
          .send({ message: "You don't have any reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

//get one status by cuurent user and admin
exports.getOneStatusClient = async (req, res) => {
  try {
    // Test if there is an status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    // Test if current client is the responsible of the status
    if (status.UserID == req.user.id || req.user.role == "admin") {
      return res.status(200).json({
        status: "succès",
        data: {
          status,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the respansble to this status",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
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
        message: "You are not the respansble to this status !! ",
      });
    }
    // Test if the status is already close
    if (status.Condition) {
      // change the  status's condition to be an close status
      status.Condition = false;
      //save the last changes
      status.save();
    }
    return res.status(400).send({
      message: "That status is already close !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
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
        status: "succès",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the respansble to this comment !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

//get one status by admin
exports.getOneStatusForAdmn = async (req, res) => {
  try {
    // Test if there is an status
    const status = await Status.findById(req.params.idStatus);
    if (!status) {
      return res.status(400).send({
        message: "No status with that id !! ",
      });
    }
    return res.status(200).json({
      status: "succès",
      data: {
        status,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      if (status.invisible == false) {
        status.invisible = true;
        //save the last changes
        status.save();
        return res.status(200).json({
          status: "succès",
          data: null,
        });
      }
      return res.status(400).send({
        message: "this Post is already deleted !!  ",
      });
    }
    const lengList = status.Comments.length;
    for (i = 0; i < lengList; i++) {
      const CommentSelected = await Comment.findById(status.Comments[i]);
      const doc = await Comment.findByIdAndDelete(CommentSelected.id);
      if (doc) {
        return res.status(200).json({
          status: "succès",
          data: null,
        });
      }
    }
    const lengListReaction = status.reactions.length;
    for (i = 0; i < lengListReaction; i++) {
      const Reaction = await Reaction.findByIdAndDelete(status.reactions[i]);
    }
    currentUser.MyStatus = currentUser.MyStatus.filter(
      (e) => e._id != req.params.idStatus
    );
    let user = await User.findByIdAndUpdate(currentUser.id, currentUser, {
      new: true,
      runValidators: true,
    });

    return res.status(404).json({
      status: "You are not the respansble to this comment !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      //Filter the id of comment from the liste of comments in status
      status.Comments = status.Comments.filter(
        (e) => e._id != req.params.idComment
      );
      let stat = await Status.findByIdAndUpdate(req.params.idComment, comment, {
        new: true,
        runValidators: true,
      });
      const doc = await Comment.findByIdAndDelete(req.params.idComment);
      if (doc) {
        return res.status(200).json({
          status: "succès",
          data: null,
        });
      }
      return res.status(200).json({
        status: "succès",
        data: null,
      });
    }
    return res.status(400).send({
      message: "You are not the respansble to this comment !!  ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
    if (req.user.id == req.params.idReaction) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.idReaction, req.body, {
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
    // Find comment and delete it
    const doc = await Reaction.findByIdAndDelete(req.params.idReaction);
    if (doc) {
      return res.status(200).json({
        status: "succès",
        data: null,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      status: "Status deleted with succes !! ",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    // Test if there is a status
    const status = await Status.findById(req.params.idStatus);
    if (status.UserID == req.user.id || req.user.role == "admin") {
      let comments = status.comments;
      if (comments.length == 0) {
        return res.status(400).send({ message: "There is no comments !! " });
      }
      return res.status(200).json({
        status: "succès",
        comments,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble to this comment !!" });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

//get all like reactions of an status by current client and admin
exports.findAllLikeReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);

    // find the reactions
    const reactions = await Reaction.find({
      react: "Like",
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Like reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Love reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Haha reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Sad reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Celebrate reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
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
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Support reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

//get all curous reactions of an status by current client and admin
exports.findAllCuriousReaction = async (req, res) => {
  try {
    // find the status
    const status = await Status.findById(req.user.idStatus);

    // find the reactions
    const reactions = await Reaction.find({
      react: "Curious",
      UserID: req.user.id,
    });

    if (status.UserID == req.user.id || req.user.role == "admin") {
      // Test if liste of reaction is an empty liste
      if (!reactions) {
        return res
          .status(400)
          .send({ message: "There is no Curious reaction in this post !! " });
      }
      return res.status(200).json({
        status: "succès",
        reactions,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the respansble of this post !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

// Liste of Status maked by current client
exports.findAllStatus = async (req, res) => {
  try {
    let status = req.user.MyStatus;
    // Test if liste of status is an empty liste
    if (!status.length) {
      return res
        .status(400)
        .send({ message: "You don't have any status in this post !! " });
    }
    return res.status(200).json({
      status: "succès",
      status,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

// Liste of Status maked by user for admin
exports.findAllStatusAdmin = async (req, res) => {
  try {
    // Test if there is a user
    const user = await User.findById(req.params.idUser);
    let Status = user.MyStatus;
    if (Status.length == 0) {
      return res.status(400).send({ message: "There is no status !! " });
    }
    return res.status(200).json({
      status: "succès",
      comments,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};
