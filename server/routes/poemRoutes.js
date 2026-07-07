const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const poemController = require("../controllers/poemController");

router.post("/", authenticate, poemController.createPoem);

router.get("/", poemController.getAllPoems);

router.get("/:id", poemController.getPoem);

module.exports = router;