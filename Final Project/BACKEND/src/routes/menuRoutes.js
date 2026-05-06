const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createMenuItem,
  listMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

router.get('/', listMenuItems);

router.post(
  '/',
  authenticate,
  requireRole('OWNER'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('description').optional().isString(),
    body('isAvailable').optional().isBoolean(),
  ],
  validate,
  createMenuItem
);

router.patch(
  '/:itemId',
  authenticate,
  requireRole('OWNER'),
  [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('description').optional().isString(),
    body('isAvailable').optional().isBoolean(),
  ],
  validate,
  updateMenuItem
);

router.delete(
  '/:itemId',
  authenticate,
  requireRole('OWNER'),
  deleteMenuItem
);

module.exports = router;
