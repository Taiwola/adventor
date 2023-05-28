const express = require('express');
const router = express.Router();


// import controllers
const {
    getAllUser,
    getOneUser
} = require('../controller/user.controller');

// import middlewares
const {authenticate} = require('../middlewares/authentication')


// use route
// get request
router.get('/', getAllUser);
router.get('/user', authenticate, getOneUser);







module.exports = router;