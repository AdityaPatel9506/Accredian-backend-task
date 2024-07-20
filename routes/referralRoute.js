const express = require('express');
const router = express.Router();
const Referral = require('../models/referralModel');
const pool = require('../db/connection');

// Endpoint to create a referral code
router.post('/createReferralCode', async (req, res) => {
  const { referred_by, course_id } = req.body;

  if (!referred_by || !course_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const referralCode = `${referred_by.split('@')[0]}${Math.floor(1000 + Math.random() * 9000)}`;

    // Create referral entry
    await Referral.create({
      referral_code: referralCode,
      referred_by: referred_by,
      referred_user: null,
      course_id: course_id
    });

    res.status(201).json({ message: 'Referral code created successfully', referralCode });
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ message: 'Error creating referral', error: error.message });
  }
});

// Endpoint to verify and use a referral code
router.post('/verifyReferralCode', async (req, res) => {
  const { referral_code, referred_user, course_id } = req.body;

  if (!referral_code || !referred_user || !course_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Find the referral entry by code
    const referral = await Referral.findByReferralCode(referral_code);
    if (referral.length === 0) {
      return res.status(404).json({ message: 'Referral code not found' });
    }

    const referralData = referral[0];

    // Check if the referral code is already used by the current user
    if (await Referral.hasUserBeenReferred(referred_user)) {
      return res.status(400).json({ message: 'User has already used a referral code' });
    }

    // Check if the referral code has already been used
    if (referralData.referred_user) {
      return res.status(400).json({ message: 'Referral code has already been used' });
    }

    // Get the course points
    const points = await Referral.getCoursePoints(referralData.course_id);

    // Update the referral entry with the referred user
    await Referral.updateReferral(referral_code, referred_user);

    // Update referral points for the referred user
    await Referral.updateReferredUserPoints(referralData.referred_by, points);

    await connection.commit();
    res.status(200).json({ message: 'Referral code verified and used successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error using referral code:', error);
    res.status(500).json({ message: 'Error using referral code', error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
