const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  placeOrder,
  listMyOrders,
  listRestaurantOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

router.post(
  '/',
  authenticate,
  requireRole('CUSTOMER'),
  [
    body('restaurantId').isInt().withMessage('restaurantId is required'),
    body('items').isArray({ min: 1 }).withMessage('items are required'),
    body('items.*.menuItemId').isInt().withMessage('menuItemId is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity must be >= 1'),
  ],
  validate,
  placeOrder
);

router.get('/my', authenticate, requireRole('CUSTOMER'), listMyOrders);

router.get(
  '/restaurant/:restaurantId',
  authenticate,
  requireRole('OWNER'),
  listRestaurantOrders
);

router.patch(
  '/:orderId/status',
  authenticate,
  requireRole('OWNER'),
  [
    body('status')
      .isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateOrderStatus
);

module.exports = router;
