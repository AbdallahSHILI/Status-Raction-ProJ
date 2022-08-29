const express = require("express");
const router = express.Router();
const statusController = require("../Controllers/statusController");

//Create status by current client
router.post(
  "/Status",
  authController.protect,
  authController.restrictTo("client"),
  statusController.postStatus
);

//Comment one status by current client
router.post(
  "/Comment",
  authController.protect,
  authController.restrictTo("client"),
  statusController.commentOneStatus
);

//Update one status by current client
router.patch(
  "/UpdateStatus/:idStatus",
  authController.protect,
  authController.restrictTo("client"),
  statusController.updateOneStatus
);

// Liste of reaction
router.get(
  "/Reaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllReaction
);

//get status by id for current client and admin
router.get(
  "/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.getOneStatusById
);

//Close one status by cuurent client
router.patch(
  "/CloseStatus/:idStatus",
  authController.protect,
  authController.restrictTo("client"),
  statusController.closeOneStatus
);

//update one comment by a current client
router.patch(
  "/UpdateComment/:idComment",
  authController.protect,
  authController.restrictTo("client"),
  statusController.updateOneComment
);

//delete post by current client
router.delete(
  "/:idStatus",
  authController.protect,
  authController.restrictTo("client"),
  statusController.deleteOneStatus
);

//delete comment by current client
router.delete(
  "/Comment/:idStatus/:idComment",
  authController.protect,
  authController.restrictTo("client"),
  statusController.deleteOneComment
);

//update one react by a current client
router.patch(
  "/Reaction/:idStatus/:idReaction",
  authController.protect,
  authController.restrictTo("client"),
  statusController.updateOneReaction
);

//delete reaction on a post by current client
router.delete(
  "/DeleteReaction/:idStatus/:idReaction",
  authController.protect,
  authController.restrictTo("client"),
  statusController.deleteOneReaction
);

//delete post by admin
router.delete(
  "/Admin/:idStatus",
  authController.protect,
  authController.restrictTo("admin"),
  statusController.deleteOneStatusAdmin
);

// Get all comments of specific status for  current user
router.get(
  "/Administrator/AllComments/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.getAllComments
);

// Liste of Like reaction
router.get(
  "/LikeReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllLikeReaction
);

// Liste of Love reaction
router.get(
  "/LoveReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllLoveReaction
);

// Liste of Haha reaction
router.get(
  "/HahaReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllHahaReaction
);

// Liste of Sad reaction
router.get(
  "/SadReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllSadReaction
);

// Liste of Celebrate reaction
router.get(
  "/CelebrateReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllCelebrateReaction
);

// Liste of Support reaction
router.get(
  "/SupportReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllSupportReaction
);

// Liste of Celebrate reaction
router.get(
  "/CelebrateReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllCelebrateReaction
);

// Liste of Curious reaction
router.get(
  "/CuriousReaction/:idStatus",
  authController.protect,
  authController.restrictTo("client", "admin"),
  statusController.findAllCuriousReaction
);

// Liste of Status maked by current client
router.get(
  "/MyAllStatus",
  authController.protect,
  authController.restrictTo("client"),
  statusController.findAllStatus
);

// Liste of Status of specific user for admin
router.get(
  "/AllStatus/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  statusController.findAllStatusAdmin
);

module.exports = router;
