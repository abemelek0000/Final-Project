const pool = require("../config/db");

async function getAllBooks() {

    const query = `
        SELECT
            book_recommendations.*,
            users.username
        FROM book_recommendations
        JOIN users
            ON book_recommendations.created_by = users.id
        ORDER BY book_recommendations.created_at DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
}

async function getLatestBook() {

    const query = `
        SELECT
            book_recommendations.*,
            users.username
        FROM book_recommendations
        JOIN users
            ON book_recommendations.created_by = users.id
        ORDER BY book_recommendations.created_at DESC
        LIMIT 1;
    `;

    const result = await pool.query(query);

    return result.rows[0];
}

async function getBookById(id) {

    const query = `
        SELECT
            book_recommendations.*,
            users.username
        FROM book_recommendations
        JOIN users
            ON book_recommendations.created_by = users.id
        WHERE book_recommendations.id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}

async function createBook(title, author, description, coverImage, createdBy) {

    const query = `
        INSERT INTO book_recommendations
        (title, author, description, cover_image, created_by)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *;
    `;

    const result = await pool.query(query, [
        title,
        author,
        description,
        coverImage,
        createdBy
    ]);

    return result.rows[0];
}

async function updateBook(id, title, author, description, coverImage) {

    const query = `
        UPDATE book_recommendations
        SET
            title=$1,
            author=$2,
            description=$3,
            cover_image=$4
        WHERE id=$5
        RETURNING *;
    `;

    const result = await pool.query(query, [
        title,
        author,
        description,
        coverImage,
        id
    ]);

    return result.rows[0];
}

async function deleteBook(id) {

    const result = await pool.query(

        `DELETE FROM book_recommendations
         WHERE id=$1
         RETURNING *`,

        [id]

    );

    return result.rows[0];
}

module.exports = {
    getAllBooks,
    getLatestBook,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};