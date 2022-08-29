const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const userController = require("../controllers/userController");

//create ew compte
router.post("/signup", authController.signup);

//login by adress and psw
router.post("/login", authController.login);

//get profil by current user
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getCurrentUserById
);

// Liste of all clients for admin
router.get(
  "/AllClients",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllClients
);

// Liste of all admins for admin
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
  userController.getUserById
);

//get client by id for current client
router.get(
  "/getClient/:idClient",
  authController.protect,
  authController.restrictTo("client"),
  userController.getUserByIdForClient
);

//get request of friend by current client
router.get(
  "/FriendReq",
  authController.protect,
  authController.restrictTo("client"),
  userController.FriendRequest
);

//update user
router.patch("/:id", authController.protect, userController.updateUser);

//delete user for admin
router.delete(
  "/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser
);

//Send a request to onther user by current client
router.post(
  "/invitation/:idClient",
  authController.protect,
  authController.restrictTo("client"),
  userController.sendInvitation
);

//delete a request of friend by current client
router.delete(
  "/CancelRequest/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.cancelRequest
);

//Accept request of friends by current client
router.patch(
  "/AcceptRequest/:idUser",
  authController.protect,
  authController.restrictTo("client"),
  userController.AcceptRequestFriend
);

//get send request by current client
router.get(
  "/AllSendReq",
  authController.protect,
  authController.restrictTo("client"),
  userController.getAllSendRequest
);

//get all freinds by current client
router.get(
  "/Friends",
  authController.protect,
  authController.restrictTo("client"),
  userController.getAllFriends
);

//get all friends of specific user for admin
router.get(
  "/Friends/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllFriendsAdmin
);

module.exports = router;
