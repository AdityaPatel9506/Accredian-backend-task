require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./db/connection'); // Import the database connection

// Import routes
const authRoutes = require('./routes/auth');
const referralRoutes = require('./routes/referralRoute');
const courseRoutes = require('./routes/courses');
const logoutRoutes = require('./routes/logout');
const authMiddleware = require('./routes/authMiddleware');
const userRoutes = require('./routes/user');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Public routes (not protected by authMiddleware)
app.use('/api', authRoutes); // Auth routes
app.use('/api', referralRoutes); // Referral routes
app.use('/api', courseRoutes); // Course routes
app.use('/api/logout', logoutRoutes); // Logout route (should be a router instance)

// Apply auth middleware to protect all subsequent routes
app.use(authMiddleware); // Apply auth middleware for protected routes
app.use('/api/user', userRoutes); // User routes (protected by authMiddleware)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
