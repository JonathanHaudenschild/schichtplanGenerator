const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../config/authConfig.js");

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '24h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while logging in.' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the user profile.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the user profile.' });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'User profile deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the user profile.' });
    }
};
