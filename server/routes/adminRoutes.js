const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

const bookController = require("../controllers/bookController");
const poemController = require("../controllers/poemController");


router.post(
    "/books",
    authenticate,
    authorizeAdmin,
    bookController.createBook
);

router.put(
    "/books/:id",
    authenticate,
    authorizeAdmin,
    bookController.updateBook
);

router.delete(
    "/books/:id",
    authenticate,
    authorizeAdmin,
    bookController.deleteBook
);


router.delete(
    "/poems/:id",
    authenticate,
    authorizeAdmin,
    poemController.adminDeletePoem
);

module.exports = router;