const { pool } = require('../config/db');

// Get all active promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const query = `
      SELECT id, code, discount_type, discount_value, min_amount, max_discount, 
             valid_until, description, used_count, max_uses
      FROM promo_codes
      WHERE (valid_until IS NULL OR valid_until >= CURDATE())
        AND (max_uses IS NULL OR used_count < max_uses)
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all promo codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Validate promo code
const validatePromoCode = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }

    if (typeof subtotal === 'undefined' || subtotal === null || isNaN(parseFloat(subtotal))) {
      return res.status(400).json({
        success: false,
        message: 'Subtotal is required and must be a valid number'
      });
    }

    const query = `
      SELECT id, code, discount_type, discount_value, min_amount, max_discount, 
             valid_until, description, used_count, max_uses
      FROM promo_codes
      WHERE UPPER(code) = UPPER(?)
        AND (valid_until IS NULL OR valid_until >= CURDATE())
        AND (max_uses IS NULL OR used_count < max_uses)
    `;
    const [rows] = await pool.execute(query, [code]);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired promo code'
      });
    }

    const promoCode = rows[0];

    // Check if minimum amount is met
    if (promoCode.min_amount && parseFloat(subtotal) < parseFloat(promoCode.min_amount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount of ৳${promoCode.min_amount.toLocaleString()} required for this promo code`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discount_type === 'percentage') {
      discount = (parseFloat(subtotal) * parseFloat(promoCode.discount_value)) / 100;
      if (promoCode.max_discount) {
        discount = Math.min(discount, parseFloat(promoCode.max_discount));
      }
    } else if (promoCode.discount_type === 'fixed') {
      discount = parseFloat(promoCode.discount_value);
    }

    // Make sure discount doesn't exceed subtotal
    discount = Math.min(discount, parseFloat(subtotal));

    res.status(200).json({
      success: true,
      data: {
        ...promoCode,
        calculated_discount: discount,
        final_total: parseFloat(subtotal) - discount
      }
    });
  } catch (error) {
    console.error('Validate promo code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPromoCodes,
  validatePromoCode
};