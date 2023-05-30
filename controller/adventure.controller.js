// library/modules
const { default: mongoose } = require('mongoose');

// Models
const Post = require('../models/adventure.model');
const User = require('../models/user.model');

// helper functions
const cloudUpload = require('../utils/cloudinary');
const { handleAsync, createApiError, handleResponse } = require('../utils/helpers');



const createPost = handleAsync(async (req, res) => {
    const { title, description } = req.body;
    // if (!title || !description) {
    //   throw createApiError("incomplete payload", 400)
    // }

    const buffer = req.file.buffer;

    let newPost;
    try {
        const url = await cloudUpload(buffer);
        console.log('url', url)
        newPost = new Post({
            title,
            description,
            image: url
        });

        await newPost.save();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
    const response = newPost.format();
    res.status(200).json(handleResponse(response, 'new post created'));
})

const getAllPost = handleAsync(async (req, res) => {
    const posts = await Post.find();

    const response = posts.map(post => post.format());

    res.status(200).json(response);
})

const getOnePost = handleAsync(async (req, res) => {
    if (!req.params.id) throw createApiError('request does not exist', 404);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'post not found' });
    const response = post.format();
    res.status(200).json(handleResponse(response));
})

const updateOnePost = handleAsync(async (req, res) => {
    if (!req.params.id) throw createApiError('request does not exist', 400);
    const post = await Post.findById(req.params.id);
    if (!post) throw createApiError('post does not exist', 404);
    const { title, description } = req.body;
    if (!title || !description) {
        throw createApi('incomplete payload', 400)
    }

    const buffer = req.file.buffer

    try {
        const url = await cloudUpload(buffer);
        let newPost = await Post.findOneAndUpdate({ _id: req.params.id }, {
            title,
            description,
            image: url
        }, { new: true });
    } catch (error) {
        console.log(error);
        throw createApiError();
    }
    const response = post.format();
    res.status(200).json(handleResponse(response, 'post updated'));
})

const addRating = handleAsync(
    async (req, res) => {
        const userId = req.user._id;
        const postId = req.params.id;
        const star = req.body.star;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            throw createApiError('request does not exist', 400);
        }

        try {
            const findUser = await User.findById(userId);
            if (!findUser) {
                throw createApiError('user not found', 404);
            }

            const post = await Post.findById(postId);

            const alreadyRated = post.rating.find(
                (rating) => rating.postedby.toString() === userId.toString()
            );

            if (alreadyRated) {
                alreadyRated.star = star;
            } else {
                post.rating.push({
                    postedby: userId,
                    star
                });
            }

            await post.save();

            const getAllRating = await Post.findOne({ _id: postId });
            const totalRating =
                getAllRating.rating.reduce((sum, item) => sum + item.star, 0) /
                getAllRating.rating.length;
            const actualRating = Math.round(totalRating);

            const ratedPost = await Post.findByIdAndUpdate(
                postId,
                { totalRating: actualRating },
                { new: true }
            );

            const response = ratedPost.format();
            res.status(200).json(handleResponse(response, 'rating added'));
        } catch (error) {
            console.log(error);
            throw createApiError('internal server error', 500);
        }
    })

const userInterest = handleAsync(
    async (req, res) => {
        const userId = req.user._id;
        const postId = req.params.id;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw createApiError('request does not exist', 400);;
        const user = await User.findOne({ _id: userId });
        if (!user) throw createApiError('user does not exist', 404);
        const post = await Post.findById(postId);

        // extract intrested from post
        interested = post.interested;


        try {
            let postUpdate;
            // if user already has interest
            if (interested.includes(userId)) {
                // remove from interested
                postUpdate = await Post.findOneAndUpdate({ _id: postId }, {
                    $pull: {
                        interested: userId
                    },
                    status: 'Not Interested'
                }, { new: true })
            } else {
                // add to interested
                postUpdate = await Post.findOneAndUpdate({ _id: postId }, {
                    $push: { interested: userId },
                    status: 'Interested'
                }, { new: true })
            }
            const response = postUpdate.format();
            res.status(200).json(handleResponse(response, 'User status updated'));
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

    }
)

const deleteOnePost = handleAsync(
    async (req, res) => {
        const userId = req.user._id;
        const postId = req.params.id;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) throw createApiError('request does not exist', 400);
        const user = await User.findOne({ _id: userId });
        if (!user) throw createApiError('user does not exist', 404);
        try {
            const deletePost = await Post.findOneAndDelete({ _id: postId });
        } catch (error) {
            console.log(error);
            throw createApiError('internal server error', 500);
        }
        res.status(200).json(handleResponse('Post deleted'));
    }
)




module.exports = {
    createPost,
    getAllPost,
    getOnePost,
    updateOnePost,
    addRating,
    userInterest,
    deleteOnePost
}