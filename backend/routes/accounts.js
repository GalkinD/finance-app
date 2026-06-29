const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/accounts
router.post('/', async (req, res) => {
  try {
    const account = await Account.create({ ...req.body, user: req.user._id });
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/accounts/:id
router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!account) return res.status(404).json({ message: 'Счёт не найден' });
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/accounts/:id
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!account) return res.status(404).json({ message: 'Счёт не найден' });
    res.json({ message: 'Счёт удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
