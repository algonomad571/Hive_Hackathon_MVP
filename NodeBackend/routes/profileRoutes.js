const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const User = require('../models/userModel');

// Test route to list all users
router.get('/test/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({
            success: true,
            count: users.length,
            users: users.map(u => u.username)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Profile route
router.get('/:username', async (req, res) => {
    try {
        console.log('Fetching profile for:', req.params.username);
        const user = await User.findOne({ username: req.params.username });
        
        if (!user) {
            console.log('User not found:', req.params.username);
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log('User found:', user.username);
        return res.json({ success: true, data: user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Update user profile
router.put('/:username', profileController.updateProfile);

router.put('/:username/security', profileController.updateSecuritySettings);

module.exports = router; 