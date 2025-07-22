const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Batch = require('../models/Batch');

// @route   GET api/users
// @desc    Get all users (can filter by role)
// @access  Private (Admin)
router.get('/', [auth, admin], async (req, res) => {
    try {
        const query = req.query.role ? { role: req.query.role } : {};
        const users = await User.find(query).select('-password').populate('batchId', 'name');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users
// @desc    Create a user
// @access  Private (Admin)
router.post('/', [auth, admin], async (req, res) => {
    const { email, password, name, phone, role, batchId } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            name,
            phone,
            password: hashedPassword,
            role,
            batchId: role === 'MENTOR' || role === 'INTERN' ? batchId : null,
        });

        await user.save();
        res.status(201).json({ msg: 'User created successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private (Admin)
router.put('/:id', [auth, admin], async (req, res) => {
    const { name, email, phone, role, batchId, isActive } = req.body;

    const userFields = { name, email, phone, role, batchId, isActive };
    // Only assign batchId if the role requires it
    if (role !== 'MENTOR' && role !== 'INTERN') {
        userFields.batchId = null;
    }

    try {
        let user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user.id === req.user.id) {
            return res.status(400).json({ msg: 'You cannot delete your own account.' });
        }

        await user.deleteOne();
        res.json({ msg: 'User removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 