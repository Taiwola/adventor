const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  console.log('authenticate');
    try {
      const authHeader = req.headers.authorization;
      console.log('authHeader', authHeader)
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({ success: false, message: 'Not authorized, no token' });
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
  
        console.log(decoded);
        console.log(decoded.id);

        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
          return res.status(401).json({ success: false, message: 'Token not authorized' });
        }
  
        req.user = user;
        next();
      } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

const isAdmin = async (req, res, next) => {
  console.log('admin')
    try {
      if (req.user.role === 'ADMIN') {
        return next();
      }
      return res.status(403).json({ success: false, message: 'FORBIDDEN' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

 


module.exports = {authenticate, isAdmin}