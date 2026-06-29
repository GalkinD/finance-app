const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['debit', 'credit', 'deposit', 'cash', 'other'],
      default: 'debit',
    },
    icon: { type: String, default: '💳' },
    balance: { type: Number, default: 0 },
    color: { type: String, default: '#6C63FF' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', AccountSchema);
