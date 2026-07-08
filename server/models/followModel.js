const pool = require("../config/db");

async function isFollowing(followerId, followingId) {

    const result = await pool.query(
        `SELECT *
         FROM followers
         WHERE follower_id = $1
         AND following_id = $2`,
        [followerId, followingId]
    );

    return result.rows[0];
}

async function followUser(followerId, followingId) {

    const result = await pool.query(
        `INSERT INTO followers
        (follower_id, following_id)
        VALUES ($1, $2)
        RETURNING *`,
        [followerId, followingId]
    );

    return result.rows[0];
}

async function unfollowUser(followerId, followingId) {

    const result = await pool.query(
        `DELETE FROM followers
         WHERE follower_id = $1
         AND following_id = $2
         RETURNING *`,
        [followerId, followingId]
    );

    return result.rows[0];
}

async function followerCount(userId) {

    const result = await pool.query(
        `SELECT COUNT(*)::int AS followers
         FROM followers
         WHERE following_id = $1`,
        [userId]
    );

    return result.rows[0];
}

module.exports = {
    isFollowing,
    followUser,
    unfollowUser,
    followerCount
};