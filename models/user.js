const pool = require('../db/connection');
const bcrypt = require('bcrypt');

const User = {
  create: async (userData, callback) => {
    const { email, password, name, age, address } = userData;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (email, password, name, age, address) VALUES (?, ?, ?, ?, ?)';
      const [results] = await pool.query(query, [email, hashedPassword, name, age, address]);
      callback(null, results);
    } catch (err) {
      callback(err, null);
    }
  },

  findByEmail: async (email, callback) => {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.query(query, [email]);
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  }
};

module.exports = User;
