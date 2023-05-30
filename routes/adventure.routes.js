const express = require('express');
const router = express.Router();


// import middleware
const { authenticate, isAdmin } = require('../middlewares/authentication');
const upload = require('../middlewares/uploadImages')

// import controller
const { createPost, getAllPost, getOnePost, updateOnePost, addRating, userInterest, deleteOnePost } = require('../controller/adventure.controller');



// use route

// get request
router.get('/', getAllPost);
router.get('/:id', getOnePost);


// post route
router.post('/', authenticate, isAdmin, upload, createPost);

// patch request
router.patch('/:id/rating', authenticate, addRating);
router.patch('/:id/status', authenticate, userInterest);
router.patch('/:id', authenticate, isAdmin, upload, updateOnePost);

// delete
router.delete('/:id', authenticate, isAdmin, deleteOnePost);



module.exports = router;