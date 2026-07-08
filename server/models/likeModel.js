const pool = require("../config/db");

async function likePoem(userId, poemId) {
    const query = `
        INSERT INTO likes(user_id, poem_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const result = await pool.query(query, [userId, poemId]);

    return result.rows[0];
}

async function unlikePoem(userId, poemId) {
    const query = `
        DELETE FROM likes
        WHERE user_id=$1
        AND poem_id=$2
        RETURNING *;
    `;

    const result = await pool.query(query, [userId, poemId]);

    return result.rows[0];
}

async function hasLiked(userId, poemId) {
    const query = `
        SELECT *
        FROM likes
        WHERE user_id=$1
        AND poem_id=$2;
    `;

    const result = await pool.query(query, [userId, poemId]);

    return result.rows[0];
}

async function countLikes(poemId) {
    const query = `
        SELECT COUNT(*)::int AS likes
        FROM likes
        WHERE poem_id=$1;
    `;

    const result = await pool.query(query, [poemId]);

    return result.rows[0];
}

module.exports = {
    likePoem,
    unlikePoem,
    hasLiked,
    countLikes
};