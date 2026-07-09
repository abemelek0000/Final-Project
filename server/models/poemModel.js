const pool = require("../config/db");

async function createPoem(authorId, title, content, sourceType) {
  const query = `
    INSERT INTO poems
    (author_id, title, content, source_type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    authorId,
    title,
    content,
    sourceType
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

function poemListQuery(whereClause) {
  return `
    SELECT
        poems.id,
        poems.title,
        poems.content,
        poems.author_id,
        poems.views,
        poems.source_type,
        poems.created_at,
        users.username,
        COUNT(DISTINCT likes.id)::int AS likes,
        COUNT(DISTINCT comments.id)::int AS comment_count,
        EXISTS (
            SELECT 1 FROM likes l2
            WHERE l2.poem_id = poems.id
            AND l2.user_id = $1
        ) AS liked_by_me,
        EXISTS (
            SELECT 1 FROM followers f2
            WHERE f2.follower_id = $1
            AND f2.following_id = poems.author_id
        ) AS following_author
    FROM poems
    JOIN users
        ON poems.author_id = users.id
    LEFT JOIN likes
        ON poems.id = likes.poem_id
    LEFT JOIN comments
        ON poems.id = comments.poem_id
    ${whereClause}
    GROUP BY poems.id, users.username
    ORDER BY poems.created_at DESC;
  `;
}


async function getAdminPoems(currentUserId = null) {

    const result = await pool.query(
        poemListQuery("WHERE poems.source_type = 'ADMIN'"),
        [currentUserId]
    );

    return result.rows;

}


async function getUserPoems(currentUserId = null) {

    const result = await pool.query(
        poemListQuery("WHERE poems.source_type = 'USER'"),
        [currentUserId]
    );

    return result.rows;

}



async function getAllPoems(currentUserId = null) {

  const result = await pool.query(
    poemListQuery(""),
    [currentUserId]
  );

  return result.rows;
}


async function getMyPoems(authorId) {

  const result = await pool.query(
    poemListQuery("WHERE poems.author_id = $2"),
    [authorId, authorId]
  );

  return result.rows;
}

async function getPoemById(id) {
  const query = `
    SELECT
        poems.*,
        users.username
    FROM poems
    JOIN users
        ON poems.author_id = users.id
    WHERE poems.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}

async function updatePoem(id, title, content) {
  const query = `
    UPDATE poems
    SET
      title = $1,
      content = $2
    WHERE id = $3
    RETURNING *;
  `;

  const result = await pool.query(query, [title, content, id]);

  return result.rows[0];
}

async function deletePoem(id) {
  const query = `
    DELETE FROM poems
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}

async function incrementViews(id) {
  const query = `
    UPDATE poems
    SET views = views + 1
    WHERE id = $1
    RETURNING views;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] ? result.rows[0].views : null;
}

async function getPoemsByAuthor(authorId, viewerId = null) {

  const result = await pool.query(
    poemListQuery("WHERE poems.author_id = $2"),
    [viewerId, authorId]
  );

  return result.rows;
}

async function getFeaturedPoem(){

    const query=`

    SELECT

        poems.id,
        poems.title,
        poems.content,
        poems.author_id,
        poems.views,
        poems.created_at,
        users.username,
        COUNT(likes.id)::int AS likes

    FROM poems

    JOIN users
        ON poems.author_id=users.id

    LEFT JOIN likes
        ON poems.id=likes.poem_id

    WHERE poems.source_type='USER'

    GROUP BY
        poems.id,
        users.username

    ORDER BY likes DESC,
             poems.created_at DESC

    LIMIT 1;

    `;

    const result=await pool.query(query);

    return result.rows[0];

}

module.exports = {
  createPoem,
  getAllPoems,
  getPoemById,
  updatePoem,
  deletePoem,
  incrementViews,
  getFeaturedPoem,
  getAdminPoems,
  getUserPoems,
  getMyPoems,
  getPoemsByAuthor
};