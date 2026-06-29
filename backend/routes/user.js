const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, password, currency } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (currency) user.currency = currency;
    if (password) user.password = password;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
