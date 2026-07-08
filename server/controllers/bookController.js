const bookModel = require("../models/bookModel");

async function getAllBooks(req, res) {

    try {

        const books = await bookModel.getAllBooks();

        res.json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function getLatestBook(req, res) {

    try {

        const book = await bookModel.getLatestBook();

        if (!book) {

            return res.status(404).json({
                message: "No book recommendation found."
            });

        }

        res.json(book);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function getBookById(req, res) {

    try {

        const book = await bookModel.getBookById(req.params.id);

        if (!book) {

            return res.status(404).json({
                message: "Book not found."
            });

        }

        res.json(book);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function createBook(req, res) {

    try {

        const {
            title,
            author,
            description,
            cover_image
        } = req.body;

        const book = await bookModel.createBook(
            title,
            author,
            description,
            cover_image,
            req.user.id
        );

        res.status(201).json(book);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function updateBook(req, res) {

    try {

        const {
            title,
            author,
            description,
            cover_image
        } = req.body;

        const book = await bookModel.updateBook(
            req.params.id,
            title,
            author,
            description,
            cover_image
        );

        if (!book) {

            return res.status(404).json({
                message: "Book not found."
            });

        }

        res.json(book);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function deleteBook(req, res) {

    try {

        const book = await bookModel.deleteBook(req.params.id);

        if (!book) {

            return res.status(404).json({
                message: "Book not found."
            });

        }

        res.json({
            message: "Book deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

module.exports = {
    getAllBooks,
    getLatestBook,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};