const express = require('express');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { topItems, topCustomers } = require('../controllers/analyticsController');

const router = express.Router();

router.get(
  '/restaurants/:restaurantId/top-items',
  authenticate,
  requireRole('OWNER'),
  topItems
);

router.get(
  '/restaurants/:restaurantId/top-customers',
  authenticate,
  requireRole('OWNER'),
  topCustomers
);

module.exports = router;
