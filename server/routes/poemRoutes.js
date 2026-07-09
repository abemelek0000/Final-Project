const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const poemController = require("../controllers/poemController");

router.post("/", authenticate, poemController.createPoem);

router.get("/", authenticate.optional, poemController.getAllPoems);

router.get("/featured", poemController.featuredPoem);

router.get("/mine", authenticate, poemController.myPoems);

router.get("/admin", authenticate.optional, poemController.adminPoems);

router.get("/user", authenticate.optional, poemController.userPoems);

router.get("/by-author/:id", authenticate.optional, poemController.poemsByAuthor);

router.post("/:id/view", poemController.viewPoem);

router.get("/:id", poemController.getPoem);

router.put("/:id", authenticate, poemController.updatePoem);

router.delete("/:id", authenticate, poemController.deletePoem);

module.exports = router;