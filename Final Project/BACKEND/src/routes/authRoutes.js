const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { getTodayStats, getWeeklyRevenue, getRecentOrders } = require('../controllers/dashboardController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ── Auth middleware ──────────────────────────────────────────────────────────
// JWT is signed with { sub: user.id, role: user.role }
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.sub, role: decoded.role }; // sub = user.id
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ── Validation helper ────────────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

// ── Auth routes ──────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').optional().isIn(['OWNER', 'CUSTOMER']).withMessage('Invalid role'),
    body('businessName').optional().trim(),
    body('location').optional().trim(),
    body('description').optional().isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// ── Dashboard routes ─────────────────────────────────────────────────────────
router.get('/dashboard/stats', protect, getTodayStats);
router.get('/dashboard/weekly-revenue', protect, getWeeklyRevenue);
router.get('/dashboard/recent-orders', protect, getRecentOrders);

module.exports = router;