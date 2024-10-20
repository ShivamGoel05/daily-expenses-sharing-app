exports.addExpense = async (req, res) => {
    const { description, totalAmount, splits, method } = req.body;

    try {
        let totalSplitAmount = 0;
        let totalPercentage = 0;

        if (method === 'equal') {
            const numberOfParticipants = splits.length;
            const amountPerPerson = totalAmount / numberOfParticipants;

            splits.forEach(split => {
                totalSplitAmount += amountPerPerson;
                split.amount = amountPerPerson;  // Assign equal amount
                split.percentage = (amountPerPerson / totalAmount) * 100;  // Calculate percentage
            });
        } else if (method === 'exact') {
            splits.forEach(split => {
                if (!split.amount) {
                    return res.status(400).json({ message: 'Exact amounts must be provided for each participant.' });
                }
                totalSplitAmount += split.amount;
            });
        } else if (method === 'percentage') {
            splits.forEach(split => {
                if (!split.percentage) {
                    return res.status(400).json({ message: 'Percentages must be provided for each participant.' });
                }
                totalPercentage += split.percentage;
                split.amount = (split.percentage / 100) * totalAmount;  // Calculate exact amount from percentage
            });

            if (totalPercentage !== 100) {
                return res.status(400).json({ message: 'Percentages must add up to 100%' });
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
