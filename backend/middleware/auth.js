const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ msg: 'Token has expired' });
    }

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error('Token verification error:', e.message);
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    } else if (e.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

function admin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }

  if (req.user.role !== 'CEO' && req.user.role !== 'HR') {
    return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
  }
  next();
}

// Middleware to check if user is active
async function checkUserActive(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ msg: 'Account is deactivated. Please contact administrator.' });
    }
    next();
  } catch (error) {
    console.error('Check user active error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports = { auth, admin, checkUserActive }; 