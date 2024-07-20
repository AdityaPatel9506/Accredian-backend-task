const mysql = require('mysql2/promise');
const pool = require('../db/connection'); // Import your connection pool

const Referral = {
  // Create a new referral entry
  create: async (referralData) => {
    const { referral_code, referred_by, referred_user, course_id } = referralData;
    try {
      const query = 'INSERT INTO referrals (referral_code, referred_by, referred_user, course_id) VALUES (?, ?, ?, ?)';
      const [results] = await pool.query(query, [referral_code, referred_by, referred_user, course_id]);
      return results;
    } catch (err) {
      throw new Error(`Error creating referral: ${err.message}`);
    }
  },

  // Find a referral entry by referral code
  findByReferralCode: async (referral_code) => {
    try {
      const query = 'SELECT * FROM referrals WHERE referral_code = ?';
      const [rows] = await pool.query(query, [referral_code]);
      return rows;
    } catch (err) {
      throw new Error(`Error finding referral by code: ${err.message}`);
    }
  },

  // Check if a user has already used a referral code
  hasUserBeenReferred: async (referred_user) => {
    try {
      const query = 'SELECT * FROM referrals WHERE referred_user = ?';
      const [rows] = await pool.query(query, [referred_user]);
      return rows.length > 0;
    } catch (err) {
      throw new Error(`Error checking if user has been referred: ${err.message}`);
    }
  },

  // Get the referral points for a specific course
  getCoursePoints: async (course_id) => {
    try {
      const query = 'SELECT referral_points FROM course WHERE course_id = ?';
      const [rows] = await pool.query(query, [course_id]);
      if (rows.length === 0) {
        throw new Error('Course not found');
      }
      return rows[0].referral_points;
    } catch (err) {
      throw new Error(`Error fetching course points: ${err.message}`);
    }
  },

  // Update the referral entry to set the referred user
  updateReferral: async (referral_code, referred_user) => {
    try {
      const query = 'UPDATE referrals SET referred_user = ? WHERE referral_code = ?';
      const [results] = await pool.query(query, [referred_user, referral_code]);
      return results;
    } catch (err) {
      throw new Error(`Error updating referral: ${err.message}`);
    }
  },

  // Get the current referral points of a user
  getCurrentReferralPoints: async (referred_by_email) => {
    try {
      const query = 'SELECT referral_points FROM users WHERE email = ?';
      const [rows] = await pool.query(query, [referred_by_email]);
      if (rows.length === 0) {
        throw new Error('User not found');
      }
      return rows[0].referral_points;
    } catch (err) {
      throw new Error(`Error fetching current referral points: ${err.message}`);
    }
  },

  // Update the referral points for the referrer in the users table
  updateReferredUserPoints: async (referred_by_email, points) => {
    try {
      if (isNaN(points) || points < 0) {
        throw new Error('Invalid points value');
      }

      // Get current points
      const currentPoints = await Referral.getCurrentReferralPoints(referred_by_email);

      // Calculate new points
      const newPoints = currentPoints + points;

      const query = 'UPDATE users SET referral_points = ? WHERE email = ?';
      const [results] = await pool.query(query, [newPoints, referred_by_email]);
      return results;
    } catch (err) {
      throw new Error(`Error updating referred user points: ${err.message}`);
    }
  }
};

module.exports = Referral;
