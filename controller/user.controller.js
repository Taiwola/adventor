// import model
const User = require('../models/user.model');
const { handleAsync, createApiError, handleResponse } = require('../utils/helpers');


const getAllUser = handleAsync(async (req, res) => {
    const users = await User.find();
    const response = users.map(user => user.format());

    if (!response) {
        throw createApiError('response not found', 404);
    }

    res.status(200).json(handleResponse(response))
    // res.status(200).json({ success: true, data: response, users });
})


const getOneUser = handleAsync(async (req, res) => {
    const  id  = req.user._id;
    const users = await User.findById(id);
    if (!users) throw createApiError('user not found', 404);
    const response = users.format();
    console.log(response);
    res.status(200).json(handleResponse(response));
})

module.exports = {
    getAllUser,
    getOneUser
}