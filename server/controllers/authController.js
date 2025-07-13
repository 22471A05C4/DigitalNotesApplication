const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development_only';
    if (!process.env.JWT_SECRET) {
        console.warn('⚠️ JWT_SECRET not found in environment variables. Using fallback secret.');
    }
    return jwt.sign({ id }, secret, {
        expiresIn: '7d',
    });
};

// @route POST /api/auth/register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.log('Registration attempt for:', { username, email });
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        console.log('User created successfully:', { _id: user._id, username: user.username, email: user.email });

        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @route POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for email:', email);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log('User found:', { _id: user._id, username: user.username, email: user.email });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);
        
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log('Login successful for user:', email);

        res.json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { register, login };
