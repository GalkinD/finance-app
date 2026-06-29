const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/transactions  (с фильтрацией и пагинацией)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, account, category, dateFrom, dateTo } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (account) filter.account = account;
    if (category) filter.category = category;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .populate('account', 'name icon color')
      .populate('category', 'name icon color type')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ transactions, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/transactions/analytics
router.get('/analytics', async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const filter = { user: req.user._id };
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const byCategory = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: { category: '$category', type: '$type' }, total: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id.category', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', icon: '$category.icon', color: '$category.color', type: '$_id.type', total: 1 } },
    ]);

    const byMonth = await Transaction.aggregate([
      { $match: filter },
      { $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const totals = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    res.json({ byCategory, byMonth, totals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { account, amount, type } = req.body;
    const transaction = await Transaction.create({ ...req.body, user: req.user._id });

    // Update account balance
    const delta = type === 'income' ? amount : -amount;
    await Account.findByIdAndUpdate(account, { $inc: { balance: delta } });

    const populated = await transaction.populate([
      { path: 'account', select: 'name icon color' },
      { path: 'category', select: 'name icon color type' },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const old = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!old) return res.status(404).json({ message: 'Операция не найдена' });

    // Revert old balance change
    const oldDelta = old.type === 'income' ? -old.amount : old.amount;
    await Account.findByIdAndUpdate(old.account, { $inc: { balance: oldDelta } });

    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('account', 'name icon color')
      .populate('category', 'name icon color type');

    // Apply new balance change
    const newDelta = updated.type === 'income' ? updated.amount : -updated.amount;
    await Account.findByIdAndUpdate(updated.account, { $inc: { balance: newDelta } });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Операция не найдена' });

    // Revert balance
    const delta = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await Account.findByIdAndUpdate(transaction.account, { $inc: { balance: delta } });

    res.json({ message: 'Операция удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
