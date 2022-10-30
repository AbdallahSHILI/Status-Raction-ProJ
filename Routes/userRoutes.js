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
router.post("/Signup", authController.signup);

//login by address and psw
router.post("/Login", authController.login);

//get request of friend by current client
router.get(
  "/FriendReq",
  authController.protect,
  authController.restrictTo("client"),
  userController.FriendRequest
);

//get send request by current client
router.get(
  "/AllSendReq",
  authController.protect,
  authController.restrictTo("client"),
  userController.getAllSendRequest
);

//get all friends by current client
router.get(
  "/Friends",
  authController.protect,
  authController.restrictTo("client"),
  userController.getAllFriends
);

//Accept request of friends by current client
router.post(
  "/AcceptRequest/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.AcceptRequestFriend
);

//Send a request to another user by current client
router.post(
  "/Invitation/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.sendInvitation
);

// List of all clients for admin
router.get(
  "/AllClients",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllClients
);

// List of all admins for admin
router.get(
  "/AllAdmins",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllAdmins
);

//get user by id for admin
router.get(
  "/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findOne
);

//get client by id for current client
router.get(
  "/getClient/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.getUserByIdForClient
);

//update user
router.patch("/:id", authController.protect, userController.updateProfile);

//delete a request of friend by current client
router.delete(
  "/CancelRequest/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.cancelRequest
);

//delete friend from list of friends by current client
router.delete(
  "/DeleteFriends/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.deleteFriend
);

//get all friends of specific user for admin
router.get(
  "/Friends/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllFriendsAdmin
);

//delete user for admin
router.delete(
  "/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteOneUser
);

module.exports = router;
