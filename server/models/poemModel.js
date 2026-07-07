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

async function getAllPoems() {
  const query = `
    SELECT
        poems.id,
        poems.title,
        poems.content,
        poems.views,
        poems.source_type,
        poems.created_at,
        users.username
    FROM poems
    JOIN users
        ON poems.author_id = users.id
    ORDER BY poems.created_at DESC;
  `;

  const result = await pool.query(query);

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

module.exports = {
  createPoem,
  getAllPoems,
  getPoemById
};