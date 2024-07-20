// routes/courses.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware'); // Import the auth middleware
const connection = require('../db/connection');

router.get('/courses', authMiddleware, async (req, res) => {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM course');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
