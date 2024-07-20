const express = require('express');
const router = express.Router();

// Define logout route
router.post('/', (req, res) => {
  // Handle logout logic
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
