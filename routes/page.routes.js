const express = require('express');
const router = express.Router();

// import controller
const { homePage, loginPage, registerPage, userPage, createPostPage, allAdventure, getOneAdventure } = require('../controller/page.controller');

// middlewares
const { authenticate, isAdmin } = require('../middlewares/authentication')

// 
router.get('/', homePage);
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/user-page', userPage);
router.get('/create-post', createPostPage);
router.get('/adventure', allAdventure);
router.get('/post/:id', getOneAdventure);

module.exports = router;