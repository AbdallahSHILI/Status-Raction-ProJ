const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const userController = require("../controllers/userController");

//get profile by current user
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.findOne
);

//create new compte
router.post("/signup", authController.signup); //Done

//login by address and psw
router.post("/login", authController.login); //Done

//get request of friend by current client
router.get(
  "/FriendReq", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.FriendRequest
);

//get send request by current client
router.get(
  "/AllSendReq", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.getAllSendRequest
);

//get all friends by current client
router.get(
  "/Friends", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.getAllFriends
);

//Accept request of friends by current client
router.post(
  "/AcceptRequest/:idUser", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.AcceptRequestFriend
);

//Send a request to another user by current client
router.post(
  "/invitation/:idUser", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.sendInvitation
);

// List of all clients for admin
router.get(
  "/AllClients", //Done
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllClients
);

// List of all admins for admin
router.get(
  "/AllAdmins", //Done
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllAdmins
);

//get user by id for admin
router.get(
  "/:idUser", //Done
  authController.protect,
  authController.restrictTo("admin"),
  userController.findOne
);

//get client by id for current client
router.get(
  "/getClient/:idUser", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.getUserByIdForClient
);

//update user
router.patch("/:id", authController.protect, userController.updateProfile); //Done

//delete a request of friend by current client
router.delete(
  "/CancelRequest/:idUser", //Done
  authController.protect,
  authController.restrictTo("client"),
  userController.cancelRequest
);

//get all friends of specific user for admin
router.get(
  "/Friends/:idUser", //Done
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllFriendsAdmin
);

//delete user for admin
router.delete(
  "/:idUser", //Done
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteOneUser
);

module.exports = router;
