const client = require("./client.js");

const createUser = async ({ username, password, email, isAdmin }) => {

  if (isAdmin !== "true") {
    isAdmin = false;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password, email, isadmin)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING id, username, email, isadmin;
      `,
      [username, password, email, isAdmin]
    );

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, fields = {}) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${userId}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username, email, isadmin
        FROM users
        WHERE id=$1;
      `,
      [id]
    );

    if (!user) {
      return false;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const { rows } = await client.query(
      `
        SELECT id, username, email, isadmin
        FROM users
        WHERE email=$1;
      `,
      [email]
    );

    if (!rows || !rows.length) return null;
    const [user] = rows;
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async ({ username }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username, password, email, isadmin
        FROM users
        WHERE username=$1;
      `,
      [username]
    );

    if (!user) {
      return false;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(
      `
        SELECT id, username, email, isadmin
        FROM users;
      `
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        DELETE FROM users
        WHERE id=$1;
      `,
      [id]
    );

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
  deleteUser,
};