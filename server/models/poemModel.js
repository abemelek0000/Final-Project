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

async function updatePoem(id, title, content) {
  const query = `
    UPDATE poems
    SET
      title = $1,
      content = $2,
      updated_at = CURRENT_TIMESTAMP
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
    WHERE id = $1;
  `;

  await pool.query(query, [id]);
}
module.exports = {
  createPoem,
  getAllPoems,
  getPoemById,
  updatePoem,
  deletePoem,
  incrementViews
};