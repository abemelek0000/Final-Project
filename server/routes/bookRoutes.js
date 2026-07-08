const express = require("express");

const router = express.Router();

const bookController = require("../controllers/bookController");

router.get("/latest", bookController.getLatestBook);

router.get("/", bookController.getAllBooks);

router.get("/:id", bookController.getBookById);

module.exports = router;