const express = require('express');
const router = express.Router();


// import middlewares
const { authenticate } = require('../middlewares/authentication');

// import controller
const {
    createUser,
    loginUser,
    handleRefresh,
    logoutUser,
    createAdmin
} = require('../controller/auth.controller');


// use routes


// post request to create a user
router.post('/register', createUser);
router.post('/admin/register', createAdmin);
router.post('/login', loginUser);
router.post('/refresh', handleRefresh);
router.post('/logout', authenticate, logoutUser);

// patch request

module.exports = router;