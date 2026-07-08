const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const likeController = require("../controllers/likeController");

router.post("/:id", authenticate, likeController.toggleLike);

module.exports = router;