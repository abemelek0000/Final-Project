const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

router.post("/:poemId", authenticate, commentController.createComment);

router.get("/:poemId", commentController.getComments);

router.put("/:id", authenticate, commentController.updateComment);

router.delete("/:id", authenticate, commentController.deleteComment);

module.exports = router;