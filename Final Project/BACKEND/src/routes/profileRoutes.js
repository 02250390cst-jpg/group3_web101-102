const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { updateProfile, getProfile } = require('../controllers/profileController');

const router = express.Router();


// Get profile (current user)
router.get('/', authenticate, getProfile);
// Update profile (name, email, profileImage)
router.put('/', authenticate, updateProfile);

module.exports = router;
