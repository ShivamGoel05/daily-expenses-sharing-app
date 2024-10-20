const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { email, name, mobile } = req.body;
    try {
        const user = new User({ email, name, mobile });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};