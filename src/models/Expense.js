const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    splits: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number },
        percentage: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);