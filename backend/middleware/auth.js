const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

function admin(req, res, next) {
  if (req.user.role !== 'CEO' && req.user.role !== 'HR') {
    return res.status(403).json({ msg: 'Access denied. Not an admin.' });
  }
  next();
}

module.exports = { auth, admin }; 