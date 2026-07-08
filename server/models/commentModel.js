const pool = require("../config/db");

async function createComment(poemId, userId, comment) {
    const query = `
        INSERT INTO comments
        (poem_id, user_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const result = await pool.query(query, [
        poemId,
        userId,
        comment
    ]);

    return result.rows[0];
}

async function getCommentsByPoem(poemId) {
    const query = `
        SELECT
            comments.*,
            users.username,
            users.profile_image
        FROM comments
        JOIN users
            ON comments.user_id = users.id
        WHERE poem_id = $1
        ORDER BY comments.created_at ASC;
    `;

    const result = await pool.query(query, [poemId]);

    return result.rows;
}

async function getCommentById(id) {
    const query = `
        SELECT *
        FROM comments
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}

async function updateComment(id, comment) {
    const query = `
        UPDATE comments
        SET
            comment = $1
        WHERE id = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [comment, id]);

    return result.rows[0];
}

async function deleteComment(id) {
    const query = `
        DELETE FROM comments
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}

module.exports = {
    createComment,
    getCommentsByPoem,
    getCommentById,
    updateComment,
    deleteComment
};