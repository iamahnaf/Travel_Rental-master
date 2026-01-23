const { body, validationResult } = require('express-validator');

// Validation middleware to check for validation errors
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}

// Validation rules for user registration
const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isString(),
  validate
];

// Validation rules for user login
const validateLogin = [
  body('email').isEmail(),
  body('password').notEmpty(),
  validate
];

// Validation rules for booking
const validateBooking = [
  body('booking_type').isIn(['vehicle', 'hotel', 'driver', 'tour-guide']),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('total_price').isFloat({ gt: 0 }),
  validate
];

// Validation rules for vehicle booking with pickup location
const validateVehicleBooking = [
  body('booking_type').equals('vehicle'),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('total_price').isFloat({ gt: 0 }),
  body('pickup_lat').optional().isFloat(),
  body('pickup_lng').optional().isFloat(),
  body('pickup_address').optional().trim(),
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking,
  validateVehicleBooking
};