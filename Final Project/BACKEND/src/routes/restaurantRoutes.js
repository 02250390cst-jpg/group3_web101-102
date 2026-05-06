const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createRestaurant,
  listRestaurants,
  getRestaurant,
  updateRestaurant,
} = require('../controllers/restaurantController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const menuRoutes = require('./menuRoutes');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

router.get('/', listRestaurants);
router.get('/:id', getRestaurant);

router.post(
  '/',
  authenticate,
  requireRole('OWNER'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').optional().isString(),
  ],
  validate,
  createRestaurant
);

router.patch(
  '/:id',
  authenticate,
  requireRole('OWNER'),
  [
    body('name').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty(),
    body('description').optional().isString(),
  ],
  validate,
  updateRestaurant
);

router.use('/:restaurantId/menu', menuRoutes);

module.exports = router;
