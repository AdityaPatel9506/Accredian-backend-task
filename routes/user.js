const express = require('express');
const router = express.Router();
const authenticateToken = require('./authMiddleware'); // Ensure correct import
const connection = require('../db/connection');
// Define routes
router.get('/points', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Extract userId from the token
  try {
    const query = 'SELECT referral_points FROM users WHERE id = ?';
    const [rows] = await connection.query(query, [userId]);

    if (rows.length > 0) {
      res.json({ points: rows[0].referral_points });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user points', error: error.message });
  }
});

module.exports = router; // Correct export
