const Expense = require('../models/Expense');
const User = require('../models/User');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

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

exports.downloadBalanceSheet = async (req, res) => {
    try {
        const expenses = await Expense.find().populate('splits.userId');
        
        const balanceSheet = expenses.map(expense => ({
            description: expense.description,
            totalAmount: expense.totalAmount,
            createdAt: expense.createdAt,
            splits: expense.splits.map(split => ({
                user: split.userId ? split.userId.name : 'Unknown',
                amount: split.amount,
                percentage: split.percentage
            }))
        }));

        const csv = new Parser().parse(balanceSheet);
        const filePath = path.join(__dirname, '../downloads/balance_sheet.csv');

        fs.writeFileSync(filePath, csv);
        
        res.download(filePath, 'balance_sheet.csv', err => {
            if (err) {
                console.error("Error downloading file:", err);
            }
            // Optionally, delete the file after download
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
