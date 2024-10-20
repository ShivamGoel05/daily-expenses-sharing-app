const Expense = require('../models/Expense');
const User = require('../models/User');

exports.addExpense = async (req, res) => {
    const { description, totalAmount, splits } = req.body;
    const totalPercentage = splits.reduce((acc, split) => acc + split.percentage, 0);

    if (totalPercentage !== 100) {
        return res.status(400).json({ message: 'Percentages must add up to 100%' });
    }

    try {
        const expense = new Expense({ description, totalAmount, splits });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ 'splits.userId': req.params.id });
        res.json(expenses);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.getOverallExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};