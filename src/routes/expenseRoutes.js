const express = require('express');
const { addExpense, getUserExpenses, getOverallExpenses } = require('../controllers/expenseController');

const router = express.Router();

router.post('/expenses', addExpense);
router.get('/expenses/user/:id', getUserExpenses);
router.get('/expenses', getOverallExpenses);
router.get('/expenses/balance-sheet', downloadBalanceSheet);

module.exports = router;
