// Models
const Post = require('../models/adventure.model');
const User = require('../models/user.model')

const homePage = async (req, res) => {
    res.render('index', { users: false });
}

const loginPage = async (req, res) => {
    res.render('login');
}

const registerPage = async (req, res) => {
    res.render('register');
}

const userPage = async (req, res) => {

    const posts = await Post.find({});
    const response = posts.map(post => post.format());

    const users = await User.find({});
    const userResponse = users.map(user => user.format());

    res.render('userpage', { postAdd: response, users: userResponse });
}

const createPostPage = async (req, res) => {
    res.render('compose');
}

const allAdventure = async (req, res) => {
    const posts = await Post.find({});
    const response = posts.map(post => post.format());
    res.render('adventure', { postAdd: response });
}

const getOneAdventure = async (req, res) => {
    const id = req.params.id;

    const adventure = await Post.findOne({ _id: id });

    const response = adventure.format();

    res.render('post', { postAdd: response });
}


module.exports = { homePage, loginPage, registerPage, userPage, createPostPage, allAdventure, getOneAdventure };