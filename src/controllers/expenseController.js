const Expense = require('../models/Expense');
const User = require('../models/User');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

exports.addExpense = async (req, res) => {
    const { description, totalAmount, splits, method } = req.body;

    // Basic validation for required fields
    if (!description || !totalAmount || !Array.isArray(splits) || splits.length === 0 || !method) {
        return res.status(400).json({ message: 'Description, total amount, splits, and method are required.' });
    }

    try {
        let totalSplitAmount = 0;
        let totalPercentage = 0;

        if (method === 'equal') {
            const numberOfParticipants = splits.length;
            const amountPerPerson = totalAmount / numberOfParticipants;

            splits.forEach(split => {
                split.amount = amountPerPerson;  // Assign equal amount
                split.percentage = (amountPerPerson / totalAmount) * 100;  // Calculate percentage
            });
        } else if (method === 'exact') {
            splits.forEach(split => {
                if (split.amount == null) {
                    return res.status(400).json({ message: 'Exact amounts must be provided for each participant.' });
                }
                totalSplitAmount += split.amount;
            });

            if (totalSplitAmount !== totalAmount) {
                return res.status(400).json({ message: 'Total of exact amounts must equal the total amount.' });
            }
        } else if (method === 'percentage') {
            splits.forEach(split => {
                if (split.percentage == null) {
                    return res.status(400).json({ message: 'Percentages must be provided for each participant.' });
                }
                totalPercentage += split.percentage; // Sum up percentages
                split.amount = (split.percentage / 100) * totalAmount;  // Calculate exact amount from percentage
            });

            // Validate that the total percentage equals 100
            if (totalPercentage !== 100) {
                return res.status(400).json({ message: 'Percentages must add up to 100%.' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid split method.' });
        }

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
