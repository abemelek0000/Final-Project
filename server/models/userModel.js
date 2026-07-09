const pool = require("../config/db");

async function createUser(username, email, passwordHash) {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, role, created_at;
  `;

  const values = [username, email, passwordHash];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function findUserByEmail(email) {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
}
async function findUserById(id) {
  const query = `
    SELECT
      id,
      username,
      email,
      bio,
      profile_image,
      role,
      created_at
    FROM users
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}

async function searchUsers(username){

    const result=await pool.query(

        `SELECT
            id,
            username,
            bio,
            profile_image
         FROM users
         WHERE username ILIKE $1
         ORDER BY username`,

         [`%${username}%`]

    );

    return result.rows;

}

async function getPublicProfile(id) {
  const query = `
    SELECT
      id,
      username,
      bio,
      profile_image,
      role,
      created_at
    FROM users
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}

async function updateProfile(id, bio, profileImage) {
  const query = `
    UPDATE users
    SET
      bio = $1,
      profile_image = $2
    WHERE id = $3
    RETURNING id, username, email, bio, profile_image, role, created_at;
  `;

  const result = await pool.query(query, [bio, profileImage, id]);

  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  searchUsers,
  getPublicProfile,
  updateProfile
};