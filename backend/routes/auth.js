const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ msg: 'Account is deactivated. Please contact administrator.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Return jsonwebtoken with enhanced user info
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        batchId: user.batchId,
        isActive: user.isActive,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ msg: 'Server error during authentication' });
        }
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            batchId: user.batchId,
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/auth/logout
// @desc    Logout user (server-side logout - mainly for audit purposes)
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT system, logout is mainly handled client-side
    // This endpoint can be used for audit logging or blacklisting tokens if needed
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/auth/user
// @desc    Get current user info
// @access  Private
router.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 