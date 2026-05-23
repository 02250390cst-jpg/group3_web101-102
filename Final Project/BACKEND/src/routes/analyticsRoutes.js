const express = require('express');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { topItems, topCustomers, dailyRevenue } = require('../controllers/analyticsController');

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

router.get(
  '/restaurants/:restaurantId/daily-revenue',
  authenticate,
  requireRole('OWNER'),
  dailyRevenue
);

module.exports = router;
