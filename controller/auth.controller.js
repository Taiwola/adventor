const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// import model
const User = require('../models/user.model');
const { createToken, refreshToken } = require('../libs/token');

// import error handler
const { handleAsync, createApiError, handleResponse } = require('../utils/helpers');



const createUser = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) return res.status(404).json({ success: false, message: 'incomplete payload' });
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'user already exists' });

    const hashPwd = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, username, password: hashPwd });
    try {
        await newUser.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'server error' });
    }
    res.json({ success: true, message: 'user created', data: newUser, redirectUrl: 'https://adventor.onrender.com/login' });
};

const createAdmin = async (req, res) => {
  const { email, username, password, role } = req.body;
  if (!email || !username || !password || !role) return res.status(404).json({ success: false, message: 'incomplete payload' });
  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ success: false, message: 'user already exists' });
  const hashPwd = await bcrypt.hash(password, saltRounds);
  const newUser = new User({ email, username, password: hashPwd, role });
  try {
    await newUser.save();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'server error' });
      }
      res.json({ success: true, message: 'user created', data: newUser });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(404).json({ success: false, message: 'incomplete payload' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'user not found' });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: 'invalid credentials' });

    const accessToken = createToken(user._id);

    const newRefreshToken = refreshToken(user._id);

    try {
       let saveRefreshToken = await User.findOneAndUpdate({email: email}, {
        $push: {refreshToken: newRefreshToken}
       }, {new: true}) ;
       res.cookie('jwt', newRefreshToken, {httpOnly: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'server error' });
    }
    const response = user.format();
    res.status(200).json({success: true, message: 'user successfully logged in', response, accessToken, redirectUrl: 'http://localhost:4000/user-page'});
}

const handleRefresh = async (req, res) => {
    const tokenRefresh = req.cookies?.jwt;
    console.log(tokenRefresh);
    if(!tokenRefresh) return res.status(400).json({success: false, message: 'request does not exist'});

    const user = await User.findOne({refreshToken: tokenRefresh});
    if(!user) return res.status(400).json({success: false, message: 'user not found'});

    try {
        jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET,(err, decode)=>{
            if(err || user._id.toString() !== decode.id) return res.status(401).json({success: false, message: 'there is something wrong with the refresh token'});
        })
        const accessToken = refreshToken(user._id);
        res.status(200).json({accessToken});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ succes: false, message: 'server error' });
    }
}

const logoutUser = async (req, res) => {
    const userId = req.user._id;
    const token = req.cookies.jwt;
  
    try {
      const user = await User.findOne({ _id: userId });
      if (!user)
        return res.status(400).json({ success: false, message: 'User not found' });
  
      const foundToken = user.refreshToken.includes(token);
      if (!foundToken) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.status(201).json({ success: false, message: 'User not logged in' });
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { refreshToken: token } },
        { new: true }
      );
  
      res.clearCookie('jwt', { httpOnly: true });
      res.status(200).json({ success: true, message: 'User logged out' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

module.exports = {
    createUser,
    loginUser,
    handleRefresh,
    logoutUser,
    createAdmin
}